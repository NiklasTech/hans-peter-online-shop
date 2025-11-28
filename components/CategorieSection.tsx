"use client";

import Image from "next/image";

interface Category {
  id: string;
  name: string;
  image?: string;
  productCount?: number;
}

interface CategorieSectionProps {
  title?: string;
  categories: Category[];
}

export function CategorieSection({
  title = "Kategorien",
  categories,
}: CategorieSectionProps) {
  return (
    <section className="mb-12">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {categories.map((category) => (
          <div key={category.id} className="group cursor-pointer">
            {/* Category Image */}
            <div className="relative bg-linear-to-br from-blue-100 to-blue-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl overflow-hidden aspect-square mb-4 flex items-center justify-center">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-center px-4">
                  <p className="text-sm font-medium">{category.name}</p>
                </div>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white font-semibold">Ansehen</p>
              </div>
            </div>

            {/* Category Info */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                {category.name}
              </h3>
              {category.productCount && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {category.productCount} Produkte
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
