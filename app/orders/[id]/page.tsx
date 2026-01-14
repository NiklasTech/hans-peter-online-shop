"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  MapPin,
  CreditCard,
  Mail,
  User as UserIcon,
  Phone,
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
    price: number;
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
  user: {
    name: string;
    email: string;
  };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; description: string }> = {
  pending: {
    label: "Ausstehend",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
    description: "Deine Bestellung wird gerade bearbeitet",
  },
  processing: {
    label: "In Bearbeitung",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Package,
    description: "Deine Bestellung wird für den Versand vorbereitet",
  },
  shipped: {
    label: "Versendet",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Truck,
    description: "Deine Bestellung ist unterwegs zu dir",
  },
  delivered: {
    label: "Zugestellt",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
    description: "Deine Bestellung wurde erfolgreich zugestellt",
  },
  cancelled: {
    label: "Storniert",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    description: "Diese Bestellung wurde storniert",
  },
};

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "Ausstehend", color: "bg-yellow-100 text-yellow-800" },
  paid: { label: "Bezahlt", color: "bg-green-100 text-green-800" },
  failed: { label: "Fehlgeschlagen", color: "bg-red-100 text-red-800" },
  refunded: { label: "Erstattet", color: "bg-gray-100 text-gray-800" },
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/orders/${orderId}`);

      if (response.status === 401) {
        router.push("/?login=true");
        return;
      }

      if (response.status === 404) {
        setError("Bestellung nicht gefunden");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Bestellung konnte nicht geladen werden. Bitte versuche es später erneut.");
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
      hour: "2-digit",
      minute: "2-digit",
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
            <p className="mt-4 text-gray-600">Lade Bestelldetails...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error || "Bestellung konnte nicht geladen werden"}</p>
              <Button onClick={() => router.push("/orders")}>Zurück zu Bestellungen</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;
  const paymentConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus] || PAYMENT_STATUS_CONFIG.pending;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/orders")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zu Bestellungen
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Bestellung #{order.id}</h1>
              <p className="text-gray-600">Bestellt am {formatDate(order.createdAt)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={statusConfig.color}>
                <StatusIcon className="h-4 w-4 mr-1" />
                {statusConfig.label}
              </Badge>
              <Badge variant="outline" className={paymentConfig.color}>
                {paymentConfig.label}
              </Badge>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${statusConfig.color}`}>
                <StatusIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">{statusConfig.label}</p>
                <p className="text-sm text-gray-600">{statusConfig.description}</p>
              </div>
            </div>
            {order.trackingNumber && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Sendungsverfolgung</p>
                {getTrackingUrl(order.trackingNumber, order.shippingMethod) ? (
                  <a
                    href={getTrackingUrl(order.trackingNumber, order.shippingMethod)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-2"
                  >
                    {order.trackingNumber}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <p className="font-mono font-semibold text-blue-600">{order.trackingNumber}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Bestellte Artikel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                      <div className="relative h-20 w-20 flex-shrink-0 bg-gray-50 rounded border">
                        {item.product.previewImage ? (
                          <Image
                            src={item.product.previewImage}
                            alt={item.product.name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-10 w-10 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium mb-1">{item.product.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{item.product.brand.name}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">Menge: {item.quantity}</span>
                          <span className="text-gray-600">×</span>
                          <span className="font-semibold">{formatPrice(item.price)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {formatPrice(item.quantity * item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Zusammenfassung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Zwischensumme</span>
                  <span className="font-semibold">
                    {formatPrice(Number(order.total) - Number(order.shippingCost))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Versandkosten</span>
                  <span className="font-semibold">{formatPrice(Number(order.shippingCost))}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold">Gesamtsumme</span>
                  <span className="font-bold text-lg">{formatPrice(Number(order.total))}</span>
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
              <CardContent className="text-sm space-y-1">
                <p className="font-medium">{order.shippingFirstName} {order.shippingLastName}</p>
                <p>{order.shippingStreet} {order.shippingHouseNumber}</p>
                <p>{order.shippingPostalCode} {order.shippingCity}</p>
                <p>{order.shippingCountryCode}</p>
                {order.shippingPhone && (
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{order.shippingPhone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Zahlungsinformationen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Zahlungsmethode</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge variant="outline" className={paymentConfig.color}>
                    {paymentConfig.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            {order.shippingMethod && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Versandinformationen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Versandart</span>
                    <span className="font-medium">{order.shippingMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Versandkosten</span>
                    <span className="font-medium">{formatPrice(Number(order.shippingCost))}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Kontaktdaten
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  <span>{order.user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-blue-600">{order.user.email}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        {order.status === "delivered" && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Wie war deine Erfahrung?</h3>
                  <p className="text-sm text-gray-600">
                    Teile deine Meinung zu den bestellten Produkten
                  </p>
                </div>
                <Button onClick={() => router.push(`/orders/${order.id}/review`)}>
                  Produkte bewerten
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
