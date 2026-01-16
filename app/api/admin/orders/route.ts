/**
 * API Route: /api/admin/orders
 *
 * GET    - Fetch a single order by ID (query param) or all orders
 * PUT    - Update an order status by ID (from body)
 * DELETE - Delete an order by ID (query param)
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Single order
    if (id) {
      const orderId = parseInt(id);

      if (isNaN(orderId)) {
        return NextResponse.json(
          { error: "Ungültige Bestell-ID" },
          { status: 400 }
        );
      }

      const order = await db.order.findUnique({
        where: { id: orderId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  previewImage: true,
                },
              },
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

      return NextResponse.json({ order });
    }

    // All orders
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;
    const status = searchParams.get("status");

    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  previewImage: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Bestellungen" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, paymentStatus, trackingNumber, shippingMethod } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Bestell-ID ist erforderlich" },
        { status: 400 }
      );
    }

    // Check if order exists
    const existingOrder = await db.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Bestellung nicht gefunden" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: {
      status?: string;
      paymentStatus?: string;
      trackingNumber?: string;
      shippingMethod?: string;
    } = {};

    if (status !== undefined) updateData.status = status;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (shippingMethod !== undefined) updateData.shippingMethod = shippingMethod;

    // Update order
    const order = await db.order.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                previewImage: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren der Bestellung" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Bestell-ID ist erforderlich" },
        { status: 400 }
      );
    }

    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "Ungültige Bestell-ID" },
        { status: 400 }
      );
    }

    // Check if order exists
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Bestellung nicht gefunden" },
        { status: 404 }
      );
    }

    // Delete order
    await db.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json({ message: "Bestellung erfolgreich gelöscht" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen der Bestellung" },
      { status: 500 }
    );
  }
}
