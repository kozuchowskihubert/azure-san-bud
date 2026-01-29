#!/usr/bin/env python3
"""
Production Email Configuration for SanBud
Uses Resend API with SMTP fallback
"""

import os
import json
import httpx
from typing import Optional, Dict, Any
from dotenv import load_dotenv

load_dotenv()

class EmailSender:
    def __init__(self):
        self.resend_api_key = os.getenv('RESEND_API_KEY')
        self.resend_url = 'https://api.resend.com/emails'
        
    async def send_via_resend_api(self, to_email: str, subject: str, html_content: str, text_content: str = None) -> bool:
        """Send email via Resend API"""
        if not self.resend_api_key or self.resend_api_key == 'your_resend_api_key_here':
            print("❌ Resend API key not configured")
            return False
            
        headers = {
            'Authorization': f'Bearer {self.resend_api_key}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'from': 'SanBud <noreply@sanbud.pl>',
            'to': [to_email],
            'subject': subject,
            'html': html_content
        }
        
        if text_content:
            data['text'] = text_content
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(self.resend_url, headers=headers, json=data)
                
                if response.status_code == 200:
                    result = response.json()
                    print(f"✅ Email sent via Resend API!")
                    print(f"   Email ID: {result.get('id', 'N/A')}")
                    return True
                else:
                    error_data = response.json() if response.content else {'message': 'Unknown error'}
                    print(f"❌ Resend API Error: {response.status_code}")
                    print(f"   Message: {error_data.get('message', 'Unknown error')}")
                    return False
                    
        except Exception as e:
            print(f"❌ Resend API request failed: {str(e)}")
            return False
    
    def send_via_netlify_forms(self, form_data: Dict[str, Any]) -> bool:
        """Send via Netlify Forms as backup"""
        try:
            # This would be configured with your Netlify site
            url = "https://sanbud.netlify.app/"  # Replace with actual Netlify site
            
            data = {
                'form-name': 'contact',
                **form_data
            }
            
            with httpx.Client(timeout=30.0) as client:
                response = client.post(url, data=data)
                
                if response.status_code == 200:
                    print("✅ Email sent via Netlify Forms!")
                    return True
                else:
                    print(f"❌ Netlify Forms Error: {response.status_code}")
                    return False
                    
        except Exception as e:
            print(f"❌ Netlify Forms request failed: {str(e)}")
            return False

async def send_test_email():
    """Send a test email to verify the system works"""
    sender = EmailSender()
    
    to_email = "hubertkozuchowski@gmail.com"
    subject = "🧪 SanBud Email System - Production Test"
    
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>SanBud Email Test</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        
        <!-- Header with SanBud branding -->
        <div style="background: linear-gradient(135deg, #16a34a 0%, #f97316 100%); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">🔧 SanBud</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Usługi Hydrauliczne</p>
        </div>
        
        <!-- Main content -->
        <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <h2 style="color: #16a34a; margin-top: 0; margin-bottom: 25px; font-size: 24px;">✅ System Email działa poprawnie!</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 20px;">
                Witamy! 👋<br><br>
                To jest testowa wiadomość z systemu email SanBud. Jeśli otrzymujesz tę wiadomość, 
                oznacza to, że nasza integracja email została skonfigurowana poprawnie i jest gotowa do użycia! 🎉
            </p>
            
            <!-- Test details box -->
            <div style="background: #f8f9fa; border-left: 4px solid #f97316; padding: 25px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #f97316; margin-top: 0; margin-bottom: 15px; font-size: 18px;">📋 Szczegóły testu:</h3>
                <ul style="color: #666; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong>Metoda:</strong> Resend API (produkcyjne rozwiązanie)</li>
                    <li><strong>Status:</strong> System gotowy do produkcji</li>
                    <li><strong>Funkcje:</strong> Formularze kontaktowe i rezerwacje</li>
                    <li><strong>Data testu:</strong> 3 grudnia 2025</li>
                    <li><strong>Limit:</strong> 3,000 emaili/miesiąc (darmowy plan)</li>
                </ul>
            </div>
            
            <!-- Features list -->
            <div style="margin: 30px 0;">
                <h3 style="color: #16a34a; margin-bottom: 20px;">🚀 Dostępne funkcje:</h3>
                <div style="display: grid; gap: 15px;">
                    <div style="padding: 15px; background: #f0f9f4; border-radius: 8px; border-left: 3px solid #16a34a;">
                        <strong style="color: #16a34a;">📞 Formularz kontaktowy</strong><br>
                        <span style="color: #666; font-size: 14px;">Automatyczne powiadomienia o nowych zapytaniach</span>
                    </div>
                    <div style="padding: 15px; background: #fff7ed; border-radius: 8px; border-left: 3px solid #f97316;">
                        <strong style="color: #f97316;">📅 System rezerwacji</strong><br>
                        <span style="color: #666; font-size: 14px;">Potwierdzenia wizyt dla klientów i administratora</span>
                    </div>
                </div>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0 30px;">
                <a href="https://sanbud.pl" style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #f97316 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(22, 163, 74, 0.3);">
                    🌐 Odwiedź naszą stronę
                </a>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px;">
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0 0 20px 0;">
            <p style="margin: 5px 0;"><strong>SanBud - Profesjonalne usługi hydrauliczne</strong></p>
            <p style="margin: 5px 0;">📧 kontakt@sanbud.pl | 📱 +48 123 456 789</p>
            <p style="margin: 5px 0; opacity: 0.7;">Warszawa, Polska</p>
        </div>
    </body>
    </html>
    """
    
    text_content = """
SanBud - Usługi Hydrauliczne

System Email działa poprawnie!

Witamy!

To jest testowa wiadomość z systemu email SanBud. Jeśli otrzymujesz tę wiadomość, 
oznacza to, że nasza integracja email została skonfigurowana poprawnie i jest gotowa do użycia!

Szczegóły testu:
- Metoda: Resend API (produkcyjne rozwiązanie)
- Status: System gotowy do produkcji
- Funkcje: Formularze kontaktowe i rezerwacje
- Data testu: 3 grudnia 2025
- Limit: 3,000 emaili/miesiąc (darmowy plan)

Dostępne funkcje:
📞 Formularz kontaktowy - Automatyczne powiadomienia o nowych zapytaniach
📅 System rezerwacji - Potwierdzenia wizyt dla klientów i administratora

Odwiedź naszą stronę: https://sanbud.pl

SanBud - Profesjonalne usługi hydrauliczne
📧 kontakt@sanbud.pl | 📱 +48 123 456 789
Warszawa, Polska
    """
    
    print("🚀 Wysyłanie testowego emaila przez Resend API...")
    print("=" * 60)
    
    success = await sender.send_via_resend_api(to_email, subject, html_content, text_content)
    
    if success:
        print(f"\n🎉 SUCCESS! Email został wysłany do: {to_email}")
        print("📧 Sprawdź swoją skrzynkę pocztową!")
        print("📋 System email SanBud jest gotowy do użycia w produkcji.")
    else:
        print(f"\n❌ FAILED! Nie udało się wysłać emaila.")
        print("💡 Sprawdź konfigurację API key w .env file")
        
    print("=" * 60)

if __name__ == "__main__":
    import asyncio
    asyncio.run(send_test_email())