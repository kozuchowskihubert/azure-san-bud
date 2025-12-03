# 🔐 Alternative Admin Login Methods - SAN-BUD

## 📋 Available Login Methods

### Method 1: JWT Token Authentication (PRIMARY - RECOMMENDED)
**Endpoint:** `POST /admin/api/login`
**Type:** Stateless, cross-domain compatible
**Storage:** localStorage

```bash
# Login
curl -X POST https://app-sanbud-api-prod.azurewebsites.net/admin/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"SanBud2025Admin"}'

# Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "username": "admin",
    "email": "admin@sanbud24.pl"
  }
}
```

**How to use:**
1. Send POST request with credentials
2. Receive JWT token in response
3. Store token in `localStorage.setItem('adminToken', token)`
4. Use token in subsequent requests: `Authorization: Bearer <token>`

**Frontend Implementation:**
```typescript
// Login
const response = await fetch(buildApiUrl('admin/api/login'), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
});

const data = await response.json();
localStorage.setItem('adminToken', data.token);
localStorage.setItem('admin', JSON.stringify(data.admin));

// Use in API calls
const token = localStorage.getItem('adminToken');
const response = await fetch(buildApiUrl('admin/api/appointments'), {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

### Method 2: Session-Based Authentication (LEGACY)
**Endpoint:** `GET /admin/login` (renders HTML form)
**Type:** Server-side sessions with cookies
**Storage:** Server session + httpOnly cookies

```bash
# Method 2A: HTML Form Login
open https://app-sanbud-api-prod.azurewebsites.net/admin/login
# Fill form: username=admin, password=SanBud2025Admin

# Method 2B: Direct POST to form endpoint
curl -X POST https://app-sanbud-api-prod.azurewebsites.net/admin/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=SanBud2025Admin" \
  -c cookies.txt \
  -L
```

**How it works:**
1. Server renders login form at `/admin/login`
2. User submits credentials via POST
3. Server creates session and sets cookie
4. Cookie automatically sent with subsequent requests

**Limitations:**
- Requires `credentials: 'include'` for cross-domain
- CORS issues with production (Access-Control-Allow-Credentials)
- Not suitable for modern SPA architectures

---

### Method 3: Direct Python Script Login
**Type:** Programmatic access for automation/testing

```python
import requests
import json

API_URL = "https://app-sanbud-api-prod.azurewebsites.net"

# Login and get token
response = requests.post(
    f"{API_URL}/admin/api/login",
    json={
        "username": "admin",
        "password": "SanBud2025Admin"
    }
)

data = response.json()
token = data['token']

# Use token in subsequent requests
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

# Example: Get appointments
appointments = requests.get(
    f"{API_URL}/admin/api/appointments",
    headers=headers
).json()

print(f"Found {len(appointments)} appointments")
```

---

### Method 4: Browser DevTools Manual Login
**Type:** Manual testing/debugging

```javascript
// In browser console (localhost:3003)
const login = async () => {
  const response = await fetch('http://localhost:5002/admin/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'admin',
      password: 'SanBud2025Admin'
    })
  });
  
  const data = await response.json();
  console.log('Token:', data.token);
  
  localStorage.setItem('adminToken', data.token);
  localStorage.setItem('admin', JSON.stringify(data.admin));
  
  console.log('✓ Logged in! Refresh page.');
};

login();
```

---

### Method 5: Postman/Insomnia Collection
**Type:** API testing tool

**Step 1: Login Request**
```
POST {{baseUrl}}/admin/api/login
Headers:
  Content-Type: application/json
Body:
{
  "username": "admin",
  "password": "SanBud2025Admin"
}
```

**Step 2: Save Token**
```javascript
// Postman: Tests tab
pm.environment.set("token", pm.response.json().token);
```

**Step 3: Use Token**
```
GET {{baseUrl}}/admin/api/appointments
Headers:
  Authorization: Bearer {{token}}
```

---

### Method 6: cURL with Token Storage
**Type:** Command-line automation

```bash
#!/bin/bash

API_URL="https://app-sanbud-api-prod.azurewebsites.net"

# Login and extract token
TOKEN=$(curl -s -X POST "$API_URL/admin/api/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"SanBud2025Admin"}' \
  | jq -r '.token')

echo "Token: $TOKEN"

# Use token in subsequent requests
curl -X GET "$API_URL/admin/api/appointments" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'
```

---

## 🔒 Security Comparison

| Method | Security | CORS | Cross-Domain | Best For |
|--------|----------|------|--------------|----------|
| JWT Token | ⭐⭐⭐⭐ | ✅ No issues | ✅ Yes | Production SPAs |
| Session Cookies | ⭐⭐⭐⭐⭐ | ❌ CORS issues | ❌ No | Same-domain apps |
| Python Script | ⭐⭐⭐ | N/A | ✅ Yes | Automation |
| DevTools | ⭐⭐ | ✅ No issues | ✅ Yes | Testing |
| Postman | ⭐⭐⭐ | N/A | ✅ Yes | API Testing |
| cURL | ⭐⭐⭐ | N/A | ✅ Yes | Automation |

---

## 🚀 Quick Start - Which Method to Use?

### For Production Website:
✅ **Use Method 1 (JWT Token)**
- No CORS issues
- Works cross-domain
- Modern standard

### For Local Development:
✅ **Use Method 1 or 4**
- Method 1: Same as production
- Method 4: Quick testing in console

### For API Testing:
✅ **Use Method 5 or 6**
- Postman: Interactive testing
- cURL: Scripting/automation

### For Backend Admin Panel:
⚠️ **Use Method 2 (Session)**
- Only if accessing from same domain as backend
- Not recommended for cross-domain

---

## 🔧 Troubleshooting

### "Failed to fetch" or ERR_CONNECTION_REFUSED
**Problem:** Backend not running
```bash
# Check if backend is running
curl http://localhost:5002/init/check

# Start backend
cd /Users/haos/azure-san-bud
.venv/bin/python run.py
```

### "CORS error" or "Access-Control-Allow-Credentials"
**Problem:** Using Method 2 (sessions) cross-domain
**Solution:** Switch to Method 1 (JWT tokens)

### "Token expired"
**Problem:** Token lifetime exceeded (1 hour)
**Solution:** Login again to get new token

### "Invalid credentials"
**Problem:** Wrong username/password
**Solution:** 
- Username: `admin`
- Password: `SanBud2025Admin`

---

## 📚 Related Documentation

- [JWT Authentication Guide](./JWT_AUTHENTICATION_GUIDE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Admin Panel User Guide](./ADMIN_PANEL_GUIDE.md)

---

## 🎯 Recommended Setup

**Development:**
```bash
# Terminal 1: Backend
cd /Users/haos/azure-san-bud
.venv/bin/python run.py

# Terminal 2: Frontend
cd /Users/haos/azure-san-bud/frontend
npm run dev

# Open: http://localhost:3003/admin/login
# Use Method 1: JWT authentication
```

**Production:**
```bash
# Frontend: https://sanbud24.pl/admin/login
# Backend: https://app-sanbud-api-prod.azurewebsites.net
# Use Method 1: JWT authentication (already implemented)
```
