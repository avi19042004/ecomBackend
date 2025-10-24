import dotenv from "dotenv";

dotenv.config()

export const port = process.env.PORT || 3000;
export const dburl = process.env.DBURL;
export const jwtToken = process.env.JWT_SECRET;