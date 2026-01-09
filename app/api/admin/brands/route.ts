/**
 * API Route: /api/admin/brands
 *
 * GET    - Fetch a single brand by ID (query param) or all brands
 * POST   - Create a new brand
 * PUT    - Update a brand by ID (from body)
 * DELETE - Delete a brand by ID (query param)
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ImageProcessor } from "@/lib/ImageProcessor";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Single brand
    if (id) {
      const brandId = parseInt(id);

      if (isNaN(brandId)) {
        return NextResponse.json(
          { error: "Ungültige Marken-ID" },
          { status: 400 }
        );
      }

      const brand = await db.brand.findUnique({
        where: { id: brandId },
        include: {
          _count: {
            select: { products: true },
          },
        },
      });

      if (!brand) {
        return NextResponse.json(
          { error: "Marke nicht gefunden" },
          { status: 404 }
        );
      }

      return NextResponse.json({ brand });
    }

    // All brands
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const [brands, total] = await Promise.all([
      db.brand.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.brand.count(),
    ]);

    return NextResponse.json({
      brands,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Marken" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const image = formData.get("image") as File | null;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: "Name ist erforderlich" },
        { status: 400 }
      );
    }

    // Check if brand already exists
    const existingBrand = await db.brand.findUnique({
      where: { name },
    });

    if (existingBrand) {
      return NextResponse.json(
        { error: "Eine Marke mit diesem Namen existiert bereits" },
        { status: 409 }
      );
    }

    let imageUrl: string | null = null;

    // Process image if provided
    if (image && image.size > 0) {
      const imageProcessor = new ImageProcessor();
      const savedImages = await imageProcessor.saveAsAvif(image, { maxWidth: 540, maxHeight: 540 });
      imageUrl = savedImages?.url;
    }

    // Create brand
    const brand = await db.brand.create({
      data: {
        name,
        description: description || null,
        image: imageUrl,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ brand, message: "Marke erfolgreich erstellt" }, { status: 201 });
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen der Marke" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = parseInt(formData.get("id") as string);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const image = formData.get("image") as File | null;
    const deleteImage = formData.get("deleteImage") === "true";

    // Validation
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Ungültige Marken-ID" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Name ist erforderlich" },
        { status: 400 }
      );
    }

    // Check if brand exists
    const existingBrand = await db.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      return NextResponse.json(
        { error: "Marke nicht gefunden" },
        { status: 404 }
      );
    }

    // Check if name is already taken by another brand
    const duplicateBrand = await db.brand.findFirst({
      where: {
        name,
        NOT: { id },
      },
    });

    if (duplicateBrand) {
      return NextResponse.json(
        { error: "Eine andere Marke mit diesem Namen existiert bereits" },
        { status: 409 }
      );
    }

    let imageUrl: string | null = existingBrand.image;

    // Delete old image if requested
    if (deleteImage && existingBrand.image) {
      const imageProcessor = new ImageProcessor();
      await imageProcessor.deleteImageByUrl(existingBrand.image);
      imageUrl = null;
    }

    // Process new image if provided
    if (image && image.size > 0) {
      // Delete old image first
      if (existingBrand.image) {
        const imageProcessor = new ImageProcessor();
        await imageProcessor.deleteImageByUrl(existingBrand.image);
      }

      // Save new image
      const imageProcessor = new ImageProcessor();
      imageProcessor.addFiles([image]);
      const savedImage = await imageProcessor.saveAsAvif(image, { maxWidth: 540, maxHeight: 540 });
      imageUrl = savedImage?.url;
    }

    // Update brand
    const brand = await db.brand.update({
      where: { id },
      data: {
        name,
        description: description || null,
        image: imageUrl,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ brand, message: "Marke erfolgreich aktualisiert" });
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren der Marke" },
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
        { error: "Marken-ID ist erforderlich" },
        { status: 400 }
      );
    }

    const brandId = parseInt(id);

    if (isNaN(brandId)) {
      return NextResponse.json(
        { error: "Ungültige Marken-ID" },
        { status: 400 }
      );
    }

    // Check if brand exists
    const brand = await db.brand.findUnique({
      where: { id: brandId },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      return NextResponse.json(
        { error: "Marke nicht gefunden" },
        { status: 404 }
      );
    }

    // Check if brand has products
    if (brand._count.products > 0) {
      return NextResponse.json(
        { error: `Diese Marke kann nicht gelöscht werden, da sie noch ${brand._count.products} Produkt(e) enthält` },
        { status: 409 }
      );
    }

    // Delete brand image if exists
    if (brand.image) {
      const imageProcessor = new ImageProcessor();
      await imageProcessor.deleteImageByUrl(brand.image);
    }

    // Delete brand
    await db.brand.delete({
      where: { id: brandId },
    });

    return NextResponse.json({ message: "Marke erfolgreich gelöscht" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen der Marke" },
      { status: 500 }
    );
  }
}

