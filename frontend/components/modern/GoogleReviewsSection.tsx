'use client';

import { useEffect, useState } from 'react';
import { Star, User, ExternalLink, Loader2 } from 'lucide-react';
import { GoogleReview } from '@/types/google-reviews';

interface ReviewCardProps {
  review: GoogleReview;
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-xl dark:bg-gray-800">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {review.profile_photo_url ? (
            <img
              src={review.profile_photo_url}
              alt={review.author_name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <User className="h-6 w-6" />
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {review.author_name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {review.relative_time_description}
            </p>
          </div>
        </div>
        {review.author_url && (
          <a
            href={review.author_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        )}
      </div>

      {/* Rating */}
      <div className="mb-3 flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < review.rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="ml-2 font-semibold text-gray-700 dark:text-gray-300">
          {review.rating.toFixed(1)}
        </span>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {review.text}
      </p>

      {/* Decorative element */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-600/10 transition-transform group-hover:scale-110" />
    </div>
  );
}

interface ReviewsSectionProps {
  maxReviews?: number;
  className?: string;
}

export default function GoogleReviewsSection({ 
  maxReviews = 6,
  className = '' 
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [businessInfo, setBusinessInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
        const response = await fetch(`${apiUrl}/api/google/reviews`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        
        if (data.business) {
          setBusinessInfo(data.business);
        }
        
        if (data.reviews && Array.isArray(data.reviews)) {
          // Sort by rating and recency, limit to maxReviews
          const sortedReviews = data.reviews
            .sort((a: GoogleReview, b: GoogleReview) => {
              if (b.rating !== a.rating) return b.rating - a.rating;
              return b.time - a.time;
            })
            .slice(0, maxReviews);
          
          setReviews(sortedReviews);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Nie udało się załadować opinii');
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [maxReviews]);

  if (loading) {
    return (
      <section className={`py-20 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Ładowanie opinii...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || reviews.length === 0) {
    return null; // Gracefully hide if no reviews
  }

  return (
    <section className={`py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            Opinie Naszych Klientów
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Zobacz co mówią o nas zadowoleni klienci w Google
          </p>
          
          {/* Overall Rating */}
          {businessInfo && (
            <div className="mt-8 inline-flex flex-col items-center gap-2 rounded-2xl bg-white px-8 py-4 shadow-lg dark:bg-gray-800">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.floor(businessInfo.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <div className="text-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {businessInfo.rating?.toFixed(1)}
                </span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  / 5.0
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Na podstawie {businessInfo.total_ratings} opinii w Google
              </p>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://www.google.com/search?q=sanbud+plonsk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
          >
            Zobacz wszystkie opinie w Google
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
