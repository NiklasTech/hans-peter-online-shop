"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  ArrowLeft,
  ShoppingBag
} from "lucide-react";
import Image from "next/image";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    previewImage: string | null;
    brand: {
      name: string;
    };
  };
}

interface Order {
  id: number;
  status: string;
  total: number;
  paymentStatus: string;
  paymentMethod: string;
  shippingMethod: string | null;
  shippingCost: number;
  trackingNumber: string | null;
  createdAt: string;
  updatedAt: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingStreet: string;
  shippingHouseNumber: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountryCode: string;
  shippingPhone: string | null;
  orderItems: OrderItem[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: {
    label: "Ausstehend",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  processing: {
    label: "In Bearbeitung",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Package,
  },
  shipped: {
    label: "Versendet",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Truck,
  },
  delivered: {
    label: "Zugestellt",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Storniert",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
};

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "Ausstehend", color: "bg-yellow-100 text-yellow-800" },
  paid: { label: "Bezahlt", color: "bg-green-100 text-green-800" },
  failed: { label: "Fehlgeschlagen", color: "bg-red-100 text-red-800" },
  refunded: { label: "Erstattet", color: "bg-gray-100 text-gray-800" },
};

export default function OrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/orders");

      if (response.status === 401) {
        router.push("/?login=true");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      console.log('Orders data:', data.orders);
      if (data.orders && data.orders.length > 0) {
        console.log('First order:', data.orders[0]);
      }
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Bestellungen konnten nicht geladen werden. Bitte versuche es später erneut.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getTrackingUrl = (trackingNumber: string, shippingMethod: string | null): string | null => {
    if (!trackingNumber || !shippingMethod) return null;

    const method = shippingMethod.toLowerCase();

    if (method.includes('dhl')) {
      return `https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${trackingNumber}`;
    } else if (method.includes('dpd')) {
      return `https://tracking.dpd.de/parcelstatus?query=${trackingNumber}&locale=de_DE`;
    } else if (method.includes('hermes')) {
      return `https://www.myhermes.de/empfangen/sendungsverfolgung/sendungsinformation#${trackingNumber}`;
    } else if (method.includes('ups')) {
      return `https://www.ups.com/track?loc=de_DE&tracknum=${trackingNumber}`;
    }

    return null;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Lade deine Bestellungen...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchOrders}>Erneut versuchen</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/account")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zum Konto
          </Button>
          <h1 className="text-3xl font-bold mb-2">Meine Bestellungen</h1>
          <p className="text-gray-600">
            Übersicht über alle deine Bestellungen und deren Status
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Noch keine Bestellungen</h3>
                <p className="text-gray-600 mb-6">
                  Du hast noch keine Bestellung aufgegeben.
                </p>
                <Button onClick={() => router.push("/products")}>
                  Jetzt shoppen
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;
              const paymentConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus] || PAYMENT_STATUS_CONFIG.pending;

              return (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg mb-2">
                          Bestellung #{order.id}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          Bestellt am {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={statusConfig.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                        <Badge variant="outline" className={paymentConfig.color}>
                          {paymentConfig.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="relative h-16 w-16 flex-shrink-0 bg-white rounded border">
                            {item.product.previewImage ? (
                              <Image
                                src={item.product.previewImage}
                                alt={item.product.name}
                                fill
                                className="object-contain p-1"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-8 w-8 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {item.product.brand.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Menge: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {formatPrice(item.quantity * item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Shipping Address */}
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Lieferadresse</h4>
                          <div className="text-sm text-gray-600">
                            <p>{order.shippingFirstName || 'N/A'} {order.shippingLastName || 'N/A'}</p>
                            <p>{order.shippingStreet || 'N/A'} {order.shippingHouseNumber || 'N/A'}</p>
                            <p>{order.shippingPostalCode || 'N/A'} {order.shippingCity || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Payment & Shipping Info */}
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Zahlungs- & Versandinfo</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Zahlungsmethode: {order.paymentMethod || 'Nicht angegeben'}</p>
                            {order.shippingMethod && (
                              <p>Versandart: {order.shippingMethod}</p>
                            )}
                            {order.trackingNumber && (
                              <>
                                {getTrackingUrl(order.trackingNumber, order.shippingMethod) ? (
                                  <p className="font-medium">
                                    <a
                                      href={getTrackingUrl(order.trackingNumber, order.shippingMethod)!}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                      Tracking: {order.trackingNumber}
                                    </a>
                                  </p>
                                ) : (
                                  <p className="font-medium text-blue-600">
                                    Tracking: {order.trackingNumber}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            Zwischensumme: {formatPrice(Number(order.total) - Number(order.shippingCost))}
                          </p>
                          <p className="text-sm text-gray-600">
                            Versandkosten: {formatPrice(Number(order.shippingCost))}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Gesamtsumme</p>
                          <p className="text-2xl font-bold">{formatPrice(Number(order.total))}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push(`/orders/${order.id}`)}
                      >
                        Details anzeigen
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                      {order.status === "delivered" && (
                        <Button
                          variant="default"
                          onClick={() => router.push(`/orders/${order.id}/review`)}
                        >
                          Bewerten
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
