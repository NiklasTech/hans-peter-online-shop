/**
 * API Route: /api/admin/auth/logout
 *
 * POST - Logout admin (clears admin session)
 */

import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";

export async function POST() {
  try {
    // Clear admin session cookie and database entry
    await clearAdminSession();

    return NextResponse.json({
      message: "Admin logout successful",
    });
  } catch (error) {
    console.error("Error logging out admin:", error);
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}
