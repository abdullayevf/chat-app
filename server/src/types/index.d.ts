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

// Socket.IO types

// Events that the SERVER sends TO the CLIENT
export interface ServerToClientEvents {
    // When a new message is received by any user
    "receive-message": (message: {
        id: string;
        content: string;
        userId: string;
        userEmail: string;
        createdAt: string;
    }) => void;
    
    // When a user connects/disconnects
    "user-online": (userId: string) => void;
    "user-offline": (userId: string) => void;
    
    // List of currently online users
    "online-users": (userIds: string[]) => void;
}

// Events that the CLIENT sends TO the SERVER
export interface ClientToServerEvents {
    // When user sends a new message
    "send-message": (data: { content: string; token: string }) => void;
}

// Events between Socket.IO servers (for scaling, not used yet)
export interface InterServerEvents {
    ping: () => void;
}

// Data stored on each socket connection
export interface SocketData {
    userId: string;
    userEmail: string;
}