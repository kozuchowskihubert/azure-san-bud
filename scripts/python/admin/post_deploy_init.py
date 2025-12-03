#!/usr/bin/env python3
"""
Automated Admin Initialization for Production
This script runs after deployment to ensure admin user exists.
Uses direct database access instead of API endpoints.
"""

import os
import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(project_root))

def init_admin_user():
    """Initialize admin user using direct database access."""
    
    print("🚀 SanBud Admin Initialization")
    print("=" * 60)
    
    try:
        # Import Flask app and models
        from app import create_app, db
        from app.models.admin import Admin
        
        # Get configuration from environment variables
        admin_password = os.environ.get('ADMIN_INIT_PASSWORD', 'SanBud2025Admin')
        admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
        admin_email = os.environ.get('ADMIN_EMAIL', 'admin@sanbud.pl')
        
        print(f"\n📋 Configuration:")
        print(f"   Username: {admin_username}")
        print(f"   Email: {admin_email}")
        
        # Create Flask app context
        app = create_app('production')
        
        with app.app_context():
            # Check if admin already exists
            existing_admin = Admin.query.filter_by(username=admin_username).first()
            
            if existing_admin:
                print(f"\n✅ Admin user already exists (ID: {existing_admin.id})")
                print("   ⚠️  Skipping password update to preserve existing credentials")
                print("   ℹ️  To reset password, delete admin user first or use admin panel")
                admin = existing_admin
            else:
                print("\n➕ Creating new admin user...")
                admin = Admin(
                    username=admin_username,
                    email=admin_email,
                    first_name='Admin',
                    last_name='SanBud',
                    is_active=True,
                    is_super_admin=True
                )
                admin.set_password(admin_password)
                db.session.add(admin)
                db.session.commit()
                print(f"   ✅ Admin created (ID: {admin.id})")
            
            # Verify
            admin = Admin.query.filter_by(username=admin_username).first()
            if admin and admin.check_password(admin_password):
                print(f"\n✅ Password verification: PASSED")
            else:
                print(f"\n❌ Password verification: FAILED")
                return False
            
            print("\n" + "=" * 60)
            print("✅ Admin Initialization Complete!")
            print("=" * 60)
            print(f"🔐 Login at: https://sanbud24.pl/admin/login")
            print(f"   Username: {admin_username}")
            print("=" * 60)
            
            return True
            
    except Exception as e:
        print(f"\n❌ Error during admin initialization: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = init_admin_user()
    sys.exit(0 if success else 1)
