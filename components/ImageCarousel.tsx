"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
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
  const [api, setApi] = useState<CarouselApi>();
  const [timestamp] = useState(() => Date.now());

  // Add cache buster only on client-side after hydration
  const cacheBustedImages = useMemo(() => {
    if (images.length > 0) {
      return images.map((img) => {
        if (!img || img.startsWith("data:") || img.startsWith("blob:")) {
          return img;
        }
        const separator = img.includes("?") ? "&" : "?";
        return `${img}${separator}v=${timestamp}`;
      });
    }
    return images;
  }, [images, timestamp]);

  // Update selected index when carousel slides
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const displayImages =
    cacheBustedImages.length > 0 ? cacheBustedImages : ["/placeholder.jpg"];

  return (
    <div className="space-y-4">
      {/* Main Carousel */}
      <div className="relative bg-gray-100 dark:bg-slate-800 rounded-2xl overflow-hidden aspect-square">
        <Carousel setApi={setApi} className="w-full h-full">
          <CarouselContent className="h-full ml-0">
            {displayImages.map((image, index) => (
              <CarouselItem
                key={index}
                className="h-full pl-0 flex items-center justify-center"
              >
                <div className="w-full h-full flex items-center justify-center p-4">
                  <img
                    src={image}
                    alt={`${productName} - Bild ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
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
              onClick={() => {
                setSelectedIndex(index);
                api?.scrollTo(index);
              }}
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
