"use client";

/**
 * Admin Support Dashboard
 * Route: /admin/support
 *
 * Displays all support chats with real-time updates via Socket.io
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, Clock, CheckCircle2 } from "lucide-react";
import { ChatList } from "@/components/admin/support/ChatList";
import { ChatView } from "@/components/admin/support/ChatView";
import { useSocket } from "@/hooks/useSocket";

interface Chat {
  id: string;
  userId: number;
  status: string;
  subject: string | null;
  assignedTo: number | null;
  unreadCount: number;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    name: string;
    email: string;
  };
  messages: Array<{
    id: number;
    content: string;
    createdAt: Date;
    isAdmin: boolean;
    user: {
      id: number;
      name: string;
    };
  }>;
  _count: {
    messages: number;
  };
}

export default function SupportDashboard() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const socket = useSocket();

  // Fetch chats
  const fetchChats = async (status: string = "all") => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/support/chats?status=${status}`);
      if (response.ok) {
        const data = await response.json();
        setChats(data);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats(activeTab);
  }, [activeTab]);

  // Socket.io listeners
  useEffect(() => {
    if (!socket) return;

    // Join admin room
    socket.emit("join-admin");

    // Listen for chat updates
    socket.on("chat-update", (data: { chatId: string; type: string }) => {
      // Refresh chats when there's an update
      fetchChats(activeTab);
    });

    return () => {
      socket.off("chat-update");
    };
  }, [socket, activeTab]);

  const stats = {
    total: chats.length,
    open: chats.filter((c) => c.status === "open").length,
    inProgress: chats.filter((c) => c.status === "in_progress").length,
    closed: chats.filter((c) => c.status === "closed").length,
    unread: chats.reduce((acc, c) => acc + c.unreadCount, 0),
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Dashboard</h1>
        <p className="text-muted-foreground">
          Verwalte Kundenanfragen und Support-Chats
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Alle Chats</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offen</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
            <p className="text-xs text-muted-foreground">Neue Anfragen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Bearbeitung</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Wird bearbeitet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ungelesen</CardTitle>
            <Badge variant="destructive" className="h-4 px-2 text-xs">
              {stats.unread}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unread}</div>
            <p className="text-xs text-muted-foreground">Neue Nachrichten</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Chats</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full rounded-none border-b">
                <TabsTrigger value="all" className="flex-1">
                  Alle ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="open" className="flex-1">
                  Offen ({stats.open})
                </TabsTrigger>
                <TabsTrigger value="in_progress" className="flex-1">
                  Aktiv ({stats.inProgress})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="m-0">
                <ChatList
                  chats={chats}
                  selectedChatId={selectedChat}
                  onSelectChat={setSelectedChat}
                  loading={loading}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Chat View */}
        <Card className="lg:col-span-2">
          <ChatView
            chatId={selectedChat}
            onClose={() => setSelectedChat(null)}
            onUpdate={() => fetchChats(activeTab)}
          />
        </Card>
      </div>
    </div>
  );
}
