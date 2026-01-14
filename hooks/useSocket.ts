import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create socket connection if not exists
    if (!socket) {
      console.log("🔌 Initializing Socket.io connection...");
      socket = io({
        path: "/api/socketio",
        addTrailingSlash: false,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket?.id);
        setIsConnected(true);
      });

      socket.on("disconnect", (reason) => {
        console.log("❌ Socket disconnected:", reason);
        setIsConnected(false);
      });

      socket.on("connect_error", (error) => {
        console.error("⚠️ Socket connection error:", error);
        setIsConnected(false);
      });

      socket.on("error", (error) => {
        console.error("⚠️ Socket error:", error);
      });
    }

    return () => {
      // Don't disconnect on component unmount, keep connection alive
    };
  }, []);

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
