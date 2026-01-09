/**
 * API Route: /api/categories/hierarchy
 *
 * GET - Fetch all categories organized in a hierarchy
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface CategoryWithChildren {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;
  children?: CategoryWithChildren[];
  _count?: {
    products: number;
  };
}

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    // Build hierarchy manually
    const categoryMap = new Map<number, CategoryWithChildren>();
    const rootCategories: CategoryWithChildren[] = [];

    // First pass: create map of all categories
    categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Second pass: build tree structure
    categories.forEach((cat) => {
      const category = categoryMap.get(cat.id)!;
      if (cat.parentId === null) {
        rootCategories.push(category);
      } else {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children!.push(category);
        }
      }
    });

    return NextResponse.json({ categories: rootCategories });
  } catch (error) {
    console.error("Error fetching category hierarchy:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Kategorie-Hierarchie" },
      { status: 500 }
    );
  }
}

