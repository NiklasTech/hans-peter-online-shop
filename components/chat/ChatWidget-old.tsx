"use client";

import { Fragment, useState, useRef } from "react";
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

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatarUrl?: string;
    username: string;
  };
  timestamp: number;
  content: string;
}

const SUPPORT_SENDER = {
  id: "support-id",
  name: "Hans Peter Support",
  avatarUrl: "/logo.png",
  username: "@support",
};

const USER_SENDER = {
  id: "user-id",
  name: "Sie",
  username: "@user",
};

const initialMessages: Message[] = [
  {
    id: "1",
    sender: SUPPORT_SENDER,
    timestamp: Date.now() - 60000,
    content: "Hallo! Willkommen bei Hans Peter. Wie kann ich Ihnen heute helfen?",
  },
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [size, setSize] = useState({ width: 420, height: 650 });
  const [isResizing, setIsResizing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: USER_SENDER,
      timestamp: Date.now(),
      content: inputValue,
    };

    setMessages((prev) => [newMessage, ...prev]);
    setInputValue("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Simulate support response
    setTimeout(() => {
      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: SUPPORT_SENDER,
        timestamp: Date.now(),
        content:
          "Vielen Dank für Ihre Nachricht! Unser Support-Team wird sich in Kürze bei Ihnen melden.",
      };
      setMessages((prev) => [supportResponse, ...prev]);

      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    }, 1000);
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
          {/* Resize handles - positioned inside but with high z-index */}
          {/* Top-left corner */}
          <div
            className="absolute top-0 left-0 w-8 h-8 cursor-nw-resize z-[100]"
            onMouseDown={(e) => handleMouseDown(e, "top-left")}
          />
          {/* Top-right corner - deactivated to not block close button */}
          {/* Bottom-left corner */}
          <div
            className="absolute bottom-0 left-0 w-8 h-8 cursor-sw-resize z-[100]"
            onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
          />
          {/* Bottom-right corner */}
          <div
            className="absolute bottom-0 right-0 w-8 h-8 cursor-se-resize z-[100]"
            onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
          />
          {/* Top edge - avoiding right corner area */}
          <div
            className="absolute top-0 left-8 right-12 h-3 cursor-n-resize z-[100]"
            onMouseDown={(e) => handleMouseDown(e, "top")}
          />
          {/* Bottom edge */}
          <div
            className="absolute bottom-0 left-8 right-8 h-3 cursor-s-resize z-[100]"
            onMouseDown={(e) => handleMouseDown(e, "bottom")}
          />
          {/* Left edge */}
          <div
            className="absolute left-0 top-8 bottom-8 w-3 cursor-w-resize z-[100]"
            onMouseDown={(e) => handleMouseDown(e, "left")}
          />
          {/* Right edge - avoiding top corner area */}
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
              {messages.map((msg, i, msgs) => {
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
              })}
            </ChatMessages>

            <ChatToolbar>
              <ChatToolbarAddonStart>
                <Button variant="ghost" className="size-8 @md/chat:size-9">
                  <Paperclip className="size-4 @md/chat:size-5 stroke-[1.7px]" />
                </Button>
              </ChatToolbarAddonStart>
              <ChatToolbarTextarea
                ref={textareaRef}
                placeholder="Nachricht schreiben..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <ChatToolbarAddonEnd>
                <Button variant="ghost" className="size-8 @md/chat:size-9">
                  <Smile className="size-4 @md/chat:size-5 stroke-[1.7px]" />
                </Button>
                <Button
                  variant="ghost"
                  className="size-8 @md/chat:size-9"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
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
