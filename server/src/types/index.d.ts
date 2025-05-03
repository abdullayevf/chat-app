import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface CustomRequest extends Request {
    user?: string | JwtPayload;
}

declare module "express" {
    interface Request {
        user?: string | JwtPayload;
    }
}

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload; 
        }
    }
}