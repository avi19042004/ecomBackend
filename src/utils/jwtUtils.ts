import jwt from 'jsonwebtoken'
import { jwtToken } from '../configs/envConfig'

export const signToken = (userId: string): string => {
    try{
        const token = jwt.sign({id: userId}, jwtToken as string, {expiresIn: "1h"});
        return token;
    }catch(err){
        throw new Error("Failed to sign token");
    }
}

export const verifyToken = (token: string) => {
    try{
        return jwt.verify(token, jwtToken as string);
    }catch(err){
        throw new Error("Invalid or expired token");
    }
}