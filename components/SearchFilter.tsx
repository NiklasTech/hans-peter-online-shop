"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Category } from "@/types/category";
import { Brand } from "@/types/brand";

interface SearchFilterProps {
  onClose?: () => void;
}

export default function SearchFilter({ onClose }: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",").filter(Boolean) || []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brands")?.split(",").filter(Boolean) || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 1000,
  ]);
  const [inStockOnly, setInStockOnly] = useState(
    searchParams.get("inStock") === "true"
  );

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories, brands and max price
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesRes, brandsRes, productsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/brands"),
          fetch("/api/products"),
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          // API returns { categories: [...] }
          setCategories(categoriesData.categories || categoriesData);
        }

        if (brandsRes.ok) {
          const brandsData = await brandsRes.json();
          // API returns direct array
          setBrands(Array.isArray(brandsData) ? brandsData : []);
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          if (productsData.length > 0) {
            const highestPrice = Math.ceil(
              Math.max(...productsData.map((p: { price: number }) => p.price))
            );
            setMaxPrice(highestPrice);
            // Only update price range if not set from URL
            if (!searchParams.get("maxPrice")) {
              setPriceRange([priceRange[0], highestPrice]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching filter data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }

    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","));
    }

    if (selectedBrands.length > 0) {
      params.set("brands", selectedBrands.join(","));
    }

    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString());
    }

    if (priceRange[1] < maxPrice) {
      params.set("maxPrice", priceRange[1].toString());
    }

    if (inStockOnly) {
      params.set("inStock", "true");
    }

    const queryString = params.toString();
    router.push(queryString ? `/search?${queryString}` : "/search");

    onClose?.();
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
    setInStockOnly(false);
  };

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Toggle brand selection
  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  // Check if any filter is active
  const hasActiveFilters =
    searchQuery.trim() ||
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    inStockOnly;

  // Handle search on Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Produktsuche
        </h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Zurücksetzen
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Suche..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-9 h-10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="py-4 text-center text-sm text-gray-500">Lädt...</div>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={["categories", "brands", "price"]}
          className="space-y-0"
        >
          {/* Categories Filter */}
          {categories.length > 0 && (
            <AccordionItem value="categories" className="border-b-0">
              <AccordionTrigger className="py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:no-underline">
                Kategorien
                {selectedCategories.length > 0 && (
                  <span className="ml-2 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                    {selectedCategories.length}
                  </span>
                )}
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <Checkbox
                        checked={selectedCategories.includes(
                          category.id.toString()
                        )}
                        onCheckedChange={() =>
                          toggleCategory(category.id.toString())
                        }
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Brands Filter */}
          {brands.length > 0 && (
            <AccordionItem value="brands" className="border-b-0">
              <AccordionTrigger className="py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:no-underline">
                Marken
                {selectedBrands.length > 0 && (
                  <span className="ml-2 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                    {selectedBrands.length}
                  </span>
                )}
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {brands.map((brand) => (
                    <label
                      key={brand.id}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <Checkbox
                        checked={selectedBrands.includes(brand.id.toString())}
                        onCheckedChange={() =>
                          toggleBrand(brand.id.toString())
                        }
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                        {brand.name}
                      </span>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Price Range Filter */}
          <AccordionItem value="price" className="border-b-0">
            <AccordionTrigger className="py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:no-underline">
              Preis
              {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <span className="ml-2 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                  1
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="space-y-4 pt-2">
                <Slider
                  value={priceRange}
                  onValueChange={(value) =>
                    setPriceRange(value as [number, number])
                  }
                  min={0}
                  max={maxPrice}
                  step={1}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{priceRange[0].toFixed(2)} €</span>
                  <span>{priceRange[1].toFixed(2)} €</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Stock Filter */}
          <AccordionItem value="stock" className="border-b-0">
            <AccordionTrigger className="py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:no-underline">
              Verfügbarkeit
              {inStockOnly && (
                <span className="ml-2 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                  1
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <label className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                  checked={inStockOnly}
                  onCheckedChange={(checked) =>
                    setInStockOnly(checked as boolean)
                  }
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                  Nur verfügbare Produkte
                </span>
              </label>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Apply Button */}
      <button
        onClick={applyFilters}
        className="w-full py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Filter anwenden
      </button>
    </div>
  );
}
