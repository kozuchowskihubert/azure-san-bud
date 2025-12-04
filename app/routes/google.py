"""
Google Places API Integration
Fetch business reviews and details from Google
"""
import os
import requests
from flask import Blueprint, jsonify
from datetime import datetime, timedelta

google_bp = Blueprint('google', __name__, url_prefix='/api/google')

GOOGLE_PLACES_API_KEY = os.environ.get('GOOGLE_PLACES_API_KEY', '')
GOOGLE_PLACE_ID = os.environ.get('GOOGLE_PLACE_ID', 'ChIJ_____your_place_id_here')

# Cache settings
CACHE_DURATION_HOURS = 6
_cache = {
    'data': None,
    'timestamp': None
}


@google_bp.route('/reviews', methods=['GET'])
def get_reviews():
    """
    Fetch Google Business reviews
    Returns cached data if available and fresh
    """
    global _cache
    
    # Check cache
    if _cache['data'] and _cache['timestamp']:
        cache_age = datetime.now() - _cache['timestamp']
        if cache_age < timedelta(hours=CACHE_DURATION_HOURS):
            return jsonify(_cache['data']), 200
    
    # Fetch fresh data
    if not GOOGLE_PLACES_API_KEY:
        return jsonify({
            'error': 'Google Places API key not configured',
            'reviews': [],
            'cached': False
        }), 200  # Return empty array instead of error for graceful degradation
    
    try:
        url = 'https://maps.googleapis.com/maps/api/place/details/json'
        params = {
            'place_id': GOOGLE_PLACE_ID,
            'fields': 'name,rating,user_ratings_total,reviews,formatted_address,formatted_phone_number,website',
            'language': 'pl',
            'key': GOOGLE_PLACES_API_KEY
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        if data.get('status') != 'OK':
            return jsonify({
                'error': f"Google API error: {data.get('status')}",
                'reviews': [],
                'cached': False
            }), 200
        
        result = data.get('result', {})
        reviews = result.get('reviews', [])
        
        # Format response
        formatted_data = {
            'business': {
                'name': result.get('name'),
                'rating': result.get('rating'),
                'total_ratings': result.get('user_ratings_total'),
                'address': result.get('formatted_address'),
                'phone': result.get('formatted_phone_number'),
                'website': result.get('website')
            },
            'reviews': [
                {
                    'author_name': review.get('author_name'),
                    'author_url': review.get('author_url'),
                    'profile_photo_url': review.get('profile_photo_url'),
                    'rating': review.get('rating'),
                    'text': review.get('text'),
                    'time': review.get('time'),
                    'relative_time': review.get('relative_time_description'),
                    'language': review.get('language')
                }
                for review in reviews
            ],
            'cached': False,
            'timestamp': datetime.now().isoformat()
        }
        
        # Update cache
        _cache['data'] = formatted_data
        _cache['timestamp'] = datetime.now()
        
        return jsonify(formatted_data), 200
        
    except requests.RequestException as e:
        return jsonify({
            'error': f'Failed to fetch reviews: {str(e)}',
            'reviews': [],
            'cached': False
        }), 200  # Graceful degradation
    except Exception as e:
        return jsonify({
            'error': f'Internal error: {str(e)}',
            'reviews': [],
            'cached': False
        }), 500


@google_bp.route('/business', methods=['GET'])
def get_business_info():
    """Get basic business information from Google"""
    try:
        reviews_data = get_reviews()
        data = reviews_data.get_json()
        
        if 'business' in data:
            return jsonify(data['business']), 200
        else:
            return jsonify({'error': 'Business info not available'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
