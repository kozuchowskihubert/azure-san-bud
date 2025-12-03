#!/usr/bin/env python3
"""
Script to create missing database tables in production.
This addresses the appointment booking error by ensuring all required tables exist.
"""
import os
import sys
from sqlalchemy import text

# Add the project root directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../..'))

from app import create_app, db
from app.models.appointment import Appointment
from app.models.service import Service
from app.models.customer import Customer
from app.models.message import Message

def check_table_exists(table_name):
    """Check if a table exists in the database."""
    try:
        result = db.session.execute(text(f"""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = '{table_name}'
            );
        """))
        return result.scalar()
    except Exception as e:
        print(f"Error checking table {table_name}: {e}")
        return False

def create_missing_tables():
    """Create missing database tables."""
    app = create_app('production')
    
    with app.app_context():
        print("Checking database tables...")
        
        # Check which tables exist
        tables_to_check = {
            'customers': Customer,
            'services': Service, 
            'appointments': Appointment,
            'messages': Message
        }
        
        missing_tables = []
        existing_tables = []
        
        for table_name, model in tables_to_check.items():
            if check_table_exists(table_name):
                existing_tables.append(table_name)
                print(f"✅ Table '{table_name}' exists")
            else:
                missing_tables.append(table_name)
                print(f"❌ Table '{table_name}' missing")
        
        if missing_tables:
            print(f"\n🔧 Creating missing tables: {', '.join(missing_tables)}")
            try:
                # Create all tables
                db.create_all()
                print("✅ All missing tables created successfully!")
                
                # Verify creation
                print("\n🔍 Verifying table creation...")
                for table_name in missing_tables:
                    if check_table_exists(table_name):
                        print(f"✅ Table '{table_name}' created successfully")
                    else:
                        print(f"❌ Table '{table_name}' creation failed")
                        
            except Exception as e:
                print(f"❌ Error creating tables: {e}")
                db.session.rollback()
                return False
        else:
            print("✅ All required tables already exist!")
        
        return True

if __name__ == '__main__':
    success = create_missing_tables()
    if success:
        print("\n🎉 Database setup completed successfully!")
    else:
        print("\n💥 Database setup failed!")
        sys.exit(1)