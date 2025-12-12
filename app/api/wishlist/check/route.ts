import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET - Prüfe ob ein Produkt in der Wishlist ist
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ isWishlisted: false });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Produkt-ID erforderlich" },
        { status: 400 }
      );
    }

    const wishlist = await db.wishlist.findFirst({
      where: { userId: user.userId },
    });

    if (!wishlist) {
      return NextResponse.json({ isWishlisted: false });
    }

    const item = await db.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: Number(productId),
        },
      },
    });

    return NextResponse.json({ isWishlisted: !!item });
  } catch (error) {
    console.error("Wishlist check error:", error);
    return NextResponse.json({ isWishlisted: false });
  }
}
