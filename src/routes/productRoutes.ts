import { Request, response, Response, Router } from "express";
import PRODUCTS from "../schema/productSchema";
import { productValidator } from "../utils/validator";
import { validateObjectId } from "../middleware/idValidator";

const router = Router()

router.get("/products", async (req: Request, res: Response): Promise<void> => {
    try{
        const products = await PRODUCTS.find({})
        if(products.length === 0){
            res.status(404).json({message: "No Products Found"})
            return;
        }
        res.status(200).json(products);
        return;
    }catch(err){
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
        res.status(201).json(newProduct)
        return;
    }catch(err){
        res.status(500).json({ message : "Internal Server Error"})
        return;
    }
})

router.get("/products/:id", validateObjectId("id"), async (req: Request, res: Response): Promise<void> => {
    try{
        const id = req.params.id;

        const product = await PRODUCTS.findById(id)
        if(!product){
            res.status(404).json({message: "No Product Found"})
            return;
        }

        res.status(200).json(product)
        return;
    }catch(err){
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
        
        res.status(200).json({message: "Product Updated", product: updatedProduct})
        return;
    }catch(err){
        res.status(500).json({message: "Internal Server Error"})
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
        
        res.status(200).json({message: "Product deleted", product: deletedProduct})
    }catch(err){
        res.status(500).json({ message : "Internal Server Error"})
        return;
    }
})

export default router;