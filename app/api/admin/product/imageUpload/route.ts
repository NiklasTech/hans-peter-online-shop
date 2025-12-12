/**
 * API Route: /api/admin/product/imageUpload
 *
 * POST - Upload image, process with ImageProcessor, save to DB and return image data
 */

import { NextResponse } from "next/server";
import { ImageProcessor } from "@/lib/ImageProcessor";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const productId = formData.get("productId") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.includes("image")) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MiB." },
        { status: 400 }
      );
    }

    // Calculate next index for this product
    const parsedProductId = parseInt(productId);
    const existingImages = await db.productImage.findMany({
      where: { productId: parsedProductId },
      orderBy: { index: "desc" },
      take: 1,
    });

    const nextIndex = existingImages.length > 0 ? existingImages[0].index + 1 : 0;

    // Process image
    const processor = new ImageProcessor(parsedProductId);

    const url = await processor.saveAsAvif(
      file,
      { maxWidth: 2560, maxHeight: 2560 },
      { quality: 75, preserveTransparency: true }
    );

    // Create preview for this image
    const imagePreviewUrl = await processor.createImagePreview(file, parsedProductId, nextIndex);

    // If this is the first image (index 0), also create product preview image
    let productPreviewUrl: string | null = null;
    if (nextIndex === 0) {
      productPreviewUrl = await processor.createPreviewImage(file, parsedProductId);

      // Update product with preview image
      await db.product.update({
        where: { id: parsedProductId },
        data: { previewImage: productPreviewUrl },
      });
    }

    // Save to database with preview URL
    const image = await db.productImage.create({
      data: {
        productId: parsedProductId,
        url,
        previewUrl: imagePreviewUrl,
        index: nextIndex,
      },
    });

    return NextResponse.json({
      image,
      productPreviewImage: productPreviewUrl
    }, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

