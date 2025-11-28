/**
 * Brand Type Definitions
 *
 * TypeScript interfaces and types for brand-related data structures
 */

export interface Brand {
  id: number;
  name: string;
  description?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBrandInput {
  name: string;
  description?: string;
  image?: string;
}

export interface UpdateBrandInput extends Partial<CreateBrandInput> {}

export type BrandWithoutDates = Omit<Brand, "createdAt" | "updatedAt">;

