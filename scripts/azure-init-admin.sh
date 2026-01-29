#!/bin/bash
# Azure Admin Initialization Script
# This script will be uploaded and executed on Azure

cd /home/site/wwwroot

# Create admin with default values
python3 << 'PYEOF'
import sys
import os
sys.path.insert(0, '/home/site/wwwroot')

from app import create_app, db
from app.models.admin import Admin

def init_admin():
    """Create initial admin user."""
    app = create_app('production')
    
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Check if admin already exists
        existing_admin = Admin.query.filter_by(username='admin').first()
        
        if existing_admin:
            print("✓ Admin user already exists!")
            print(f"Username: {existing_admin.username}")
            print(f"Email: {existing_admin.email}")
            return
        
        # Create new admin
        print("Creating new admin user...")
        
        admin = Admin(
            username='admin',
            email='admin@sanbud.pl',
            first_name='Admin',
            last_name='SanBud',
            is_active=True,
            is_super_admin=True
        )
        admin.set_password('Admin123!@#$Zaj')
        
        db.session.add(admin)
        db.session.commit()
        
        print("=" * 50)
        print("✓ Admin user created successfully!")
        print("=" * 50)
        print(f"Username: {admin.username}")
        print(f"Email: {admin.email}")
        print(f"Password: Admin123!@#$Zaj")
        print("=" * 50)
        print("Login at: https://sanbud24.pl/admin/login")
        print("=" * 50)

if __name__ == '__main__':
    init_admin()
PYEOF
