"""Database initialization script with sample data."""
import os
import sys

# Add the project root directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../..'))

from app import create_app, db
from app.models import Service, Customer, Appointment
from datetime import datetime, date, time

def init_db():
    """Initialize database with sample data."""
    app = create_app(os.environ.get('FLASK_ENV', 'development'))
    
    with app.app_context():
        # Create tables
        print("Creating database tables...")
        db.create_all()
        
        # Check if data already exists
        if Service.query.first() is not None:
            print("Database already initialized with data.")
            return
        
        print("Adding sample services...")
        
        # Add sample services
        services = [
            Service(
                name="Emergency Leak Repair",
                description="24/7 emergency service for urgent leak repairs",
                category="emergency",
                price=150.00,
                duration_minutes=120,
                is_active=True
            ),
            Service(
                name="Drain Cleaning",
                description="Professional drain cleaning and unclogging service",
                category="plumbing",
                price=95.00,
                duration_minutes=90,
                is_active=True
            ),
            Service(
                name="Toilet Installation",
                description="Complete toilet installation service",
                category="installation",
                price=200.00,
                duration_minutes=180,
                is_active=True
            ),
            Service(
                name="Water Heater Repair",
                description="Repair and maintenance of water heaters",
                category="repair",
                price=120.00,
                duration_minutes=120,
                is_active=True
            ),
            Service(
                name="Sink Installation",
                description="Kitchen and bathroom sink installation",
                category="installation",
                price=180.00,
                duration_minutes=150,
                is_active=True
            ),
            Service(
                name="Pipe Replacement",
                description="Old pipe replacement and upgrade service",
                category="plumbing",
                price=250.00,
                duration_minutes=240,
                is_active=True
            ),
            Service(
                name="Bathroom Renovation",
                description="Complete bathroom plumbing renovation",
                category="sanitary",
                price=500.00,
                duration_minutes=480,
                is_active=True
            ),
            Service(
                name="Faucet Repair",
                description="Repair or replacement of leaky faucets",
                category="repair",
                price=75.00,
                duration_minutes=60,
                is_active=True
            ),
            Service(
                name="Preventive Maintenance",
                description="Regular plumbing system inspection and maintenance",
                category="maintenance",
                price=100.00,
                duration_minutes=90,
                is_active=True
            ),
            Service(
                name="Sewer Line Inspection",
                description="Camera inspection of sewer lines",
                category="inspection",
                price=175.00,
                duration_minutes=120,
                is_active=True
            ),
        ]
        
        for service in services:
            db.session.add(service)
        
        print("Adding sample customers...")
        
        # Add sample customers
        customers = [
            Customer(
                first_name="John",
                last_name="Doe",
                email="john.doe@example.com",
                phone="+1-555-123-4567",
                address="123 Main Street",
                city="New York",
                postal_code="10001"
            ),
            Customer(
                first_name="Jane",
                last_name="Smith",
                email="jane.smith@example.com",
                phone="+1-555-987-6543",
                address="456 Oak Avenue",
                city="Los Angeles",
                postal_code="90001"
            ),
        ]
        
        for customer in customers:
            db.session.add(customer)
        
        # Commit to get IDs
        db.session.commit()
        
        print("Adding sample appointments...")
        
        # Add sample appointments
        appointments = [
            Appointment(
                customer_id=1,
                service_id=1,
                scheduled_date=date.today(),
                scheduled_time=time(10, 0),
                status='confirmed',
                notes='Emergency leak in kitchen'
            ),
            Appointment(
                customer_id=2,
                service_id=2,
                scheduled_date=date.today(),
                scheduled_time=time(14, 0),
                status='pending',
                notes='Bathroom drain clogged'
            ),
        ]
        
        for appointment in appointments:
            db.session.add(appointment)
        
        db.session.commit()
        
        print("Database initialized successfully!")
        print(f"Added {len(services)} services")
        print(f"Added {len(customers)} customers")
        print(f"Added {len(appointments)} appointments")


if __name__ == '__main__':
    init_db()
