#!/usr/bin/env python3
"""
Test booking system - sends test email and creates booking
"""

import sys
import os
from datetime import datetime, timedelta

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models.customer import Customer
from app.models.service import Service
from app.models.appointment import Appointment
from config.email import send_booking_confirmation

def test_booking():
    """Test booking creation and email sending"""
    
    app = create_app('development')
    
    with app.app_context():
        print("\n" + "="*80)
        print("🧪 TEST REZERWACJI I WYSYŁKI EMAIL")
        print("="*80 + "\n")
        
        # 1. Find or create test service
        print("📋 Szukam usługi 'Instalacje wodno-kanalizacyjne'...")
        service = Service.query.filter_by(name='Instalacje wodno-kanalizacyjne').first()
        
        if not service:
            print("⚠️  Usługa nie znaleziona. Tworzę nową...")
            service = Service(
                name='Instalacje wodno-kanalizacyjne',
                description='Kompleksowe usługi hydrauliczne',
                category='plumbing',
                price=150.00,
                duration_minutes=60,
                is_active=True
            )
            db.session.add(service)
            db.session.commit()
            print(f"✅ Utworzono usługę: {service.name} (ID: {service.id})")
        else:
            print(f"✅ Znaleziono usługę: {service.name} (ID: {service.id})")
        
        # 2. Create test customer
        print("\n👤 Tworzę testowego klienta...")
        
        # Check if test customer exists
        test_customer = Customer.query.filter_by(email='hubertkozuchowski@gmail.com').first()
        
        if test_customer:
            print(f"ℹ️  Klient już istnieje: {test_customer.first_name} {test_customer.last_name}")
            customer = test_customer
        else:
            customer = Customer(
                first_name='Hubert',
                last_name='Kozuchowski',
                email='hubertkozuchowski@gmail.com',
                phone='+48 503 691 808'
            )
            db.session.add(customer)
            db.session.commit()
            print(f"✅ Utworzono klienta: {customer.first_name} {customer.last_name}")
        
        # 3. Create test appointment (tomorrow at 14:00)
        print("\n📅 Tworzę testową rezerwację...")
        
        tomorrow = datetime.now().date() + timedelta(days=1)
        appointment_time = datetime.strptime('14:00', '%H:%M').time()
        
        # Check if appointment already exists for this time
        existing_appointment = Appointment.query.filter_by(
            customer_id=customer.id,
            scheduled_date=tomorrow,
            scheduled_time=appointment_time
        ).first()
        
        if existing_appointment:
            print(f"⚠️  Rezerwacja już istnieje (ID: {existing_appointment.id})")
            print(f"   Usuwam starą rezerwację...")
            db.session.delete(existing_appointment)
            db.session.commit()
        
        appointment = Appointment(
            customer_id=customer.id,
            service_id=service.id,
            scheduled_date=tomorrow,
            scheduled_time=appointment_time,
            notes='TEST: Naprawa nieszczelnego kranu w łazience',
            status='pending'
        )
        
        db.session.add(appointment)
        db.session.commit()
        
        print(f"✅ Utworzono rezerwację (ID: {appointment.id})")
        print(f"   Data: {appointment.scheduled_date.strftime('%Y-%m-%d')}")
        print(f"   Godzina: {appointment.scheduled_time.strftime('%H:%M')}")
        print(f"   Usługa: {service.name}")
        print(f"   Klient: {customer.first_name} {customer.last_name}")
        
        # 4. Send confirmation email
        print("\n📧 Wysyłam email potwierdzający...")
        
        booking_data = {
            'name': f"{customer.first_name} {customer.last_name}",
            'email': customer.email,
            'phone': customer.phone,
            'date': appointment.scheduled_date.strftime('%Y-%m-%d'),
            'time': appointment.scheduled_time.strftime('%H:%M'),
            'service': service.name,
            'description': appointment.notes or '',
            'address': 'ul. Dalii 8, 09-100 Płońsk'
        }
        
        email_sent = send_booking_confirmation(booking_data)
        
        if email_sent:
            print("✅ Email wysłany pomyślnie!")
            print(f"   Do: {customer.email}")
            print(f"   Temat: Potwierdzenie rezerwacji - SanBud ({booking_data['date']})")
        else:
            print("⚠️  Email nie został wysłany przez SMTP")
            print("   Sprawdź logi w katalogu logs/")
        
        # 5. Summary
        print("\n" + "="*80)
        print("📊 PODSUMOWANIE TESTU")
        print("="*80)
        print(f"✅ Rezerwacja utworzona: ID {appointment.id}")
        print(f"✅ Klient: {customer.email}")
        print(f"✅ Data wizyty: {appointment.scheduled_date.strftime('%Y-%m-%d')} o {appointment.scheduled_time.strftime('%H:%M')}")
        print(f"✅ Status email: {'Wysłany' if email_sent else 'Zalogowany do pliku'}")
        print("\n💡 Sprawdź:")
        print(f"   - Skrzynkę email: {customer.email}")
        print(f"   - Logi: logs/email_notifications_{datetime.now().strftime('%Y-%m-%d')}.json")
        print(f"   - Bazę danych: SELECT * FROM appointment WHERE id = {appointment.id}")
        print("="*80 + "\n")
        
        return True

if __name__ == '__main__':
    try:
        test_booking()
        print("✅ Test zakończony sukcesem!\n")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ BŁĄD: {str(e)}\n")
        import traceback
        traceback.print_exc()
        sys.exit(1)
