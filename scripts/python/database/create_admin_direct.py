#!/usr/bin/env python3
"""
Direct Database Admin Creation Script
Creates an admin user directly in the PostgreSQL database.
"""

import psycopg2
import hashlib
import secrets
from datetime import datetime
import sys
import os

def create_password_hash(password):
    """Create a password hash compatible with Flask-Bcrypt."""
    import bcrypt
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_admin_user_in_db():
    """Create admin user directly in the database."""
    
    print("🔧 Direct Database Admin Creation")
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
        
        # Check if admin table exists
        print("\n📋 Checking admin table...")
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'admin'
            );
        """)
        
        table_exists = cursor.fetchone()[0]
        
        if not table_exists:
            print("❌ Admin table doesn't exist. Creating table...")
            
            # Create admin table
            create_table_sql = """
            CREATE TABLE admin (
                id SERIAL PRIMARY KEY,
                username VARCHAR(80) UNIQUE NOT NULL,
                email VARCHAR(120) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                is_active BOOLEAN DEFAULT TRUE,
                is_super_admin BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP
            );
            """
            
            cursor.execute(create_table_sql)
            conn.commit()
            print("✅ Admin table created!")
        else:
            print("✅ Admin table exists!")
        
        # Check if admin user already exists
        print("\n👤 Checking for existing admin users...")
        cursor.execute("SELECT username, email FROM admin WHERE username = 'admin'")
        existing_admin = cursor.fetchone()
        
        if existing_admin:
            print(f"⚠️  Admin user already exists: {existing_admin[0]} ({existing_admin[1]})")
            
            # Update existing admin password
            print("🔄 Updating admin password...")
            password = "SanBud2025!InitAdmin!Zaj"
            password_hash = create_password_hash(password)
            
            cursor.execute("""
                UPDATE admin 
                SET password_hash = %s 
                WHERE username = 'admin'
            """, (password_hash,))
            
            conn.commit()
            print("✅ Admin password updated!")
            
        else:
            print("🔨 Creating new admin user...")
            
            # Create new admin user
            admin_data = {
                'username': 'admin',
                'email': 'admin@sanbud.pl',
                'password': 'SanBud2025!InitAdmin!Zaj',
                'first_name': 'Admin',
                'last_name': 'SanBud',
                'is_active': True,
                'is_super_admin': True
            }
            
            password_hash = create_password_hash(admin_data['password'])
            
            insert_sql = """
            INSERT INTO admin (username, email, password_hash, first_name, last_name, is_active, is_super_admin, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            cursor.execute(insert_sql, (
                admin_data['username'],
                admin_data['email'],
                password_hash,
                admin_data['first_name'],
                admin_data['last_name'],
                admin_data['is_active'],
                admin_data['is_super_admin'],
                datetime.utcnow()
            ))
            
            conn.commit()
            print("✅ Admin user created successfully!")
        
        # Verify the admin user
        print("\n🔍 Verifying admin user...")
        cursor.execute("SELECT username, email, is_active, is_super_admin, created_at FROM admin WHERE username = 'admin'")
        admin = cursor.fetchone()
        
        if admin:
            print("✅ Admin user verified:")
            print(f"   👤 Username: {admin[0]}")
            print(f"   📧 Email: {admin[1]}")
            print(f"   🔑 Active: {'Yes' if admin[2] else 'No'}")
            print(f"   👑 Super Admin: {'Yes' if admin[3] else 'No'}")
            print(f"   📅 Created: {admin[4]}")
            print(f"   🔐 Password: SanBud2025!InitAdmin!Zaj")
        
        cursor.close()
        conn.close()
        
        print(f"\n" + "=" * 60)
        print("🎉 Admin user successfully created/updated in database!")
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
    # Install bcrypt if not available
    try:
        import bcrypt
    except ImportError:
        print("Installing bcrypt...")
        os.system("pip install bcrypt")
        import bcrypt
    
    create_admin_user_in_db()