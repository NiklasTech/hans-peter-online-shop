import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// POST /api/orders - Create new order from cart
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
    }

    const { addressId, paymentMethod } = await request.json();

    if (!addressId || !paymentMethod) {
      return NextResponse.json({ error: "Adresse und Zahlungsmethode erforderlich" }, { status: 400 });
    }

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.userId,
      },
    });

    if (!address) {
      return NextResponse.json({ error: "Ungültige Adresse" }, { status: 400 });
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Warenkorb ist leer" }, { status: 400 });
    }

    // Validate stock for all items
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Nicht genügend Lagerbestand für ${item.product.name}. Verfügbar: ${item.product.stock}, Benötigt: ${item.quantity}`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    // Create order with order items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: user.userId,
          status: "pending",
          total: total,
        },
      });

      // Create order items and update stock
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          },
        });

        // Decrease stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: {
          userId: user.userId,
        },
      });

      return newOrder;
    });

    // Fetch complete order with items
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
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

    return NextResponse.json({
      message: "Bestellung erfolgreich erstellt",
      order: completeOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Fehler beim Erstellen der Bestellung" }, { status: 500 });
  }
}
