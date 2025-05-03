import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const mockUser = {
    id: "user_1",
    email: "test@example.com",
    password: "password",
  };

  if (email !== mockUser.email || password !== mockUser.password) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ id: mockUser.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.status(200).json({ token });
};
