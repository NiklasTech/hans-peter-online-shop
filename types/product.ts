/**
 * Product Type Definitions
 *
 * TypeScript interfaces and types for product-related data structures
 */

export interface ProductImage {
  id: number;
  url: string;
  index: number;
  createdAt: Date;
}

export interface ProductDetail {
  id: number;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  previewImage?: string | null;
  stock: number;
  sku?: string | null;
  brandId: number;
  createdAt: Date;
  updatedAt: Date;
  images?: ProductImage[];
  details?: ProductDetail[];
  categories?: { categoryId: number; category?: { name: string } }[];
  brand?: { id: number; name: string };
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  sku?: string;
  categoryIds: number[];
  brandId: number;
  previewImage?: string;
  images?: { url: string; index: number }[];
  details?: { key: string; value: string }[];
}

export type UpdateProductInput = Partial<CreateProductInput>;

export type ProductWithoutDates = Omit<Product, "createdAt" | "updatedAt">;


