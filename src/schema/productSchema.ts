import mongoose from "mongoose";
import { required } from "zod/v4/core/util.cjs";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    size:{
        type: [String],
        required: true
    },
    category:{
        type: [String],
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    image:{
        type: [String],
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const PRODUCTS = mongoose.model("Products", productSchema);

export default PRODUCTS