/**
 * API Route: /api/user/profile
 *
 * GET - Get user profile with all details
 * PUT - Update user profile
 */

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        isAdmin: true,
        defaultAddressId: true,
        defaultSupplier: true,
        defaultPayment: true,
        defaultAddress: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            street: true,
            houseNumber: true,
            city: true,
            postalCode: true,
            countryCode: true,
            phone: true,
          },
        },
        addresses: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            street: true,
            houseNumber: true,
            city: true,
            postalCode: true,
            countryCode: true,
            phone: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, currentPassword, newPassword, defaultSupplier, defaultPayment } = body;

    // Validate required fields
    if (!name && !email && !newPassword && !defaultSupplier && !defaultPayment) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password" },
          { status: 400 }
        );
      }

      const user = await db.user.findUnique({
        where: { id: session.userId },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const bcrypt = await import("bcryptjs");
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }
    }

    // If changing email, check if new email is already taken
    if (email && email !== session.email) {
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Build update data
    const updateData: {
      name?: string;
      email?: string;
      password?: string;
      defaultSupplier?: string | null;
      defaultPayment?: string | null;
    } = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (newPassword) updateData.password = await hashPassword(newPassword);
    if (defaultSupplier !== undefined) updateData.defaultSupplier = defaultSupplier;
    if (defaultPayment !== undefined) updateData.defaultPayment = defaultPayment;

    // Update user
    const updatedUser = await db.user.update({
      where: { id: session.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        defaultSupplier: true,
        defaultPayment: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}
