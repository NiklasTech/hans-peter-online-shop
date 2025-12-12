"use client";

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: number;
  variant?: "icon" | "button";
  size?: "sm" | "md" | "lg";
  className?: string;
  onToggle?: (isWishlisted: boolean) => void;
}

export default function WishlistButton({
  productId,
  variant = "icon",
  size = "md",
  className,
  onToggle,
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Prüfe initialen Wishlist-Status
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const response = await fetch(`/api/wishlist/check?productId=${productId}`);
        const data = await response.json();
        setIsWishlisted(data.isWishlisted);
      } catch (error) {
        console.error("Fehler beim Prüfen des Wishlist-Status:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkWishlistStatus();
  }, [productId]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isWishlisted) {
        // Entferne aus Wishlist
        const response = await fetch(`/api/wishlist?productId=${productId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsWishlisted(false);
          onToggle?.(false);
          // Trigger event für Navbar Badge Update
          window.dispatchEvent(new CustomEvent("wishlist-updated"));
        }
      } else {
        // Füge zur Wishlist hinzu
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });

        if (response.ok) {
          setIsWishlisted(true);
          onToggle?.(true);
          // Trigger event für Navbar Badge Update
          window.dispatchEvent(new CustomEvent("wishlist-updated"));
        } else if (response.status === 401) {
          // User nicht eingeloggt - zur Login-Seite weiterleiten
          window.location.href = "/auth/login?redirect=" + encodeURIComponent(window.location.pathname);
          return;
        }
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  if (variant === "button") {
    return (
      <Button
        onClick={toggleWishlist}
        variant="outline"
        disabled={isLoading || isChecking}
        className={cn("px-6 h-12", className)}
      >
        <Heart
          className={cn(
            iconSizes[size],
            isWishlisted
              ? "fill-red-500 text-red-500"
              : "text-gray-600 dark:text-gray-300",
            isLoading && "animate-pulse"
          )}
        />
      </Button>
    );
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading || isChecking}
      className={cn(
        "rounded-full bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50",
        sizeClasses[size],
        className
      )}
      aria-label={isWishlisted ? "Von Wunschliste entfernen" : "Zur Wunschliste hinzufügen"}
    >
      <Heart
        className={cn(
          iconSizes[size],
          isWishlisted
            ? "fill-red-500 text-red-500"
            : "text-gray-600 dark:text-gray-300",
          isLoading && "animate-pulse"
        )}
      />
    </button>
  );
}
