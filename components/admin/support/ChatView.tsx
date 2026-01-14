"use client";

import { useState, useEffect, useRef } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Loader2, X } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { formatDistanceToNow } from "@/lib/utils";

interface Message {
  id: number;
  chatId: string;
  userId: number;
  content: string;
  isAdmin: boolean;
  read: boolean;
  createdAt: Date;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface Chat {
  id: string;
  userId: number;
  status: string;
  subject: string | null;
  assignedTo: number | null;
  unreadCount: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  messages: Message[];
}

interface ChatViewProps {
  chatId: string | null;
  onClose: () => void;
  onUpdate: () => void;
}

export function ChatView({ chatId, onClose, onUpdate }: ChatViewProps) {
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [adminUser, setAdminUser] = useState<{ id: number; name: string } | null>(
    null
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();

  // Get current admin user
  useEffect(() => {
    const fetchAdminUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setAdminUser(data);
        }
      } catch (error) {
        console.error("Error fetching admin user:", error);
      }
    };

    fetchAdminUser();
  }, []);

  // Fetch chat details
  useEffect(() => {
    if (!chatId) {
      setChat(null);
      return;
    }

    const fetchChat = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/support/chats/${chatId}`);
        if (response.ok) {
          const data = await response.json();
          setChat(data);

          // Mark messages as read
          if (socket) {
            socket.emit("mark-read", { chatId, isAdmin: true });
          }
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [chatId, socket]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !chatId) return;

    // Join chat room
    socket.emit("join-chat", chatId);

    // Listen for new messages
    socket.on("new-message", (newMessage: Message) => {
      if (newMessage.chatId === chatId) {
        setChat((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, newMessage],
          };
        });

        // Mark as read if it's a user message
        if (!newMessage.isAdmin) {
          socket.emit("mark-read", { chatId, isAdmin: true });
        }
      }
    });

    return () => {
      socket.emit("leave-chat", chatId);
      socket.off("new-message");
    };
  }, [socket, chatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat?.messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !chat || !socket || !adminUser) return;

    try {
      setSending(true);

      // Send via socket
      socket.emit("send-message", {
        chatId: chat.id,
        userId: adminUser.id,
        content: message.trim(),
        isAdmin: true,
      });

      setMessage("");
      onUpdate();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!chat) return;

    try {
      const response = await fetch(`/api/admin/support/chats/${chat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedChat = await response.json();
        setChat(updatedChat);
        onUpdate();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (!chatId) {
    return (
      <CardContent className="flex items-center justify-center h-[600px]">
        <p className="text-muted-foreground">Wähle einen Chat aus</p>
      </CardContent>
    );
  }

  if (loading) {
    return (
      <CardContent className="flex items-center justify-center h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </CardContent>
    );
  }

  if (!chat) {
    return (
      <CardContent className="flex items-center justify-center h-[600px]">
        <p className="text-muted-foreground">Chat nicht gefunden</p>
      </CardContent>
    );
  }

  return (
    <>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={undefined} />
              <AvatarFallback>
                {chat.user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{chat.user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{chat.user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={chat.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Offen</SelectItem>
                <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                <SelectItem value="closed">Geschlossen</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[520px]">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {chat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.isAdmin ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={undefined} />
                  <AvatarFallback>
                    {msg.user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`flex flex-col ${
                    msg.isAdmin ? "items-end" : "items-start"
                  } max-w-[70%]`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{msg.user.name}</span>
                    {msg.isAdmin && (
                      <Badge variant="secondary" className="text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>

                  <div
                    className={`rounded-lg px-3 py-2 ${
                      msg.isAdmin
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  <span className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(msg.createdAt))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Nachricht eingeben..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="min-h-[60px] resize-none"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sending}
              size="icon"
              className="shrink-0"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
}
