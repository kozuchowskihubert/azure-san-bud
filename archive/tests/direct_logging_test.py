#!/usr/bin/env python3
"""
Direct test of the logging system
"""

import sys
import os
sys.path.append('/Users/haos/azure-san-bud')

from config.email import log_email_to_file

print("🧪 Direct Logging System Test")
print("=" * 50)

# Test logging contact form
print("📧 Testing contact form logging...")
contact_success = log_email_to_file(
    email_type='contact_form',
    recipient='hubertkozuchowski@gmail.com',
    subject='Test Contact Form - SanBud',
    content='<h1>Test HTML Email Content</h1><p>This is a test contact form submission.</p>',
    data={
        'name': 'Hubert Kozuchowski',
        'email': 'hubertkozuchowski@gmail.com',
        'phone': '+48 123 456 789',
        'message': 'Test message from contact form'
    }
)

print(f"Contact logging result: {'✅ SUCCESS' if contact_success else '❌ FAILED'}")

# Test logging booking confirmation
print("\n📅 Testing booking confirmation logging...")
booking_success = log_email_to_file(
    email_type='booking_confirmation',
    recipient='admin@sanbud.pl',
    subject='Test Booking Confirmation - SanBud',
    content='<h1>Test Booking Email</h1><p>This is a test booking confirmation.</p>',
    data={
        'name': 'Hubert Kozuchowski',
        'email': 'hubertkozuchowski@gmail.com',
        'date': '04.12.2025',
        'time': '10:00',
        'service': 'Naprawa pieca'
    }
)

print(f"Booking logging result: {'✅ SUCCESS' if booking_success else '❌ FAILED'}")

print("\n" + "=" * 50)
if contact_success and booking_success:
    print("🎉 SUCCESS! Logging system works perfectly!")
    print("📁 Check the 'logs/' folder for notification files")
else:
    print("❌ FAILED! Check the error messages above")
print("=" * 50)