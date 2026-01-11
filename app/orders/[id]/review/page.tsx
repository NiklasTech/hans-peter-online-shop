"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Star, Package } from "lucide-react";
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
  orderItems: OrderItem[];
}

interface ProductReview {
  productId: number;
  rating: number;
  title: string;
  comment: string;
}

export default function OrderReviewPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Map<number, ProductReview>>(new Map());

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
      const fetchedOrder = data.order;

      if (fetchedOrder.status !== "delivered") {
        setError("Bewertungen können nur für zugestellte Bestellungen abgegeben werden");
        return;
      }

      setOrder(fetchedOrder);

      // Initialisiere Reviews für alle Produkte
      const initialReviews = new Map<number, ProductReview>();
      fetchedOrder.orderItems.forEach((item: OrderItem) => {
        initialReviews.set(item.product.id, {
          productId: item.product.id,
          rating: 5,
          title: "",
          comment: "",
        });
      });
      setReviews(initialReviews);
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Bestellung konnte nicht geladen werden. Bitte versuche es später erneut.");
    } finally {
      setLoading(false);
    }
  };

  const updateReview = (productId: number, field: keyof ProductReview, value: string | number) => {
    setReviews((prev) => {
      const updated = new Map(prev);
      const review = updated.get(productId);
      if (review) {
        updated.set(productId, { ...review, [field]: value });
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order) return;

    try {
      setSubmitting(true);

      // Filtere nur Bewertungen mit Kommentar oder Titel (oder alle wenn du willst)
      const reviewsArray = Array.from(reviews.values());

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          reviews: reviewsArray,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Fehler beim Speichern der Bewertungen");
      }

      // Erfolg - zurück zur Bestellung
      router.push(`/orders/${order.id}?reviewed=true`);
    } catch (err) {
      console.error("Error submitting reviews:", err);
      alert(err instanceof Error ? err.message : "Fehler beim Speichern der Bewertungen");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (productId: number, currentRating: number) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => updateReview(productId, "rating", star)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              className={`h-8 w-8 ${
                star <= currentRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Lade Bestellung...</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push(`/orders/${order.id}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zur Bestellung
          </Button>
          <h1 className="text-3xl font-bold mb-2">Produkte bewerten</h1>
          <p className="text-gray-600">
            Teile deine Erfahrung mit den Produkten aus Bestellung #{order.id}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {order.orderItems.map((item) => {
              const review = reviews.get(item.product.id);
              if (!review) return null;

              return (
                <Card key={item.product.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 bg-gray-50 rounded border">
                        {item.product.previewImage ? (
                          <Image
                            src={item.product.previewImage}
                            alt={item.product.name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{item.product.name}</h3>
                        <p className="text-sm text-gray-600 font-normal">
                          {item.product.brand.name}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Rating */}
                    <div>
                      <Label className="text-base mb-2 block">Bewertung *</Label>
                      {renderStars(item.product.id, review.rating)}
                    </div>

                    {/* Title */}
                    <div>
                      <Label htmlFor={`title-${item.product.id}`} className="text-base mb-2 block">
                        Überschrift (optional)
                      </Label>
                      <Input
                        id={`title-${item.product.id}`}
                        placeholder="z.B. Großartiges Produkt!"
                        value={review.title}
                        onChange={(e) =>
                          updateReview(item.product.id, "title", e.target.value)
                        }
                        maxLength={100}
                      />
                    </div>

                    {/* Comment */}
                    <div>
                      <Label htmlFor={`comment-${item.product.id}`} className="text-base mb-2 block">
                        Deine Bewertung (optional)
                      </Label>
                      <Textarea
                        id={`comment-${item.product.id}`}
                        placeholder="Was hat dir gefallen oder nicht gefallen?"
                        value={review.comment}
                        onChange={(e) =>
                          updateReview(item.product.id, "comment", e.target.value)
                        }
                        rows={4}
                        maxLength={1000}
                        className="resize-none"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {review.comment.length} / 1000 Zeichen
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/orders/${order.id}`)}
              disabled={submitting}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? "Speichere..." : "Bewertungen absenden"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
