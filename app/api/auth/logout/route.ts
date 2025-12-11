/**
 * API Route: /api/auth/logout
 *
 * POST - Logout user (clears only user session, NOT admin session)
 */

import { NextResponse } from "next/server";
import { clearUserSession } from "@/lib/auth";

export async function POST() {
  try {
    // Clear only the user session cookie
    await clearUserSession();

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
