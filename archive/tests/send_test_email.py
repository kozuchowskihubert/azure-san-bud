#!/usr/bin/env python3
"""
Quick test script to send an email to hubertkozuchowski@gmail.com
Run with: python send_test_email.py
"""

import os
from dotenv import load_dotenv
from flask import Flask
from config.email import init_email, send_contact_email

# Load environment variables from .env file
load_dotenv()

# Create a minimal Flask app for testing
app = Flask(__name__)

# You need to set these environment variables before running:
# export SMTP_HOST="smtp.sendgrid.net"
# export SMTP_PORT="587"
# export SMTP_USER="apikey"
# export SMTP_PASS="your_sendgrid_api_key_here"
# export SMTP_FROM_EMAIL="noreply@sanbud.pl"
# export SMTP_FROM_NAME="SanBud - Usługi Hydrauliczne"
# export CONTACT_EMAIL="hubertkozuchowski@gmail.com"

# Initialize email configuration
with app.app_context():
    init_email(app)
    
    print("\n" + "="*60)
    print("🚀 Sending test email to hubertkozuchowski@gmail.com")
    print("="*60 + "\n")
    
    # Check if SMTP is configured
    if not os.getenv('SMTP_PASS'):
        print("❌ ERROR: SMTP_PASS environment variable not set!\n")
        print("Please run:")
        print('  export SMTP_PASS="your_sendgrid_api_key"')
        print("\nThen run this script again.\n")
        exit(1)
    
    # Send test email
    try:
        success = send_contact_email(
            name="Test User",
            email="hubertkozuchowski@gmail.com",
            phone="+48 123 456 789",
            message="This is a test email from the SanBud email system. If you're seeing this, the email configuration is working correctly! 🎉"
        )
        
        if success:
            print("✅ SUCCESS! Test email sent successfully!")
            print(f"📧 Check your inbox at: hubertkozuchowski@gmail.com")
            print("\nEmail details:")
            print(f"  From: {os.getenv('SMTP_FROM_NAME')} <{os.getenv('SMTP_FROM_EMAIL')}>")
            print(f"  To: {os.getenv('CONTACT_EMAIL', 'hubertkozuchowski@gmail.com')}")
            print(f"  Subject: Nowa wiadomość z formularza kontaktowego - SanBud")
            print("\n✨ Your email system is ready to use!")
        else:
            print("❌ FAILED: Could not send email. Check the logs above for details.")
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

print("\n" + "="*60 + "\n")
