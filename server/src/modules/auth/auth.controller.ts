import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { JwtPayload} from "jsonwebtoken"

dotenv.config();

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    res.status(401).json({ message: "User not found" })
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.status(200).json({ token });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: {email}
  })

  if (existingUser) {
    res.status(400).json({message: "User already exists"})
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword }
  })

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h"
  })

  res.status(201).json({ token })
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as JwtPayload;

  try {
    await prisma.user.delete({
      where: {id: user.id}
    })

    res.status(200).json({message: "User deleted successfully"})
  } catch (error) {
    res.status(500).json({message: "Internal server error"})
  }
}