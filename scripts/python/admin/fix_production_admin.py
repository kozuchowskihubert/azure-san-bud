#!/usr/bin/env python3
"""
Production Admin Database Fix Script
Creates admin user directly in production database using Flask models.
"""

import sys
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get admin credentials from environment
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'SanBud2025!InitAdmin!Zaj')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@sanbud.pl')
ADMIN_FIRST_NAME = os.environ.get('ADMIN_FIRST_NAME', 'Admin')
ADMIN_LAST_NAME = os.environ.get('ADMIN_LAST_NAME', 'SanBud')

# Add project root to path
sys.path.insert(0, '/Users/haos/azure-san-bud')

# Import Flask and models
from app import create_app, db
from app.models.admin import Admin

def fix_production_admin():
    """Fix admin user in production database."""
    
    print("🔧 Production Admin Database Fix")
    print("=" * 60)
    
    try:
        # Create app with production config
        app = create_app('production')
        
        # Override database URL to use production
        prod_db_url = os.getenv('PROD_DATABASE_URL')
        if not prod_db_url:
            print("❌ PROD_DATABASE_URL not found in environment!")
            return False
            
        app.config['SQLALCHEMY_DATABASE_URI'] = prod_db_url
        
        print(f"🔗 Connecting to: {prod_db_url.split('@')[1].split('?')[0]}")
        
        with app.app_context():
            # Ensure tables exist
            db.create_all()
            print("✅ Database tables created/verified")
            
            # Check if admin already exists
            existing_admin = Admin.query.filter_by(username=ADMIN_USERNAME).first()
            
            if existing_admin:
                print(f"👤 Admin user already exists!")
                print(f"   Username: {existing_admin.username}")
                print(f"   Email: {existing_admin.email}")
                print(f"   Active: {existing_admin.is_active}")
                
                # Update password to ensure it's correct
                existing_admin.set_password(ADMIN_PASSWORD)
                db.session.commit()
                print("🔑 Password updated successfully!")
                
            else:
                print("🆕 Creating new admin user...")
                
                # Create new admin with proper Flask model
                admin = Admin(
                    username=ADMIN_USERNAME,
                    email=ADMIN_EMAIL,
                    first_name=ADMIN_FIRST_NAME,
                    last_name=ADMIN_LAST_NAME,
                    is_active=True,
                    is_super_admin=True,
                    created_at=datetime.utcnow()
                )
                
                # Set password using Flask model method
                admin.set_password(ADMIN_PASSWORD)
                
                # Add to database
                db.session.add(admin)
                db.session.commit()
                
                print("✅ Admin user created successfully!")
                print(f"   Username: {ADMIN_USERNAME}")
                print(f"   Email: {ADMIN_EMAIL}")
            
            # Verify the admin can be retrieved
            test_admin = Admin.query.filter_by(username=ADMIN_USERNAME).first()
            if test_admin:
                print("\n🧪 Verification:")
                print(f"   ✅ Admin found in database")
                print(f"   ✅ Username: {test_admin.username}")
                print(f"   ✅ Email: {test_admin.email}")
                print(f"   ✅ Active: {test_admin.is_active}")
                print(f"   ✅ Super Admin: {test_admin.is_super_admin}")
                
                # Test password verification
                if test_admin.check_password(ADMIN_PASSWORD):
                    print(f"   ✅ Password verification works!")
                else:
                    print(f"   ❌ Password verification failed!")
                    return False
                    
            else:
                print("❌ Verification failed - admin not found after creation!")
                return False
            
            print("\n" + "=" * 60)
            print("🎉 Admin user fixed successfully!")
            print("🔗 Test at: https://sanbud24.pl/admin/login")
            print(f"👤 Username: {ADMIN_USERNAME}")
            print("=" * 60)
            
            return True
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_admin_login():
    """Test admin login after creation."""
    
    print("\n🧪 Testing Admin Login API")
    print("-" * 40)
    
    try:
        import requests
        
        login_url = "https://app-sanbud-api-prod.azurewebsites.net/admin/api/login"
        login_data = {
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        }
        
        headers = {
            "Content-Type": "application/json",
            "Origin": "https://sanbud24.pl"
        }
        
        response = requests.post(login_url, json=login_data, headers=headers, timeout=10)
        
        print(f"📊 Status: {response.status_code}")
        print(f"📝 Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login test successful!")
            return True
        else:
            print("❌ Login test failed!")
            return False
            
    except Exception as e:
        print(f"❌ Login test error: {e}")
        return False

if __name__ == "__main__":
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv('/Users/haos/azure-san-bud/.env')
    
    print("Loading production database credentials...")
    
    success = fix_production_admin()
    
    if success:
        print("\n" + "🔄" * 20)
        test_admin_login()
    else:
        print("❌ Fix failed - cannot test login")