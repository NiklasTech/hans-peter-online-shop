/**
 * Admin Dashboard Statistics API
 * Route: GET /api/admin/dashboard
 *
 * Returns statistics for the admin dashboard
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get counts for all main entities
    const [
      productsCount,
      categoriesCount,
      brandsCount,
      usersCount,
      ordersCount,
      reviewsCount,
      openChatsCount,
      lowStockProducts,
      recentOrders,
      recentUsers,
      orderStats,
    ] = await Promise.all([
      // Total products
      db.product.count(),
      // Total categories
      db.category.count(),
      // Total brands
      db.brand.count(),
      // Total users
      db.user.count(),
      // Total orders
      db.order.count(),
      // Total reviews
      db.review.count(),
      // Open support chats
      db.supportChat.count({
        where: {
          status: { in: ["open", "in_progress"] },
        },
      }),
      // Low stock products (less than 10)
      db.product.count({
        where: {
          stock: { lt: 10 },
        },
      }),
      // Recent orders (last 5)
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true },
          },
          orderItems: {
            include: {
              product: {
                select: { name: true },
              },
            },
          },
        },
      }),
      // Recent users (last 5)
      db.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          isAdmin: true,
        },
      }),
      // Order statistics by status
      db.order.groupBy({
        by: ["status"],
        _count: { id: true },
        _sum: { total: true },
      }),
    ]);

    // Calculate total revenue
    const totalRevenue = orderStats.reduce(
      (sum, stat) => sum + (stat._sum.total || 0),
      0
    );

    // Get orders from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ordersToday = await db.order.count({
      where: {
        createdAt: { gte: today },
      },
    });

    // Get new users this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newUsersThisWeek = await db.user.count({
      where: {
        createdAt: { gte: weekAgo },
      },
    });

    return NextResponse.json({
      stats: {
        products: productsCount,
        categories: categoriesCount,
        brands: brandsCount,
        users: usersCount,
        orders: ordersCount,
        reviews: reviewsCount,
        openChats: openChatsCount,
        lowStockProducts,
        ordersToday,
        newUsersThisWeek,
        totalRevenue,
      },
      orderStats: orderStats.map((stat) => ({
        status: stat.status,
        count: stat._count.id,
        total: stat._sum.total || 0,
      })),
      recentOrders,
      recentUsers,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard statistics" },
      { status: 500 }
    );
  }
}
