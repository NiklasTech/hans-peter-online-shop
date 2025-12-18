/**
 * API Route: /api/user/addresses/[id]/default
 *
 * PUT - Set address as default
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

    // Verify address belongs to user
    const address = await db.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    if (address.userId !== session.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Set as default address
    await db.user.update({
      where: { id: session.userId },
      data: { defaultAddressId: addressId },
    });

    return NextResponse.json({
      message: "Default address updated successfully",
    });
  } catch (error) {
    console.error("Error setting default address:", error);
    return NextResponse.json(
      { error: "Failed to set default address" },
      { status: 500 }
    );
  }
}
