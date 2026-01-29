import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/products
 * Alle Produkte abrufen mit Pagination und Filter-Support
 * Query-Parameter:
 * - page: Seitennummer (Standard: 1)
 * - limit: Anzahl Produkte pro Seite (Standard: 20)
 * - simple: Nur ID und Preis zurückgeben (für Filter-Berechnung)
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const simple = searchParams.get("simple") === "true";

    // Für Filter-Berechnung nur ID und Preis zurückgeben
    if (simple) {
      const products = await db.product.findMany({
        select: {
          id: true,
          price: true,
        },
      });
      return NextResponse.json(products);
    }

    // Pagination-Parameter
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Produkte mit Pagination laden
    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          brand: {
            select: {
              id: true,
              name: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      db.product.count(),
    ]);

    // Produkte transformieren
    const transformedProducts = products.map((p) => ({
      id: p.id.toString(),
      name: p.name,
      description: p.description,
      price: p.price,
      salePrice: p.salePrice,
      image: p.previewImage,
      stock: p.stock,
      brand: p.brand,
      rating:
        p.reviews.length > 0
          ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length
          : 0,
      categories: p.categories.map((c) => c.category),
    }));

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Produkte" },
      { status: 500 }
    );
  }
}
