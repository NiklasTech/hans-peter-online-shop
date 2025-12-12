import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/brands
 * Alle Marken abrufen
 */
export async function GET() {
  try {
    const brands = await db.brand.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ brands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Marken" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/brands
 * Neue Marke erstellen
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, image } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name ist erforderlich" },
        { status: 400 }
      );
    }

    const brand = await db.brand.create({
      data: {
        name,
        description: description || null,
        image: image || null,
      },
    });

    return NextResponse.json({ brand }, { status: 201 });
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen der Marke" },
      { status: 500 }
    );
  }
}

