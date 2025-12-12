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

    // If user session exists, fetch full user data
    let userData = null;
    if (userSession) {
      const user = await db.user.findUnique({
        where: { id: userSession.userId },
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
          createdAt: true,
        },
      });

      if (user) {
        userData = user;
      }
    }

    return NextResponse.json({
      user: userData,
      hasUserSession: !!userSession,
      hasAdminSession: !!adminSession,
      isAdmin: userSession?.isAdmin || false,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
