/**
 * API Route: /api/user/orders/[id]
 *
 * GET - Get a specific user order by ID
 */

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "Ungültige Bestellnummer" },
        { status: 400 }
      );
    }

    const order = await db.order.findFirst({
      where: {
        id: orderId,
        userId: session.userId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                previewImage: true,
                price: true,
                brand: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Bestellung nicht gefunden" },
        { status: 404 }
      );
    }

    // Serialize Decimal values to numbers and ensure all fields are included
    const serializedOrder = {
      id: order.id,
      userId: order.userId,
      status: order.status,
      total: Number(order.total),
      shippingStreet: order.shippingStreet,
      shippingHouseNumber: order.shippingHouseNumber,
      shippingCity: order.shippingCity,
      shippingPostalCode: order.shippingPostalCode,
      shippingCountryCode: order.shippingCountryCode,
      shippingFirstName: order.shippingFirstName,
      shippingLastName: order.shippingLastName,
      shippingPhone: order.shippingPhone,
      paymentMethod: order.paymentMethod,
      shippingMethod: order.shippingMethod,
      shippingCost: Number(order.shippingCost),
      trackingNumber: order.trackingNumber,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      user: order.user,
      orderItems: order.orderItems.map(item => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price),
        product: item.product,
      })),
    };

    return NextResponse.json({ order: serializedOrder });
  } catch (error) {
    console.error("Fehler beim Abrufen der Bestellung:", error);
    return NextResponse.json(
      { error: "Bestellung konnte nicht geladen werden" },
      { status: 500 }
    );
  }
}
