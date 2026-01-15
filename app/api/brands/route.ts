import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/brands
 * Alle Marken abrufen
 */
export async function GET() {
  try {
    const brands = await db.brand.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
      },
    });

    return NextResponse.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Marken" },
      { status: 500 }
    );
  }
}
