import { Request, Response, Router } from "express";
import PRODUCTS from "../schema/productSchema";
import { productValidator } from "../utils/validator";
import { validateObjectId } from "../middleware/idValidator";
import redisClient from "../configs/redisConfig";

const router = Router()

router.get("/products", async (req: Request, res: Response): Promise<void> => {
    try{

        const cachedProducts = await redisClient.get("allProducts")
        if(cachedProducts){
            console.log("📦 Products from Redis cache");
            res.status(200).json(JSON.parse(cachedProducts));
            return;
        }

        const products = await PRODUCTS.find({})
        if(products.length === 0){
            res.status(404).json({message: "No Products Found"})
            return;
        }
        await redisClient.set("allProducts", JSON.stringify(products));
        res.status(200).json(products);
        return;
    }catch(err){
        console.error("❌ Error in /products route:", err);
        res.status(500).json({ message : "Internal Server Error"})
        return;
    }
})

router.post("/products", async (req: Request, res: Response): Promise<void> => {
    try{
        const parsed = productValidator.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ errors: parsed.error });
            return;
        }

        const {name, description, size, category, price, image, stock} = parsed.data;

        const product = await PRODUCTS.findOne({name});
        if(product){
            res.status(409).json({message: "Product With This Name Already Exsist"})
            return;
        }

        const newProduct = new PRODUCTS({name, description, size, category, price, image, stock})
        await newProduct.save();

        const cachedProducts = await redisClient.get("allProducts");
        if (cachedProducts) {
          const products = JSON.parse(cachedProducts);
          products.push(newProduct.toObject());
          await redisClient.set("allProducts", JSON.stringify(products));
          console.log("🧠 Redis cache updated with new product");
        } else {
          await redisClient.set("allProducts", JSON.stringify([newProduct]));
          console.log("🧠 Redis cache initialized with first product");
        }
        
        await redisClient.set(`product_${newProduct._id}`, JSON.stringify(newProduct));
        res.status(201).json(newProduct)
        return;
    }catch(err){
        console.error("❌ Error in /products route:", err);
        res.status(500).json({ message : "Internal Server Error"})
        return;
    }
})

router.get("/products/:id", validateObjectId("id"), async (req: Request, res: Response): Promise<void> => {
    try{
        const id = req.params.id;

        const cacheProduct = await redisClient.get(`product_${id}`)
        if(cacheProduct){

            const updatedProduct = await PRODUCTS.findByIdAndUpdate(
                id,
                { $inc: { click: 1 } },
                { new: true }
            );

            if (updatedProduct) {
                await redisClient.set(`product_${id}`, JSON.stringify(updatedProduct));
            }

            console.log("📦 Products from Redis cache")
            res.status(200).json(updatedProduct || JSON.parse(cacheProduct))
            return;
        }

        const product = await PRODUCTS.findByIdAndUpdate(
            id,
            { $inc: { click: 1 } },
            { new: true }
        );

        if(!product){
            res.status(404).json({message: "No Product Found"})
            return;
        }

        await redisClient.set(`product_${id}`, JSON.stringify(product));
        res.status(200).json(product)
        return;
    }catch(err){
        console.error("❌ Error in /products route:", err);
        res.status(500).json({ message : "Internal Server Error"})
        return;
    }
})

router.put("/products/:id", validateObjectId("id"), async (req: Request, res: Response): Promise<void> => {
    try{
        const parsed = productValidator.partial().safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ errors: parsed.error });
            return;
        }

        const update = parsed.data;
        const id = req.params.id;
        
        const updatedProduct = await PRODUCTS.findByIdAndUpdate(
            id,
            { $set: update},
            { new: true, runValidators: true }
        );

        if(!updatedProduct){
            res.status(404).json({message: "No Product Found"})
            return;
        }
        
        await redisClient.set(`product_${id}`, JSON.stringify(updatedProduct))
        await redisClient.del("allProducts");
        res.status(200).json({message: "Product Updated", product: updatedProduct})
        return;
    }catch(err){
        console.error("❌ Error in /products route:", err);
        res.status(500).json({ message : "Internal Server Error"})
        return;
    }
})

router.delete("/products/:id", validateObjectId("id"), async (req: Request, res: Response): Promise<void> =>{
    try{
        const id = req.params.id;

        const deletedProduct = await PRODUCTS.findByIdAndDelete(id)
        if(!deletedProduct){
            res.status(404).json({message: "Product not found"})
            return
        }
         
        await redisClient.del(`product_${id}`)
        await redisClient.del("allProducts");
        res.status(200).json({message: "Product deleted", product: deletedProduct})
    }catch(err){
        console.error("❌ Error in /products route:", err);
        res.status(500).json({ message : "Internal Server Error"})
        return;
    }
})

router.get("/popularproduct", async (req: Request, res: Response): Promise<void> => {
    try {
        const cachedPopular = await redisClient.get("popularProducts");
        if (cachedPopular) {
            console.log("📦 Popular products from Redis cache");
            res.status(200).json(JSON.parse(cachedPopular));
            return;
        }

        const popularProducts = await PRODUCTS.find({})
            .sort({ click: -1 })
            .limit(8);

        if (popularProducts.length === 0) {
            res.status(404).json({ message: "No Products Found" });
            return;
        }

        await redisClient.set("popularProducts", JSON.stringify(popularProducts), { EX: 1800 }); 

        res.status(200).json(popularProducts);
        return;
    } catch (err) {
        console.error("❌ Error in /products/popular route:", err);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});


export default router;