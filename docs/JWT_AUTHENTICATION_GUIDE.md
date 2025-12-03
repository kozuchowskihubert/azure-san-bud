# 🔐 JWT Authentication - Kompletny Przewodnik

## 📋 Spis Treści
1. [Jak Działa JWT w SAN-BUD](#jak-działa-jwt)
2. [Flow Logowania](#flow-logowania)
3. [Struktura Kodu](#struktura-kodu)
4. [Testowanie](#testowanie)
5. [Bezpieczeństwo](#bezpieczeństwo)

---

## 🔄 Jak Działa JWT w SAN-BUD

### KROK 1: Logowanie
```
User → Frontend → Backend → Database
                 ↓
            JWT Token
                 ↓
          localStorage
```

### KROK 2: Autoryzowane Zapytania
```
Frontend → localStorage (pobierz token)
    ↓
Request Header: Authorization: Bearer <token>
    ↓
Backend → JWT Verify → Database
    ↓
Response
```

---

## 🚀 Flow Logowania - Szczegółowo

### 1️⃣ **Frontend: Login Form Submit**
**Plik:** `frontend/app/admin/login/page.tsx`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // KROK 1: Wyślij credentials do backendu
  const response = await fetch(buildApiUrl('admin/api/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // ❌ NIE MA credentials: 'include' - to był problem CORS!
    body: JSON.stringify({
      username: 'admin',
      password: 'SanBud2025Admin'
    }),
  });

  const data = await response.json();
  
  // KROK 2: Zapisz token w localStorage
  if (response.ok && data.success) {
    localStorage.setItem('adminToken', data.token);  // 🔑 JWT Token
    localStorage.setItem('admin', JSON.stringify(data.admin));  // 👤 User Info
    
    // KROK 3: Redirect do dashboardu
    router.push('/admin/dashboard');
  }
};
```

### 2️⃣ **Backend: Generate JWT Token**
**Plik:** `app/routes/admin.py`

```python
@admin_bp.route('/api/login', methods=['POST'])
def login():
    # KROK 1: Pobierz credentials
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # KROK 2: Znajdź admina w DB
    admin = Admin.query.filter_by(username=username).first()
    
    # KROK 3: Weryfikuj hasło
    if not admin or not admin.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # KROK 4: Generuj JWT Token
    token_payload = {
        'admin_id': admin.id,
        'username': admin.username,
        'is_super_admin': admin.is_super_admin,
        'exp': datetime.utcnow() + timedelta(seconds=3600),  # Wygasa po 1h
        'iat': datetime.utcnow()  # Issued at
    }
    
    token = jwt.encode(
        token_payload,
        current_app.config['JWT_SECRET_KEY'],  # Sekretny klucz z .env
        algorithm='HS256'
    )
    
    # KROK 5: Zwróć token + admin info
    return jsonify({
        'success': True,
        'token': token,  # 🔑 JWT Token - to jest najważniejsze!
        'admin': admin.to_dict()
    }), 200
```

### 3️⃣ **Frontend: Używanie Token w API Calls**
**Plik:** `frontend/utils/auth.ts`

```typescript
// Funkcja do robienia autoryzowanych zapytań
export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  
  // KROK 1: Pobierz token z localStorage
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    throw new Error('No token - redirect to login');
  }
  
  // KROK 2: Dodaj token do headera
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,  // 🔑 TUTAJ jest token!
  };
  
  // KROP 3: Wyślij request z tokenem
  const response = await fetch(buildApiUrl(endpoint), {
    ...options,
    headers: authHeaders,
  });
  
  // KROK 4: Jeśli 401 = wyloguj
  if (response.status === 401) {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  }
  
  return response;
}
```

### 4️⃣ **Backend: Weryfikacja JWT Token**
**Plik:** `app/routes/admin.py` (decorator)

```python
from functools import wraps

def token_required(f):
    """Decorator dla endpointów wymagających JWT."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # KROK 1: Pobierz token z headera
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # "Bearer <token>"
            except IndexError:
                return jsonify({'error': 'Token format invalid'}), 401
        
        if not token:
            return jsonify({'error': 'Token missing'}), 401
        
        try:
            # KROK 2: Zweryfikuj token
            data = jwt.decode(
                token,
                current_app.config['JWT_SECRET_KEY'],
                algorithms=['HS256']
            )
            
            # KROK 3: Pobierz admina z DB
            current_admin = Admin.query.get(data['admin_id'])
            
            if not current_admin or not current_admin.is_active:
                return jsonify({'error': 'Invalid token'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        # KROK 4: Przekaż admina do funkcji
        return f(current_admin, *args, **kwargs)
    
    return decorated


# Użycie:
@admin_bp.route('/api/protected', methods=['GET'])
@token_required
def protected_route(current_admin):
    return jsonify({
        'message': 'Access granted',
        'admin': current_admin.username
    })
```

---

## 📁 Struktura Kodu

```
Frontend:
├── app/admin/login/page.tsx          # Login form + token storage
├── app/admin/dashboard/page.tsx      # Protected page using token
├── utils/auth.ts                     # authenticatedFetch() helper
└── utils/api.ts                      # buildApiUrl() helper

Backend:
├── app/routes/admin.py               # Login endpoint + JWT generation
├── app/models/admin.py               # Admin model
└── config/settings.py                # JWT_SECRET_KEY config
```

---

## 🧪 Testowanie

### 1. **Test Login (ręcznie):**
```bash
curl -X POST https://app-sanbud-api-prod.azurewebsites.net/admin/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"SanBud2025Admin"}'
```

**Oczekiwana odpowiedź:**
```json
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

### 2. **Test Protected Endpoint:**
```bash
# Skopiuj token z poprzedniego requesta
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET https://app-sanbud-api-prod.azurewebsites.net/admin/api/me \
  -H "Authorization: Bearer $TOKEN"
```

### 3. **Test w Przeglądarce:**

1. Otwórz DevTools → Console
2. Zaloguj się do panelu admin
3. Sprawdź localStorage:
```javascript
console.log('Token:', localStorage.getItem('adminToken'));
console.log('Admin:', JSON.parse(localStorage.getItem('admin')));
```

4. Sprawdź Network tab:
   - Login request → Response → Powinien być `token`
   - Inne requesty → Request Headers → `Authorization: Bearer ...`

---

## 🔒 Bezpieczeństwo

### ✅ **Co jest bezpieczne:**
1. **Token w localStorage** - OK dla admin panelu (nie public app)
2. **HTTPS only** - Token wysyłany tylko przez HTTPS
3. **Expiration** - Token wygasa po 1h
4. **No credentials** - Brak cookies = brak CORS problemów

### ⚠️ **Potencjalne zagrożenia:**
1. **XSS Attack** - Jeśli ktoś wstrzyknie JS, może ukraść token
   - **Mitygacja:** CSP headers, Input sanitization
2. **Token Hijacking** - Jeśli ktoś przechwyci token
   - **Mitygacja:** HTTPS, krótki czas wygaśnięcia

### 🛡️ **Best Practices:**
```typescript
// 1. Zawsze sprawdzaj czy token istnieje
if (!isAuthenticated()) {
  router.push('/admin/login');
}

// 2. Wyloguj na 401
if (response.status === 401) {
  logout(); // Wyczyść localStorage + redirect
}

// 3. Refresh token przed wygaśnięciem (TODO)
// Automatycznie odśwież token co 45 minut
```

---

## 📊 Porównanie: Cookies vs JWT

| Feature | Cookies (stary sposób) | JWT (nowy sposób) |
|---------|----------------------|------------------|
| **CORS** | ❌ Wymaga credentials | ✅ Działa cross-domain |
| **Storage** | Browser cookies | localStorage |
| **Security** | httpOnly, Secure | HTTPS + expiration |
| **Expiration** | Server-side | Client + Server |
| **Stateless** | ❌ Session w DB | ✅ Token ma wszystko |

---

## 🎯 Dlaczego JWT Naprawił CORS?

### ❌ **Problem (stary kod):**
```typescript
fetch(url, {
  credentials: 'include',  // Wysyła cookies
})
```
- Backend musi zwrócić: `Access-Control-Allow-Credentials: true`
- Nie działało bo backend nie zwracał tego headera

### ✅ **Rozwiązanie (nowy kod):**
```typescript
fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`  // Token w headerze
  }
  // NIE MA credentials: 'include'
})
```
- Backend NIE musi zwracać `Access-Control-Allow-Credentials`
- Działa cross-domain bez problemów!

---

## 🚀 Quick Start

### Logowanie do panelu:
1. Wejdź na: `https://sanbud24.pl/admin/login`
2. Username: `admin`
3. Password: `SanBud2025Admin`
4. Kliknij "Zaloguj"
5. ✅ Token zapisany w localStorage!
6. Redirect → `/admin/dashboard`

### Używanie w kodzie:
```typescript
import { authenticatedFetch } from '@/utils/auth';

// Proste!
const response = await authenticatedFetch('admin/api/appointments');
const data = await response.json();
```

---

## 📝 Troubleshooting

### Problem: "No token found"
**Rozwiązanie:** Zaloguj się ponownie

### Problem: "Token expired"
**Rozwiązanie:** Token wygasa po 1h - zaloguj się ponownie

### Problem: "CORS error"
**Rozwiązanie:** Sprawdź czy NIE używasz `credentials: 'include'`

### Problem: "401 Unauthorized"
**Rozwiązanie:** 
1. Sprawdź localStorage: `localStorage.getItem('adminToken')`
2. Sprawdź Network tab - czy header Authorization jest wysyłany
3. Zweryfikuj token na jwt.io

---

## 🎓 Więcej informacji

- [JWT.io](https://jwt.io) - Decode/verify tokens
- [RFC 7519](https://tools.ietf.org/html/rfc7519) - JWT Standard
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
