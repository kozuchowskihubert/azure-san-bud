# 🌐 DNS Configuration for sanbud24.pl - READY TO IMPLEMENT

## ✅ GitHub Secrets - COMPLETED!

All secrets have been added to GitHub:
- ✅ AZURE_WEBAPP_PUBLISH_PROFILE
- ✅ AZURE_STATIC_WEB_APPS_API_TOKEN  
- ✅ DATABASE_URL
- ✅ SECRET_KEY

## 📋 DNS Records to Add NOW

Login to: **https://ssl.hitme.net.pl/clientarea.php**
- Email: **sanbud.biuro@gmail.com**
- Password: **MyszkaMiki1@**

### Step 1: Navigate to DNS Management
1. Login to panel
2. Go to "Domains" → "My Domains"
3. Click on "sanbud24.pl"
4. Click "DNS Management" or "Manage DNS"

### Step 2: Add These DNS Records

| Type | Host/Name | Points To / Value | TTL | Priority |
|------|-----------|-------------------|-----|----------|
| **CNAME** | www | delightful-wave-0fb6d2d03.3.azurestaticapps.net | 300 | - |
| **CNAME** | api | app-sanbud-api-prod.azurewebsites.net | 300 | - |
| **TXT** | @ | 07557C0B02D6FEF6E51231B7B6F76868B466FFCA18F3FDE9E390B354F5D50C95 | 300 | - |
| **TXT** | asuid.api | 07557C0B02D6FEF6E51231B7B6F76868B466FFCA18F3FDE9E390B354F5D50C95 | 300 | - |
| **MX** | @ | mail.sanbud24.pl | 3600 | 10 |
| **TXT** | @ | v=spf1 include:_spf.google.com ~all | 3600 | - |

**Important for ROOT domain (@):**

For the root domain (sanbud24.pl without www), check if your DNS provider supports:

**Option A: ALIAS or ANAME record (preferred)**
```
Type: ALIAS (or ANAME)
Host: @
Points To: delightful-wave-0fb6d2d03.3.azurestaticapps.net
TTL: 300
```

**Option B: A record (if ALIAS not supported)**

If your DNS provider doesn't support ALIAS, you need to use Azure Static Web Apps custom apex domain feature. After adding the validation TXT record above, Azure will provide an IP address to use in an A record.

### Step 3: Wait for DNS Propagation (5-10 minutes)

Check propagation:
```bash
dig sanbud24.pl TXT +short
dig www.sanbud24.pl +short
dig api.sanbud24.pl +short
dig asuid.api.sanbud24.pl TXT +short
```

Expected results:
- `www.sanbud24.pl` → CNAME to delightful-wave-0fb6d2d03.3.azurestaticapps.net
- `api.sanbud24.pl` → CNAME to app-sanbud-api-prod.azurewebsites.net
- TXT records visible

---

## 🔧 Azure Custom Domain Configuration

### After DNS records are added and propagated (wait 10 minutes), run these commands:

### 1. Add Root Domain (sanbud24.pl)
```bash
# For Static Web Apps with apex domain, use validation token method
az staticwebapp hostname set \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod \
  --hostname sanbud24.pl \
  --validation-method dns-txt-token
```

### 2. Add WWW Subdomain
```bash
az staticwebapp hostname set \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod \
  --hostname www.sanbud24.pl
```

### 3. Add API Subdomain  
```bash
az webapp config hostname add \
  --webapp-name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --hostname api.sanbud24.pl
```

### 4. Enable SSL for Backend API
```bash
az webapp config ssl bind \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --certificate-name api.sanbud24.pl \
  --ssl-type SNI
```

---

## 🚀 Deploy Code to Azure

Once DNS is configured and custom domains are added:

```bash
cd /Users/haos/azure-san-bud

# Commit any remaining changes
git add .
git commit -m "🚀 Ready for production deployment"

# Push to trigger GitHub Actions deployment
git push origin main

# Watch the deployment
gh run watch
```

---

## 💾 Initialize Database

After deployment completes successfully:

```bash
# SSH into the backend
az webapp ssh --name app-sanbud-api-prod --resource-group rg-sanbud-prod

# Inside the SSH session, run:
python init_db.py
python init_admin.py

# Exit
exit
```

---

## ✅ Verification Commands

