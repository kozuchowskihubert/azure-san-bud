#!/usr/bin/env python3
"""
Test Azure API endpoints to check database connectivity
"""

import requests
import json

def test_azure_endpoints():
    """Test Azure API endpoints"""
    
    base_url = "https://app-sanbud-api-prod.azurewebsites.net"
    
    print("\n" + "="*80)
    print("🧪 TESTOWANIE ENDPOINTÓW API AZURE")
    print("="*80 + "\n")
    
    # Test 1: Stats endpoint (doesn't require auth for basic check)
    print("1️⃣ Test /admin/api/stats (bez tokena - oczekujemy 401):")
    try:
        response = requests.get(f"{base_url}/admin/api/stats", timeout=10)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"   ❌ Błąd: {e}")
    
    print("\n" + "-"*80 + "\n")
    
    # Test 2: Appointments endpoint
    print("2️⃣ Test /admin/api/appointments (bez tokena - oczekujemy 401):")
    try:
        response = requests.get(f"{base_url}/admin/api/appointments", timeout=10)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"   ❌ Błąd: {e}")
    
    print("\n" + "-"*80 + "\n")
    
    # Test 3: Messages endpoint
    print("3️⃣ Test /admin/api/messages (bez tokena - oczekujemy 401):")
    try:
        response = requests.get(f"{base_url}/admin/api/messages", timeout=10)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"   ❌ Błąd: {e}")
    
    print("\n" + "-"*80 + "\n")
    
    # Test 4: Login endpoint
    print("4️⃣ Test /admin/api/login (próba logowania):")
    try:
        login_data = {
            "username": "admin",
            "password": "admin123"  # Domyślne hasło - zmień jeśli inne
        }
        response = requests.post(
            f"{base_url}/admin/api/login",
            json=login_data,
            timeout=10
        )
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            print(f"   ✅ Token otrzymany: {token[:50]}...")
            
            # Test z tokenem
            print("\n5️⃣ Test /admin/api/appointments (z tokenem):")
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(
                f"{base_url}/admin/api/appointments",
                headers=headers,
                timeout=10
            )
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Liczba wizyt: {len(data.get('appointments', []))}")
                if data.get('appointments'):
                    print(f"   Przykład: {json.dumps(data['appointments'][0], indent=2, ensure_ascii=False)[:300]}")
            else:
                print(f"   ❌ Response: {response.text[:300]}")
            
            print("\n6️⃣ Test /admin/api/messages (z tokenem):")
            response = requests.get(
                f"{base_url}/admin/api/messages",
                headers=headers,
                timeout=10
            )
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Liczba wiadomości: {len(data.get('messages', []))}")
                if data.get('messages'):
                    print(f"   Przykład: {json.dumps(data['messages'][0], indent=2, ensure_ascii=False)[:300]}")
            else:
                print(f"   ❌ Response: {response.text[:300]}")
                
        else:
            print(f"   ❌ Login failed: {response.text[:200]}")
            
    except Exception as e:
        print(f"   ❌ Błąd: {e}")
    
    print("\n" + "="*80)
    print("✅ Test zakończony")
    print("="*80 + "\n")

if __name__ == '__main__':
    test_azure_endpoints()
