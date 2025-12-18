/**
 * API Route: /api/admin/product/updatePreview
 *
 * POST - Updates the preview image based on the first product image
 */

import { NextResponse } from "next/server";
import { ImageProcessor } from "@/lib/ImageProcessor";
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
        index: 0
      },
    });

    if (!firstImage) {
      return NextResponse.json(
        { error: "No images found for this product" },
        { status: 404 }
      );
    }

    // Download the image from URL
    const response = await fetch(firstImage.url);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a File object from buffer
    const file = new File([buffer], `preview_${parsedProductId}`, {
      type: "image/avif",
    });

    // Process image
    const processor = new ImageProcessor(parsedProductId);

    // Delete old preview image
    await processor.deletePreviewImage(parsedProductId);

    // Create new preview image
    const previewImageUrl = await processor.createPreviewImage(file, parsedProductId);

    // Update product with new preview image
    await db.product.update({
      where: { id: parsedProductId },
      data: { previewImage: previewImageUrl },
    });

    return NextResponse.json({ previewImage: previewImageUrl }, { status: 200 });
  } catch (error) {
    console.error("Error updating preview image:", error);
    return NextResponse.json(
      { error: "Failed to update preview image" },
      { status: 500 }
    );
  }
}

