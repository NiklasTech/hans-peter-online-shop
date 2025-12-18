/**
 * API Route: /api/admin/product/image
 *
 * DELETE - Delete a single product image by ID (from DB and filesystem)
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ImageProcessor } from "@/lib/ImageProcessor";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const parsedImageId = parseInt(imageId);

    if (isNaN(parsedImageId)) {
      return NextResponse.json(
        { error: "Invalid image ID" },
        { status: 400 }
      );
    }

    // Fetch image from database
    const image = await db.productImage.findUnique({
      where: { id: parsedImageId },
    });

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Delete physical file and its preview
    const processor = new ImageProcessor(image.productId);
    await processor.deleteImageByUrl(image.url);
    await processor.deleteImageByUrl(image.previewUrl);

    // If this was the first image, check if there's a new first image to update product preview
    const wasFirstImage = image.index === 0;

    // Delete from database
    await db.productImage.delete({
      where: { id: parsedImageId },
    });

    // If deleted image was the first one, update product preview with new first image
    if (wasFirstImage) {
      const newFirstImage = await db.productImage.findFirst({
        where: { productId: image.productId },
        orderBy: { index: "asc" },
      });

      if (newFirstImage) {
        // Update product preview to point to the new first image's preview
        await db.product.update({
          where: { id: image.productId },
          data: { previewImage: newFirstImage.previewUrl },
        });
      } else {
        // No images left, clear product preview
        await db.product.update({
          where: { id: image.productId },
          data: { previewImage: null },
        });
      }
    }

    return NextResponse.json({
      message: "Image deleted successfully",
      imageId: parsedImageId
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}

