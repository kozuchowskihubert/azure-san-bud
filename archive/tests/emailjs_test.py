#!/usr/bin/env python3
"""
EmailJS Integration for SanBud
Professional email service with 200 free emails/month
"""

import json
import httpx
import asyncio
from dotenv import load_dotenv

load_dotenv()

# EmailJS Configuration - these will work for testing
EMAILJS_CONFIG = {
    'service_id': 'service_sanbud_2025',
    'template_id': 'template_sanbud_contact',
    'user_id': 'BPKhJ4hF2RLSGMHlJ',  # Public key from EmailJS
    'url': 'https://api.emailjs.com/api/v1.0/email/send'
}

async def send_email_via_emailjs(to_email: str, subject: str, message: str, sender_name: str = "SanBud System"):
    """Send email using EmailJS service"""
    
    print(f"📧 Wysyłanie emaila do: {to_email}")
    print(f"📝 Temat: {subject}")
    
    template_params = {
        'to_email': to_email,
        'to_name': 'Hubert',
        'from_name': sender_name,
        'subject': subject,
        'message': message,
        'reply_to': 'noreply@sanbud.pl'
    }
    
    data = {
        'service_id': EMAILJS_CONFIG['service_id'],
        'template_id': EMAILJS_CONFIG['template_id'],
        'user_id': EMAILJS_CONFIG['user_id'],
        'template_params': template_params
    }
    
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'SanBud/1.0'
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                EMAILJS_CONFIG['url'],
                json=data,
                headers=headers
            )
            
            print(f"📊 Response Status: {response.status_code}")
            
            if response.status_code == 200:
                print("✅ Email został wysłany pomyślnie przez EmailJS!")
                return True
            else:
                print(f"❌ EmailJS Error: {response.status_code}")
                print(f"📄 Response: {response.text}")
                return False
                
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")
        return False

async def send_sanbud_test_email():
    """Send a comprehensive test email"""
    
    to_email = "hubertkozuchowski@gmail.com"
    subject = "🧪 Test Email z systemu SanBud - EmailJS"
    
    message = """
Dzień dobry, Hubert!

To jest testowa wiadomość z systemu email SanBud wysłana przez EmailJS API.

📋 SZCZEGÓŁY TESTU:
═══════════════════
✅ Metoda: EmailJS API
✅ Status: Gotowe do produkcji
✅ Limit: 200 emaili/miesiąc (darmowe)
✅ Niezawodność: Wysoka
✅ Bez konfiguracji serwera

🚀 MOŻLIWOŚCI SYSTEMU:
═══════════════════════
• Automatyczne powiadomienia z formularza kontaktowego
• Potwierdzenia rezerwacji wizyt
• Powiadomienia dla administratora
• Profesjonalne szablony email
• Obsługa załączników (opcjonalnie)

📧 KONFIGURACJA:
═══════════════
• Service ID: service_sanbud_2025
• Template ID: template_sanbud_contact
• User ID: BPKhJ4hF2RLSGMHlJ

🎯 NASTĘPNE KROKI:
═══════════════════
1. ✅ Test przeszedł pomyślnie
2. Integracja z formularzami na stronie
3. Deploy do Azure App Service
4. Testy produkcyjne

Jeśli otrzymujesz tę wiadomość, system email SanBud jest w pełni funkcjonalny! 🎉

---
Pozdrawienia,
Zespół SanBud
🔧 Profesjonalne usługi hydrauliczne
📧 kontakt@sanbud.pl | 📱 +48 123 456 789

PS: Ta wiadomość została wysłana automatycznie przez system SanBud.
    """
    
    print("🚀 SanBud EmailJS Test")
    print("=" * 50)
    
    success = await send_email_via_emailjs(
        to_email=to_email,
        subject=subject,
        message=message,
        sender_name="SanBud - System Testowy"
    )
    
    print("=" * 50)
    if success:
        print("🎉 SUCCESS! Test email został wysłany!")
        print(f"📧 Sprawdź skrzynkę: {to_email}")
        print("📋 System SanBud Email jest gotowy do użycia!")
        print("\n✨ Kolejne kroki:")
        print("   1. Sprawdź czy email dotarł")
        print("   2. Zintegruj z formularzami na stronie")
        print("   3. Deploy do Azure")
    else:
        print("❌ FAILED! Sprawdź konfigurację EmailJS")
        print("💡 Możliwe przyczyny:")
        print("   - Nieprawidłowy Service ID")
        print("   - Nieprawidłowy Template ID")
        print("   - Nieprawidłowy User ID")
        print("   - Problemy z siecią")
    print("=" * 50)

if __name__ == "__main__":
    asyncio.run(send_sanbud_test_email())