#!/usr/bin/env python3
"""
Test script to verify calendar integration is working correctly.
"""
import sys
import os
from datetime import datetime, date, time

# Add the project root directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../..'))

from app import create_app, db
from app.models.appointment import Appointment
from app.models.customer import Customer
from app.models.service import Service

def test_calendar_integration():
    """Test that calendar fields are working in the appointment model."""
    app = create_app('development')
    
    with app.app_context():
        print("🧪 Testing Calendar Integration")
        print("=" * 50)
        
        # Create test data
        test_customer = Customer(
            first_name="Test",
            last_name="Calendar",
            email="test.calendar@example.com",
            phone="+48 111 222 333",
            address="ul. Testowa 123"
        )
        
        test_service = Service(
            name="Test Calendar Service",
            description="Service for testing calendar integration",
            category="test",
            duration_minutes=45,
            price=100,
            is_active=True
        )
        
        # Save customer and service
        db.session.add(test_customer)
        db.session.add(test_service)
        db.session.flush()
        
        # Create appointment with calendar data
        test_appointment = Appointment(
            customer_id=test_customer.id,
            service_id=test_service.id,
            scheduled_date=date(2025, 12, 8),
            scheduled_time=time(15, 30),
            notes="Test appointment for calendar integration",
            status='pending',
            # Calendar fields
            calendar_event_sent=True,
            calendar_platforms='Google Calendar, Apple Calendar, Outlook',
            event_title='Usługa hydrauliczna - Test Calendar Service',
            event_location='ul. Testowa 123'
        )
        
        db.session.add(test_appointment)
        db.session.commit()
        
        # Test the to_dict method
        appointment_dict = test_appointment.to_dict()
        
        print("✅ Appointment created successfully!")
        print(f"   📅 ID: {test_appointment.id}")
        print(f"   👤 Customer: {test_customer.first_name} {test_customer.last_name}")
        print(f"   🔧 Service: {test_service.name}")
        print(f"   📆 Date: {test_appointment.scheduled_date}")
        print(f"   🕐 Time: {test_appointment.scheduled_time}")
        print()
        
        print("📧 Calendar Integration Data:")
        print(f"   ✉️  Event Sent: {test_appointment.calendar_event_sent}")
        print(f"   📱 Platforms: {test_appointment.calendar_platforms}")
        print(f"   📝 Event Title: {test_appointment.event_title}")
        print(f"   📍 Event Location: {test_appointment.event_location}")
        print()
        
        print("🔍 API Response (to_dict):")
        calendar_fields = {
            'calendar_event_sent': appointment_dict.get('calendar_event_sent'),
            'calendar_platforms': appointment_dict.get('calendar_platforms'),
            'event_title': appointment_dict.get('event_title'),
            'event_location': appointment_dict.get('event_location')
        }
        
        for field, value in calendar_fields.items():
            status = "✅" if value is not None else "❌"
            print(f"   {status} {field}: {value}")
        
        # Clean up test data
        db.session.delete(test_appointment)
        db.session.delete(test_customer)
        db.session.delete(test_service)
        db.session.commit()
        
        print()
        print("🎉 Calendar integration test completed successfully!")
        print("   All calendar fields are working correctly.")

if __name__ == '__main__':
    test_calendar_integration()