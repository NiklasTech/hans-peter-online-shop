/**
 * API Route: /api/admin/auth/login
 *
 * POST - Admin login (creates separate admin session)
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comparePassword, setAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return NextResponse.json(
        { error: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Set admin session
    const adminSession = await setAdminSession(user.id, user.email);

    return NextResponse.json({
      message: "Admin login successful",
      admin: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      sessionId: adminSession.id,
    });
  } catch (error) {
    console.error("Error logging in admin:", error);
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
}
