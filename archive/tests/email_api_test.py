#!/usr/bin/env python3
"""
Email API Test - Send email via programmatic API
Uses httpx to send emails via EmailJS, Formspree, or similar services
"""

import json
import asyncio
import httpx
from datetime import datetime

# EmailJS Configuration (Free service, no server needed)
EMAILJS_CONFIG = {
    'service_id': 'service_sanbud',
    'template_id': 'template_contact',
    'user_id': 'YOUR_EMAILJS_USER_ID',  # Get from EmailJS dashboard
    'url': 'https://api.emailjs.com/api/v1.0/email/send'
}

# Formspree Configuration (Alternative)
FORMSPREE_CONFIG = {
    'form_id': 'YOUR_FORM_ID',  # Get from Formspree dashboard
    'url': 'https://formspree.io/f/YOUR_FORM_ID'
}

async def send_via_emailjs(to_email: str, subject: str, message: str):
    """Send email via EmailJS API"""
    print("📧 Sending email via EmailJS API...")
    
    data = {
        'service_id': EMAILJS_CONFIG['service_id'],
        'template_id': EMAILJS_CONFIG['template_id'],
        'user_id': EMAILJS_CONFIG['user_id'],
        'template_params': {
            'to_email': to_email,
            'subject': subject,
            'message': message,
            'from_name': 'SanBud - Usługi Hydrauliczne',
            'reply_to': 'noreply@sanbud.pl'
        }
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                EMAILJS_CONFIG['url'],
                json=data,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                print("✅ Email sent successfully via EmailJS!")
                return True
            else:
                print(f"❌ EmailJS Error: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ EmailJS Request failed: {str(e)}")
            return False

async def send_via_formspree(to_email: str, subject: str, message: str):
    """Send email via Formspree API"""
    print("📧 Sending email via Formspree API...")
    
    data = {
        'email': 'noreply@sanbud.pl',
        'subject': subject,
        'message': f"To: {to_email}\n\n{message}",
        '_replyto': to_email,
        '_format': 'plain'
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                FORMSPREE_CONFIG['url'],
                data=data,
                headers={'Accept': 'application/json'}
            )
            
            if response.status_code == 200:
                print("✅ Email sent successfully via Formspree!")
                return True
            else:
                print(f"❌ Formspree Error: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Formspree Request failed: {str(e)}")
            return False

async def send_via_webhook(to_email: str, subject: str, message: str):
    """Send email via webhook (like Zapier, Make.com, etc.)"""
    print("📧 Sending email via Webhook...")
    
    # Example webhook URL (replace with your webhook)
    webhook_url = "https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID"
    
    data = {
        'to_email': to_email,
        'subject': subject,
        'message': message,
        'from_name': 'SanBud - Usługi Hydrauliczne',
        'timestamp': datetime.now().isoformat(),
        'source': 'sanbud_website'
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                webhook_url,
                json=data,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                print("✅ Email sent successfully via Webhook!")
                return True
            else:
                print(f"❌ Webhook Error: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Webhook Request failed: {str(e)}")
            return False

async def test_email_apis():
    """Test different email API services"""
    to_email = "hubertkozuchowski@gmail.com"
    subject = "🧪 SanBud Email Test - API/CLI Method"
    message = """
    This is a test email from the SanBud email system using API/CLI method.
    
    Test Details:
    - Method: Programmatic API call
    - No SMTP configuration required
    - Sent via external email service API
    - Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
    
    If you receive this email, the API integration is working correctly! 🎉
    
    Best regards,
    SanBud Team
    """.strip()
    
    print("=" * 60)
    print("🚀 Testing Email APIs for SanBud")
    print("=" * 60)
    
    # Test 1: EmailJS (most popular for client-side)
    print("\n1️⃣ Testing EmailJS...")
    await send_via_emailjs(to_email, subject, message)
    
    # Test 2: Formspree (popular form backend)
    print("\n2️⃣ Testing Formspree...")
    await send_via_formspree(to_email, subject, message)
    
    # Test 3: Webhook (Zapier/Make.com integration)
    print("\n3️⃣ Testing Webhook...")
    await send_via_webhook(to_email, subject, message)
    
    print("\n" + "=" * 60)
    print("📝 Next Steps:")
    print("1. Choose a service that worked")
    print("2. Sign up and get API credentials")
    print("3. Update the configuration above")
    print("4. Run this script again to test")
    print("=" * 60)

if __name__ == "__main__":
    # Install required package
    print("📦 Installing required packages...")
    import subprocess
    subprocess.run(["pip", "install", "httpx"], check=True)
    
    # Run the test
    asyncio.run(test_email_apis())