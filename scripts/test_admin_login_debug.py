#!/usr/bin/env python3
"""
Debug Admin Login - Test password hash matching
"""
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from app import create_app, db
from app.models.admin import Admin

app = create_app('production')

with app.app_context():
    print("🔍 DEBUG: Admin Login Testing")
    print("=" * 70)
    
    # Get admin
    admin = Admin.query.filter_by(username='admin').first()
    
    if not admin:
        print("❌ No admin user found!")
        sys.exit(1)
    
    print(f"\n📋 Admin Details:")
    print(f"   ID: {admin.id}")
    print(f"   Username: {admin.username}")
    print(f"   Email: {admin.email}")
    print(f"   Active: {admin.is_active}")
    print(f"   Super Admin: {admin.is_super_admin}")
    print(f"   Password Hash: {admin.password_hash}")
    print(f"   Hash Length: {len(admin.password_hash)}")
    
    # Test passwords
    test_passwords = [
        'SanBud2025Admin',
        'SanBud2025!InitAdmin!Zaj',
        'admin',
        'Admin123',
    ]
    
    print(f"\n🧪 Testing Passwords:")
    print("-" * 70)
    
    for pwd in test_passwords:
        result = admin.check_password(pwd)
        status = "✅ MATCH" if result else "❌ NO MATCH"
        print(f"   {status}: '{pwd}'")
    
    print("\n" + "=" * 70)
    print("🔐 Password Hash Method Details:")
    print("=" * 70)
    
    # Show hash components
    if admin.password_hash.startswith('pbkdf2:'):
        parts = admin.password_hash.split('$')
        print(f"   Method: {parts[0]}")
        if len(parts) > 1:
            print(f"   Salt: {parts[1]}")
        if len(parts) > 2:
            print(f"   Hash: {parts[2][:40]}...")
    
    # Manual password check with details
    print("\n🔬 Manual Password Verification:")
    from werkzeug.security import check_password_hash
    
    test_pwd = 'SanBud2025Admin'
    print(f"   Testing: '{test_pwd}'")
    print(f"   Against Hash: {admin.password_hash[:80]}...")
    
    manual_check = check_password_hash(admin.password_hash, test_pwd)
    print(f"   Result: {'✅ VALID' if manual_check else '❌ INVALID'}")
    
    print("\n" + "=" * 70)
