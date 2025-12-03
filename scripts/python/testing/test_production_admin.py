#!/usr/bin/env python3
"""
Production Admin Initialization Script
This script initializes an admin user for the production environment.
"""

import sys
import os
sys.path.insert(0, '/Users/haos/azure-san-bud')

import requests
import json

def test_production_admin():
    """Test various admin credentials on production."""
    
    print("🔧 Production Admin Login Testing")
    print("=" * 60)
    
    base_url = "https://app-sanbud-api-prod.azurewebsites.net"
    login_url = f"{base_url}/admin/api/login"
    
    # Test different password combinations
    test_credentials = [
        {"username": "admin", "password": "admin123", "description": "Default dev password"},
        {"username": "admin", "password": "Admin123!@#$Zaj", "description": "Script password"},
        {"username": "admin", "password": "SanBud2025!InitAdmin!Zaj", "description": "Provided password"},
        {"username": "admin", "password": "admin", "description": "Simple password"},
        {"username": "sanbud", "password": "admin123", "description": "Alternative username"},
    ]
    
    headers = {
        "Content-Type": "application/json",
        "Origin": "https://sanbud24.pl",
        "User-Agent": "SanBud-AdminTest/1.0"
    }
    
    for i, creds in enumerate(test_credentials, 1):
        print(f"\n📋 Test {i}/5: {creds['description']}")
        print(f"   👤 Username: {creds['username']}")
        print(f"   🔑 Password: {creds['password'][:5]}...")
        
        try:
            response = requests.post(
                login_url,
                headers=headers,
                json={"username": creds["username"], "password": creds["password"]},
                timeout=10
            )
            
            print(f"   📊 Status: {response.status_code}")
            
            if response.status_code == 200:
                print("   ✅ LOGIN SUCCESS!")
                print(f"   📝 Response: {response.text}")
                return True
            elif response.status_code == 401:
                print("   ❌ Invalid credentials")
            elif response.status_code == 404:
                print("   ❌ Endpoint not found")
            else:
                print(f"   ❌ Unexpected status: {response.text}")
                
        except requests.exceptions.Timeout:
            print("   ⏰ Request timeout")
        except requests.exceptions.ConnectionError:
            print("   🔌 Connection error")
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print(f"\n" + "=" * 60)
    print("🚨 All login attempts failed!")
    print("💡 Suggestions:")
    print("   1. Admin user might not exist in production database")
    print("   2. Need to run production admin initialization")
    print("   3. Database connection issues")
    print("   4. Different admin credentials")
    
    return False

def check_admin_endpoints():
    """Check if admin endpoints are available."""
    
    print("\n🔧 Admin Endpoints Testing")
    print("=" * 60)
    
    base_url = "https://app-sanbud-api-prod.azurewebsites.net"
    
    endpoints_to_test = [
        "/admin/",
        "/admin/login",
        "/admin/api/login"
    ]
    
    for endpoint in endpoints_to_test:
        try:
            url = f"{base_url}{endpoint}"
            response = requests.get(url, timeout=10)
            
            print(f"📍 {endpoint}")
            print(f"   📊 Status: {response.status_code}")
            
            if response.status_code == 200:
                print("   ✅ Accessible")
            elif response.status_code == 404:
                print("   ❌ Not found")
            elif response.status_code == 401:
                print("   🔒 Requires authentication")
            else:
                print(f"   ⚠️  Unexpected: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")

def main():
    """Main function."""
    check_admin_endpoints()
    test_production_admin()

if __name__ == "__main__":
    main()