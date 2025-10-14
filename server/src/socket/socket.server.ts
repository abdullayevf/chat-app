import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import { 
    ServerToClientEvents, 
    ClientToServerEvents, 
    InterServerEvents, 
    SocketData 
} from "@/types";

dotenv.config();
const prisma = new PrismaClient();

// Track online users (userId -> socket.id mapping)
const onlineUsers = new Map<string, string>();

export function initializeSocket(httpServer: HTTPServer) {
    // Create Socket.IO server with typed events
    const io = new Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
    >(httpServer, {
        cors: {
            origin: "http://localhost:5173", // Your Vue client URL
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    console.log("🔌 Socket.IO server initialized");

    // AUTHENTICATION MIDDLEWARE
    // This runs BEFORE a socket connection is established
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        try {
            // Verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
            
            // Store user data in socket for later use
            socket.data.userId = decoded.id;
            
            next(); // Allow connection
        } catch (error) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    // CONNECTION EVENT
    // This runs when a client successfully connects
    io.on("connection", async (socket) => {
        const userId = socket.data.userId;

        try {
            // Fetch user details from database
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, email: true }
            });

            if (!user) {
                socket.disconnect();
                return;
            }

            // Store user email in socket data
            socket.data.userEmail = user.email;

            // Add to online users tracking
            onlineUsers.set(userId, socket.id);

            console.log(`✅ User connected: ${user.email} (${socket.id})`);

            // Notify all clients that this user is online
            io.emit("user-online", userId);

            // Send current online users list to the newly connected user
            socket.emit("online-users", Array.from(onlineUsers.keys()));

            // SEND MESSAGE EVENT
            // When client emits "send-message", this handler runs
            socket.on("send-message", async (data) => {
                try {
                    const { content } = data;

                    // Validate message content
                    if (!content || content.trim().length === 0) {
                        return; // Ignore empty messages
                    }

                    if (content.length > 1000) {
                        return; // Prevent spam (max 1000 chars)
                    }

                    // Save message to database
                    const message = await prisma.message.create({
                        data: {
                            content: content.trim(),
                            userId: socket.data.userId
                        }
                    });

                    console.log(`💬 Message from ${socket.data.userEmail}: ${content}`);

                    // Broadcast message to ALL connected clients (including sender)
                    io.emit("receive-message", {
                        id: message.id,
                        content: message.content,
                        userId: socket.data.userId,
                        userEmail: socket.data.userEmail,
                        createdAt: message.createdAt.toISOString()
                    });
                } catch (error) {
                    console.error("Error sending message:", error);
                }
            });

            // DISCONNECT EVENT
            // When client disconnects (closes tab, loses connection, etc.)
            socket.on("disconnect", () => {
                // Remove from online users
                onlineUsers.delete(userId);

                console.log(`❌ User disconnected: ${socket.data.userEmail} (${socket.id})`);

                // Notify all clients that this user is offline
                io.emit("user-offline", userId);
            });

        } catch (error) {
            console.error("Error in socket connection:", error);
            socket.disconnect();
        }
    });

    return io;
}
