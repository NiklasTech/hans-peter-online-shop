"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

export default function Navbar() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAvatarClick = () => {
    if (!isLoggedIn) {
      setIsAuthDialogOpen(true);
      setAuthMode("login");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex-shrink-0 font-bold text-xl dark:text-white">
              Hans Peter Shop
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Produkte suchen..."
                  className="pl-10 dark:bg-slate-900 dark:border-gray-700"
                />
              </div>
            </div>

            {/* Avatar / Auth */}
            <div>
              {isLoggedIn ? (
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <Avatar className="cursor-pointer hover:opacity-80 transition">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuLabel>Mein Konto</ContextMenuLabel>
                    <ContextMenuSeparator />
                    <ContextMenuItem>Profil</ContextMenuItem>
                    <ContextMenuItem>Einstellungen</ContextMenuItem>
                    <ContextMenuItem>Bestellungen</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem onClick={handleLogout}>
                      Abmelden
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ) : (
                <Avatar
                  className="cursor-pointer hover:opacity-80 transition"
                  onClick={handleAvatarClick}
                >
                  <AvatarFallback>AG</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Dialog */}
      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {authMode === "login" ? "Anmelden" : "Registrieren"}
            </DialogTitle>
            <DialogDescription>
              {authMode === "login"
                ? "Melden Sie sich an, um Ihren Account zu verwalten"
                : "Erstellen Sie einen neuen Account"}
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={authMode}
            onValueChange={(value) =>
              setAuthMode(value as "login" | "register")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Anmelden</TabsTrigger>
              <TabsTrigger value="register">Registrieren</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">E-Mail</label>
                <Input type="email" placeholder="deine@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Passwort</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  setIsLoggedIn(true);
                  setIsAuthDialogOpen(false);
                }}
              >
                Anmelden
              </Button>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Vollständiger Name</label>
                <Input type="text" placeholder="Max Mustermann" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">E-Mail</label>
                <Input type="email" placeholder="deine@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Passwort</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Passwort bestätigen
                </label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  setIsLoggedIn(true);
                  setIsAuthDialogOpen(false);
                }}
              >
                Registrieren
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
