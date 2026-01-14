/**
 * API Route: /api/auth/me
 *
 * GET - Get current user information
 */

import { NextResponse } from "next/server";
import { getCurrentUser, getCurrentAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const userSession = await getCurrentUser();
    const adminSession = await getCurrentAdmin();

    if (!userSession && !adminSession) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get userId from either session
    const userId = userSession?.userId || adminSession?.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Fetch full user data
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return user data with userId field for compatibility
    return NextResponse.json({
      userId: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      hasUserSession: !!userSession,
      hasAdminSession: !!adminSession,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
