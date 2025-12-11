"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ShoppingBag,
  Heart,
  User,
  Settings,
  Shield,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const categories = [
  {
    name: "Männer",
    subcategories: [
      { name: "T-Shirts", href: "/products/men/tshirts" },
      { name: "Hemden", href: "/products/men/shirts" },
      { name: "Hosen", href: "/products/men/pants" },
      { name: "Schuhe", href: "/products/men/shoes" },
    ],
  },
  {
    name: "Frauen",
    subcategories: [
      { name: "Kleider", href: "/products/women/dresses" },
      { name: "Tops", href: "/products/women/tops" },
      { name: "Jeans", href: "/products/women/jeans" },
      { name: "Schuhe", href: "/products/women/shoes" },
    ],
  },
  {
    name: "Zubehör",
    subcategories: [
      { name: "Taschen", href: "/products/accessories/bags" },
      { name: "Schmuck", href: "/products/accessories/jewelry" },
      { name: "Gürtel", href: "/products/accessories/belts" },
      { name: "Sonstiges", href: "/products/accessories/other" },
    ],
  },
];

interface UserData {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

export default function Navbar() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [user, setUser] = useState<UserData | null>(null);
  const [hasAdminSession, setHasAdminSession] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setHasAdminSession(data.hasAdminSession);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login fehlgeschlagen");
        return;
      }

      setUser(data.user);
      setIsAuthDialogOpen(false);
      setLoginEmail("");
      setLoginPassword("");
      await checkAuthStatus();
    } catch {
      setError("Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (registerPassword !== registerConfirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registrierung fehlgeschlagen");
        return;
      }

      setUser(data.user);
      setIsAuthDialogOpen(false);
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      await checkAuthStatus();
    } catch {
      setError("Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      await checkAuthStatus();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 sticky top-0 z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 sm:gap-6">
            {/* Logo */}
            <Link href="/">
              <div className="shrink-0 font-bold text-xl text-gray-900 dark:text-white cursor-pointer hover:opacity-80 transition">
                Hans Peter Shop
              </div>
            </Link>

            {/* Navigation Menu - Desktop */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {categories.map((category) => (
                  <NavigationMenuItem key={category.name}>
                    <NavigationMenuTrigger className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[200px] gap-2 p-4">
                        {category.subcategories.map((sub) => (
                          <Link key={sub.href} href={sub.href}>
                            <NavigationMenuLink asChild>
                              <span className="block px-3 py-2 text-sm text-gray-900 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer transition">
                                {sub.name}
                              </span>
                            </NavigationMenuLink>
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 dark:text-white" />
              ) : (
                <Menu className="h-6 w-6 dark:text-white" />
              )}
            </button>

            {/* Search Bar */}
            <div className="hidden sm:flex flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Produkte suchen..."
                  className="pl-10 dark:bg-slate-900 dark:border-gray-700"
                />
              </div>
            </div>

            {/* Cart, Wishlist and Avatar */}
            <div className="flex items-center gap-4">
              {/* Wishlist Icon */}
              <Link href="/wishlist">
                <div className="relative cursor-pointer hover:opacity-80 transition">
                  <Heart className="h-6 w-6 text-gray-900 dark:text-white" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    0
                  </span>
                </div>
              </Link>

              {/* Shopping Cart with Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer hover:opacity-80 transition">
                    <ShoppingCart className="h-6 w-6 text-gray-900 dark:text-white" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      0
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Warenkorb</h3>

                    {/* Cart Items (Empty State) */}
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">
                        Dein Warenkorb ist leer
                      </p>
                    </div>

                    {/* Subtotal */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                      <div className="flex justify-between mb-4">
                        <span className="font-medium">Summe:</span>
                        <span className="font-semibold">€0,00</span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-2">
                      <Link href="/" className="block">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {}}
                        >
                          Weiter einkaufen
                        </Button>
                      </Link>
                      <Link href="/checkout" className="block">
                        <Button className="w-full">Zur Kasse</Button>
                      </Link>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Avatar / Auth */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative cursor-pointer">
                    <Avatar className="hover:opacity-80 transition">
                      {user ? (
                        <>
                          <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
                          <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                        </>
                      ) : (
                        <AvatarFallback>AG</AvatarFallback>
                      )}
                    </Avatar>
                    {/* Admin badge indicator */}
                    {hasAdminSession && (
                      <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1">
                        <Shield className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {user ? (
                    <>
                      <DropdownMenuLabel>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <User className="h-4 w-4" />
                          <span>Mein Profil</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/orders"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          <span>Meine Bestellungen</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/settings"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Einstellungen</span>
                        </Link>
                      </DropdownMenuItem>

                      {/* Admin section */}
                      {hasAdminSession && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-yellow-600 dark:text-yellow-500 flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Admin
                          </DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/admin"
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Settings className="h-4 w-4" />
                              <span>Admin Panel</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 dark:text-red-500"
                      >
                        Abmelden (User)
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        onClick={() => {
                          setIsAuthDialogOpen(true);
                          setAuthMode("login");
                        }}
                        className="cursor-pointer"
                      >
                        Login / Registrieren
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Accordion Style */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {selectedCategory ? (
              <>
                {/* Back Button */}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 mb-6 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                  <span>←</span> Zurück
                </button>

                {/* Subcategories */}
                <div>
                  {categories
                    .find((cat) => cat.name === selectedCategory)
                    ?.subcategories.map((sub) => (
                      <div key={sub.href} className="mb-3">
                        <Link href={sub.href}>
                          <div className="px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {sub.name}
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <>
                {/* Main Categories */}
                <h2 className="text-xl font-bold mb-6 dark:text-white">
                  Alle Kategorien
                </h2>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </span>
                      <span className="text-gray-400">→</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

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
            onValueChange={(value) => {
              setAuthMode(value as "login" | "register");
              setError("");
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Anmelden</TabsTrigger>
              <TabsTrigger value="register">Registrieren</TabsTrigger>
            </TabsList>

            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">E-Mail</label>
                  <Input
                    type="email"
                    placeholder="deine@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Passwort</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Wird angemeldet..." : "Anmelden"}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Vollständiger Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Max Mustermann"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">E-Mail</label>
                  <Input
                    type="email"
                    placeholder="deine@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Passwort</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Passwort bestätigen
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Wird registriert..." : "Registrieren"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
