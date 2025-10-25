import dotenv from "dotenv";

dotenv.config()

export const port = process.env.PORT || 3000;
export const dburl = process.env.DBURL;
export const jwtToken = process.env.JWT_SECRET;
export const REDIS_USERNAME = process.env.REDIS_USERNAME
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD
export const REDIS_HOST = process.env.REDIS_HOST
export const REDIS_PORT = process.env.REDIS_PORT