/**
 * Vue Composable for Socket.IO
 * Provides reactive state and easy-to-use methods for Socket.IO integration
 */

import { ref, onMounted, onUnmounted, computed } from "vue";
import { socketService } from "@/services/socket.service";
import { useAuthStore } from "@/stores/auth";
import type { SocketMessage, ConnectionStatus } from "@/shared/socket.types";

export function useSocket() {
  const authStore = useAuthStore();
  
  // Reactive state
  const connectionStatus = ref<ConnectionStatus>("disconnected");
  const messages = ref<SocketMessage[]>([]);
  const onlineUsers = ref<string[]>([]);
  const isConnected = computed(() => connectionStatus.value === "connected");
  const isConnecting = computed(() => connectionStatus.value === "connecting");

  // Unsubscribe functions
  let unsubscribeStatus: (() => void) | null = null;
  let unsubscribeMessage: (() => void) | null = null;
  let unsubscribeOnlineUsers: (() => void) | null = null;
  let unsubscribeUserOnline: (() => void) | null = null;
  let unsubscribeUserOffline: (() => void) | null = null;

  /**
   * Connect to Socket.IO server
   * Automatically uses auth token from store
   */
  const connect = () => {
    if (!authStore.token) {
      console.error("❌ Cannot connect: No auth token");
      return;
    }

    socketService.connect(authStore.token);
  };

  /**
   * Disconnect from Socket.IO server
   */
  const disconnect = () => {
    socketService.disconnect();
    messages.value = [];
    onlineUsers.value = [];
  };

  /**
   * Send a message
   * @param content - Message content
   */
  const sendMessage = (content: string) => {
    try {
      socketService.sendMessage(content);
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  };

  /**
   * Add a new message to the local messages array
   * @param message - Message to add
   */
  const addMessage = (message: SocketMessage) => {
    messages.value.push(message);
  };

  /**
   * Clear all messages
   */
  const clearMessages = () => {
    messages.value = [];
  };

  /**
   * Setup event listeners
   */
  const setupListeners = () => {
    // Listen for connection status changes
    unsubscribeStatus = socketService.onStatusChange((status) => {
      connectionStatus.value = status;
    });

    // Listen for new messages
    unsubscribeMessage = socketService.onMessage((message) => {
      addMessage(message);
    });

    // Listen for online users list
    unsubscribeOnlineUsers = socketService.onOnlineUsers((userIds) => {
      onlineUsers.value = userIds;
    });

    // Listen for user coming online
    unsubscribeUserOnline = socketService.onUserOnline((userId) => {
      if (!onlineUsers.value.includes(userId)) {
        onlineUsers.value.push(userId);
      }
    });

    // Listen for user going offline
    unsubscribeUserOffline = socketService.onUserOffline((userId) => {
      onlineUsers.value = onlineUsers.value.filter(id => id !== userId);
    });
  };

  /**
   * Cleanup event listeners
   */
  const cleanup = () => {
    unsubscribeStatus?.();
    unsubscribeMessage?.();
    unsubscribeOnlineUsers?.();
    unsubscribeUserOnline?.();
    unsubscribeUserOffline?.();
  };

  // Setup listeners when composable is used
  onMounted(() => {
    setupListeners();
    
    // Auto-connect if authenticated
    if (authStore.isAuthenticated) {
      connect();
    }
  });

  // Cleanup on unmount
  onUnmounted(() => {
    cleanup();
  });

  return {
    // State
    connectionStatus,
    isConnected,
    isConnecting,
    messages,
    onlineUsers,
    
    // Methods
    connect,
    disconnect,
    sendMessage,
    addMessage,
    clearMessages,
  };
}


