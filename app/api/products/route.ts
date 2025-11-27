/**
 * API Route: /api/products
 *
 * GET  - Fetch all products
 * POST - Create a new product
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      db.product.findMany({
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { index: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.product.count(),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, previewImage, images } = body;

    // Validierung
    if (!name || price === undefined || stock === undefined) {
      return NextResponse.json(
        { error: "Name, price and stock are required" },
        { status: 400 }
      );
    }

    // Produkt erstellen
    const product = await db.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        stock: parseInt(stock),
        previewImage: previewImage || null,
        images: {
          create:
            images?.map((img: { url: string; index: number }) => ({
              url: img.url,
              index: img.index,
            })) || [],
        },
      },
      include: {
        images: {
          orderBy: { index: "asc" },
        },
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
