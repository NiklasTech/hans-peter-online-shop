import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/products
 * Alle Produkte abrufen (für Filter max-price Berechnung)
 */
export async function GET() {
  try {
    const products = await db.product.findMany({
      select: {
        id: true,
        price: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Produkte" },
      { status: 500 }
    );
  }
}
