import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";
import { db as prisma } from "@/lib/db";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

let io: SocketIOServer | null = null;

export const initSocket = (server: NetServer) => {
  if (!io) {
    io = new SocketIOServer(server, {
      path: "/api/socketio",
      addTrailingSlash: false,
      transports: ["websocket", "polling"],
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      // Join chat room
      socket.on("join-chat", async (chatId: string) => {
        socket.join(`chat-${chatId}`);
        console.log(`Socket ${socket.id} joined chat-${chatId}`);
      });

      // Leave chat room
      socket.on("leave-chat", (chatId: string) => {
        socket.leave(`chat-${chatId}`);
        console.log(`Socket ${socket.id} left chat-${chatId}`);
      });

      // Join admin room
      socket.on("join-admin", () => {
        socket.join("admin-room");
        console.log(`Socket ${socket.id} joined admin-room`);
      });

      // Send message
      socket.on(
        "send-message",
        async (data: {
          chatId: string;
          userId: number;
          content: string;
          isAdmin: boolean;
        }) => {
          console.log("📨 Received send-message event:", data);
          try {
            // Save message to database
            console.log("💾 Saving message to database...");
            const message = await prisma.chatMessage.create({
              data: {
                chatId: data.chatId,
                userId: data.userId,
                content: data.content,
                isAdmin: data.isAdmin,
                read: false,
              },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            });

            // Update chat lastMessageAt and unreadCount
            await prisma.supportChat.update({
              where: { id: data.chatId },
              data: {
                lastMessageAt: new Date(),
                unreadCount: data.isAdmin ? 0 : { increment: 1 },
              },
            });

            console.log("✅ Message saved:", message.id);

            // Emit to chat room
            console.log(`📤 Emitting to room: chat-${data.chatId}`);
            io?.to(`chat-${data.chatId}`).emit("new-message", {
              id: message.id,
              chatId: message.chatId,
              userId: message.userId,
              content: message.content,
              isAdmin: message.isAdmin,
              read: message.read,
              createdAt: message.createdAt,
              user: message.user,
            });

            // Notify admins of new user message
            if (!data.isAdmin) {
              console.log("🔔 Notifying admin-room");
              io?.to("admin-room").emit("chat-update", {
                chatId: data.chatId,
                type: "new-message",
              });
            }
          } catch (error) {
            console.error("❌ Error saving message:", error);
            socket.emit("error", { message: "Failed to send message" });
          }
        }
      );

      // Mark messages as read
      socket.on(
        "mark-read",
        async (data: { chatId: string; isAdmin: boolean }) => {
          try {
            // Mark all messages in chat as read
            await prisma.chatMessage.updateMany({
              where: {
                chatId: data.chatId,
                read: false,
                isAdmin: !data.isAdmin, // Mark opposite side's messages as read
              },
              data: {
                read: true,
              },
            });

            // Reset unread count if admin is reading
            if (data.isAdmin) {
              await prisma.supportChat.update({
                where: { id: data.chatId },
                data: { unreadCount: 0 },
              });
            }

            // Notify both sides
            io?.to(`chat-${data.chatId}`).emit("messages-read", {
              chatId: data.chatId,
            });
          } catch (error) {
            console.error("Error marking messages as read:", error);
          }
        }
      );

      // Typing indicator
      socket.on(
        "typing",
        (data: { chatId: string; userId: number; isTyping: boolean }) => {
          socket.to(`chat-${data.chatId}`).emit("user-typing", {
            chatId: data.chatId,
            userId: data.userId,
            isTyping: data.isTyping,
          });
        }
      );

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
