import "module-alias/register";
import express from "express";
import { createServer } from "http";
import * as dotenv from "dotenv";
import authRoutes from "@/routes/auth.routes";
import messageRoutes from "@/routes/message.routes";
import cors from "cors";
import { initializeSocket } from "@/socket/socket.server";

dotenv.config();

// Create Express app
const app = express();

// Create HTTP server (needed for Socket.IO)
const httpServer = createServer(app);

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Initialize Socket.IO
const io = initializeSocket(httpServer);

// 404 handler (must be AFTER all routes)
app.use((req, res) => {
  console.log(`Unmatched route: ${req.method} ${req.path}`);
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 Socket.IO ready for connections`);
});
