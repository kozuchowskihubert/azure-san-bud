#!/usr/bin/env python3
"""
Simple script to create database tables via HTTP request.
This will be run through the Azure Web App's HTTP interface.
"""

def create_tables_endpoint():
    """Create missing database tables via HTTP."""
    import os
    import sys
    from sqlalchemy import inspect
    
    try:
        # Import Flask app
        from app import create_app, db
        
        app = create_app('production')
        
        with app.app_context():
            print("🔍 Checking database tables...")
            
            # Get current tables
            inspector = inspect(db.engine)
            existing_tables = inspector.get_table_names()
            print(f"Existing tables: {existing_tables}")
            
            # Import all models to ensure they're registered
            from app.models.appointment import Appointment
            from app.models.service import Service
            from app.models.customer import Customer
            from app.models.message import Message
            from app.models.admin import Admin
            
            print("🔧 Creating missing tables...")
            db.create_all()
            
            # Check tables after creation
            inspector = inspect(db.engine)
            final_tables = inspector.get_table_names()
            print(f"Final tables: {final_tables}")
            
            required_tables = ['customers', 'services', 'appointments', 'messages', 'admins']
            missing_tables = [table for table in required_tables if table not in final_tables]
            
            if missing_tables:
                print(f"❌ Still missing tables: {missing_tables}")
                return False
            else:
                print("✅ All required tables exist!")
                return True
                
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = create_tables_endpoint()
    print("SUCCESS" if success else "FAILED")