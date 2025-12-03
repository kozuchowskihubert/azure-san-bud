#!/usr/bin/env python3
"""
Frontend Form Validation Test Script
Tests the appointment booking form validation on https://sanbud24.pl
"""

import requests
import json
from datetime import datetime, timedelta

def test_frontend_form_validation():
    """Test frontend form validation by submitting various test cases to the API."""
    
    print("🧪 Testing Frontend Form Validation")
    print("=" * 60)
    
    base_url = "https://app-sanbud-api-prod.azurewebsites.net/api/book-appointment"
    headers = {
        "Content-Type": "application/json",
        "Origin": "https://sanbud24.pl",
        "Referer": "https://sanbud24.pl/"
    }
    
    # Test cases for form validation
    test_cases = [
        {
            "name": "Empty Fields Test",
            "description": "Test with completely empty data",
            "data": {},
            "expected_status": 400,
            "expected_validation": "missing required fields"
        },
        {
            "name": "Missing Name Test",
            "description": "Test missing name field",
            "data": {
                "email": "test@example.com",
                "phone": "+48 123 456 789",
                "service": "Naprawa kranu",
                "date": "2025-12-15",
                "time": "10:00",
                "address": "ul. Testowa 123"
            },
            "expected_status": 400,
            "expected_validation": "missing name"
        },
        {
            "name": "Invalid Email Format Test",
            "description": "Test with invalid email format",
            "data": {
                "name": "Jan Kowalski",
                "email": "invalid-email",
                "phone": "+48 123 456 789",
                "service": "Naprawa kranu",
                "date": "2025-12-15",
                "time": "10:00",
                "address": "ul. Testowa 123"
            },
            "expected_status": 400,
            "expected_validation": "invalid email"
        },
        {
            "name": "Missing Service Test",
            "description": "Test without selecting service",
            "data": {
                "name": "Jan Kowalski",
                "email": "jan@example.com",
                "phone": "+48 123 456 789",
                "date": "2025-12-15",
                "time": "10:00",
                "address": "ul. Testowa 123"
            },
            "expected_status": 400,
            "expected_validation": "missing service"
        },
        {
            "name": "Invalid Date Format Test",
            "description": "Test with invalid date format",
            "data": {
                "name": "Jan Kowalski",
                "email": "jan@example.com",
                "phone": "+48 123 456 789",
                "service": "Naprawa kranu",
                "date": "invalid-date",
                "time": "10:00",
                "address": "ul. Testowa 123"
            },
            "expected_status": 400,
            "expected_validation": "invalid date"
        },
        {
            "name": "Invalid Time Format Test",
            "description": "Test with invalid time format",
            "data": {
                "name": "Jan Kowalski",
                "email": "jan@example.com",
                "phone": "+48 123 456 789",
                "service": "Naprawa kranu",
                "date": "2025-12-15",
                "time": "invalid-time",
                "address": "ul. Testowa 123"
            },
            "expected_status": 400,
            "expected_validation": "invalid time"
        },
        {
            "name": "Past Date Test",
            "description": "Test booking for past date",
            "data": {
                "name": "Jan Kowalski",
                "email": "jan@example.com",
                "phone": "+48 123 456 789",
                "service": "Naprawa kranu",
                "date": "2020-01-01",
                "time": "10:00",
                "address": "ul. Testowa 123"
            },
            "expected_status": 400,
            "expected_validation": "past date"
        },
        {
            "name": "Valid Booking Test",
            "description": "Test with completely valid data",
            "data": {
                "name": "Jan Testowy",
                "email": "jan.testowy@example.com",
                "phone": "+48 555 888 999",
                "service": "Naprawa kranu",
                "date": "2025-12-20",
                "time": "14:00",
                "address": "ul. Walidacyjna 123, 00-001 Warszawa",
                "description": "Test walidacji formularza - rezerwacja poprawna"
            },
            "expected_status": 201,
            "expected_validation": "successful booking"
        }
    ]
    
    results = []
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📋 Test {i}/{len(test_cases)}: {test_case['name']}")
        print(f"   Description: {test_case['description']}")
        
        try:
            response = requests.post(base_url, json=test_case['data'], headers=headers)
            response_data = response.json() if response.text else {}
            
            # Analyze result
            status_match = response.status_code == test_case['expected_status']
            
            result = {
                'test_name': test_case['name'],
                'status_code': response.status_code,
                'expected_status': test_case['expected_status'],
                'status_match': status_match,
                'response': response_data,
                'validation_type': test_case['expected_validation']
            }
            
            results.append(result)
            
            # Print result
            status_icon = "✅" if status_match else "❌"
            print(f"   {status_icon} Status: {response.status_code} (expected: {test_case['expected_status']})")
            
            if response_data:
                if response_data.get('success'):
                    print(f"   📝 Response: Success - {response_data.get('message', 'No message')}")
                    if 'appointment_id' in response_data:
                        print(f"   📅 Appointment ID: {response_data['appointment_id']}")
                else:
                    print(f"   📝 Error: {response_data.get('error', 'Unknown error')}")
            
        except Exception as e:
            print(f"   💥 Exception: {e}")
            result = {
                'test_name': test_case['name'],
                'status_code': 'ERROR',
                'expected_status': test_case['expected_status'],
                'status_match': False,
                'response': {'error': str(e)},
                'validation_type': test_case['expected_validation']
            }
            results.append(result)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed_tests = [r for r in results if r['status_match']]
    failed_tests = [r for r in results if not r['status_match']]
    
    print(f"✅ Passed: {len(passed_tests)}/{len(results)}")
    print(f"❌ Failed: {len(failed_tests)}/{len(results)}")
    
    if failed_tests:
        print("\n🔍 Failed Tests:")
        for test in failed_tests:
            print(f"   • {test['test_name']}: Got {test['status_code']}, expected {test['expected_status']}")
    
    print(f"\n🎯 Validation Coverage:")
    validation_types = set(r['validation_type'] for r in results)
    for validation in validation_types:
        tests_for_validation = [r for r in results if r['validation_type'] == validation]
        passed = len([r for r in tests_for_validation if r['status_match']])
        total = len(tests_for_validation)
        print(f"   • {validation.title()}: {passed}/{total}")
    
    print("\n🔧 Frontend Form Validation Status:")
    if len(passed_tests) == len(results):
        print("   🎉 All validation tests passed! Form validation is working correctly.")
    elif len(passed_tests) >= len(results) * 0.8:
        print("   ⚠️  Most validation tests passed. Minor issues detected.")
    else:
        print("   🚨 Multiple validation tests failed. Form validation needs attention.")
    
    return results

if __name__ == "__main__":
    results = test_frontend_form_validation()