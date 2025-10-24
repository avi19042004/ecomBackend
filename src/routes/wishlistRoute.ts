import { Router, Request, Response } from "express";
import USER from "../schema/userSchema";
import PRODUCTS from "../schema/productSchema";
import mongoose from "mongoose";

const router = Router();

router.post("/wishlist", async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, productId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      res.status(400).json({ message: "Invalid User ID or Product ID" });
      return;
    }

    const user = await USER.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const productExists = await PRODUCTS.exists({ _id: productId });
    if (!productExists) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const alreadyInWishlist = user.wishlist.some(
      (id: any) => id.toString() === productId
    );

    if (alreadyInWishlist) {
      user.wishlist = user.wishlist.filter(
        (id: any) => id.toString() !== productId
      );
      await user.save();
      res.status(200).json({ message: "Item removed from wishlist", wishlist: user.wishlist });
      return;
    } else {
      user.wishlist.push(productId);
      await user.save();
      res.status(200).json({ message: "Item added to wishlist", wishlist: user.wishlist });
      return;
    }

  } catch (err) {
    console.error("Wishlist Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
