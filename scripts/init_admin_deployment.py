#!/usr/bin/env python3
"""
Initialize Admin User During Deployment
This script is run during CI/CD to ensure admin user exists with correct credentials.
"""
import os
import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from app import create_app, db
from app.models.admin import Admin


def init_admin():
    """Initialize admin user with environment variables"""
    
    # Get credentials from environment
    username = os.getenv('ADMIN_USERNAME', 'admin')
    email = os.getenv('ADMIN_EMAIL', 'admin@sanbud.pl')
    password = os.getenv('ADMIN_INIT_PASSWORD')
    
    if not password:
        print("❌ ERROR: ADMIN_INIT_PASSWORD environment variable not set!")
        sys.exit(1)
    
    print("🔧 Initializing Admin User")
    print("=" * 60)
    
    # Create Flask app context
    app = create_app('production')
    
    with app.app_context():
        # Check if admin already exists
        existing_admin = Admin.query.filter_by(username=username).first()
        
        if existing_admin:
            print(f"📝 Updating existing admin user: {username}")
            admin = existing_admin
        else:
            print(f"➕ Creating new admin user: {username}")
            admin = Admin(
                username=username,
                email=email,
                first_name='Admin',
                last_name='SanBud',
                is_active=True,
                is_super_admin=True
            )
            db.session.add(admin)
        
        # Set/update password
        admin.set_password(password)
        
        # Commit changes
        db.session.commit()
        
        print(f"✅ Admin user initialized successfully")
        print(f"   👤 Username: {admin.username}")
        print(f"   📧 Email: {admin.email}")
        print(f"   🔐 Password: {'*' * len(password)}")
        print(f"   ✓ Active: {admin.is_active}")
        print(f"   ✓ Super Admin: {admin.is_super_admin}")
        
        # Verify password
        if admin.check_password(password):
            print(f"\n✅ Password verification: PASSED")
        else:
            print(f"\n❌ Password verification: FAILED")
            sys.exit(1)
    
    print("=" * 60)
    print("✅ Admin initialization complete!")
    return 0


if __name__ == '__main__':
    try:
        sys.exit(init_admin())
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
