import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET - Hole die Anzahl der Wishlist Items
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ count: 0 });
    }

    const wishlist = await db.wishlist.findFirst({
      where: { userId: user.userId },
    });

    if (!wishlist) {
      return NextResponse.json({ count: 0 });
    }

    const count = await db.wishlistItem.count({
      where: { wishlistId: wishlist.id },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Wishlist count error:", error);
    return NextResponse.json({ count: 0 });
  }
}
