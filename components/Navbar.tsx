"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Loader2,
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

interface SearchProduct {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  previewImage?: string | null;
  stock: number;
  brand?: { name: string };
  categories?: string[];
}

export default function Navbar() {
  const router = useRouter();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [user, setUser] = useState<UserData | null>(null);
  const [hasAdminSession, setHasAdminSession] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Prevent hydration mismatch by only rendering interactive components after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Fetch wishlist count
  const fetchWishlistCount = async () => {
    try {
      const response = await fetch("/api/wishlist/count");
      if (response.ok) {
        const data = await response.json();
        setWishlistCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
    }
  };

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      const response = await fetch("/api/cart/count");
      if (response.ok) {
        const data = await response.json();
        setCartCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  // Fetch cart items
  const fetchCartItems = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cartItems || []);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Fetch wishlist and cart count on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchWishlistCount();
      fetchCartCount();
    } else {
      setWishlistCount(0);
      setCartCount(0);
      setCartItems([]);
    }
  }, [user]);

  // Listen for wishlist and cart updates
  useEffect(() => {
    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };

    const handleCartUpdate = () => {
      fetchCartCount();
      fetchCartItems();
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => {
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  // Handle search input with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/products/search?q=${encodeURIComponent(searchQuery)}`
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.products || []);
          setShowSearchResults(true);
        }
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setHasAdminSession(data.hasAdminSession);
      } else {
        // Not authenticated - reset all states
        setUser(null);
        setHasAdminSession(false);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      // On error, reset states to be safe
      setUser(null);
      setHasAdminSession(false);
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
      // Hard reload to ensure all server components re-render
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      // Hard reload to ensure all server components re-render (especially admin layout)
      window.location.reload();
    } catch (error) {
      console.error("Error logging out admin:", error);
    }
  };

  const handleAdminActivate = async () => {
    try {
      const response = await fetch("/api/admin/auth/activate", { method: "POST" });
      if (response.ok) {
        // Hard reload to ensure all server components re-render with admin access
        window.location.reload();
      }
    } catch (error) {
      console.error("Error activating admin session:", error);
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const handleSearchResultClick = (productId: number) => {
    setShowSearchResults(false);
    setSearchQuery("");
    router.push(`/product/${productId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
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
            {isMounted ? (
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
            ) : (
              <div className="hidden lg:flex gap-4">
                {categories.map((category) => (
                  <span key={category.name} className="text-sm font-medium text-gray-900 dark:text-white px-4 py-2">
                    {category.name}
                  </span>
                ))}
              </div>
            )}

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
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 max-w-md relative" ref={searchRef}>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Produkte suchen (Name, Kategorie, etc.)..."
                  className="pl-10 dark:bg-slate-900 dark:border-gray-700 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowSearchResults(true);
                    }
                  }}
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                )}
              </div>

              {/* Search Suggestions Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-[500px] overflow-y-auto z-50">
                  {searchResults.length > 0 ? (
                    <>
                      {/* Suggestions Header */}
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Vorschläge
                        </p>
                      </div>

                      {/* Product Suggestions - Show max 5 */}
                      <div className="py-1">
                        {searchResults.slice(0, 5).map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleSearchResultClick(product.id)}
                            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer transition-colors flex items-center gap-3"
                          >
                            {/* Product Image */}
                            <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-slate-800 shrink-0">
                              {product.previewImage ? (
                                <img
                                  src={product.previewImage}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Search className="h-6 w-6" />
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {product.name}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                                  #{product.id}
                                </span>
                              </div>
                              {product.brand && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {product.brand.name}
                                </p>
                              )}
                              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                {formatPrice(product.price)}
                              </p>
                            </div>

                            {/* Stock Status */}
                            <div className="shrink-0">
                              {product.stock > 0 ? (
                                <span className="text-xs text-green-600 dark:text-green-400">
                                  Verfügbar
                                </span>
                              ) : (
                                <span className="text-xs text-red-600 dark:text-red-400">
                                  Ausverkauft
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* View All Results Button */}
                      <div className="border-t border-gray-200 dark:border-gray-700">
                        <button
                          type="button"
                          onClick={handleViewAllResults}
                          className="w-full px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-center"
                        >
                          Alle {searchResults.length} Ergebnisse anzeigen →
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Keine Produkte gefunden
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Drücke Enter für erweiterte Suche
                      </p>
                    </div>
                  )}
                </div>
              )}
            </form>

            {/* Cart, Wishlist and Avatar */}
            <div className="flex items-center gap-4">
              {/* Wishlist Icon */}
              <Link href="/wishlist">
                <div className="relative cursor-pointer hover:opacity-80 transition">
                  <Heart className="h-6 w-6 text-gray-900 dark:text-white" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* Shopping Cart with Popover */}
              {isMounted ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      className="relative cursor-pointer hover:opacity-80 transition"
                      onClick={fetchCartItems}
                    >
                      <ShoppingCart className="h-6 w-6 text-gray-900 dark:text-white" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {cartCount > 99 ? "99+" : cartCount}
                        </span>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-4" align="end">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Warenkorb</h3>

                      {/* Cart Items */}
                      {cartItems.length > 0 ? (
                        <>
                          <div className="max-h-[400px] overflow-y-auto space-y-3">
                            {cartItems.map((item) => (
                              <div key={item.id} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">
                                {/* Product Image */}
                                <div className="w-16 h-16 rounded bg-gray-100 dark:bg-slate-700 shrink-0 overflow-hidden">
                                  {item.product.previewImage ? (
                                    <img
                                      src={item.product.previewImage}
                                      alt={item.product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      <ShoppingCart className="h-6 w-6" />
                                    </div>
                                  )}
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                  <Link href={`/product/${item.productId}`}>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400">
                                      {item.product.name}
                                    </p>
                                  </Link>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.product.brand?.name}
                                  </p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                      {formatPrice(item.product.price)}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      Menge: {item.quantity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Subtotal */}
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                            <div className="flex justify-between mb-4">
                              <span className="font-medium">Summe:</span>
                              <span className="font-semibold">
                                {formatPrice(
                                  cartItems.reduce(
                                    (sum, item) => sum + item.product.price * item.quantity,
                                    0
                                  )
                                )}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                          <p className="text-gray-500 dark:text-gray-400">
                            Dein Warenkorb ist leer
                          </p>
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="space-y-2">
                        <Link href="/" className="block">
                          <Button
                            variant="outline"
                            className="w-full"
                          >
                            Weiter einkaufen
                          </Button>
                        </Link>
                        <Link href="/checkout" className="block">
                          <Button className="w-full" disabled={cartItems.length === 0}>
                            Zur Kasse
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="relative cursor-pointer hover:opacity-80 transition">
                  <ShoppingCart className="h-6 w-6 text-gray-900 dark:text-white" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </div>
              )}

              {/* Avatar / Auth */}
              {isMounted ? (
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
                            href="/account"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <User className="h-4 w-4" />
                            <span>Mein Konto</span>
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
                            href="/wishlist"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Heart className="h-4 w-4" />
                            <span>Wunschliste</span>
                          </Link>
                        </DropdownMenuItem>

                        {/* Admin section - show if user has admin rights */}
                        {user?.isAdmin && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-yellow-600 dark:text-yellow-500 flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Admin
                            </DropdownMenuLabel>
                            {hasAdminSession ? (
                              <>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href="/admin"
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <Settings className="h-4 w-4" />
                                    <span>Admin Panel</span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={handleAdminLogout}
                                  className="cursor-pointer text-yellow-600 dark:text-yellow-500"
                                >
                                  Admin abmelden
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem
                                onClick={handleAdminActivate}
                                className="cursor-pointer text-yellow-600 dark:text-yellow-500"
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Als Admin anmelden
                              </DropdownMenuItem>
                            )}
                          </>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="cursor-pointer text-red-600 dark:text-red-500"
                        >
                          Abmelden
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
              ) : (
                <div className="relative cursor-pointer">
                  <Avatar className="hover:opacity-80 transition">
                    <AvatarFallback>AG</AvatarFallback>
                  </Avatar>
                </div>
              )}
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
