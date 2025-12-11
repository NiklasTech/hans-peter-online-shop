import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
const USER_TOKEN_EXPIRY = "7d"; // User sessions expire after 7 days
const ADMIN_TOKEN_EXPIRY = "30d"; // Admin sessions expire after 30 days

export interface UserPayload {
  userId: number;
  email: string;
  isAdmin: boolean;
}

export interface AdminPayload {
  userId: number;
  email: string;
  sessionId: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a password with a hash
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a user JWT token
 */
export function generateUserToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: USER_TOKEN_EXPIRY });
}

/**
 * Generate an admin JWT token
 */
export function generateAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ADMIN_TOKEN_EXPIRY });
}

/**
 * Verify a JWT token
 */
export function verifyToken<T>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (error) {
    return null;
  }
}

/**
 * Set user session cookie
 */
export async function setUserSession(payload: UserPayload) {
  const token = generateUserToken(payload);
  const cookieStore = await cookies();

  cookieStore.set("user_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Set admin session cookie and create database session
 */
export async function setAdminSession(userId: number, email: string) {
  // Create admin session in database
  const sessionToken = jwt.sign({ random: Math.random() }, JWT_SECRET);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

  const adminSession = await db.adminSession.create({
    data: {
      userId,
      token: sessionToken,
      expiresAt,
    },
  });

  // Create JWT with session reference
  const token = generateAdminToken({
    userId,
    email,
    sessionId: adminSession.id,
  });

  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return adminSession;
}

/**
 * Get current user from session cookie
 */
export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_token");

  if (!token) {
    return null;
  }

  return verifyToken<UserPayload>(token.value);
}

/**
 * Get current admin from session cookie and verify in database
 */
export async function getCurrentAdmin(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) {
    return null;
  }

  const payload = verifyToken<AdminPayload>(token.value);

  if (!payload) {
    return null;
  }

  // Verify session exists in database and hasn't expired
  const session = await db.adminSession.findUnique({
    where: { id: payload.sessionId },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    // Session invalid or expired
    await clearAdminSession();
    return null;
  }

  // Verify user is still an admin
  if (!session.user.isAdmin) {
    await clearAdminSession();
    return null;
  }

  return payload;
}

/**
 * Clear user session cookie
 */
export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete("user_token");
}

/**
 * Clear admin session cookie and database entry
 */
export async function clearAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (token) {
    const payload = verifyToken<AdminPayload>(token.value);

    if (payload) {
      // Delete session from database
      await db.adminSession.delete({
        where: { id: payload.sessionId },
      }).catch(() => {
        // Session might already be deleted, ignore error
      });
    }
  }

  cookieStore.delete("admin_token");
}

/**
 * Cleanup expired admin sessions (should be called periodically)
 */
export async function cleanupExpiredAdminSessions() {
  await db.adminSession.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}
