/**
 * API Route: /api/admin/auth/verify
 *
 * GET - Verify admin session is valid
 */

import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const adminSession = await getCurrentAdmin();

    if (!adminSession) {
      return NextResponse.json(
        { error: "Not authenticated as admin" },
        { status: 401 }
      );
    }

    // Fetch admin user data
    const admin = await db.user.findUnique({
      where: { id: adminSession.userId },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
      },
    });

    if (!admin || !admin.isAdmin) {
      return NextResponse.json(
        { error: "Admin privileges revoked" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      isAdmin: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Error verifying admin:", error);
    return NextResponse.json(
      { error: "Failed to verify admin session" },
      { status: 500 }
    );
  }
}
