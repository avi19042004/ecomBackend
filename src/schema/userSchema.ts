import { count } from "console";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    wishlist:{
        type:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products"
        }],
        default: []
    },
    cart: {
        type:[{
            items:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products",
                required: true
            },
            count: {
                type: Number,
                required: true,
                default: 1,
                min: 1
            },
            size: {
                type: String,
                required: true
            }
        }],
        default: []
    }
})

const USER = mongoose.model("Users", userSchema)

export default USER;