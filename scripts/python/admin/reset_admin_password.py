#!/usr/bin/env python3
"""
Simple Admin Password Reset using Flask App Context
"""
import sys
import os

# Add project root to path
sys.path.insert(0, '/Users/haos/azure-san-bud')

from app import create_app, db
from app.models.admin import Admin

def reset_admin_password():
    """Reset admin password using production config."""
    
    print("🔧 Resetting Admin Password")
    print("=" * 60)
    
    # Create app with production config
    app = create_app('production')
    
    with app.app_context():
        # Find admin user
        admin = Admin.query.filter_by(username='admin').first()
        
        if not admin:
            print("❌ Admin user not found!")
            return False
        
        print(f"✅ Found admin user: {admin.username}")
        print(f"   📧 Email: {admin.email}")
        
        # Set new password using the model's method
        password = "SanBud2025!InitAdmin!Zaj"
        admin.set_password(password)
        
        # Commit changes
        db.session.commit()
        
        print(f"✅ Password updated successfully!")
        print(f"   🔐 New hash: {admin.password_hash[:50]}...")
        
        # Verify the password works
        if admin.check_password(password):
            print("✅ Password verification successful!")
        else:
            print("❌ Password verification failed!")
            return False
        
        print("\n" + "=" * 60)
        print("🎉 Admin password reset complete!")
        print(f"👤 Username: {admin.username}")
        print(f"🔑 Password: {password}")
        print(f"🔗 Login at: https://sanbud24.pl/admin/login")
        print("=" * 60)
        
        return True

if __name__ == "__main__":
    reset_admin_password()