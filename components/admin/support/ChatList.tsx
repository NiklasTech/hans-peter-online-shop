"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Chat {
  id: string;
  userId: number;
  status: string;
  subject: string | null;
  unreadCount: number;
  lastMessageAt: Date;
  user: {
    id: number;
    name: string;
    email: string;
  };
  messages: Array<{
    content: string;
    createdAt: Date;
    isAdmin: boolean;
  }>;
  _count: {
    messages: number;
  };
}

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  loading?: boolean;
}

export function ChatList({
  chats,
  selectedChatId,
  onSelectChat,
  loading,
}: ChatListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
        <p>Keine Chats gefunden</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-orange-500";
      case "in_progress":
        return "bg-blue-500";
      case "closed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Offen";
      case "in_progress":
        return "In Bearbeitung";
      case "closed":
        return "Geschlossen";
      default:
        return status;
    }
  };

  return (
    <ScrollArea className="h-[600px]">
      <div className="divide-y">
        {chats.map((chat) => {
          const lastMessage = chat.messages[0];
          const isSelected = selectedChatId === chat.id;

          return (
            <div
              key={chat.id}
              className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                isSelected ? "bg-muted" : ""
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={undefined} />
                  <AvatarFallback>
                    {chat.user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-medium text-sm truncate">
                      {chat.user.name}
                    </p>
                    {chat.unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="h-5 min-w-5 px-1.5 text-xs"
                      >
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground truncate mb-2">
                    {lastMessage?.content || "Kein Nachricht"}
                  </p>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusColor(chat.status)} text-white border-none`}
                    >
                      {getStatusLabel(chat.status)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(chat.lastMessageAt))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
