/**
 * Public API Route: /api/products/[id]
 *
 * GET - Fetch a single product by ID (public access)
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        images: {
          orderBy: { index: "asc" },
        },
        categories: {
          include: {
            category: true,
          },
        },
        brand: true,
        details: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    const averageRating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0) /
          product.reviews.length
        : 0;

    return NextResponse.json({
      product: {
        ...product,
        averageRating,
        reviewCount: product.reviews.length,
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
