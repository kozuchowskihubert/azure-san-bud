#!/usr/bin/env python3
"""
Automated Admin Initialization for Production
This script runs after deployment to ensure admin user exists.
"""

import os
import sys
import requests
import time

def init_admin_user():
    """Initialize admin user using the init endpoint."""
    
    print("🚀 SanBud Admin Initialization")
    print("=" * 60)
    
    # Get configuration from environment variables
    api_url = os.environ.get('API_URL', 'https://app-sanbud-api-prod.azurewebsites.net')
    admin_secret = os.environ.get('ADMIN_INIT_SECRET')
    admin_password = os.environ.get('ADMIN_PASSWORD', 'SanBud2025!InitAdmin!Zaj')
    admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
    admin_email = os.environ.get('ADMIN_EMAIL', 'admin@sanbud.pl')
    
    if not admin_secret:
        print("❌ ERROR: ADMIN_INIT_SECRET environment variable not set")
        return False
    
    # Wait for API to be ready
    print("\n⏳ Waiting for API to be ready...")
    max_retries = 30
    for i in range(max_retries):
        try:
            response = requests.get(f"{api_url}/api/", timeout=10)
            if response.status_code == 200:
                print("✅ API is ready!")
                break
        except:
            pass
        
        if i < max_retries - 1:
            print(f"   Retry {i+1}/{max_retries}...")
            time.sleep(10)
        else:
            print("❌ API not responding after 5 minutes")
            return False
    
    # Check if admin already exists
    print("\n🔍 Checking if admin user exists...")
    try:
        check_url = f"{api_url}/init/check"
        response = requests.get(check_url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('admin_exists'):
                print(f"✅ Admin user already exists (count: {data.get('count')})")
                print("   No initialization needed.")
                return True
    except Exception as e:
        print(f"⚠️  Could not check admin status: {e}")
        print("   Proceeding with initialization attempt...")
    
    # Initialize admin user
    print("\n🔨 Creating admin user...")
    try:
        init_url = f"{api_url}/init/admin"
        payload = {
            "secret": admin_secret,
            "password": admin_password
        }
        
        response = requests.post(init_url, json=payload, timeout=30)
        
        if response.status_code in [200, 201]:
            print("✅ Admin user initialized successfully!")
            data = response.json()
            print(f"   Username: {data.get('username')}")
            print(f"   Email: {data.get('email')}")
            print("\n🔐 Login at: https://sanbud24.pl/admin/login")
            print(f"   Username: admin")
            print(f"   Password: {admin_password}")
            print("\n⚠️  IMPORTANT: Change the password after first login!")
            return True
        else:
            print(f"❌ Admin initialization failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error during admin initialization: {e}")
        return False

if __name__ == "__main__":
    success = init_admin_user()
    sys.exit(0 if success else 1)
