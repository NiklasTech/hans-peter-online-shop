"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  id?: string;
  name: string;
  price?: number;
  image?: string;
  rating?: number;
}

export default function ProductCard({
  id = "1",
  name,
  price,
  image,
  rating = 5,
}: ProductCardProps) {
  return (
    <Link href={`/product/${id}`} className="group cursor-pointer block">
      {/* Image Container */}
      <div className="relative bg-gray-200 dark:bg-slate-800 rounded-2xl overflow-hidden aspect-square mb-4 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-gray-400 dark:text-gray-600 text-center px-4">
            <p className="text-sm font-medium">Produktbild</p>
          </div>
        )}

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
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          {typeof price === "number"
            ? `€${price.toFixed(2)}`
            : "Preis auf Anfrage"}
        </p>
      </div>
    </Link>
  );
}
