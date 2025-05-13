import { Response, NextFunction } from "express";
import { CustomRequest } from "@/types";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { log } from "console";

dotenv.config();

export const authenticate = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(403).json({ message: "No token provided" });
    return;
  }

  try {
    console.log(req.headers.authorization);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next(); 
  } catch (error) {
    res.status(401).json({ message:  error });
  }
};
