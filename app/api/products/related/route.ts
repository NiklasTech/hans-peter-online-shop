/**
 * Public API Route: /api/products/related
 *
 * GET - Fetch related products based on category
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryIdsParam = searchParams.get("categoryIds");
    const excludeIdParam = searchParams.get("excludeId");
    const limitParam = searchParams.get("limit");

    const limit = limitParam ? parseInt(limitParam) : 4;
    const excludeId = excludeIdParam ? parseInt(excludeIdParam) : undefined;

    if (!categoryIdsParam) {
      return NextResponse.json(
        { error: "Category IDs are required" },
        { status: 400 }
      );
    }

    const categoryIds = categoryIdsParam
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    if (categoryIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid category IDs" },
        { status: 400 }
      );
    }

    // Find products in the same categories
    const products = await db.product.findMany({
      where: {
        AND: [
          {
            categories: {
              some: {
                categoryId: {
                  in: categoryIds,
                },
              },
            },
          },
          excludeId
            ? {
                id: {
                  not: excludeId,
                },
              }
            : {},
        ],
      },
      include: {
        images: {
          orderBy: { index: "asc" },
          take: 1,
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate average rating for each product
    const productsWithRating = products.map((product) => {
      const averageRating =
        product.reviews.length > 0
          ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
            product.reviews.length
          : 0;

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        previewImage: product.previewImage,
        images: product.images,
        averageRating,
      };
    });

    return NextResponse.json({ products: productsWithRating });
  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { error: "Failed to fetch related products" },
      { status: 500 }
    );
  }
}
