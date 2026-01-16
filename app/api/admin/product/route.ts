/**
 * API Route: /api/admin/product
 *
 * GET    - Fetch a single product by ID (query param) or all products
 * POST   - Create a new product
 * PUT    - Update a product by ID (from body)
 * DELETE - Delete a product by ID (query param)
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Single product
    if (id) {
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
    }

    // All products
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
          categories: {
            include: {
              category: true,
            },
          },
          brand: true,
          details: true,
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

// ...existing POST code...

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, price, salePrice, stock, categoryIds, brandId, images, details } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Update product (previewImage is managed automatically via imageUpload and updatePreview routes)
    const product = await db.product.update({
      where: { id: productId },
      data: {
        name: name !== undefined ? name : undefined,
        description: description !== undefined ? description : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        salePrice: salePrice !== undefined ? (salePrice === null ? null : parseFloat(salePrice)) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        brandId: brandId !== undefined ? parseInt(brandId) : undefined,
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Delete product (cascade deletes images)
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, salePrice, stock, categoryIds, brandId, images, details } = body;

    // Validierung
    if (!name || price === undefined || stock === undefined || !categoryIds || categoryIds.length === 0 || !brandId) {
      return NextResponse.json(
        { error: "Name, price, stock, categoryIds (at least one) and brandId are required" },
        { status: 400 }
      );
    }

    // Produkt erstellen
    const product = await db.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        stock: parseInt(stock),
        brandId: parseInt(brandId),
        previewImage: null, // Will be set automatically when first image is uploaded
        images: {
          create:
            images?.map((img: { url: string; index: number }) => ({
              url: img.url,
              index: img.index,
            })) || [],
        },
        categories: {
          create: categoryIds.map((categoryId: number) => ({
            categoryId: parseInt(categoryId.toString()),
          })),
        },
        details: {
          create:
            details
              ?.filter((d: { key: string; value: string }) => d.key && d.value)
              .map((d: { key: string; value: string }) => ({
                key: d.key,
                value: d.value,
              })) || [],
        },
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

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
