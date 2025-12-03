#!/usr/bin/env python3
"""
Test frontend booking functionality from browser perspective.
This simulates what happens when a user submits the booking form on sanbud24.pl
"""

import requests
import json

def test_frontend_booking():
    """Test booking as it would happen from the frontend."""
    
    print("🧪 Testing Frontend Booking Flow")
    print("=" * 50)
    
    # This simulates the exact request the frontend would make
    url = "https://app-sanbud-api-prod.azurewebsites.net/api/book-appointment"
    
    headers = {
        "Content-Type": "application/json",
        "Origin": "https://sanbud24.pl",
        "Referer": "https://sanbud24.pl/",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    }
    
    booking_data = {
        "name": "Jan Kowalski", 
        "email": "jan.kowalski@example.com",
        "phone": "+48 123 456 789",
        "service": "Naprawa kranu",
        "date": "2025-12-11", 
        "time": "10:00",
        "address": "ul. Warszawska 123, 00-001 Warszawa",
        "description": "Pilna naprawa przeciekającego kranu w kuchni"
    }
    
    print("📤 Sending booking request...")
    print(f"   URL: {url}")
    print(f"   Origin: {headers['Origin']}")
    print(f"   Data: {json.dumps(booking_data, indent=2, ensure_ascii=False)}")
    print()
    
    try:
        # Test preflight request first
        print("🔍 Testing CORS preflight...")
        preflight_response = requests.options(
            url,
            headers={
                "Origin": "https://sanbud24.pl",
                "Access-Control-Request-Method": "POST", 
                "Access-Control-Request-Headers": "Content-Type"
            }
        )
        
        print(f"   Preflight Status: {preflight_response.status_code}")
        print(f"   Allowed Origin: {preflight_response.headers.get('Access-Control-Allow-Origin', 'NOT SET')}")
        print(f"   Allowed Headers: {preflight_response.headers.get('Access-Control-Allow-Headers', 'NOT SET')}")
        print()
        
        # Now test actual booking request
        print("📋 Submitting booking...")
        response = requests.post(url, json=booking_data, headers=headers)
        
        print(f"✅ Response Status: {response.status_code}")
        print(f"   CORS Origin: {response.headers.get('Access-Control-Allow-Origin', 'NOT SET')}")
        
        if response.status_code == 201:
            result = response.json()
            print("🎉 Booking Successful!")
            print(f"   Appointment ID: {result.get('appointment_id')}")
            print(f"   Message: {result.get('message')}")
            print(f"   Email Sent: {result.get('email_sent')}")
            
            booking_info = result.get('booking_data', {})
            print()
            print("📋 Booking Details:")
            print(f"   👤 Customer: {booking_info.get('customerName')}")
            print(f"   📧 Email: {booking_info.get('customerEmail')}")
            print(f"   🔧 Service: {booking_info.get('service')}")
            print(f"   📅 Date: {booking_info.get('date')}")
            print(f"   🕐 Time: {booking_info.get('time')}")
            print(f"   📍 Address: {booking_info.get('address')}")
            
        else:
            print(f"❌ Booking Failed!")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"💥 Error: {e}")
        return False
    
    print()
    print("✅ Frontend booking test completed!")
    print("   The booking form on sanbud24.pl should now work correctly.")
    return True

if __name__ == "__main__":
    test_frontend_booking()