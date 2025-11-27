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

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  previewImage?: string | null;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  images?: ProductImage[];
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  previewImage?: string;
  images?: { url: string; index: number }[];
  details?: { key: string; value: string }[];
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export type ProductWithoutDates = Omit<Product, "createdAt" | "updatedAt">;


