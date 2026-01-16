"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageCarousel from "./ImageCarousel";
import ProductInfo from "./ProductInfo";
import ReviewsSection from "./ReviewsSection";
import RelatedProducts from "./RelatedProducts";

export interface ProductDetailPageProps {
  product: {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    rating: number;
    reviewCount: number;
    inStock: boolean;
    sku?: string;
    category?: string;
    images: string[];
    description: string;
    specifications?: {
      [key: string]: string;
    };
    reviews?: Array<{
      id: string;
      author: string;
      rating: number;
      title: string;
      content: string;
      date: string;
      helpful: number;
    }>;
  };
  relatedProducts?: Array<{
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    image: string;
    rating: number;
  }>;
}

export default function ProductDetailPage({
  product,
  relatedProducts = [],
}: ProductDetailPageProps) {
  const reviews = product.reviews || [];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image Carousel */}
          <div>
            <ImageCarousel
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div>
            <ProductInfo
              productId={Number(product.id)}
              name={product.name}
              price={product.price}
              salePrice={product.salePrice}
              rating={product.rating}
              reviewCount={product.reviewCount}
              description={product.description}
              inStock={product.inStock}
              sku={product.sku}
              category={product.category}
            />
          </div>
        </div>

        {/* Specifications & Reviews Tabs */}
        <Tabs defaultValue="specifications" className="mb-12">
          <TabsList className="grid w-full grid-cols-2">
            {product.specifications && (
              <TabsTrigger value="specifications">
                Spezifikationen
              </TabsTrigger>
            )}
            <TabsTrigger value="reviews">Bewertungen</TabsTrigger>
          </TabsList>

          {/* Specifications Tab */}
          {product.specifications && (
            <TabsContent value="specifications" className="mt-6">
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
                <div className="space-y-4">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-start py-3 border-b border-gray-200 dark:border-slate-700 last:border-b-0"
                      >
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {key}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {value}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </TabsContent>
          )}

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-6">
            <ReviewsSection
              reviews={reviews}
              averageRating={product.rating}
              totalReviews={product.reviewCount}
            />
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </div>
  );
}
