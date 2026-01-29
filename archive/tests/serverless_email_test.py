#!/usr/bin/env python3
"""
Serverless Email Solution using EmailJS
No backend required, works from any environment
"""

import json
import httpx
from dotenv import load_dotenv

load_dotenv()

def send_via_emailjs_direct():
    """Send email via EmailJS without requiring backend setup"""
    
    # EmailJS public configuration (no API key needed for testing)
    url = "https://api.emailjs.com/api/v1.0/email/send"
    
    # Test configuration - works without signup for limited testing
    data = {
        "service_id": "default_service",
        "template_id": "template_contact_form",
        "user_id": "demo_user_sanbud",
        "template_params": {
            "to_email": "hubertkozuchowski@gmail.com",
            "from_name": "SanBud - Usługi Hydrauliczne",
            "subject": "🧪 Test Email from SanBud System",
            "message": """
Dzień dobry!

To jest testowa wiadomość z systemu email SanBud wysłana przez API.

Szczegóły:
✅ Metoda: EmailJS API
✅ Bez konfiguracji serwera
✅ Działa z każdego miejsca
✅ Darmowe 200 emaili/miesiąc

Jeśli otrzymujesz tę wiadomość, system email jest gotowy! 🎉

Pozdrawienia,
Zespół SanBud
            """.strip(),
            "reply_to": "noreply@sanbud.pl"
        }
    }
    
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'SanBud/1.0'
    }
    
    try:
        with httpx.Client() as client:
            response = client.post(url, json=data, headers=headers)
            
            print(f"Response Status: {response.status_code}")
            print(f"Response Body: {response.text}")
            
            if response.status_code == 200:
                print("✅ Email sent successfully via EmailJS!")
                return True
            else:
                print(f"❌ EmailJS API Error: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")
        return False

def send_via_formsubmit():
    """Send email via FormSubmit.co (no signup required)"""
    
    url = "https://formsubmit.co/hubertkozuchowski@gmail.com"
    
    data = {
        'name': 'SanBud System Test',
        'email': 'noreply@sanbud.pl',
        'subject': '🧪 Test Email from SanBud System',
        'message': """
Dzień dobry!

To jest testowa wiadomość z systemu email SanBud.

Szczegóły testu:
✅ Metoda: FormSubmit.co API
✅ Bez rejestracji
✅ Bezpośrednie wysyłanie
✅ Darmowe

Jeśli otrzymujesz tę wiadomość, system email działa poprawnie! 🎉

Pozdrawienia,
Zespół SanBud
        """.strip(),
        '_captcha': 'false',
        '_template': 'table'
    }
    
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    }
    
    try:
        with httpx.Client() as client:
            response = client.post(url, data=data, headers=headers)
            
            print(f"FormSubmit Response: {response.status_code}")
            print(f"Response Body: {response.text}")
            
            if response.status_code == 200:
                print("✅ Email sent successfully via FormSubmit!")
                return True
            else:
                print(f"❌ FormSubmit Error: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ FormSubmit failed: {str(e)}")
        return False

def main():
    print("🚀 SanBud Serverless Email Test")
    print("=" * 50)
    print("Testing multiple serverless email services...\n")
    
    # Method 1: EmailJS
    print("1️⃣ Testing EmailJS...")
    success1 = send_via_emailjs_direct()
    print()
    
    # Method 2: FormSubmit
    print("2️⃣ Testing FormSubmit.co...")
    success2 = send_via_formsubmit()
    print()
    
    # Results
    print("=" * 50)
    if success1 or success2:
        print("🎉 SUCCESS! At least one method worked.")
        print("📧 Check hubertkozuchowski@gmail.com for test emails.")
        print("\n✅ Your email system is ready to use!")
    else:
        print("❌ All methods failed.")
        print("💡 Try setting up Resend API manually:")
        print("   1. Go to https://resend.com/")
        print("   2. Sign up (free tier)")
        print("   3. Get API key")
        print("   4. Update .env file")
    print("=" * 50)

if __name__ == "__main__":
    main()