"use client";

/**
 * Admin Dashboard Page
 * Route: /admin
 *
 * Displays overview statistics and quick links for admin management
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Grid3X3,
  Palette,
  Users,
  ShoppingCart,
  Star,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
  Euro,
  UserPlus,
  PackageOpen,
} from "lucide-react";

interface DashboardStats {
  products: number;
  categories: number;
  brands: number;
  users: number;
  orders: number;
  reviews: number;
  openChats: number;
  lowStockProducts: number;
  ordersToday: number;
  newUsersThisWeek: number;
  totalRevenue: number;
}

interface OrderStat {
  status: string;
  count: number;
  total: number;
}

interface RecentOrder {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  user: { name: string; email: string };
  orderItems: Array<{ product: { name: string }; quantity: number }>;
}

interface RecentUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  isAdmin: boolean;
}

interface DashboardData {
  stats: DashboardStats;
  orderStats: OrderStat[];
  recentOrders: RecentOrder[];
  recentUsers: RecentUser[];
}

const statusLabels: Record<string, string> = {
  pending: "Ausstehend",
  processing: "In Bearbeitung",
  shipped: "Versendet",
  delivered: "Geliefert",
  cancelled: "Storniert",
};

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  processing: "default",
  shipped: "default",
  delivered: "default",
  cancelled: "destructive",
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      if (!response.ok) {
        throw new Error("Fehler beim Laden der Dashboard-Daten");
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Lädt Dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { stats, orderStats, recentOrders, recentUsers } = data;

  // Main stat cards configuration
  const mainStats = [
    {
      title: "Gesamtumsatz",
      value: formatCurrency(stats.totalRevenue),
      icon: Euro,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Bestellungen heute",
      value: stats.ordersToday.toString(),
      icon: ShoppingCart,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Neue Benutzer (7 Tage)",
      value: stats.newUsersThisWeek.toString(),
      icon: UserPlus,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Offene Support-Anfragen",
      value: stats.openChats.toString(),
      icon: MessageSquare,
      color: stats.openChats > 0 ? "text-orange-600 dark:text-orange-400" : "text-gray-600 dark:text-gray-400",
      bgColor: stats.openChats > 0 ? "bg-orange-100 dark:bg-orange-900/30" : "bg-gray-100 dark:bg-gray-800",
    },
  ];

  // Quick link cards configuration
  const quickLinks = [
    {
      title: "Produkte",
      count: stats.products,
      description: "Produkte verwalten",
      href: "/admin/products",
      icon: Package,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      alert: stats.lowStockProducts > 0 ? `${stats.lowStockProducts} mit niedrigem Bestand` : undefined,
    },
    {
      title: "Kategorien",
      count: stats.categories,
      description: "Kategorien verwalten",
      href: "/admin/categories",
      icon: Grid3X3,
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-100 dark:bg-teal-900/30",
    },
    {
      title: "Marken",
      count: stats.brands,
      description: "Marken verwalten",
      href: "/admin/brands",
      icon: Palette,
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
    },
    {
      title: "Benutzer",
      count: stats.users,
      description: "Benutzer verwalten",
      href: "/admin/users",
      icon: Users,
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    },
    {
      title: "Bestellungen",
      count: stats.orders,
      description: "Alle Bestellungen",
      href: "/admin/orders",
      icon: ShoppingCart,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "Support",
      count: stats.openChats,
      description: "Support-Chats",
      href: "/admin/support",
      icon: MessageSquare,
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-100 dark:bg-rose-900/30",
      alert: stats.openChats > 0 ? `${stats.openChats} offen` : undefined,
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Willkommen zurück! Hier ist ein Überblick über deinen Shop.
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts Section */}
      {(stats.lowStockProducts > 0 || stats.openChats > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.lowStockProducts > 0 && (
            <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-orange-800 dark:text-orange-200">
                      Niedriger Lagerbestand
                    </p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      {stats.lowStockProducts} Produkte haben weniger als 10 Stück auf Lager
                    </p>
                  </div>
                  <Link
                    href="/admin/products"
                    className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
          {stats.openChats > 0 && (
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                    <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-800 dark:text-blue-200">
                      Offene Support-Anfragen
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {stats.openChats} Kunden warten auf eine Antwort
                    </p>
                  </div>
                  <Link
                    href="/admin/support"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Schnellzugriff
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${link.bgColor}`}>
                          <link.icon className={`h-5 w-5 ${link.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {link.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {link.description}
                          </p>
                        </div>
                      </div>
                      {link.alert && (
                        <div className="mt-3">
                          <Badge variant="secondary" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {link.alert}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {link.count}
                      </span>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Order Status Overview */}
      {orderStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Bestellstatus Übersicht
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {orderStats.map((stat) => (
                <div
                  key={stat.status}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
                >
                  <Badge variant={statusColors[stat.status] || "secondary"}>
                    {statusLabels[stat.status] || stat.status}
                  </Badge>
                  <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
                    {stat.count}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(stat.total)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Letzte Bestellungen
            </CardTitle>
            <Link
              href="/admin/orders"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Alle anzeigen
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Noch keine Bestellungen vorhanden
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          #{order.id}
                        </span>
                        <Badge variant={statusColors[order.status] || "secondary"}>
                          {statusLabels[order.status] || order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {order.user.name} - {order.orderItems.length} Artikel
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Neue Benutzer
            </CardTitle>
            <Link
              href="/admin/users"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Alle anzeigen
            </Link>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Noch keine Benutzer vorhanden
              </p>
            ) : (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <Link key={user.id} href={`/admin/user/${user.id}`}>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </span>
                          {user.isAdmin && (
                            <Badge variant="default">Admin</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageOpen className="h-5 w-5" />
            Shop Übersicht
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Package className="h-8 w-8 mx-auto text-indigo-600 dark:text-indigo-400" />
              <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
                {stats.products}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Produkte</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-cyan-600 dark:text-cyan-400" />
              <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
                {stats.users}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Benutzer</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <ShoppingCart className="h-8 w-8 mx-auto text-amber-600 dark:text-amber-400" />
              <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
                {stats.orders}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bestellungen</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Star className="h-8 w-8 mx-auto text-yellow-600 dark:text-yellow-400" />
              <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
                {stats.reviews}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bewertungen</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
