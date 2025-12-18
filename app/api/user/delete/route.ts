/**
 * API Route: /api/user/delete
 *
 * DELETE - Delete user account and all associated data
 */

import { NextResponse } from "next/server";
import { getCurrentUser, clearUserSession, clearAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(request: Request) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { password, confirmText } = body;

    // Validate confirmation text
    if (confirmText !== "ACCOUNT LÖSCHEN") {
      return NextResponse.json(
        { error: "Bestätigungstext stimmt nicht überein" },
        { status: 400 }
      );
    }

    // Verify password
    const user = await db.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }

    const bcrypt = await import("bcryptjs");
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Falsches Passwort" },
        { status: 401 }
      );
    }

    // Delete user account
    // Cascade deletes will handle related data (orders, cart, wishlist, etc.)
    await db.user.delete({
      where: { id: session.userId },
    });

    // Clear sessions
    await clearUserSession();
    if (user.isAdmin) {
      await clearAdminSession();
    }

    return NextResponse.json({
      message: "Account erfolgreich gelöscht",
    });
  } catch (error) {
    console.error("Fehler beim Löschen des Accounts:", error);
    return NextResponse.json(
      { error: "Account konnte nicht gelöscht werden" },
      { status: 500 }
    );
  }
}
