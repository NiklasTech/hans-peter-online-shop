/**
 * API Route: /api/user/addresses
 *
 * GET - Get all user addresses
 * POST - Create new address
 */

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const addresses = await db.address.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
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
      countryCode = "DE",
      phone,
      setAsDefault = false,
    } = body;

    // Validation
    if (!firstName || !lastName || !street || !houseNumber || !city || !postalCode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create address
    const address = await db.address.create({
      data: {
        userId: session.userId,
        firstName,
        lastName,
        street,
        houseNumber,
        city,
        postalCode,
        countryCode,
        phone: phone || null,
      },
    });

    // Set as default if requested
    if (setAsDefault) {
      await db.user.update({
        where: { id: session.userId },
        data: { defaultAddressId: address.id },
      });
    }

    return NextResponse.json({
      message: "Address created successfully",
      address,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}
