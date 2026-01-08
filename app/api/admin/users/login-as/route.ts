/**
 * API Route: /api/admin/users/login-as
 *
 * POST - Login as a specific user (for admin testing purposes)
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setUserSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Benutzer-ID ist erforderlich" },
        { status: 400 }
      );
    }

    // Find user
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }

    // Set user session
    await setUserSession({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    });

    return NextResponse.json({
      message: "Erfolgreich als Benutzer angemeldet",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error logging in as user:", error);
    return NextResponse.json(
      { error: "Fehler beim Anmelden als Benutzer" },
      { status: 500 }
    );
  }
}

