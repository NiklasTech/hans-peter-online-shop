import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/cart/count - Get total count of items in cart
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ count: 0 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: user.userId,
      },
    });

    // Sum up all quantities
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({ count: totalCount });
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return NextResponse.json({ count: 0 });
  }
}
