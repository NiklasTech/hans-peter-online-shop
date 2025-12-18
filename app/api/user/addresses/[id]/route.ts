/**
 * API Route: /api/user/addresses/[id]
 *
 * PUT - Update address
 * DELETE - Delete address
 */

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const addressId = parseInt(id);

    if (isNaN(addressId)) {
      return NextResponse.json(
        { error: "Invalid address ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      street,
      houseNumber,
      city,
      postalCode,
      countryCode,
      phone,
    } = body;

    // Verify address belongs to user
    const existingAddress = await db.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    if (existingAddress.userId !== session.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (street) updateData.street = street;
    if (houseNumber) updateData.houseNumber = houseNumber;
    if (city) updateData.city = city;
    if (postalCode) updateData.postalCode = postalCode;
    if (countryCode) updateData.countryCode = countryCode;
    if (phone !== undefined) updateData.phone = phone || null;

    // Update address
    const address = await db.address.update({
      where: { id: addressId },
      data: updateData,
    });

    return NextResponse.json({
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const addressId = parseInt(id);

    if (isNaN(addressId)) {
      return NextResponse.json(
        { error: "Invalid address ID" },
        { status: 400 }
      );
    }

    // Verify address belongs to user
    const existingAddress = await db.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    if (existingAddress.userId !== session.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Check if this is the default address
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { defaultAddressId: true },
    });

    // Delete address
    await db.address.delete({
      where: { id: addressId },
    });

    // If this was the default address, clear the default
    if (user?.defaultAddressId === addressId) {
      await db.user.update({
        where: { id: session.userId },
        data: { defaultAddressId: null },
      });
    }

    return NextResponse.json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
