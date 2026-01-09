/**
 * API Route: /api/admin/categories
 *
 * GET    - Fetch a single category by ID (query param) or all categories
 * POST   - Create a new category
 * PUT    - Update a category by ID (from body)
 * DELETE - Delete a category by ID (query param)
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ImageProcessor } from "@/lib/ImageProcessor";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Single category
    if (id) {
      const categoryId = parseInt(id);

      if (isNaN(categoryId)) {
        return NextResponse.json(
          { error: "Ungültige Kategorie-ID" },
          { status: 400 }
        );
      }

      const category = await db.category.findUnique({
        where: { id: categoryId },
        include: {
          parent: true,
          _count: {
            select: { products: true },
          },
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Kategorie nicht gefunden" },
          { status: 404 }
        );
      }

      return NextResponse.json({ category });
    }

    // All categories
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      db.category.findMany({
        skip,
        take: limit,
        include: {
          parent: true,
          _count: {
            select: { products: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.category.count(),
    ]);

    return NextResponse.json({
      categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Kategorien" },
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
    const parentId = formData.get("parentId") as string | null;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: "Name ist erforderlich" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await db.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Eine Kategorie mit diesem Namen existiert bereits" },
        { status: 409 }
      );
    }

    // Validate parent category if provided
    if (parentId) {
      const parent = await db.category.findUnique({
        where: { id: parseInt(parentId) },
      });

      if (!parent) {
        return NextResponse.json(
          { error: "Übergeordnete Kategorie nicht gefunden" },
          { status: 404 }
        );
      }
    }

    let imageUrl: string | null = null;

    // Process image if provided
    if (image && image.size > 0) {
      const imageProcessor = new ImageProcessor();
      const savedImages = await imageProcessor.saveAsAvif(image, { maxWidth: 540, maxHeight: 540 });
      imageUrl = savedImages?.url;
    }

    // Create category
    const category = await db.category.create({
      data: {
        name,
        description: description || null,
        image: imageUrl,
        parentId: parentId ? parseInt(parentId) : null,
      },
      include: {
        parent: true,
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ category, message: "Kategorie erfolgreich erstellt" }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen der Kategorie" },
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
    const parentId = formData.get("parentId") as string | null;

    // Validation
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Ungültige Kategorie-ID" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Name ist erforderlich" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await db.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Kategorie nicht gefunden" },
        { status: 404 }
      );
    }

    // Check if name is already taken by another category
    const duplicateCategory = await db.category.findFirst({
      where: {
        name,
        NOT: { id },
      },
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { error: "Eine andere Kategorie mit diesem Namen existiert bereits" },
        { status: 409 }
      );
    }

    // Validate parent category if provided
    const newParentId = parentId ? parseInt(parentId) : null;
    if (newParentId) {
      // Cannot set itself as parent
      if (newParentId === id) {
        return NextResponse.json(
          { error: "Eine Kategorie kann nicht ihre eigene Überkategorie sein" },
          { status: 400 }
        );
      }

      const parent = await db.category.findUnique({
        where: { id: newParentId },
      });

      if (!parent) {
        return NextResponse.json(
          { error: "Übergeordnete Kategorie nicht gefunden" },
          { status: 404 }
        );
      }

      // Check if the new parent is a child of this category (would create circular reference)
      const isCircular = await checkCircularReference(id, newParentId);
      if (isCircular) {
        return NextResponse.json(
          { error: "Zirkuläre Referenz: Die gewählte Überkategorie ist eine Unterkategorie dieser Kategorie" },
          { status: 400 }
        );
      }
    }

    let imageUrl: string | null = existingCategory.image;

    // Delete old image if requested
    if (deleteImage && existingCategory.image) {
      const imageProcessor = new ImageProcessor();
      await imageProcessor.deleteImageByUrl(existingCategory.image);
      imageUrl = null;
    }

    // Process new image if provided
    if (image && image.size > 0) {
      // Delete old image first
      if (existingCategory.image) {
        const imageProcessor = new ImageProcessor();
        await imageProcessor.deleteImageByUrl(existingCategory.image);
      }

      // Save new image
      const imageProcessor = new ImageProcessor();
      imageProcessor.addFiles([image]);
      const savedImage = await imageProcessor.saveAsAvif(image, { maxWidth: 540, maxHeight: 540 });
      imageUrl = savedImage?.url;
    }

    // Update category
    const category = await db.category.update({
      where: { id },
      data: {
        name,
        description: description || null,
        image: imageUrl,
        parentId: newParentId,
      },
      include: {
        parent: true,
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ category, message: "Kategorie erfolgreich aktualisiert" });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren der Kategorie" },
      { status: 500 }
    );
  }
}

// Helper function to check for circular references
async function checkCircularReference(categoryId: number, potentialParentId: number): Promise<boolean> {
  let currentId: number | null = potentialParentId;

  while (currentId !== null) {
    if (currentId === categoryId) {
      return true; // Circular reference found
    }

    const parent = await db.category.findUnique({
      where: { id: currentId },
      select: { parentId: true },
    });

    currentId = parent?.parentId || null;
  }

  return false;
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Kategorie-ID fehlt" },
        { status: 400 }
      );
    }

    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: "Ungültige Kategorie-ID" },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await db.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Kategorie nicht gefunden" },
        { status: 404 }
      );
    }

    // Check if category has products
    if (category._count.products > 0) {
      return NextResponse.json(
        { error: `Kategorie kann nicht gelöscht werden, da sie ${category._count.products} Produkt(e) enthält` },
        { status: 409 }
      );
    }

    // Delete image if exists
    if (category.image) {
      const imageProcessor = new ImageProcessor();
      await imageProcessor.deleteImageByUrl(category.image);
    }

    // Delete category
    await db.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ message: "Kategorie erfolgreich gelöscht" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen der Kategorie" },
      { status: 500 }
    );
  }
}

