"use client";

import Image from "next/image";

interface Brand {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

interface BrandSectionProps {
  title?: string;
  brands: Brand[];
}

export function BrandSection({
  title = "Marken",
  brands,
}: BrandSectionProps) {
  return (
    <section className="mb-12">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="group cursor-pointer"
          >
            {/* Brand Logo */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl overflow-hidden aspect-square mb-4 flex items-center justify-center p-6">
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="text-gray-400 dark:text-gray-500 text-center">
                  <p className="text-sm font-semibold">{brand.name}</p>
                </div>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-gray-900 dark:text-white font-semibold bg-white/80 dark:bg-slate-900/80 px-4 py-2 rounded-lg">
                  Erkunden
                </p>
              </div>
            </div>

            {/* Brand Info */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                {brand.name}
              </h3>
              {brand.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                  {brand.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
