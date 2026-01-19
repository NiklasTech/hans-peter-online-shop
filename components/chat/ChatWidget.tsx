"use client";

import { Fragment, useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Paperclip, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Chat } from "./chat";
import { ChatHeader, ChatHeaderStart, ChatHeaderMain, ChatHeaderEnd } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import {
  ChatToolbar,
  ChatToolbarAddonStart,
  ChatToolbarAddonEnd,
  ChatToolbarTextarea,
} from "./chat-toolbar";
import { PrimaryMessage } from "./message-items/primary-message";
import { AdditionalMessage } from "./message-items/additional-message";
import { DateItem } from "./message-items/date-item";
import { useSocket } from "@/hooks/useSocket";

interface Message {
  id: number;
  chatId: string;
  userId: number;
  content: string;
  isAdmin: boolean;
  createdAt: Date;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface SupportChat {
  id: string;
  userId: number;
  status: string;
  messages: Message[];
}

interface User {
  userId: number;
  name?: string;
  email: string;
  isAdmin?: boolean;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState<SupportChat | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [size, setSize] = useState({ width: 420, height: 650 });
  const [isResizing, setIsResizing] = useState(false);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();

  // Get current user - check periodically in case of login
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        // User not logged in, widget will be hidden
        setUser(null);
      }
    };

    fetchUser();

    // Re-check user every 5 seconds to detect login
    const interval = setInterval(fetchUser, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch or create chat when opened
  useEffect(() => {
    if (isOpen && user && !chat) {
      fetchChat();
    }
  }, [isOpen, user]);

  // Socket listeners - setup once when chat is loaded
  useEffect(() => {
    if (!socket || !chat) return;

    console.log("🔗 Joining chat room:", chat.id);
    socket.emit("join-chat", chat.id);

    // Handler functions
    const handleNewMessage = (newMessage: Message) => {
      console.log("📩 Received new message:", newMessage);
      if (newMessage.chatId === chat.id) {
        setChat((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, newMessage],
          };
        });

        // If admin message and chat is closed, increment unread
        if (newMessage.isAdmin && !isOpen) {
          setUnreadCount((prev) => prev + 1);
        }
      }
    };

    const handleMessagesRead = ({ chatId }: { chatId: string }) => {
      if (chatId === chat.id) {
        setChat((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: prev.messages.map((msg) => ({
              ...msg,
              read: true,
            })),
          };
        });
      }
    };

    // Register listeners
    socket.on("new-message", handleNewMessage);
    socket.on("messages-read", handleMessagesRead);

    return () => {
      console.log("🔌 Leaving chat room:", chat.id);
      socket.emit("leave-chat", chat.id);
      socket.off("new-message", handleNewMessage);
      socket.off("messages-read", handleMessagesRead);
    };
  }, [socket, chat?.id]); // Only re-run when socket or chat.id changes

  const fetchChat = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/chat");
      if (response.ok) {
        const data = await response.json();
        setChat(data);

        // Mark messages as read when opening
        if (socket) {
          socket.emit("mark-read", { chatId: data.id, isAdmin: false });
        }
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !chat || !socket || !user) return;

    console.log("Sending message:", { chatId: chat.id, userId: user.userId, content: inputValue.trim() });

    // Send via socket
    socket.emit("send-message", {
      chatId: chat.id,
      userId: user.userId,
      content: inputValue.trim(),
      isAdmin: false,
    });

    setInputValue("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (e: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes("left")) {
        newWidth = startWidth + (startX - e.clientX);
      }
      if (direction.includes("right")) {
        newWidth = startWidth - (startX - e.clientX);
      }
      if (direction.includes("top")) {
        newHeight = startHeight + (startY - e.clientY);
      }
      if (direction.includes("bottom")) {
        newHeight = startHeight - (startY - e.clientY);
      }

      // Min and max constraints
      newWidth = Math.max(320, Math.min(800, newWidth));
      newHeight = Math.max(400, Math.min(900, newHeight));

      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Convert messages to old format for rendering
  const displayMessages = chat
    ? chat.messages
        .slice()
        .reverse()
        .map((msg) => ({
          id: msg.id.toString(),
          sender: {
            id: msg.userId.toString(),
            name: msg.user.name,
            avatarUrl: msg.isAdmin ? "/logo.png" : undefined,
            username: msg.isAdmin ? "@support" : "@user",
          },
          timestamp: new Date(msg.createdAt).getTime(),
          content: msg.content,
        }))
    : [];

  // Don't show widget if user is not logged in or is an admin
  if (!user || user.isAdmin) {
    return null;
  }

  return (
    <>
      {!isOpen ? (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={toggleChat}
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform relative"
          >
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      ) : (
        <div
          ref={chatRef}
          className="fixed bottom-6 right-6 z-50 shadow-2xl rounded-lg bg-background border overflow-hidden"
          style={{
            width: `${size.width}px`,
            height: `${size.height}px`,
          }}
        >
          {/* Resize handles */}
          <div
            className="absolute top-0 left-0 w-8 h-8 cursor-nw-resize z-[100]"
            onMouseDown={(e) => handleMouseDown(e, "top-left")}
          />
          <div
            className="absolute bottom-0 left-0 w-8 h-8 cursor-sw-resize z-[100]"
            onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
          />
          <div
            className="absolute bottom-0 right-0 w-8 h-8 cursor-se-resize z-[100]"
            onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
          />
          <div
            className="absolute top-0 left-8 right-12 h-3 cursor-n-resize z-[100]"
            onMouseDown={(e) => handleMouseDown(e, "top")}
          />
          <div
            className="absolute bottom-0 left-8 right-8 h-3 cursor-s-resize z-[100]"
            onMouseDown={(e) => handleMouseDown(e, "bottom")}
          />
          <div
            className="absolute left-0 top-8 bottom-8 w-3 cursor-w-resize z-[100]"
            onMouseDown={(e) => handleMouseDown(e, "left")}
          />
          <div
            className="absolute right-0 top-12 bottom-8 w-3 cursor-e-resize z-[100]"
            onMouseDown={(e) => handleMouseDown(e, "right")}
          />

          <Chat>
            <ChatHeader className="border-b">
              <ChatHeaderStart>
                <Avatar className="rounded-full size-8">
                  <AvatarImage src="/logo.png" alt="Support" />
                  <AvatarFallback>HP</AvatarFallback>
                </Avatar>
              </ChatHeaderStart>
              <ChatHeaderMain>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Hans Peter Support</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    Online
                  </span>
                </div>
              </ChatHeaderMain>
              <ChatHeaderEnd>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleChat}
                >
                  <X className="h-4 w-4" />
                </Button>
              </ChatHeaderEnd>
            </ChatHeader>

            <ChatMessages className="scrollbar-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Laden...</p>
                </div>
              ) : displayMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    Keine Nachrichten. Starte ein Gespräch!
                  </p>
                </div>
              ) : (
                displayMessages.map((msg, i, msgs) => {
                  // If date changed, show date item
                  if (
                    new Date(msg.timestamp).toDateString() !==
                    new Date(msgs[i + 1]?.timestamp).toDateString()
                  ) {
                    return (
                      <Fragment key={msg.id}>
                        <PrimaryMessage
                          avatarSrc={msg.sender.avatarUrl}
                          avatarAlt={msg.sender.username}
                          avatarFallback={msg.sender.name.slice(0, 2)}
                          senderName={msg.sender.name}
                          content={msg.content}
                          timestamp={msg.timestamp}
                        />
                        <DateItem timestamp={msg.timestamp} className="my-4" />
                      </Fragment>
                    );
                  }

                  // If next item is same user, show additional
                  if (msg.sender.id === msgs[i + 1]?.sender.id) {
                    return (
                      <AdditionalMessage
                        key={msg.id}
                        content={msg.content}
                        timestamp={msg.timestamp}
                      />
                    );
                  }
                  // Else, show primary
                  else {
                    return (
                      <PrimaryMessage
                        className="mt-4"
                        key={msg.id}
                        avatarSrc={msg.sender.avatarUrl}
                        avatarAlt={msg.sender.username}
                        avatarFallback={msg.sender.name.slice(0, 2)}
                        senderName={msg.sender.name}
                        content={msg.content}
                        timestamp={msg.timestamp}
                      />
                    );
                  }
                })
              )}
            </ChatMessages>

            <ChatToolbar>
              <ChatToolbarAddonStart>
                <Button variant="ghost" className="size-8 @md/chat:size-9" disabled>
                  <Paperclip className="size-4 @md/chat:size-5 stroke-[1.7px]" />
                </Button>
              </ChatToolbarAddonStart>
              <ChatToolbarTextarea
                ref={textareaRef}
                placeholder="Nachricht schreiben..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading || !chat}
              />
              <ChatToolbarAddonEnd>
                <Button variant="ghost" className="size-8 @md/chat:size-9" disabled>
                  <Smile className="size-4 @md/chat:size-5 stroke-[1.7px]" />
                </Button>
                <Button
                  variant="ghost"
                  className="size-8 @md/chat:size-9"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || loading || !chat}
                >
                  <Send className="size-4 @md/chat:size-5 stroke-[1.7px]" />
                </Button>
              </ChatToolbarAddonEnd>
            </ChatToolbar>
          </Chat>
        </div>
      )}
    </>
  );
}
