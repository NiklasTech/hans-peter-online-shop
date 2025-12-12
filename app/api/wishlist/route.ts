import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET - Hole alle Wishlist Items des Users
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    // Hole oder erstelle die Default-Wishlist
    let wishlist = await db.wishlist.findFirst({
      where: { userId: user.userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                brand: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!wishlist) {
      wishlist = await db.wishlist.create({
        data: {
          userId: user.userId,
          name: "Meine Wunschliste",
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  brand: true,
                },
              },
            },
          },
        },
      });
    }

    return NextResponse.json({
      wishlist,
      count: wishlist.items.length,
    });
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Wunschliste" },
      { status: 500 }
    );
  }
}

// POST - Füge Produkt zur Wishlist hinzu
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Produkt-ID erforderlich" },
        { status: 400 }
      );
    }

    // Prüfe ob Produkt existiert
    const product = await db.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produkt nicht gefunden" },
        { status: 404 }
      );
    }

    // Hole oder erstelle die Default-Wishlist
    let wishlist = await db.wishlist.findFirst({
      where: { userId: user.userId },
    });

    if (!wishlist) {
      wishlist = await db.wishlist.create({
        data: {
          userId: user.userId,
          name: "Meine Wunschliste",
        },
      });
    }

    // Prüfe ob Produkt bereits in der Wishlist
    const existingItem = await db.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: Number(productId),
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: "Produkt bereits in der Wunschliste", alreadyExists: true },
        { status: 409 }
      );
    }

    // Füge Produkt zur Wishlist hinzu
    const wishlistItem = await db.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId: Number(productId),
      },
      include: {
        product: {
          include: {
            brand: true,
          },
        },
      },
    });

    // Hole aktualisierte Anzahl
    const count = await db.wishlistItem.count({
      where: { wishlistId: wishlist.id },
    });

    return NextResponse.json({
      item: wishlistItem,
      count,
      message: "Produkt zur Wunschliste hinzugefügt",
    });
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json(
      { error: "Fehler beim Hinzufügen zur Wunschliste" },
      { status: 500 }
    );
  }
}

// DELETE - Entferne Produkt aus der Wishlist
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Produkt-ID erforderlich" },
        { status: 400 }
      );
    }

    // Finde die Wishlist des Users
    const wishlist = await db.wishlist.findFirst({
      where: { userId: user.userId },
    });

    if (!wishlist) {
      return NextResponse.json(
        { error: "Wunschliste nicht gefunden" },
        { status: 404 }
      );
    }

    // Lösche das Item
    await db.wishlistItem.delete({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: Number(productId),
        },
      },
    });

    // Hole aktualisierte Anzahl
    const count = await db.wishlistItem.count({
      where: { wishlistId: wishlist.id },
    });

    return NextResponse.json({
      count,
      message: "Produkt aus Wunschliste entfernt",
    });
  } catch (error) {
    console.error("Wishlist DELETE error:", error);
    return NextResponse.json(
      { error: "Fehler beim Entfernen aus der Wunschliste" },
      { status: 500 }
    );
  }
}
