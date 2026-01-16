"use client";

import { ShoppingCart, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import WishlistButton from "@/components/WishlistButton";

interface ProductInfoProps {
  productId: number;
  name: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  inStock: boolean;
  sku?: string;
  category?: string;
}

export default function ProductInfo({
  productId,
  name,
  price,
  salePrice,
  rating,
  reviewCount,
  description,
  inStock,
  sku,
  category,
}: ProductInfoProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const isOnSale = salePrice !== undefined && salePrice !== null && salePrice < price;
  const displayPrice = isOnSale ? salePrice : price;
  const discountPercent = isOnSale ? Math.round((1 - salePrice / price) * 100) : 0;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (response.ok) {
        setAddedToCart(true);
        window.dispatchEvent(new CustomEvent("cart-updated"));

        // Reset "added" state after 2 seconds
        setTimeout(() => {
          setAddedToCart(false);
        }, 2000);
      } else {
        const data = await response.json();
        alert(data.error || "Fehler beim Hinzufügen zum Warenkorb");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Ein Fehler ist aufgetreten");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    setIsAddingToCart(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (response.ok) {
        window.dispatchEvent(new CustomEvent("cart-updated"));
        router.push("/checkout");
      } else {
        const data = await response.json();
        alert(data.error || "Fehler beim Hinzufügen zum Warenkorb");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Ein Fehler ist aufgetreten");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      {category && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {category} {">"} {name}
        </div>
      )}

      {/* Title & Rating */}
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          {name}
        </h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-lg">
                  {i < Math.floor(rating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {rating.toFixed(1)} ({reviewCount}{" "}
              {reviewCount === 1 ? "Bewertung" : "Bewertungen"})
            </span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        {isOnSale && (
          <div className="flex items-center gap-3">
            <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
              €{price.toFixed(2)}
            </span>
            <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full">
              -{discountPercent}% SALE
            </span>
          </div>
        )}
        <div className={`text-4xl font-bold ${isOnSale ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}>
          €{displayPrice.toFixed(2)}
        </div>
        {inStock ? (
          <div className="text-sm font-medium text-green-600 dark:text-green-400">
            ✓ Auf Lager
          </div>
        ) : (
          <div className="text-sm font-medium text-red-600 dark:text-red-400">
            ✗ Nicht auf Lager
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Beschreibung
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Product Details */}
      {sku && (
        <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">SKU:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {sku}
            </span>
          </div>
        </div>
      )}

      {/* Quantity & Actions */}
      <div className="space-y-4">
        {/* Quantity Selector */}
        <div className="flex items-center gap-4">
          <span className="text-gray-600 dark:text-gray-400">Menge:</span>
          <div className="flex items-center border border-gray-300 dark:border-slate-600 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              −
            </button>
            <span className="px-6 py-2 font-semibold text-gray-900 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || isAddingToCart}
            className="flex-1 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 h-12 text-base font-semibold"
          >
            {addedToCart ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Hinzugefügt!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isAddingToCart ? "Wird hinzugefügt..." : "In den Warenkorb"}
              </>
            )}
          </Button>
          <WishlistButton productId={productId} variant="button" />
          <Button variant="outline" className="px-6 h-12">
            <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>

        {/* Buy Now Button */}
        <Button
          onClick={handleBuyNow}
          disabled={!inStock || isAddingToCart}
          variant="outline"
          className="w-full h-12 text-base font-semibold"
        >
          {isAddingToCart ? "Wird geladen..." : "Jetzt kaufen"}
        </Button>
      </div>

      {/* Shipping & Returns Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2 text-sm">
        <p className="text-blue-900 dark:text-blue-100">
          ✓ Kostenloser Versand ab €50
        </p>
        <p className="text-blue-900 dark:text-blue-100">
          ✓ 30 Tage Rückgaberecht
        </p>
        <p className="text-blue-900 dark:text-blue-100">✓ Sichere Zahlung</p>
      </div>
    </div>
  );
}
