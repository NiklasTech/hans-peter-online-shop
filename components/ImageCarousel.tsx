"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: string[];
  productName: string;
}

export default function ImageCarousel({
  images,
  productName,
}: ImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cacheBustedImages, setCacheBustedImages] = useState<string[]>(images);

  // Add cache buster only on client-side after hydration
  useEffect(() => {
    if (images.length > 0) {
      const timestamp = Date.now();
      const busted = images.map(img => {
        if (!img || img.startsWith('data:') || img.startsWith('blob:')) {
          return img;
        }
        const separator = img.includes('?') ? '&' : '?';
        return `${img}${separator}v=${timestamp}`;
      });
      setCacheBustedImages(busted);
    }
  }, [images]);

  const displayImages = cacheBustedImages.length > 0 ? cacheBustedImages : ["/placeholder.jpg"];

  return (
    <div className="space-y-4">
      {/* Main Carousel */}
      <div className="relative bg-gray-100 dark:bg-slate-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
        <Carousel className="w-full h-full">
          <CarouselContent className="h-full">
            {displayImages.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="flex items-center justify-center h-full w-full">
                  <img
                    src={image}
                    alt={`${productName} - Bild ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {displayImages.length > 1 && (
            <>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </>
          )}
        </Carousel>
      </div>

      {/* Thumbnail Navigation */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                selectedIndex === index
                  ? "border-gray-900 dark:border-white"
                  : "border-gray-300 dark:border-slate-600"
              )}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
