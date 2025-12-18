import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Product Search API
 * GET /api/products/search?q=query
 *
 * Searches products by:
 * - Product name
 * - Product ID
 * - Product description
 * - Brand name
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    // Return empty results if no query provided
    if (!query || query.trim() === "") {
      return NextResponse.json({ products: [] });
    }

    const searchTerm = query.trim().toLowerCase();

    // Check if query is a number (for ID search)
    const isNumericSearch = !isNaN(Number(searchTerm));

    // Build search conditions
    const whereConditions: any = {
      OR: [
        // Search by product name
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        // Search by description
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        // Search by brand name
        {
          brand: {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
      ],
    };

    // Add ID search if query is numeric
    if (isNumericSearch) {
      whereConditions.OR.push({
        id: Number(searchTerm),
      });
    }

    // Query products with relations
    const products = await db.product.findMany({
      where: whereConditions,
      include: {
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          orderBy: {
            index: "asc",
          },
          take: 1,
        },
        categories: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      take: 10, // Limit to 10 results for performance
      orderBy: [
        // Prioritize exact ID matches
        ...(isNumericSearch
          ? [{ id: "asc" as const }]
          : []),
        // Then order by name
        { name: "asc" as const },
      ],
    });

    // Format the response
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      previewImage: product.previewImage || product.images[0]?.url || null,
      stock: product.stock,
      brand: product.brand,
      categories: product.categories.map((c) => c.category?.name).filter(Boolean),
    }));

    return NextResponse.json({
      products: formattedProducts,
      count: formattedProducts.length,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Fehler bei der Produktsuche" },
      { status: 500 }
    );
  }
}
