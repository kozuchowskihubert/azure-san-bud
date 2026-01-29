#!/usr/bin/env python3
"""
SanBud Notification System using Telegram
Instant, reliable, and free alternative to email
"""

import httpx
import asyncio
import json
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Telegram Bot Configuration
TELEGRAM_CONFIG = {
    'bot_token': '7849463726:AAGvmhfQHdvZKJ5xJ8ZsI_iVQCqKP8-NCes',  # Demo bot token
    'chat_id': '5712345678',  # Your Telegram user ID
    'api_url': 'https://api.telegram.org/bot{}/sendMessage'
}

async def send_telegram_notification(message: str, parse_mode: str = 'HTML') -> bool:
    """Send notification via Telegram Bot"""
    
    url = TELEGRAM_CONFIG['api_url'].format(TELEGRAM_CONFIG['bot_token'])
    
    data = {
        'chat_id': TELEGRAM_CONFIG['chat_id'],
        'text': message,
        'parse_mode': parse_mode,
        'disable_web_page_preview': False
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=data)
            
            if response.status_code == 200:
                result = response.json()
                if result.get('ok'):
                    print("✅ Telegram notification sent successfully!")
                    return True
                else:
                    print(f"❌ Telegram API Error: {result.get('description', 'Unknown error')}")
                    return False
            else:
                print(f"❌ HTTP Error: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")
        return False

def create_contact_notification(name: str, email: str, phone: str, message: str) -> str:
    """Create formatted notification for contact form submission"""
    
    return f"""
🔧 <b>SanBud - Nowe zapytanie</b>

📞 <b>Formularz kontaktowy</b>
━━━━━━━━━━━━━━━━━━━

👤 <b>Imię:</b> {name}
📧 <b>Email:</b> {email}
📱 <b>Telefon:</b> {phone}

💬 <b>Wiadomość:</b>
{message}

━━━━━━━━━━━━━━━━━━━
🕐 <b>Data:</b> {datetime.now().strftime('%d.%m.%Y %H:%M')}
🌐 <b>Źródło:</b> sanbud.pl

<i>Odpowiedz klientowi jak najszybciej!</i>
    """.strip()

def create_booking_notification(booking_data: dict) -> str:
    """Create formatted notification for booking submission"""
    
    return f"""
📅 <b>SanBud - Nowa rezerwacja</b>

🗓️ <b>Rezerwacja wizyty</b>
━━━━━━━━━━━━━━━━━━━━

👤 <b>Klient:</b> {booking_data.get('name', 'N/A')}
📧 <b>Email:</b> {booking_data.get('email', 'N/A')}
📱 <b>Telefon:</b> {booking_data.get('phone', 'N/A')}

📅 <b>Data wizyty:</b> {booking_data.get('date', 'N/A')}
🕐 <b>Godzina:</b> {booking_data.get('time', 'N/A')}

🏠 <b>Adres:</b> {booking_data.get('address', 'N/A')}

🔧 <b>Typ usługi:</b> {booking_data.get('service', 'N/A')}

💬 <b>Opis problemu:</b>
{booking_data.get('description', 'Brak opisu')}

━━━━━━━━━━━━━━━━━━━━
🕐 <b>Złożono:</b> {datetime.now().strftime('%d.%m.%Y %H:%M')}
🌐 <b>Źródło:</b> sanbud.pl

<i>⚡ Skontaktuj się z klientem w ciągu 24h!</i>
    """.strip()

def create_test_notification() -> str:
    """Create test notification"""
    
    return f"""
🧪 <b>SanBud - Test systemu powiadomień</b>

✅ <b>System działa poprawnie!</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 <b>Typ:</b> Telegram Bot API
🚀 <b>Status:</b> Gotowy do produkcji
⚡ <b>Szybkość:</b> Natychmiastowa
🔒 <b>Niezawodność:</b> Wysoka
💰 <b>Koszt:</b> Darmowy

📋 <b>Funkcje systemu:</b>
• Powiadomienia z formularza kontaktowego
• Alerty o nowych rezerwacjach
• Natychmiastowe dostarczanie
• Formatowanie HTML
• Bez limitów

━━━━━━━━━━━━━━━━━━━━━━━━━━
🕐 <b>Test:</b> {datetime.now().strftime('%d.%m.%Y %H:%M')}
🔧 <b>System:</b> SanBud Notification Bot
🌐 <b>Website:</b> sanbud.pl

<b>🎉 System powiadomień SanBud jest gotowy!</b>

<i>💡 Tip: Dodaj tego bota do grupy z zespołem, aby wszyscy otrzymywali powiadomienia.</i>
    """.strip()

async def test_notification_system():
    """Test the notification system with sample data"""
    
    print("🚀 SanBud Telegram Notification Test")
    print("=" * 50)
    
    # Test 1: System test
    print("1️⃣ Wysyłanie testu systemu...")
    test_message = create_test_notification()
    success1 = await send_telegram_notification(test_message)
    
    if not success1:
        print("❌ Test systemu nieudany!")
        return False
    
    # Wait a bit between messages
    await asyncio.sleep(2)
    
    # Test 2: Contact form notification
    print("\n2️⃣ Testowanie powiadomienia z formularza kontaktowego...")
    contact_message = create_contact_notification(
        name="Hubert Kozuchowski",
        email="hubertkozuchowski@gmail.com",
        phone="+48 123 456 789",
        message="Potrzebuję naprawy pieca gazowego. Urządzenie nie grzeje od wczoraj. Proszę o kontakt w sprawie wyceny i terminu wizyty."
    )
    success2 = await send_telegram_notification(contact_message)
    
    # Wait a bit between messages
    await asyncio.sleep(2)
    
    # Test 3: Booking notification
    print("\n3️⃣ Testowanie powiadomienia o rezerwacji...")
    booking_data = {
        'name': 'Hubert Kozuchowski',
        'email': 'hubertkozuchowski@gmail.com',
        'phone': '+48 123 456 789',
        'date': '04.12.2025',
        'time': '10:00',
        'address': 'ul. Przykładowa 123, 00-001 Warszawa',
        'service': 'Naprawa pieca gazowego',
        'description': 'Piec przestał grzać wczoraj wieczorem. Potrzebna szybka naprawa przed świętami.'
    }
    booking_message = create_booking_notification(booking_data)
    success3 = await send_telegram_notification(booking_message)
    
    print("\n" + "=" * 50)
    if success1 and success2 and success3:
        print("🎉 SUCCESS! Wszystkie testy przeszły pomyślnie!")
        print("📱 Sprawdź swoje powiadomienia w Telegramie")
        print("✅ System powiadomień SanBud jest gotowy do użycia!")
        print("\n📋 Następne kroki:")
        print("   1. Zintegruj z Flask aplikacją")
        print("   2. Zastąp email w formularzach kontaktowych")
        print("   3. Deploy do Azure")
        print("   4. Skonfiguruj swój własny bot token")
    else:
        print("❌ FAILED! Niektóre testy nie przeszły.")
        print("💡 Sprawdź konfigurację Telegram Bot")
    print("=" * 50)
    
    return success1 and success2 and success3

if __name__ == "__main__":
    asyncio.run(test_notification_system())