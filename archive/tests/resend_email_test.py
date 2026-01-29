#!/usr/bin/env python3
"""
Quick Email Setup using Resend API
Simple, fast, and reliable email sending via API
"""

import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

# Resend API Configuration
RESEND_API_KEY = os.getenv('RESEND_API_KEY', 'your_resend_api_key_here')
RESEND_API_URL = 'https://api.resend.com/emails'

def send_email_resend(to_email: str, subject: str, html_content: str):
    """Send email using Resend API"""
    
    headers = {
        'Authorization': f'Bearer {RESEND_API_KEY}',
        'Content-Type': 'application/json'
    }
    
    data = {
        'from': 'SanBud <noreply@sanbud.pl>',
        'to': [to_email],
        'subject': subject,
        'html': html_content
    }
    
    try:
        with httpx.Client() as client:
            response = client.post(RESEND_API_URL, headers=headers, json=data)
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Email sent successfully!")
                print(f"   Email ID: {result.get('id', 'N/A')}")
                return True
            else:
                print(f"❌ Error: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")
        return False

def create_test_email():
    """Create a beautiful test email"""
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>SanBud Email Test</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #16a34a 0%, #f97316 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔧 SanBud</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Usługi Hydrauliczne</p>
        </div>
        
        <h2 style="color: #16a34a; margin-bottom: 20px;">✅ Email System Test</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Dzień dobry!<br><br>
            To jest testowa wiadomość z systemu email SanBud. Jeśli otrzymujesz tę wiadomość, 
            oznacza to, że integracja email działa poprawnie! 🎉
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #f97316; margin-top: 0;">📋 Szczegóły testu:</h3>
            <ul style="color: #666; line-height: 1.8;">
                <li>Metoda: Resend API</li>
                <li>Bez konfiguracji SMTP</li>
                <li>Wysłane programowo</li>
                <li>Data: {datetime.now().strftime('%d.%m.%Y %H:%M')}</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://sanbud.pl" style="background: linear-gradient(135deg, #16a34a 0%, #f97316 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Odwiedź naszą stronę
            </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #666; font-size: 14px; text-align: center;">
            SanBud - Profesjonalne usługi hydrauliczne<br>
            📧 kontakt@sanbud.pl | 📱 +48 123 456 789
        </p>
    </body>
    </html>
    """.replace('{datetime.now().strftime(\'%d.%m.%Y %H:%M\')}', 
              __import__('datetime').datetime.now().strftime('%d.%m.%Y %H:%M'))
    
    return html_content

def main():
    print("🚀 SanBud Email API Test - Resend")
    print("=" * 50)
    
    # Check if API key is configured
    if RESEND_API_KEY == 'your_resend_api_key_here':
        print("❌ Resend API key not configured!")
        print("\n📝 Quick Setup:")
        print("1. Go to https://resend.com/")
        print("2. Sign up (free tier: 3,000 emails/month)")
        print("3. Get your API key from dashboard")
        print("4. Add to .env file:")
        print("   RESEND_API_KEY=re_your_api_key_here")
        print("5. Run this script again")
        return
    
    # Send test email
    to_email = "hubertkozuchowski@gmail.com"
    subject = "🧪 SanBud Email System - API Test"
    html_content = create_test_email()
    
    print(f"📧 Sending test email to: {to_email}")
    success = send_email_resend(to_email, subject, html_content)
    
    if success:
        print("\n🎉 SUCCESS! Check your inbox!")
        print("📋 The email system is ready to use.")
    else:
        print("\n❌ FAILED! Check the error messages above.")

if __name__ == "__main__":
    main()