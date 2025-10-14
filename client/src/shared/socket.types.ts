/**
 * Socket.IO Type Definitions (Client-Side)
 * These should match the server-side types in server/src/types/index.d.ts
 */

// Message received from server
export interface SocketMessage {
  id: string;
  content: string;
  userId: string;
  userEmail: string;
  createdAt: string;
}

// Events that the SERVER sends TO the CLIENT
export interface ServerToClientEvents {
  "receive-message": (message: SocketMessage) => void;
  "user-online": (userId: string) => void;
  "user-offline": (userId: string) => void;
  "online-users": (userIds: string[]) => void;
}

// Events that the CLIENT sends TO the SERVER
export interface ClientToServerEvents {
  "send-message": (data: { content: string }) => void;
}

// Connection status
export type ConnectionStatus = "connected" | "disconnected" | "connecting" | "error";


