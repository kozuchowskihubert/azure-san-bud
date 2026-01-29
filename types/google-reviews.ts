/**
 * Google Places API Review Types
 */

export interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: GoogleReview[];
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
}

export interface GooglePlacesResponse {
  result: GooglePlaceDetails;
  status: string;
}

export interface ReviewCardProps {
  review: GoogleReview;
  className?: string;
}

export interface ReviewsSectionProps {
  maxReviews?: number;
  className?: string;
}
