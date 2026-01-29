"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";
import Footer from "@/components/Footer";

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  image?: string | null;
  stock: number;
  rating: number;
  brand?: { id: number; name: string };
  categories?: Array<{ id: number; name: string }>;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Produkte laden
  const loadProducts = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/products?page=${page}&limit=20`);
      if (!response.ok) {
        throw new Error("Fehler beim Laden der Produkte");
      }

      const data = await response.json();
      setProducts(data.products || []);
      setPagination(data.pagination);

      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ein Fehler ist aufgetreten"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(1);
  }, []);

  // Pagination-Seiten generieren
  const generatePaginationPages = () => {
    const pages: (number | "ellipsis")[] = [];
    const { page, totalPages } = pagination;

    if (totalPages <= 7) {
      // Zeige alle Seiten
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Zeige erste Seite
      pages.push(1);

      if (page > 3) {
        pages.push("ellipsis");
      }

      // Zeige Seiten um aktuelle Seite
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Zeige letzte Seite
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <>
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Alle Produkte
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {loading
                ? "Lädt..."
                : `${pagination.totalCount} Produkte gefunden`}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-96 text-gray-500 dark:text-gray-400">
              <p className="text-xl font-medium mb-2">
                Keine Produkte gefunden
              </p>
              <p className="text-sm">
                Es sind derzeit keine Produkte verfügbar.
              </p>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mb-12">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    salePrice={product.salePrice || undefined}
                    image={product.image || undefined}
                    rating={product.rating}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    {/* Previous Button */}
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => {
                          if (pagination.page > 1) {
                            loadProducts(pagination.page - 1);
                          }
                        }}
                        className={
                          pagination.page === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {generatePaginationPages().map((pageNum, index) =>
                      pageNum === "ellipsis" ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => loadProducts(pageNum)}
                            isActive={pagination.page === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    {/* Next Button */}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => {
                          if (pagination.page < pagination.totalPages) {
                            loadProducts(pagination.page + 1);
                          }
                        }}
                        className={
                          pagination.page === pagination.totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
