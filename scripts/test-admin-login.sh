#!/bin/bash
# Quick test script for admin login debugging

echo "🔍 Testing Admin Login Flow"
echo "================================"
echo ""

API_URL="https://api.sanbud24.pl"
# API_URL="https://app-sanbud-api-prod.azurewebsites.net"

echo "1️⃣ Testing login endpoint..."
echo "POST $API_URL/admin/api/login"
echo ""

# Test login
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -X POST \
  "$API_URL/admin/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}')

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | grep -v "HTTP_CODE:")

echo "Response Code: $HTTP_CODE"
echo "Response Body:"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    # Extract token
    TOKEN=$(echo "$BODY" | jq -r '.token' 2>/dev/null)
    
    if [ ! -z "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
        echo "✅ Login successful! Token received."
        echo "Token preview: ${TOKEN:0:50}..."
        echo ""
        
        echo "2️⃣ Testing /admin/api/me endpoint with token..."
        echo "GET $API_URL/admin/api/me"
        echo "Authorization: Bearer [token]"
        echo ""
        
        ME_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
          -X GET \
          "$API_URL/admin/api/me" \
          -H "Authorization: Bearer $TOKEN")
        
        ME_HTTP_CODE=$(echo "$ME_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
        ME_BODY=$(echo "$ME_RESPONSE" | grep -v "HTTP_CODE:")
        
        echo "Response Code: $ME_HTTP_CODE"
        echo "Response Body:"
        echo "$ME_BODY" | jq . 2>/dev/null || echo "$ME_BODY"
        echo ""
        
        if [ "$ME_HTTP_CODE" = "200" ]; then
            echo "✅ /api/me endpoint works!"
            echo ""
            echo "🎉 Admin login flow is working correctly"
            echo ""
            echo "Test in browser console:"
            echo "1. Login at https://sanbud24.pl/admin/login"
            echo "2. Open DevTools Console (F12)"
            echo "3. Look for these logs:"
            echo "   [Login] Token stored in localStorage"
            echo "   [Dashboard] Loaded admin from localStorage: admin"
            echo "   [Dashboard] Auth check successful: admin"
        else
            echo "❌ /api/me endpoint failed!"
            echo "This is why the dashboard logs out immediately."
            echo ""
            echo "Possible causes:"
            echo "- JWT_SECRET_KEY mismatch between login and verification"
            echo "- Token expiration set too short"
            echo "- @token_required decorator not working"
        fi
    else
        echo "❌ No token in response!"
        echo "Login endpoint not returning JWT token"
    fi
else
    echo "❌ Login failed!"
    echo "Cannot test further without valid login"
fi

echo ""
echo "================================"
echo "💡 Browser debugging:"
echo "1. Go to https://sanbud24.pl/admin/login"
echo "2. Open DevTools Console (F12)"
echo "3. Enter credentials and login"
echo "4. Watch console for:"
echo "   - [Login] messages"
echo "   - [Dashboard] messages"
echo "   - [Auth] errors"
echo ""
echo "Check localStorage:"
echo "  localStorage.getItem('adminToken')"
echo "  localStorage.getItem('admin')"
