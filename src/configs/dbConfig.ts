import mongoose from "mongoose";
import { dburl } from "./envConfig";

export const connectToDB = () => {
    mongoose.connect(dburl as string)
        .then(() => {console.log("MongoDB is connected")})
        .catch(() => {console.log("error while connecting MongoDB")})
}