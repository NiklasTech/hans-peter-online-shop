"use client";

import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface WishlistProduct {
  id: number;
  name: string;
  price: number;
  previewImage: string | null;
  stock: number;
  brand: {
    name: string;
  };
}

interface WishlistItem {
  id: number;
  productId: number;
  createdAt: string;
  product: WishlistProduct;
}

interface Wishlist {
  id: number;
  name: string;
  items: WishlistItem[];
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist");
      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist);
      } else if (response.status === 401) {
        // User nicht eingeloggt
        setWishlist(null);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Wunschliste:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId: number) => {
    setRemovingId(productId);
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setWishlist((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            items: prev.items.filter((item) => item.productId !== productId),
          };
        });
        // Trigger event für Navbar Badge Update
        window.dispatchEvent(new CustomEvent("wishlist-updated"));
      }
    } catch (error) {
      console.error("Fehler beim Entfernen:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const addToCart = async (productId: number) => {
    // TODO: Implement add to cart functionality
    console.log("Add to cart:", productId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  // User nicht eingeloggt
  if (!wishlist) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Bitte melde dich an
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Um deine Wunschliste zu sehen, musst du eingeloggt sein.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/login">
                <Button>Anmelden</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline">Registrieren</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Leere Wunschliste
  if (wishlist.items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Meine Wunschliste
          </h1>
          <div className="text-center py-16 bg-gray-50 dark:bg-slate-800 rounded-2xl">
            <Heart className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Deine Wunschliste ist leer
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Füge Produkte hinzu, die dir gefallen, um sie später zu kaufen.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Weiter einkaufen
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Meine Wunschliste
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {wishlist.items.length}{" "}
              {wishlist.items.length === 1 ? "Produkt" : "Produkte"}
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Weiter einkaufen
            </Button>
          </Link>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden group"
            >
              {/* Product Image */}
              <Link href={`/product/${item.productId}`}>
                <div className="relative aspect-square bg-gray-100 dark:bg-slate-700">
                  {item.product.previewImage ? (
                    <img
                      src={item.product.previewImage}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Heart className="w-12 h-12" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/product/${item.productId}`}>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {item.product.brand.name}
                  </p>
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {item.product.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    €{item.product.price.toFixed(2)}
                  </span>
                  {item.product.stock > 0 ? (
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Auf Lager
                    </span>
                  ) : (
                    <span className="text-sm text-red-600 dark:text-red-400">
                      Nicht verfügbar
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => addToCart(item.productId)}
                    disabled={item.product.stock === 0}
                    className="flex-1"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    In den Warenkorb
                  </Button>
                  <Button
                    onClick={() => removeFromWishlist(item.productId)}
                    variant="outline"
                    size="sm"
                    disabled={removingId === item.productId}
                    className="px-3"
                  >
                    <Trash2
                      className={`w-4 h-4 text-red-500 ${
                        removingId === item.productId ? "animate-pulse" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
