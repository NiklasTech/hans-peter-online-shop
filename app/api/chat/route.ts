import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { getCurrentUser, getCurrentAdmin } from "@/lib/auth";

// Get or create chat for current user
export async function GET(req: NextRequest) {
  try {
    // Try to get user from either user or admin session
    let user = await getCurrentUser();
    let userId: number | null = null;

    if (user) {
      userId = user.userId;
    } else {
      // If not a regular user, check if admin
      const admin = await getCurrentAdmin();
      if (admin) {
        userId = admin.userId;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find existing open chat for user
    let chat = await prisma.supportChat.findFirst({
      where: {
        userId: userId,
        status: { in: ["open", "in_progress"] },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Create new chat if none exists
    if (!chat) {
      chat = await prisma.supportChat.create({
        data: {
          userId: userId,
          status: "open",
        },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat" },
      { status: 500 }
    );
  }
}

// Create new chat
export async function POST(req: NextRequest) {
  try {
    // Try to get user from either user or admin session
    let user = await getCurrentUser();
    let userId: number | null = null;

    if (user) {
      userId = user.userId;
    } else {
      // If not a regular user, check if admin
      const admin = await getCurrentAdmin();
      if (admin) {
        userId = admin.userId;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { subject, content } = body;

    // Create chat with initial message
    const chat = await prisma.supportChat.create({
      data: {
        userId: userId,
        status: "open",
        subject: subject || null,
        messages: {
          create: {
            userId: userId,
            content: content,
            isAdmin: false,
          },
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}
