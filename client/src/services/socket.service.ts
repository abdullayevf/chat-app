/**
 * Socket.IO Client Service
 * Manages WebSocket connection, authentication, and real-time events
 */

import { io, Socket } from "socket.io-client";
import type { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  ConnectionStatus,
  SocketMessage 
} from "@/shared/socket.types";

// Type-safe Socket.IO client
type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

class SocketService {
  private socket: TypedSocket | null = null;
  private connectionStatus: ConnectionStatus = "disconnected";
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  // Event listeners storage
  private messageListeners: Array<(message: SocketMessage) => void> = [];
  private statusListeners: Array<(status: ConnectionStatus) => void> = [];
  private onlineUsersListeners: Array<(userIds: string[]) => void> = [];
  private userOnlineListeners: Array<(userId: string) => void> = [];
  private userOfflineListeners: Array<(userId: string) => void> = [];

  // Server URL configuration
  private readonly serverUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  /**
   * Connect to Socket.IO server with JWT authentication
   * @param token - JWT authentication token
   */
  connect(token: string): void {
    if (this.socket?.connected) {
      console.log("⚠️  Socket already connected");
      return;
    }

    console.log("🔌 Connecting to Socket.IO server...");
    this.setConnectionStatus("connecting");

    try {
      // Create socket connection with authentication
      this.socket = io(this.serverUrl, {
        auth: {
          token, // JWT token sent to server for authentication
        },
        transports: ["websocket", "polling"], // Try WebSocket first, fallback to polling
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
      }) as TypedSocket;

      this.setupEventListeners();
    } catch (error) {
      console.error("❌ Socket connection error:", error);
      this.setConnectionStatus("error");
    }
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect(): void {
    if (this.socket) {
      console.log("🔌 Disconnecting from Socket.IO server...");
      this.socket.disconnect();
      this.socket = null;
      this.setConnectionStatus("disconnected");
      this.reconnectAttempts = 0;
    }
  }

  /**
   * Check if socket is currently connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * Send a message to the chat
   * @param content - Message content
   */
  sendMessage(content: string): void {
    if (!this.socket?.connected) {
      console.error("❌ Cannot send message: Socket not connected");
      throw new Error("Socket not connected");
    }

    if (!content || content.trim().length === 0) {
      console.warn("⚠️  Cannot send empty message");
      return;
    }

    console.log("📤 Sending message:", content);
    this.socket.emit("send-message", { content: content.trim() });
  }

  /**
   * Subscribe to new messages
   * @param callback - Function to call when new message arrives
   * @returns Unsubscribe function
   */
  onMessage(callback: (message: SocketMessage) => void): () => void {
    this.messageListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.messageListeners = this.messageListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Subscribe to connection status changes
   * @param callback - Function to call when status changes
   * @returns Unsubscribe function
   */
  onStatusChange(callback: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.push(callback);
    
    // Immediately call with current status
    callback(this.connectionStatus);
    
    // Return unsubscribe function
    return () => {
      this.statusListeners = this.statusListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Subscribe to online users list
   * @param callback - Function to call when online users list updates
   * @returns Unsubscribe function
   */
  onOnlineUsers(callback: (userIds: string[]) => void): () => void {
    this.onlineUsersListeners.push(callback);
    return () => {
      this.onlineUsersListeners = this.onlineUsersListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Subscribe to user online events
   * @param callback - Function to call when a user comes online
   * @returns Unsubscribe function
   */
  onUserOnline(callback: (userId: string) => void): () => void {
    this.userOnlineListeners.push(callback);
    return () => {
      this.userOnlineListeners = this.userOnlineListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Subscribe to user offline events
   * @param callback - Function to call when a user goes offline
   * @returns Unsubscribe function
   */
  onUserOffline(callback: (userId: string) => void): () => void {
    this.userOfflineListeners.push(callback);
    return () => {
      this.userOfflineListeners = this.userOfflineListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Setup Socket.IO event listeners
   * @private
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection successful
    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket?.id);
      this.setConnectionStatus("connected");
      this.reconnectAttempts = 0;
    });

    // Connection error
    this.socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      this.setConnectionStatus("error");
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("❌ Max reconnection attempts reached");
        this.disconnect();
      }
    });

    // Disconnected
    this.socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      this.setConnectionStatus("disconnected");

      // Auto-reconnect unless manually disconnected
      if (reason === "io server disconnect") {
        // Server disconnected us, try to reconnect
        this.socket?.connect();
      }
    });

    // Receive new message
    this.socket.on("receive-message", (message: SocketMessage) => {
      console.log("📨 Message received:", message);
      this.messageListeners.forEach(callback => callback(message));
    });

    // Online users list
    this.socket.on("online-users", (userIds: string[]) => {
      console.log("👥 Online users:", userIds);
      this.onlineUsersListeners.forEach(callback => callback(userIds));
    });

    // User came online
    this.socket.on("user-online", (userId: string) => {
      console.log("🟢 User online:", userId);
      this.userOnlineListeners.forEach(callback => callback(userId));
    });

    // User went offline
    this.socket.on("user-offline", (userId: string) => {
      console.log("🔴 User offline:", userId);
      this.userOfflineListeners.forEach(callback => callback(userId));
    });
  }

  /**
   * Update connection status and notify listeners
   * @private
   */
  private setConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
    this.statusListeners.forEach(callback => callback(status));
  }
}

// Export singleton instance
export const socketService = new SocketService();

// Also export the class for testing purposes
export { SocketService };
