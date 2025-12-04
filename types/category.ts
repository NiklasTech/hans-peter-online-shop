/**
 * Category Type Definitions
 *
 * TypeScript interfaces and types for category-related data structures
 */

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  image?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

export type CategoryWithoutDates = Omit<Category, "createdAt" | "updatedAt">;

