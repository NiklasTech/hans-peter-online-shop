/**
 * API Route: /api/admin/products/[id]
 *
 * GET    - Fetch a single product by ID
 * PUT    - Update a product by ID
 * DELETE - Delete a product by ID
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ImageProcessor } from "@/lib/ImageProcessor";

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
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const body = await request.json();
    const { name, description, price, stock, categoryIds, brandId, previewImage, images, details } = body;

    // Check if product exists and fetch current images
    const existingProduct = await db.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // If images are being updated, delete old images from filesystem
    if (images) {
      const processor = new ImageProcessor(productId);
      const oldImageUrls = existingProduct.images.map(img => img.url);
      await processor.deleteImagesByUrls(oldImageUrls);
    }

    // Update product
    const product = await db.product.update({
      where: { id: productId },
      data: {
        name: name !== undefined ? name : undefined,
        description: description !== undefined ? description : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        brandId: brandId !== undefined ? parseInt(brandId) : undefined,
        previewImage: previewImage !== undefined ? previewImage : undefined,
        images: images
          ? {
              deleteMany: {},
              create: images.map((img: { url: string; index: number }) => ({
                url: img.url,
                index: img.index,
              })),
            }
          : undefined,
        categories: categoryIds
          ? {
              deleteMany: {},
              create: categoryIds.map((categoryId: number) => ({
                categoryId: parseInt(categoryId.toString()),
              })),
            }
          : undefined,
        details: details
          ? {
              deleteMany: {},
              create: details
                .filter((d: { key: string; value: string }) => d.key && d.value)
                .map((d: { key: string; value: string }) => ({
                  key: d.key,
                  value: d.value,
                })),
            }
          : undefined,
      },
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
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if product exists and fetch images
    const existingProduct = await db.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Delete physical image files
    const processor = new ImageProcessor(productId);
    for (const image of existingProduct.images) {
      await processor.deleteImageByUrl(image.url);
    }

    // Delete preview image if exists and different from product images
    if (existingProduct.previewImage) {
      const isPreviewInImages = existingProduct.images.some(
        img => img.url === existingProduct.previewImage
      );
      if (!isPreviewInImages) {
        await processor.deleteImageByUrl(existingProduct.previewImage);
      }
    }

    // Delete product from database (cascade deletes image records)
    await db.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
