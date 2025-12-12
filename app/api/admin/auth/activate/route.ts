/**
 * API Route: /api/admin/auth/activate
 *
 * POST - Activate admin session for a logged-in user who has admin rights
 */

import { NextResponse } from "next/server";
import { getCurrentUser, setAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST() {
  try {
    // Check if user is logged in
    const userSession = await getCurrentUser();

    if (!userSession) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if user has admin rights
    const user = await db.user.findUnique({
      where: { id: userSession.userId },
      select: { id: true, email: true, isAdmin: true },
    });

    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }

    // Create admin session
    await setAdminSession(user.id, user.email);

    return NextResponse.json({
      message: "Admin session activated",
    });
  } catch (error) {
    console.error("Error activating admin session:", error);
    return NextResponse.json(
      { error: "Failed to activate admin session" },
      { status: 500 }
    );
  }
}
