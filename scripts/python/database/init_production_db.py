#!/usr/bin/env python3
"""
Script to create missing database tables in Azure production.
This will be run via Azure Web App to create the appointments table.
"""
import os
import sys
from sqlalchemy import inspect

# Add the project root directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../..'))

from app import create_app, db

def create_tables_azure():
    """Create missing database tables in Azure production."""
    app = create_app('production')
    
    with app.app_context():
        try:
            print("🔍 Checking existing tables...")
            
            # Get current tables
            inspector = inspect(db.engine)
            existing_tables = inspector.get_table_names()
            print(f"Existing tables: {existing_tables}")
            
            # Create all tables (this won't overwrite existing ones)
            print("🔧 Creating tables...")
            db.create_all()
            
            # Check tables after creation
            inspector = inspect(db.engine)
            final_tables = inspector.get_table_names()
            print(f"Final tables: {final_tables}")
            
            # Check if appointments table exists
            if 'appointments' in final_tables:
                print("✅ Appointments table exists!")
                return True
            else:
                print("❌ Appointments table missing!")
                return False
                
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == '__main__':
    success = create_tables_azure()
    if success:
        print("🎉 Database tables created successfully!")
    else:
        print("💥 Failed to create database tables!")
        sys.exit(1)