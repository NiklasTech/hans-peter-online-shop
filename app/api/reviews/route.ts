import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

interface ReviewInput {
  productId: number;
  rating: number;
  title?: string;
  comment?: string;
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();

    if (!session) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
    }

    const userId = session.userId;

    const body = await request.json();
    const { orderId, reviews } = body as {
      orderId: number;
      reviews: ReviewInput[];
    };

    if (!orderId || !reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json(
        { error: "Ungültige Anfrage - orderId und reviews erforderlich" },
        { status: 400 }
      );
    }

    // Prüfen, ob die Bestellung existiert und dem User gehört
    const order = await db.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Bestellung nicht gefunden" },
        { status: 404 }
      );
    }

    // Prüfen, ob die Bestellung zugestellt wurde
    if (order.status !== "delivered") {
      return NextResponse.json(
        { error: "Bewertungen können nur für zugestellte Bestellungen abgegeben werden" },
        { status: 400 }
      );
    }

    // Prüfen, ob alle zu bewertenden Produkte in der Bestellung enthalten sind
    const orderProductIds = order.orderItems.map((item) => item.productId);
    const invalidProducts = reviews.filter(
      (review) => !orderProductIds.includes(review.productId)
    );

    if (invalidProducts.length > 0) {
      return NextResponse.json(
        { error: "Einige Produkte sind nicht in dieser Bestellung enthalten" },
        { status: 400 }
      );
    }

    // Validierung der Bewertungen
    for (const review of reviews) {
      if (review.rating < 1 || review.rating > 5) {
        return NextResponse.json(
          { error: "Bewertung muss zwischen 1 und 5 liegen" },
          { status: 400 }
        );
      }
    }

    // Bewertungen speichern oder aktualisieren
    const createdReviews = await Promise.all(
      reviews.map((review) =>
        db.review.upsert({
          where: {
            userId_productId: {
              userId: userId,
              productId: review.productId,
            },
          },
          update: {
            rating: review.rating,
            title: review.title || null,
            comment: review.comment || null,
            updatedAt: new Date(),
          },
          create: {
            userId: userId,
            productId: review.productId,
            rating: review.rating,
            title: review.title || null,
            comment: review.comment || null,
          },
        })
      )
    );

    return NextResponse.json({
      message: "Bewertungen erfolgreich gespeichert",
      reviews: createdReviews,
    });
  } catch (error) {
    console.error("Error saving reviews:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern der Bewertungen" },
      { status: 500 }
    );
  }
}
