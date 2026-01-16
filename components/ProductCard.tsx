"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import WishlistButton from "@/components/WishlistButton";

interface ProductCardProps {
  id?: string;
  name: string;
  price?: number;
  salePrice?: number;
  image?: string;
  rating?: number;
}

export default function ProductCard({
  id = "1",
  name,
  price,
  salePrice,
  image,
  rating = 5,
}: ProductCardProps) {
  const isOnSale = salePrice !== undefined && salePrice !== null && salePrice < (price || 0);
  const displayPrice = isOnSale ? salePrice : price;
  const discountPercent = isOnSale && price ? Math.round((1 - salePrice / price) * 100) : 0;
  const [timestamp] = useState(() => Date.now());

  // Add cache buster only on client-side after hydration
  const cacheBustedImage = useMemo(() => {
    if (image && !image.startsWith('data:') && !image.startsWith('blob:')) {
      const separator = image.includes('?') ? '&' : '?';
      return `${image}${separator}v=${timestamp}`;
    }
    return image;
  }, [image, timestamp]);

  return (
    <Link href={`/product/${id}`} className="group cursor-pointer block">
      {/* Image Container */}
      <div className="relative bg-gray-200 dark:bg-slate-800 rounded-2xl overflow-hidden aspect-square mb-4 flex items-center justify-center">
        {cacheBustedImage ? (
          <img
            src={cacheBustedImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-gray-400 dark:text-gray-600 text-center px-4">
            <p className="text-sm font-medium">Produktbild</p>
          </div>
        )}

        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist Button - appears on hover */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <WishlistButton productId={Number(id)} size="sm" />
        </div>

        {/* Add to Cart Button - appears on hover */}
        <button className="absolute bottom-4 right-4 bg-white dark:bg-slate-900 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ShoppingCart className="h-5 w-5 dark:text-white" />
        </button>
      </div>

      {/* Product Info */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
          {name}
        </h3>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < Math.floor(rating) ? "★" : "☆"}</span>
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({rating})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          {isOnSale && typeof price === "number" && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              €{price.toFixed(2)}
            </span>
          )}
          <span className={`text-lg font-bold ${isOnSale ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}>
            {typeof displayPrice === "number"
              ? `€${displayPrice.toFixed(2)}`
              : "Preis auf Anfrage"}
          </span>
        </div>
      </div>
    </Link>
  );
}
