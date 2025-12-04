"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
}

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export default function ReviewsSection({
  reviews,
  averageRating,
  totalReviews,
}: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmitReview = () => {
    console.log("Review submitted:", { rating, reviewText });
    setReviewText("");
    setRating(5);
    setShowForm(false);
  };

  // Rating distribution
  const ratingDistribution = [
    { stars: 5, percentage: 60 },
    { stars: 4, percentage: 25 },
    { stars: 3, percentage: 10 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Kundenbewertungen ({totalReviews})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-gray-500 dark:text-gray-400">/ 5</span>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-xl">
                    {i < Math.floor(averageRating) ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Basierend auf {totalReviews}{" "}
                {totalReviews === 1 ? "Bewertung" : "Bewertungen"}
              </p>
            </div>

            {/* Rating Bars */}
            <div className="space-y-3">
              {ratingDistribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-12 text-gray-600 dark:text-gray-400">
                    {dist.stars} ★
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${dist.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
                    {dist.percentage}%
                  </span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setShowForm(!showForm)}
              className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900"
            >
              Bewertung schreiben
            </Button>
          </div>

          {/* Review Form */}
          {showForm && (
            <div className="md:col-span-2 bg-gray-50 dark:bg-slate-800 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Deine Bewertung
              </h3>

              {/* Star Rating Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bewertung
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-3xl transition-colors"
                    >
                      {star <= rating ? (
                        <span className="text-yellow-400">★</span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">
                          ☆
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Deine Bewertung
                </label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Teile deine Erfahrung mit diesem Produkt..."
                  className="min-h-32 dark:bg-slate-700 dark:text-white dark:border-slate-600"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => setShowForm(false)}
                  variant="outline"
                >
                  Abbrechen
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={!reviewText.trim()}
                  className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900"
                >
                  Bewertung absenden
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Alle Bewertungen
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Noch keine Bewertungen. Sei der Erste!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {review.author.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {review.author}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {review.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < review.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {review.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {review.content}
                  </p>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400 pt-2">
                  Hilfreich: {review.helpful}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
