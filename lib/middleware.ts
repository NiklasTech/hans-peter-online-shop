/**
 * Middleware helper functions for authentication
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getCurrentAdmin } from "./auth";

/**
 * Middleware to require user authentication
 */
export async function requireUserAuth(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Attach user to request for use in handler
    (req as NextRequest & { user: typeof user }).user = user;
    return handler(req);
  };
}

/**
 * Middleware to require admin authentication
 */
export async function requireAdminAuth(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Admin authentication required" },
        { status: 401 }
      );
    }

    // Attach admin to request for use in handler
    (req as NextRequest & { admin: typeof admin }).admin = admin;
    return handler(req);
  };
}

/**
 * Check if request has valid user or admin session
 */
export async function hasAnyAuth(): Promise<boolean> {
  const user = await getCurrentUser();
  const admin = await getCurrentAdmin();
  return !!(user || admin);
}

/**
 * Check if request has valid admin session
 */
export async function hasAdminAuth(): Promise<boolean> {
  const admin = await getCurrentAdmin();
  return !!admin;
}
