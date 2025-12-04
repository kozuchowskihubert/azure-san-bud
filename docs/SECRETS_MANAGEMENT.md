# Environment Variables & Secrets Configuration

## Current Status (Updated: 2025-12-04)

### ✅ Configured Secrets

#### GitHub Secrets (15 total)
```bash
gh secret list
```

| Secret Name | Status | Last Updated | Purpose |
|------------|--------|--------------|---------|
| `ADMIN_INIT_PASSWORD` | ✅ | 4 hours ago | Initial admin password for deployments |
| `ADMIN_INIT_SECRET` | ✅ | 9 hours ago | Admin initialization secret |
| `API_URL` | ✅ | 1 day ago | Backend API URL for frontend |
| `AZURE_CLIENT_ID` | ✅ | 1 day ago | Azure service principal |
| `AZURE_CLIENT_SECRET` | ✅ | 1 day ago | Azure service principal secret |
| `AZURE_CREDENTIALS` | ✅ | 1 day ago | Azure login credentials (JSON) |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | ✅ | 1 day ago | Static Web App deployment token |
| `AZURE_SUBSCRIPTION_ID` | ✅ | 1 day ago | Azure subscription ID |
| `AZURE_TENANT_ID` | ✅ | 1 day ago | Azure tenant ID |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | ✅ | 1 day ago | App Service publish profile |
| `DATABASE_URL` | ✅ | 3 mins ago | **PostgreSQL connection string (NEW PASSWORD!)** |
| `DB_ADMIN_PASSWORD` | ✅ | 9 hours ago | PostgreSQL admin password |
| `SECRET_KEY` | ✅ | 1 day ago | Flask secret key |
| `SMTP_PASSWORD` | ✅ | 4 hours ago | Email SMTP password |
| `SMTP_USER` | ✅ | 4 hours ago | Email SMTP username |

#### Azure App Service Settings (26 total)
All settings are configured with values (shown as `***` for security).

Key settings:
- `DATABASE_URL` - ✅ Updated with new password
- `SECRET_KEY` - ✅ Flask secret
- `ADMIN_INIT_PASSWORD` - ✅ Admin password
- `SMTP_*` - ✅ Email configuration
- `SCM_DO_BUILD_DURING_DEPLOYMENT` - ✅ true

### ⚠️ Missing Secrets (To Be Added)

#### Google Places API (for reviews)
```bash
# Not yet configured - need to obtain from Google Cloud Console
GOOGLE_PLACES_API_KEY="AIza..."
GOOGLE_PLACE_ID="ChIJ..."
```

**How to add:**
```bash
# After obtaining credentials, run:
./scripts/setup-google-credentials.sh "YOUR_API_KEY" "YOUR_PLACE_ID"
```

---

## Recent Changes

### PostgreSQL Password Rotation (2025-12-04 00:14)
✅ **Successfully rotated PostgreSQL password**

**Old password:** `SanBud2024SecureDB!` (INVALIDATED)
**New password:** `Idp0gbw5g&bluIS0Ofn5kYFQzo%Etcoa`

**Updated locations:**
1. ✅ Azure PostgreSQL server
2. ✅ GitHub secret `DATABASE_URL`
3. ✅ Azure App Service `DATABASE_URL`

**Verification:**
```bash
curl https://api.sanbud24.pl/api/health
# Response: {"status":"healthy","timestamp":"2025-12-04T00:20:21.677106"}
```

---

## Secret Management Best Practices

### Never Commit Secrets
- ❌ Don't commit `.env` files
- ❌ Don't hardcode secrets in code
- ✅ Use environment variables
- ✅ Use GitHub Secrets for CI/CD
- ✅ Use Azure App Settings for runtime

### Rotation Schedule
| Secret Type | Rotation Frequency | Last Rotated |
|------------|-------------------|--------------|
| Database passwords | Every 90 days | 2025-12-04 |
| API keys | Every 180 days | - |
| Service principal | Every 365 days | - |
| SMTP passwords | As needed | 2025-12-03 |

### Accessing Secrets

#### Local Development
```bash
# Copy example file
cp .env.example .env

# Fill in values (never commit this file!)
# .env is in .gitignore
```

#### GitHub Actions (CI/CD)
Secrets are automatically available as:
```yaml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  SECRET_KEY: ${{ secrets.SECRET_KEY }}
```

#### Azure App Service
Secrets are injected as environment variables:
```python
import os
db_url = os.environ.get('DATABASE_URL')
```

---

## Troubleshooting

### Backend Can't Connect to Database
1. Check `DATABASE_URL` format:
   ```
   postgresql://username:password@host:5432/dbname?sslmode=require
   ```
2. Verify password in Azure:
   ```bash
   az postgres flexible-server show --name psql-sanbud-prod --resource-group rg-sanbud-prod
   ```
3. Test connection:
   ```bash
   psql "$DATABASE_URL"
   ```

### Missing Environment Variable
1. Check Azure App Settings:
   ```bash
   az webapp config appsettings list --name app-sanbud-api-prod --resource-group rg-sanbud-prod
   ```
2. Add if missing:
   ```bash
   az webapp config appsettings set \
     --name app-sanbud-api-prod \
     --resource-group rg-sanbud-prod \
     --settings KEY="value"
   ```

### GitHub Secret Not Working
1. List secrets:
   ```bash
   gh secret list
   ```
2. Update secret:
   ```bash
   gh secret set SECRET_NAME --body "new_value"
   ```

---

## Security Audit Checklist

- [x] Database password rotated
- [x] Strong passwords (32+ characters)
- [x] HTTPS enforced everywhere
- [x] CORS configured correctly
- [x] API keys restricted by domain
- [ ] Google Places API key configured
- [ ] Regular secret rotation schedule
- [ ] Monitoring for unauthorized access
- [ ] Backup of critical secrets (encrypted)

---

## Emergency Procedures

### If Secrets Compromised
1. **Immediate Actions:**
   - Rotate all affected secrets
   - Check Azure audit logs
   - Review GitHub Actions logs
   - Change admin passwords

2. **Run rotation scripts:**
   ```bash
   # Database password
   ./scripts/rotate-database-password.sh
   
   # Update all secrets
   ./scripts/update-production-secrets.sh
   ```

3. **Verify changes:**
   ```bash
   # Test backend
   curl https://api.sanbud24.pl/api/health
   
   # Test admin login
   curl -X POST https://api.sanbud24.pl/admin/api/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"NEW_PASSWORD"}'
   ```

---

*Last updated: 2025-12-04 00:22 UTC*
*Backend status: ✅ Healthy*
*Database: ✅ Connected (new password)*
