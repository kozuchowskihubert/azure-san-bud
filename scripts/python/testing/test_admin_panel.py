#!/usr/bin/env python3
"""
Admin Panel Testing Script
Tests the admin panel functionality locally.
"""

import requests
import json
import sys
import os
import time
from datetime import datetime

# Add project root to path
sys.path.insert(0, '/Users/haos/azure-san-bud')

from app import create_app, db
from app.models.admin import Admin

def test_admin_panel_locally():
    """Test admin panel functionality locally."""
    
    print("🔧 Admin Panel Local Testing")
    print("=" * 60)
    
    # Test 1: Check admin users in database
    print("\n📋 Test 1: Check Admin Users in Database")
    print("-" * 40)
    
    try:
        app = create_app('development')
        with app.app_context():
            admins = Admin.query.all()
            
            if not admins:
                print("❌ No admin users found!")
                
                # Create a test admin
                print("🔨 Creating test admin...")
                admin = Admin(
                    username='admin',
                    email='admin@sanbud.pl',
                    first_name='Test',
                    last_name='Admin',
                    is_active=True,
                    is_super_admin=True
                )
                admin.set_password('admin123')
                db.session.add(admin)
                db.session.commit()
                print("✅ Test admin created!")
            else:
                print(f"✅ Found {len(admins)} admin user(s):")
                for admin in admins:
                    print(f"   👤 Username: {admin.username}")
                    print(f"   📧 Email: {admin.email}")
                    print(f"   🔑 Active: {'Yes' if admin.is_active else 'No'}")
                    print(f"   👑 Super Admin: {'Yes' if admin.is_super_admin else 'No'}")
                    print(f"   📅 Created: {admin.created_at}")
    
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False
    
    # Test 2: Test Admin Login API
    print("\n📋 Test 2: Test Admin Login API")
    print("-" * 40)
    
    base_url = "http://127.0.0.1:5002"
    login_url = f"{base_url}/admin/api/login"
    
    # Test with admin123 password
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        print(f"🔗 Testing login at: {login_url}")
        print(f"📝 Credentials: {login_data['username']}")
        
        response = requests.post(
            login_url, 
            headers={"Content-Type": "application/json"},
            json=login_data,
            timeout=5
        )
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📝 Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Admin login successful!")
            
            # Test authenticated endpoint
            print("\n📋 Test 3: Test Authenticated Endpoint")
            print("-" * 40)
            
            # Get session cookies
            cookies = response.cookies
            
            # Test getting current admin info
            me_url = f"{base_url}/admin/api/me"
            me_response = requests.get(me_url, cookies=cookies, timeout=5)
            
            print(f"📊 /admin/api/me Status: {me_response.status_code}")
            print(f"📝 Response: {me_response.text}")
            
            if me_response.status_code == 200:
                print("✅ Authenticated endpoint working!")
            else:
                print("❌ Authenticated endpoint failed!")
                
        else:
            print(f"❌ Login failed with status {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to local server")
        print("💡 Make sure Flask server is running on port 5002")
        return False
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False
    
    # Test 4: Test Admin Panel Pages
    print("\n📋 Test 4: Test Admin Panel Pages")
    print("-" * 40)
    
    admin_pages = [
        "/admin/",
        "/admin/login",
        "/admin/clients", 
        "/admin/services",
        "/admin/appointments"
    ]
    
    for page in admin_pages:
        try:
            page_url = f"{base_url}{page}"
            response = requests.get(page_url, timeout=5)
            
            if response.status_code == 200:
                print(f"✅ {page} - OK (200)")
            else:
                print(f"❌ {page} - Status: {response.status_code}")
                
        except Exception as e:
            print(f"❌ {page} - Error: {e}")
    
    print("\n" + "=" * 60)
    print("🏁 Admin Panel Testing Complete!")
    print("=" * 60)
    
    return True

if __name__ == "__main__":
    test_admin_panel_locally()