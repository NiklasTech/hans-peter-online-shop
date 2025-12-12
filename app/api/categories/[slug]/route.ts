import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET /api/categories/[slug]
 * Kategorie mit Produkten abrufen
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Versuche erst nach ID, dann nach Name zu suchen
    const categoryId = parseInt(slug);

    const category = await db.category.findFirst({
      where: isNaN(categoryId)
        ? { name: { equals: slug, mode: 'insensitive' } }
        : { id: categoryId },
      include: {
        products: {
          include: {
            product: {
              include: {
                images: true,
                brand: true,
              },
            },
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Kategorie nicht gefunden" },
        { status: 404 }
      );
    }

    // Produkte aus der Kategorie extrahieren und transformieren
    const products = category.products.map((pc) => ({
      id: pc.product.id.toString(),
      name: pc.product.name,
      price: pc.product.price,
      image: pc.product.previewImage || pc.product.images[0]?.url || null,
      rating: pc.product.averageRating || 0,
      brand: pc.product.brand?.name || null,
    }));

    return NextResponse.json({
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        image: category.image,
      },
      products,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Kategorie" },
      { status: 500 }
    );
  }
}