### Check DNS Propagation
```bash
# Check all records
dig sanbud24.pl +short
dig www.sanbud24.pl +short
dig api.sanbud24.pl +short
dig sanbud24.pl TXT +short
dig asuid.api.sanbud24.pl TXT +short

# Check from multiple DNS servers
dig @8.8.8.8 sanbud24.pl +short    # Google DNS
dig @1.1.1.1 sanbud24.pl +short    # Cloudflare DNS
dig @9.9.9.9 sanbud24.pl +short    # Quad9 DNS
```

### Check Custom Domain Status
```bash
# Frontend domains status
az staticwebapp show \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod \
  --query "customDomains[].{domain:name,status:status}" -o table

# Backend domain status
az webapp config hostname list \
  --webapp-name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --query "[].{name:name,sslState:sslState}" -o table
```

### Test Endpoints
```bash
# Test current Azure URLs (should work now)
curl https://app-sanbud-api-prod.azurewebsites.net/api/health
curl https://delightful-wave-0fb6d2d03.3.azurestaticapps.net

# Test custom domains (after DNS propagation)
curl https://api.sanbud24.pl/api/health
curl https://sanbud24.pl
curl https://www.sanbud24.pl
```

### Run Full Verification
```bash
cd /Users/haos/azure-san-bud
./check-domain.sh
```

---

## 🎯 Current Status

### ✅ Completed
- [x] Azure Resource Group created
- [x] PostgreSQL database ready and configured
- [x] Backend Web App deployed and running
- [x] Static Web App created
- [x] Backend environment variables configured
- [x] Database created (sanbud_db)
- [x] GitHub Secrets added (all 4)
- [x] Backend publish profile generated
- [x] Frontend deployment token retrieved
- [x] DNS verification IDs obtained

### ⏳ Pending (Do Now!)
- [ ] **Add DNS records in ssl.hitme.net.pl** ← **DO THIS NOW**
- [ ] Wait 10 minutes for DNS propagation
- [ ] Add custom domains to Azure
- [ ] Enable SSL certificates
- [ ] Deploy code via GitHub Actions
- [ ] Initialize database
- [ ] Verify live site

---

## 📊 Azure Resources Summary

### Resource Group
- **Name:** rg-sanbud-prod
- **Location:** West Europe

### PostgreSQL Database
- **Server:** psql-sanbud-prod.postgres.database.azure.com
- **Database:** sanbud_db
- **User:** sanbud_admin
- **Password:** SanBud2024SecureDB!
- **Status:** ✅ Ready

### Backend API
- **Name:** app-sanbud-api-prod
- **Current URL:** https://app-sanbud-api-prod.azurewebsites.net
- **Future URL:** https://api.sanbud24.pl
- **Runtime:** Python 3.11
- **Status:** ✅ Running

### Frontend
- **Name:** swa-sanbud-frontend-prod
- **Current URL:** https://delightful-wave-0fb6d2d03.3.azurestaticapps.net
- **Future URLs:** https://sanbud24.pl, https://www.sanbud24.pl
- **SKU:** Standard
- **Status:** ✅ Created

### Verification IDs
- **Backend Verification:** 07557C0B02D6FEF6E51231B7B6F76868B466FFCA18F3FDE9E390B354F5D50C95
- **Frontend Token:** (Embedded in Azure, no separate TXT needed for www)

---

## 🎉 Next Immediate Action

**👉 GO TO:** https://ssl.hitme.net.pl/clientarea.php

**Login:**
- Email: sanbud.biuro@gmail.com
- Password: MyszkaMiki1@

**Add the DNS records from the table above!**

Then wait 10 minutes and run the Azure custom domain commands.

---

## 📞 Support

### Check Azure Resources
```bash
# List all resources
az resource list --resource-group rg-sanbud-prod -o table

# Check backend logs
az webapp log tail --name app-sanbud-api-prod --resource-group rg-sanbud-prod

# Check PostgreSQL
az postgres flexible-server show --name psql-sanbud-prod --resource-group rg-sanbud-prod
```

### Troubleshooting
- **DNS not propagating:** Wait longer (up to 48 hours globally)
- **SSL not working:** Make sure DNS is fully propagated first
- **Custom domain errors:** Verify TXT records are correct and visible
- **Backend errors:** Check logs with `az webapp log tail`

---

**All set! Add the DNS records now and your site will be live! 🚀**
