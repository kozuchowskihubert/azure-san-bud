/**
 * Google Places API Utilities
 * Fetch real business reviews and details
 */

import { GooglePlacesResponse, GoogleReview } from '@/types/google-reviews';

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '';
const GOOGLE_PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || '';

/**
 * Fetch place details including reviews from Google Places API
 */
export async function fetchGooglePlaceDetails(): Promise<GooglePlacesResponse | null> {
  if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) {
    console.warn('Google Places API key or Place ID not configured');
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${GOOGLE_PLACE_ID}&` +
      `fields=name,rating,user_ratings_total,reviews,formatted_address,formatted_phone_number,website,opening_hours&` +
      `language=pl&` +
      `key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data: GooglePlacesResponse = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API returned status: ${data.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching Google Place details:', error);
    return null;
  }
}

/**
 * Fetch only reviews from Google Places
 */
export async function fetchGoogleReviews(limit?: number): Promise<GoogleReview[]> {
  const data = await fetchGooglePlaceDetails();
  
  if (!data || !data.result || !data.result.reviews) {
    return [];
  }

  const reviews = data.result.reviews;
  
  // Sort by rating (highest first) and recency
  const sortedReviews = reviews.sort((a, b) => {
    // First by rating
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    // Then by time (most recent first)
    return b.time - a.time;
  });

  return limit ? sortedReviews.slice(0, limit) : sortedReviews;
}

/**
 * Format time ago string in Polish
 */
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - (timestamp * 1000); // Convert to milliseconds
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return years === 1 ? 'rok temu' : `${years} lata temu`;
  }
  if (months > 0) {
    return months === 1 ? 'miesiąc temu' : `${months} miesięcy temu`;
  }
  if (days > 0) {
    return days === 1 ? 'dzień temu' : `${days} dni temu`;
  }
  if (hours > 0) {
    return hours === 1 ? 'godzinę temu' : `${hours} godzin temu`;
  }
  if (minutes > 0) {
    return minutes === 1 ? 'minutę temu' : `${minutes} minut temu`;
  }
  return 'przed chwilą';
}

/**
 * Render star rating as emoji or component
 */
export function renderStars(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return '⭐'.repeat(fullStars) + (hasHalfStar ? '½' : '');
}

/**
 * Get rating color based on score
 */
export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 4.0) return 'text-green-500';
  if (rating >= 3.5) return 'text-yellow-500';
  if (rating >= 3.0) return 'text-orange-500';
  return 'text-red-500';
}
