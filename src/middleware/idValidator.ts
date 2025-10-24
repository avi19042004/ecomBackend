import { Response, Request } from "express";
import mongoose from "mongoose";

export const validateObjectId = (paramName: string) => (req: Request, res: Response, next: Function) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }
  next();
};
