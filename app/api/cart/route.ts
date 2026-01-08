import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/cart - Get user's cart with all items
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        product: {
          include: {
            brand: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ cartItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Fehler beim Laden des Warenkorbs" }, { status: 500 });
  }
}

// POST /api/cart - Add product to cart
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Produkt-ID fehlt" }, { status: 400 });
    }

    if (quantity < 1) {
      return NextResponse.json({ error: "Ungültige Menge" }, { status: 400 });
    }

    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Produkt nicht gefunden" }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: "Nicht genügend Lagerbestand" }, { status: 400 });
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.userId,
          productId: productId,
        },
      },
    });

    let cartItem;

    if (existingCartItem) {
      // Update quantity if item exists
      const newQuantity = existingCartItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return NextResponse.json({ error: "Nicht genügend Lagerbestand" }, { status: 400 });
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            include: {
              brand: true,
            },
          },
        },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: user.userId,
          productId: productId,
          quantity: quantity,
        },
        include: {
          product: {
            include: {
              brand: true,
            },
          },
        },
      });
    }

    return NextResponse.json({
      message: "Produkt zum Warenkorb hinzugefügt",
      cartItem
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Fehler beim Hinzufügen zum Warenkorb" }, { status: 500 });
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
    }

    const { productId, quantity } = await request.json();

    if (!productId || quantity === undefined) {
      return NextResponse.json({ error: "Produkt-ID und Menge erforderlich" }, { status: 400 });
    }

    if (quantity < 1) {
      return NextResponse.json({ error: "Ungültige Menge" }, { status: 400 });
    }

    // Check if product has enough stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Produkt nicht gefunden" }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: "Nicht genügend Lagerbestand" }, { status: 400 });
    }

    // Update cart item
    const cartItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: user.userId,
          productId: productId,
        },
      },
      data: { quantity },
      include: {
        product: {
          include: {
            brand: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Warenkorb aktualisiert",
      cartItem
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json({ error: "Fehler beim Aktualisieren des Warenkorbs" }, { status: 500 });
  }
}

// DELETE /api/cart?productId=123 - Remove item from cart
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Produkt-ID fehlt" }, { status: 400 });
    }

    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId: user.userId,
          productId: parseInt(productId),
        },
      },
    });

    return NextResponse.json({ message: "Produkt aus dem Warenkorb entfernt" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json({ error: "Fehler beim Entfernen aus dem Warenkorb" }, { status: 500 });
  }
}
