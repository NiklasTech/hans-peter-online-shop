/**
 * Product Type Definitions
 *
 * TypeScript interfaces and types for product-related data structures
 */

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  image?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export type ProductWithoutDates = Omit<Product, "createdAt" | "updatedAt">;
