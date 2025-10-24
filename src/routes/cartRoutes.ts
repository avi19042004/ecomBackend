import { Router, Request, Response } from "express";
import USER from "../schema/userSchema";
import mongoose from "mongoose";
import PRODUCTS from "../schema/productSchema";

const router = Router()

router.post('/cart', async (req: Request, res: Response): Promise<void> =>{
    try{
        const { userId, productId, size, type} = req.body

        if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)){
            res.status(400).json({ message: "Invalid Product ID or User ID" })
            return;
        }

        const user = await USER.findById(userId)
        if(!user){
            res.status(404).json({message: "No User Find"})
            return;
        }

        const product = await PRODUCTS.findById(productId)
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }


        if(type == "new"){

            user.cart.push({
                items: productId,
                count: 1,
                size,
            })
        }else if(type == "increment"){
            const exsistingItem = user.cart.find((item: any) => item.items.toString() === productId && item.size === size)
            if (!exsistingItem) {
                res.status(404).json({ message: "Item not found in cart" });
                return;
            }

            if (exsistingItem.count + 1 > product.stock) {
              res.status(400).json({ message: `Cannot exceed available stock (${product.stock})` });
              return;
            }

            exsistingItem.count += 1;
        }else if(type == "decrement"){
            const exsistingItem = user.cart.find((item: any) => item.items.toString() === productId && item.size === size)
            if (!exsistingItem) {
                res.status(404).json({ message: "Item not found in cart" });
                return;
            }
            if (exsistingItem.count - 1 < 1) {
                (user.cart.id(exsistingItem._id) as any)?.remove();
                res.status(200).json({ message: "Item Remove from cart" });
                return;
            }
            exsistingItem.count -= 1;
        }else{
            res.status(400).json({message: "Type field is wrong"})
        }

        await user.save();
        res.status(200).json({message: "Product add to cart successfully", cart: user.cart})
        return;
    }catch(err){
        res.status(500).json({message : "Internal Server Error"})
        return;
    }
})