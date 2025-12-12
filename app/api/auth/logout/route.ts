/**
 * API Route: /api/auth/logout
 *
 * POST - Logout user (clears both user and admin session)
 */

import { NextResponse } from "next/server";
import { clearUserSession, clearAdminSession } from "@/lib/auth";

export async function POST() {
  try {
    // Clear both user and admin session cookies
    await clearUserSession();
    await clearAdminSession();

    return NextResponse.json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}
