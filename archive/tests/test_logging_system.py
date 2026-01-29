#!/usr/bin/env python3
"""
Test the improved email system with logging
"""

import os
import sys
sys.path.append('/Users/haos/azure-san-bud')

from flask import Flask
from config.email import init_email, send_contact_email, send_booking_confirmation

# Create test Flask app
app = Flask(__name__)

# Remove SMTP_PASS to test fallback logging
os.environ.pop('SMTP_PASS', None)

with app.app_context():
    # Initialize email system
    init_email(app)
    
    print("🚀 Testing SanBud Email System with Logging Fallback")
    print("=" * 60)
    
    # Test 1: Contact form
    print("\n1️⃣ Testing contact form notification...")
    contact_success = send_contact_email(
        name="Hubert Kozuchowski",
        email="hubertkozuchowski@gmail.com",
        phone="+48 123 456 789",
        message="Test wiadomości z formularza kontaktowego. Potrzebuję naprawy pieca gazowego - urządzenie przestało działać wczoraj wieczorem."
    )
    
    print(f"Contact form result: {'✅ SUCCESS' if contact_success else '❌ FAILED'}")
    
    # Test 2: Booking confirmation
    print("\n2️⃣ Testing booking confirmation...")
    booking_data = {
        'id': 123,
        'name': 'Hubert Kozuchowski',
        'email': 'hubertkozuchowski@gmail.com',
        'phone': '+48 123 456 789',
        'date': '04.12.2025',
        'time': '10:00',
        'address': 'ul. Przykładowa 123, 00-001 Warszawa',
        'service': 'Naprawa pieca gazowego',
        'description': 'Piec przestał grzać wczoraj wieczorem. Potrzebna pilna naprawa przed świętami.'
    }
    
    booking_success = send_booking_confirmation(booking_data)
    print(f"Booking confirmation result: {'✅ SUCCESS' if booking_success else '❌ FAILED'}")
    
    print("\n" + "=" * 60)
    if contact_success and booking_success:
        print("🎉 SUCCESS! Email system działa poprawnie!")
        print("📁 Sprawdź folder 'logs' aby zobaczyć zapisane powiadomienia")
        print("📧 Po skonfigurowaniu SMTP, emaile będą wysyłane automatycznie")
        print("\n📋 Następne kroki:")
        print("   1. Sprawdź pliki w folderze logs/")
        print("   2. Zarejestruj się na resend.com dla prawdziwego API key")
        print("   3. Zaktualizuj SMTP_PASS w .env")
        print("   4. Zintegruj z formularzami na stronie")
    else:
        print("❌ FAILED! Sprawdź konfigurację systemu")
    print("=" * 60)