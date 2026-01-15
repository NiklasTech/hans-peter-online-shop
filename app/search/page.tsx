"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Filter, X } from "lucide-react";

interface SearchProduct {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  previewImage?: string | null;
  stock: number;
  brand?: { name: string };
  categories?: string[];
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Get all filter params
  const categoriesParam = searchParams.get("categories");
  const brandsParam = searchParams.get("brands");
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const inStockParam = searchParams.get("inStock");

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      initialQuery ||
      categoriesParam ||
      brandsParam ||
      minPriceParam ||
      maxPriceParam ||
      inStockParam === "true"
    );
  }, [initialQuery, categoriesParam, brandsParam, minPriceParam, maxPriceParam, inStockParam]);

  // Build search description
  const filterDescription = useMemo(() => {
    const parts: string[] = [];
    if (initialQuery) parts.push(`"${initialQuery}"`);
    if (categoriesParam) {
      const count = categoriesParam.split(",").length;
      parts.push(`${count} Kategorie${count > 1 ? "n" : ""}`);
    }
    if (brandsParam) {
      const count = brandsParam.split(",").length;
      parts.push(`${count} Marke${count > 1 ? "n" : ""}`);
    }
    if (minPriceParam || maxPriceParam) {
      parts.push("Preisfilter");
    }
    if (inStockParam === "true") {
      parts.push("Nur verfügbar");
    }
    return parts.join(", ");
  }, [initialQuery, categoriesParam, brandsParam, minPriceParam, maxPriceParam, inStockParam]);

  useEffect(() => {
    if (hasActiveFilters) {
      performSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const performSearch = async () => {
    if (!hasActiveFilters) {
      setProducts([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      // Forward all search params to the API
      const response = await fetch(`/api/products/search?${searchParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Preserve existing filters and update query
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", searchQuery.trim());
      router.push(`/search?${params.toString()}`);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    router.push("/search");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Produktsuche
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch}>
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Produkte suchen (Name, Kategorie, Marke, etc.)..."
                className="pl-10 pr-4 py-6 text-lg dark:bg-slate-900 dark:border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Search Results Info */}
        {hasSearched && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Suche läuft...
                  </span>
                ) : (
                  <>
                    {products.length} Ergebnis{products.length !== 1 ? "se" : ""}
                    {filterDescription && ` für ${filterDescription}`}
                  </>
                )}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Filter zurücksetzen
                </button>
              )}
            </div>
            {/* Active Filter Badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {initialQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Search className="h-3 w-3" />
                    {initialQuery}
                  </Badge>
                )}
                {categoriesParam && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Filter className="h-3 w-3" />
                    {categoriesParam.split(",").length} Kategorien
                  </Badge>
                )}
                {brandsParam && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Filter className="h-3 w-3" />
                    {brandsParam.split(",").length} Marken
                  </Badge>
                )}
                {(minPriceParam || maxPriceParam) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Filter className="h-3 w-3" />
                    {minPriceParam || "0"} - {maxPriceParam || "∞"} €
                  </Badge>
                )}
                {inStockParam === "true" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Filter className="h-3 w-3" />
                    Nur verfügbar
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* No Results */}
        {!loading && hasSearched && products.length === 0 && (
          <div className="text-center py-20">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Keine Produkte gefunden
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Versuche es mit anderen Suchbegriffen
            </p>
          </div>
        )}

        {/* Search Results Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/product/${product.id}`)}
              >
                <CardContent className="p-4">
                  {/* Product Image */}
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 mb-4">
                    {product.previewImage ? (
                      <img
                        src={product.previewImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Search className="h-16 w-16" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    {/* Brand */}
                    {product.brand && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {product.brand.name}
                      </p>
                    )}

                    {/* Name */}
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Description */}
                    {product.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(product.price)}
                      </span>
                      {product.stock > 0 ? (
                        <Badge variant="default" className="text-xs">
                          Auf Lager
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          Ausverkauft
                        </Badge>
                      )}
                    </div>

                    {/* Product ID */}
                    <p className="text-xs text-gray-400">
                      Artikel-Nr: #{product.id}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Initial State - No Search Yet */}
        {!hasSearched && (
          <div className="text-center py-20">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Wonach suchst du?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Gib einen Suchbegriff ein, um Produkte zu finden
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
