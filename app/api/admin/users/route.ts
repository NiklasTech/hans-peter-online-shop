/**
 * API Route: /api/admin/users
 *
 * GET    - Fetch a single user by ID (query param) or all users
 * POST   - Create a new user
 * PUT    - Update a user by ID (from body)
 * DELETE - Delete a user by ID (query param)
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Single user
    if (id) {
      const userId = parseInt(id);

      if (isNaN(userId)) {
        return NextResponse.json(
          { error: "Ungültige Benutzer-ID" },
          { status: 400 }
        );
      }

      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
          createdAt: true,
          updatedAt: true,
          defaultAddressId: true,
          defaultSupplier: true,
          defaultPayment: true,
          // Exclude password
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Benutzer nicht gefunden" },
          { status: 404 }
        );
      }

      return NextResponse.json({ user });
    }

    // All users
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      db.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
          createdAt: true,
          updatedAt: true,
          defaultAddressId: true,
          defaultSupplier: true,
          defaultPayment: true,
          // Exclude password
        },
        orderBy: { createdAt: "desc" },
      }),
      db.user.count(),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Benutzer" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password, isAdmin, defaultSupplier, defaultPayment } = body;

    // Validation
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "E-Mail, Name und Passwort sind erforderlich" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Das Passwort muss mindestens 6 Zeichen lang sein" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ein Benutzer mit dieser E-Mail existiert bereits" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        isAdmin: isAdmin || false,
        defaultSupplier: defaultSupplier || null,
        defaultPayment: defaultPayment || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        defaultAddressId: true,
        defaultSupplier: true,
        defaultPayment: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Benutzers" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, email, name, password, isAdmin, defaultSupplier, defaultPayment } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Benutzer-ID ist erforderlich" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }

    // Check if email is already taken by another user
    if (email && email !== existingUser.email) {
      const emailTaken = await db.user.findUnique({
        where: { email },
      });

      if (emailTaken) {
        return NextResponse.json(
          { error: "Diese E-Mail wird bereits verwendet" },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData: {
      email: string;
      name: string;
      isAdmin: boolean;
      defaultSupplier: string | null;
      defaultPayment: string | null;
      password?: string;
    } = {
      email: email || existingUser.email,
      name: name || existingUser.name,
      isAdmin: isAdmin !== undefined ? isAdmin : existingUser.isAdmin,
      defaultSupplier: defaultSupplier !== undefined ? defaultSupplier : existingUser.defaultSupplier,
      defaultPayment: defaultPayment !== undefined ? defaultPayment : existingUser.defaultPayment,
    };

    // Only update password if provided
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Das Passwort muss mindestens 6 Zeichen lang sein" },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user
    const user = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        defaultAddressId: true,
        defaultSupplier: true,
        defaultPayment: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren des Benutzers" },
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
        { error: "Benutzer-ID ist erforderlich" },
        { status: 400 }
      );
    }

    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "Ungültige Benutzer-ID" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }

    // Delete user
    await db.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "Benutzer erfolgreich gelöscht" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen des Benutzers" },
      { status: 500 }
    );
  }
}

