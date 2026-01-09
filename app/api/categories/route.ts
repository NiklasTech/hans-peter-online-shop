import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/categories
 * Alle Kategorien abrufen
 */
export async function GET() {
  try {
    const categories = await db.category.findMany({
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

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Kategorien" },
      { status: 500 }
    );
  }
}
