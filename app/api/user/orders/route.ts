/**
 * API Route: /api/user/orders
 *
 * GET - Get all user orders
 */

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const orders = await db.order.findMany({
      where: { userId: session.userId },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                previewImage: true,
                brand: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Fehler beim Abrufen der Bestellungen:", error);
    return NextResponse.json(
      { error: "Bestellungen konnten nicht geladen werden" },
      { status: 500 }
    );
  }
}
