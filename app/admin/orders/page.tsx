"use client";

/**
 * Admin Orders List Page
 * Route: /admin/orders
 *
 * Displays all orders with options to view, edit status, and delete
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, Eye, Trash2, Package } from "lucide-react";

// Order type
interface OrderItem {
  id: number;
  productId: number | null;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    previewImage: string | null;
  } | null;
}

interface Order {
  id: number;
  userId: number;
  status: string;
  paymentStatus: string;
  total: number;
  shippingStreet: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingFirstName: string;
  shippingLastName: string;
  paymentMethod: string;
  shippingMethod: string | null;
  trackingNumber: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user: {
    id: number;
    email: string;
    name: string;
  };
  orderItems: OrderItem[];
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

const paymentStatusLabels: Record<string, string> = {
  pending: "Ausstehend",
  paid: "Bezahlt",
  failed: "Fehlgeschlagen",
  refunded: "Erstattet",
};

export default function OrdersListPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Load orders
  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Fehler beim Laden der Bestellungen");
      }
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  // Delete order
  const handleDelete = async (orderId: number) => {
    if (deleteConfirm !== orderId) {
      setDeleteConfirm(orderId);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    try {
      const response = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Fehler beim Löschen der Bestellung");
      }

      // Remove order from list
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Löschen");
    }
  };

  // Update order status
  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Aktualisieren des Status");
      }

      const data = await response.json();

      // Update order in list
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: data.order.status } : o))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Aktualisieren");
    }
  };

  // Filter orders by search query
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order.id.toString().includes(query) ||
      order.user.name.toLowerCase().includes(query) ||
      order.user.email.toLowerCase().includes(query) ||
      `${order.shippingFirstName} ${order.shippingLastName}`.toLowerCase().includes(query)
    );
  });

  // Format date
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Lädt Bestellungen...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bestellungen Verwaltung</h1>
          <p className="text-gray-600 mt-1">
            {filteredOrders.length} von {orders.length} Bestellungen
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Suche & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Bestellungen durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status filtern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="pending">Ausstehend</SelectItem>
                <SelectItem value="processing">In Bearbeitung</SelectItem>
                <SelectItem value="shipped">Versendet</SelectItem>
                <SelectItem value="delivered">Geliefert</SelectItem>
                <SelectItem value="cancelled">Storniert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Kunde</TableHead>
                <TableHead>Artikel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Zahlung</TableHead>
                <TableHead>Gesamt</TableHead>
                <TableHead>Erstellt am</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {searchQuery
                      ? "Keine Bestellungen gefunden"
                      : "Noch keine Bestellungen vorhanden"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell
                      className="font-medium cursor-pointer"
                      onClick={() => router.push(`/admin/order/${order.id}`)}
                    >
                      #{order.id}
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      onClick={() => router.push(`/admin/order/${order.id}`)}
                    >
                      <div className="font-medium">{order.user.name}</div>
                      <div className="text-sm text-gray-500">{order.user.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>{order.orderItems.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusUpdate(order.id, value)}
                      >
                        <SelectTrigger className="w-[140px] h-8">
                          <Badge variant={statusColors[order.status] || "secondary"}>
                            {statusLabels[order.status] || order.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Ausstehend</SelectItem>
                          <SelectItem value="processing">In Bearbeitung</SelectItem>
                          <SelectItem value="shipped">Versendet</SelectItem>
                          <SelectItem value="delivered">Geliefert</SelectItem>
                          <SelectItem value="cancelled">Storniert</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.paymentStatus === "paid"
                            ? "default"
                            : order.paymentStatus === "failed"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {paymentStatusLabels[order.paymentStatus] || order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild className="cursor-pointer">
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => router.push(`/admin/order/${order.id}`)}
                            className="cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Details anzeigen
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 cursor-pointer"
                            onSelect={(e) => {
                              e.preventDefault();
                              handleDelete(order.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {deleteConfirm === order.id ? "Wirklich?" : "Löschen"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
