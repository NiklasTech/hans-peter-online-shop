"use client";

import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price?: number;
  salePrice?: number;
  image?: string;
  rating?: number;
}

interface ProductSectionProps {
  title?: string;
  products: Product[];
}

export default function ProductSection({
  title = "Produkte",
  products,
}: ProductSectionProps) {
  return (
    <section className="mb-12">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            salePrice={product.salePrice}
            image={product.image}
            rating={product.rating}
          />
        ))}
      </div>
    </section>
  );
}
