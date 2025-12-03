#!/usr/bin/env python3
import sys
sys.path.insert(0, '/Users/haos/azure-san-bud')

from app import create_app, db
from app.models.admin import Admin

app = create_app('production')
with app.app_context():
    admins = Admin.query.all()
    print(f'📊 Total admin users: {len(admins)}')
    for admin in admins:
        print(f'\n👤 Username: {admin.username}')
        print(f'   📧 Email: {admin.email}')
        print(f'   🔐 Hash: {admin.password_hash[:80]}...')
        print(f'   🔑 Active: {admin.is_active}')
        print(f'   📅 Updated: {admin.updated_at}')
        
        # Test password
        test_pass = 'SanBud2025!InitAdmin!Zaj'
        if admin.check_password(test_pass):
            print(f'   ✅ Password matches!')
        else:
            print(f'   ❌ Password does NOT match')
