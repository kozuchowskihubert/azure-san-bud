#!/usr/bin/env python3
"""
Fix Admin Password Hash Script
Updates the admin password hash to be compatible with Flask-Bcrypt.
"""

import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get credentials from environment
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'SanBud2025!InitAdmin!Zaj')
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')

sys.path.insert(0, '/Users/haos/azure-san-bud')

import psycopg2
from werkzeug.security import generate_password_hash
from datetime import datetime

def fix_admin_password():
    """Fix admin password hash in production database."""
    
    print("🔧 Fixing Admin Password Hash")
    print("=" * 60)
    
    # Database connection details from Azure
    db_config = {
        'host': 'psql-sanbud-prod.postgres.database.azure.com',
        'database': 'sanbud_db',
        'user': 'sanbud_admin',
        'password': 'SanBud2024SecureDB!',
        'port': 5432,
        'sslmode': 'require'
    }
    
    try:
        print("🔌 Connecting to production database...")
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()
        
        print("✅ Database connection successful!")
        
        # Generate proper Flask-compatible password hash
        password_hash = generate_password_hash(ADMIN_PASSWORD, method='pbkdf2:sha256')
        
        print(f"🔐 Generated password hash: {password_hash[:50]}...")
        
        # Update admin password
        print("🔄 Updating admin password hash...")
        cursor.execute("""
            UPDATE admin 
            SET password_hash = %s 
            WHERE username = %s
        """, (password_hash, ADMIN_USERNAME))
        
        if cursor.rowcount > 0:
            conn.commit()
            print("✅ Admin password hash updated successfully!")
        else:
            print("❌ No admin user found to update!")
            return False
        
        # Verify the update
        print("\n🔍 Verifying admin user...")
        cursor.execute("""
            SELECT username, email, password_hash, is_active, is_super_admin, created_at 
            FROM admin WHERE username = 'admin'
        """)
        admin = cursor.fetchone()
        
        if admin:
            print("✅ Admin user verified:")
            print(f"   👤 Username: {admin[0]}")
            print(f"   📧 Email: {admin[1]}")
            print(f"   🔐 Password Hash: {admin[2][:50]}...")
            print(f"   🔑 Active: {'Yes' if admin[3] else 'No'}")
            print(f"   👑 Super Admin: {'Yes' if admin[4] else 'No'}")
            print(f"   📅 Created: {admin[5]}")
        
        cursor.close()
        conn.close()
        
        print(f"\n" + "=" * 60)
        print("🎉 Admin password hash successfully fixed!")
        print(f"👤 Username: {ADMIN_USERNAME}")
        print("🔗 Login at: https://sanbud24.pl/admin/login")
        print("=" * 60)
        
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Database error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    fix_admin_password()