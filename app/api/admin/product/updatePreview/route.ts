/**
 * API Route: /api/admin/product/updatePreview
 *
 * POST - Updates the preview image based on the first product image
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const parsedProductId = parseInt(productId);

    // Get the first image (index 0)
    const firstImage = await db.productImage.findFirst({
      where: {
        productId: parsedProductId,
      },
      orderBy: { index: "asc" }
    });

    if (!firstImage) {
      return NextResponse.json(
        { error: "No images found for this product" },
        { status: 404 }
      );
    }

    // Update product with new preview image
    await db.product.update({
      where: { id: parsedProductId },
      data: { previewImage: firstImage.previewUrl },
    });

    return NextResponse.json({ previewImage: firstImage.previewUrl }, { status: 200 });
  } catch (error) {
    console.error("Error updating preview image:", error);
    return NextResponse.json(
      { error: "Failed to update preview image" },
      { status: 500 }
    );
  }
}

