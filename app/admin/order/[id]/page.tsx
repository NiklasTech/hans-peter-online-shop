"use client";

/**
 * Admin Order Detail Page
 * Route: /admin/order/[id]
 *
 * Displays detailed information about a single order
 */

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  Save,
  Trash2,
} from "lucide-react";

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
  shippingHouseNumber: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountryCode: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingPhone: string | null;
  paymentMethod: string;
  shippingMethod: string | null;
  shippingCost: number;
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

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const orderId = parseInt(id);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/orders?id=${orderId}`);
      if (!response.ok) {
        throw new Error("Fehler beim Laden der Bestellung");
      }
      const data = await response.json();
      setOrder(data.order);

      // Set form state
      setStatus(data.order.status);
      setPaymentStatus(data.order.paymentStatus);
      setTrackingNumber(data.order.trackingNumber || "");
      setShippingMethod(data.order.shippingMethod || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderId,
          status,
          paymentStatus,
          trackingNumber: trackingNumber || null,
          shippingMethod: shippingMethod || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Speichern der Bestellung");
      }

      const data = await response.json();
      setOrder(data.order);
      alert("Bestellung erfolgreich aktualisiert");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Speichern");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Möchten Sie diese Bestellung wirklich löschen?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Fehler beim Löschen der Bestellung");
      }

      router.push("/admin/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Löschen");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Lädt Bestellung...</div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-500">Bestellung nicht gefunden</div>
      </div>
    );
  }

  const subtotal = order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/orders")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Bestellung #{order.id}</h1>
            <p className="text-gray-600 mt-1">
              Erstellt am {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Speichert..." : "Speichern"}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Löschen
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Bestellte Artikel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    {item.product?.previewImage && (
                      <img
                        src={item.product.previewImage}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {item.product?.name || "Produkt gelöscht"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Menge: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Zwischensumme</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Versandkosten</span>
                  <span>{formatCurrency(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Gesamt</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Lieferadresse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">
                  {order.shippingFirstName} {order.shippingLastName}
                </p>
                <p className="text-gray-600">
                  {order.shippingStreet} {order.shippingHouseNumber}
                </p>
                <p className="text-gray-600">
                  {order.shippingPostalCode} {order.shippingCity}
                </p>
                <p className="text-gray-600">{order.shippingCountryCode}</p>
                {order.shippingPhone && (
                  <p className="text-gray-600">Tel: {order.shippingPhone}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Kunde
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="font-medium">{order.user.name}</p>
                <p className="text-sm text-gray-600">{order.user.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push(`/admin/user/${order.user.id}`)}
              >
                Kundenprofil anzeigen
              </Button>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Bestellstatus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Ausstehend</SelectItem>
                    <SelectItem value="processing">In Bearbeitung</SelectItem>
                    <SelectItem value="shipped">Versendet</SelectItem>
                    <SelectItem value="delivered">Geliefert</SelectItem>
                    <SelectItem value="cancelled">Storniert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Zahlungsstatus</Label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Ausstehend</SelectItem>
                    <SelectItem value="paid">Bezahlt</SelectItem>
                    <SelectItem value="failed">Fehlgeschlagen</SelectItem>
                    <SelectItem value="refunded">Erstattet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Payment & Shipping */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Zahlung & Versand
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-gray-600">Zahlungsmethode</Label>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>

              <div className="space-y-2">
                <Label>Versandmethode</Label>
                <Input
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  placeholder="z.B. DHL Standard"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Tracking-Nummer
                </Label>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Tracking-Nummer eingeben"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
