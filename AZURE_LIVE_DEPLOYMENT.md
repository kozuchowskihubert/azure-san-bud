# 🚀 Azure Live Deployment Guide for sanbud24.pl

Complete guide to deploy your SanBud application to Azure with custom domain sanbud24.pl.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Azure Resources Setup](#azure-resources-setup)
3. [Deploy Backend (Flask API)](#deploy-backend)
4. [Deploy Frontend (Next.js)](#deploy-frontend)
5. [Configure Custom Domain & DNS](#configure-custom-domain--dns)
6. [SSL Certificate Setup](#ssl-certificate-setup)
7. [Verification & Testing](#verification--testing)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required Tools
```bash
# Install Azure CLI
brew install azure-cli

# Login to Azure
az login

# Set default subscription (if you have multiple)
az account set --subscription "Your-Subscription-Name"

# Install GitHub CLI (for secrets)
brew install gh
gh auth login
```

### Required Secrets
You'll need these secrets for GitHub Actions:
- `AZURE_WEBAPP_PUBLISH_PROFILE` - Backend deployment
- `AZURE_STATIC_WEB_APPS_API_TOKEN` - Frontend deployment
- `AZURE_CREDENTIALS` - Service principal for automation
- `DATABASE_URL` - PostgreSQL connection string

---

## 🏗️ Azure Resources Setup

### Step 1: Create Resource Group
```bash
# Create resource group in West Europe (closest to Poland)
az group create \
  --name rg-sanbud-prod \
  --location westeurope \
  --tags Environment=Production Project=SanBud
```

### Step 2: Create PostgreSQL Database
```bash
# Create PostgreSQL Flexible Server
az postgres flexible-server create \
  --name psql-sanbud-prod \
  --resource-group rg-sanbud-prod \
  --location westeurope \
  --admin-user sanbud_admin \
  --admin-password "YourSecurePassword123!" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 14 \
  --storage-size 32 \
  --public-access 0.0.0.0-255.255.255.255

# Create database
az postgres flexible-server db create \
  --resource-group rg-sanbud-prod \
  --server-name psql-sanbud-prod \
  --database-name sanbud_db

# Get connection string
az postgres flexible-server show-connection-string \
  --server-name psql-sanbud-prod \
  --database-name sanbud_db \
  --admin-user sanbud_admin \
  --admin-password "YourSecurePassword123!"
```

**Save this connection string** - you'll need it for environment variables:
```
postgresql://sanbud_admin:YourSecurePassword123!@psql-sanbud-prod.postgres.database.azure.com/sanbud_db?sslmode=require
```

### Step 3: Create App Service Plan (for Backend)
```bash
# Create Linux-based App Service Plan
az appservice plan create \
  --name plan-sanbud-backend-prod \
  --resource-group rg-sanbud-prod \
  --location westeurope \
  --is-linux \
  --sku B1 \
  --tags Environment=Production Component=Backend
```

### Step 4: Create Web App (Flask Backend)
```bash
# Create Web App with Python 3.11
az webapp create \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --plan plan-sanbud-backend-prod \
  --runtime "PYTHON:3.11" \
  --tags Environment=Production Component=API

# Enable HTTPS only
az webapp update \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --https-only true

# Configure startup command
az webapp config set \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --startup-file "gunicorn --bind=0.0.0.0:8000 --timeout 600 run:app"
```

### Step 5: Configure Backend Environment Variables
```bash
# Set all environment variables
az webapp config appsettings set \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --settings \
    FLASK_ENV=production \
    FLASK_APP=run.py \
    SECRET_KEY="$(openssl rand -hex 32)" \
    DATABASE_URL="postgresql://sanbud_admin:YourSecurePassword123!@psql-sanbud-prod.postgres.database.azure.com/sanbud_db?sslmode=require" \
    CORS_ORIGINS="https://sanbud24.pl,https://www.sanbud24.pl,https://api.sanbud24.pl" \
    ALLOWED_HOSTS="sanbud24.pl,www.sanbud24.pl,api.sanbud24.pl,app-sanbud-api-prod.azurewebsites.net" \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true \
    WEBSITES_PORT=8000
```

### Step 6: Get Backend Publish Profile
```bash
# Download publish profile for GitHub Actions
az webapp deployment list-publishing-profiles \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --xml > azure-backend-publish-profile.xml

# Copy content and add to GitHub Secrets as AZURE_WEBAPP_PUBLISH_PROFILE
cat azure-backend-publish-profile.xml | pbcopy
```

### Step 7: Create Static Web App (Frontend)
```bash
# Create Static Web App for Next.js
az staticwebapp create \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod \
  --location westeurope \
  --sku Standard \
  --tags Environment=Production Component=Frontend

# Get deployment token
az staticwebapp secrets list \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod \
  --query "properties.apiKey" -o tsv
```

**Save this token** - add it to GitHub Secrets as `AZURE_STATIC_WEB_APPS_API_TOKEN`

---

## 🔧 Deploy Backend

### Update GitHub Secrets
Go to your GitHub repository: `kozuchowskihubert/azure-san-bud`

**Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:
1. **AZURE_WEBAPP_PUBLISH_PROFILE** - Content from `azure-backend-publish-profile.xml`
2. **DATABASE_URL** - PostgreSQL connection string
3. **SECRET_KEY** - Generate with `openssl rand -hex 32`

### Deploy via GitHub Actions
```bash
# Your workflow is already set up! Just push to main
git add .
git commit -m "🚀 Configure Azure production deployment"
git push origin main

# Check deployment status
gh run list --limit 1
gh run watch
```

### Manual Deployment (Alternative)
```bash
# If GitHub Actions fails, deploy manually
cd /Users/haos/azure-san-bud

# Create deployment package
zip -r deployment.zip . \
  -x "*.git*" \
  -x "frontend/*" \
  -x "terraform/*" \
  -x "venv/*" \
  -x "*.pyc" \
  -x "__pycache__/*" \
  -x "instance/*"

# Deploy
az webapp deploy \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --src-path deployment.zip \
  --type zip \
  --async true
```

### Initialize Database
```bash
# SSH into Azure App Service
az webapp ssh \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod

# Inside Azure shell, run:
python init_db.py
python init_admin.py

# Exit
exit
```

### Verify Backend
```bash
# Get backend URL
BACKEND_URL=$(az webapp show \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --query "defaultHostName" -o tsv)

echo "Backend URL: https://$BACKEND_URL"

# Test health endpoint
curl https://$BACKEND_URL/api/health

# Expected response: {"status":"healthy","timestamp":"..."}
```

---

## 🎨 Deploy Frontend

### Update Frontend Configuration
Update `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://api.sanbud24.pl/api
NEXT_PUBLIC_DOMAIN=sanbud24.pl
NEXT_PUBLIC_SITE_URL=https://sanbud24.pl
NEXT_PUBLIC_PHONE=+48503691808
NEXT_PUBLIC_EMAIL=kontakt@sanbud24.pl
NEXT_PUBLIC_SITE_NAME=San-Bud Hydraulika
NEXT_PUBLIC_SITE_DESCRIPTION=Profesjonalne usługi hydrauliczne i sanitarne
```

### Add GitHub Secret for Frontend
```bash
# Get Static Web App token (if you haven't already)
TOKEN=$(az staticwebapp secrets list \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod \
  --query "properties.apiKey" -o tsv)

echo "Add this to GitHub Secrets as AZURE_STATIC_WEB_APPS_API_TOKEN:"
echo $TOKEN
```

### Deploy Frontend
```bash
# Commit changes
git add frontend/.env.production
git commit -m "🎨 Configure frontend for production"
git push origin main

# GitHub Actions will automatically deploy frontend
# Check workflow status
gh run watch
```

### Manual Frontend Deployment (Alternative)
```bash
cd /Users/haos/azure-san-bud/frontend

# Build production
npm run build

# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Deploy
swa deploy \
  --app-location . \
  --output-location .next \
  --deployment-token $TOKEN
```

### Verify Frontend
```bash
# Get frontend URL
FRONTEND_URL=$(az staticwebapp show \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod \
  --query "defaultHostname" -o tsv)

echo "Frontend URL: https://$FRONTEND_URL"

# Open in browser
open "https://$FRONTEND_URL"
```

---

## 🌐 Configure Custom Domain & DNS

### Step 1: Add Custom Domain to Backend (api.sanbud24.pl)
```bash
# Add custom domain to App Service
az webapp config hostname add \
  --webapp-name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --hostname api.sanbud24.pl

# Get verification ID
BACKEND_VERIFICATION_ID=$(az webapp show \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --query "customDomainVerificationId" -o tsv)

echo "Backend Verification ID: $BACKEND_VERIFICATION_ID"
```

### Step 2: Add Custom Domain to Frontend (sanbud24.pl & www.sanbud24.pl)
```bash
# Add root domain
az staticwebapp hostname set \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod \
  --hostname sanbud24.pl

# Add www subdomain
az staticwebapp hostname set \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod \
  --hostname www.sanbud24.pl

# Get validation token
FRONTEND_VALIDATION_TOKEN=$(az staticwebapp show \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod \
  --query "customDomains[0].validationToken" -o tsv)

echo "Frontend Validation Token: $FRONTEND_VALIDATION_TOKEN"
```

### Step 3: Configure DNS Records

Login to your domain registrar (where you bought sanbud24.pl) and add these records:

#### DNS Records for sanbud24.pl

| Type | Host/Name | Value/Target | TTL | Purpose |
|------|-----------|--------------|-----|---------|
| **A** | @ | `20.105.XXX.XXX` (Static Web App IP) | 300 | Main website |
| **CNAME** | www | sanbud24.pl | 300 | WWW redirect |
| **CNAME** | api | app-sanbud-api-prod.azurewebsites.net | 300 | Backend API |
| **TXT** | @ | `$FRONTEND_VALIDATION_TOKEN` | 300 | Azure validation |
| **TXT** | asuid.api | `$BACKEND_VERIFICATION_ID` | 300 | Backend validation |
| **MX** | @ | mail.sanbud24.pl (Priority: 10) | 3600 | Email |
| **TXT** | @ | `v=spf1 include:_spf.google.com ~all` | 3600 | SPF |

**Get Static Web App IP Address:**
```bash
# Static Web Apps don't have fixed IPs, use CNAME instead
# For root domain, you'll need to use Azure Front Door or DNS flattening

# Alternative: Use ALIAS/ANAME record (if your DNS provider supports it)
# ALIAS @ → swa-sanbud-frontend-prod.azurestaticapps.net
```

#### Option A: DNS Provider Supports ALIAS (Cloudflare, Route53)
```
ALIAS  @    →  swa-sanbud-frontend-prod.azurestaticapps.net
CNAME  www  →  swa-sanbud-frontend-prod.azurestaticapps.net
CNAME  api  →  app-sanbud-api-prod.azurewebsites.net
```

#### Option B: DNS Provider Only Supports A/CNAME (Most providers)
You'll need Azure Front Door for apex domain:

```bash
# Create Azure Front Door (recommended for production)
az afd profile create \
  --profile-name fd-sanbud-prod \
  --resource-group rg-sanbud-prod \
  --sku Standard_AzureFrontDoor

# Add endpoint
az afd endpoint create \
  --endpoint-name sanbud24 \
  --profile-name fd-sanbud-prod \
  --resource-group rg-sanbud-prod \
  --enabled-state Enabled

# Configure origin
az afd origin-group create \
  --origin-group-name frontend-origin \
  --profile-name fd-sanbud-prod \
  --resource-group rg-sanbud-prod \
  --probe-path / \
  --probe-protocol Https

az afd origin create \
  --origin-name static-web-app \
  --origin-group-name frontend-origin \
  --profile-name fd-sanbud-prod \
  --resource-group rg-sanbud-prod \
  --host-name swa-sanbud-frontend-prod.azurestaticapps.net \
  --origin-host-header swa-sanbud-frontend-prod.azurestaticapps.net \
  --priority 1 \
  --weight 1000 \
  --enabled-state Enabled \
  --http-port 80 \
  --https-port 443

# Get Front Door IP for DNS
az afd endpoint show \
  --endpoint-name sanbud24 \
  --profile-name fd-sanbud-prod \
  --resource-group rg-sanbud-prod \
  --query "hostName" -o tsv
```

### Step 4: Verify DNS Configuration
```bash
# Wait 5-10 minutes for DNS propagation, then verify:

# Check root domain
dig sanbud24.pl +short

# Check www subdomain  
dig www.sanbud24.pl +short

# Check API subdomain
dig api.sanbud24.pl +short

# Check TXT records
dig TXT sanbud24.pl +short
dig TXT asuid.api.sanbud24.pl +short

# Test globally (from different DNS servers)
dig @8.8.8.8 sanbud24.pl +short  # Google DNS
dig @1.1.1.1 sanbud24.pl +short  # Cloudflare DNS
dig @9.9.9.9 sanbud24.pl +short  # Quad9 DNS
```

### Step 5: Monitor DNS Propagation
```bash
# Use your verification script
cd /Users/haos/azure-san-bud
./check-domain.sh

# Or check online
# https://dnschecker.org/#A/sanbud24.pl
# https://www.whatsmydns.net/#A/sanbud24.pl
```

**DNS Propagation Timeline:**
- ⏱️ **Local**: 5-10 minutes
- 🌍 **Regional**: 1-4 hours
- 🌐 **Global**: 24-48 hours

---

## 🔒 SSL Certificate Setup

Azure automatically provisions SSL certificates for custom domains!

### Backend SSL (api.sanbud24.pl)
```bash
# Enable managed certificate
az webapp config ssl bind \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --certificate-name api.sanbud24.pl \
  --ssl-type SNI

# Verify SSL
curl -I https://api.sanbud24.pl/api/health
```

### Frontend SSL (sanbud24.pl & www.sanbud24.pl)
Static Web Apps automatically provision SSL certificates after DNS validation!

```bash
# Check SSL status
az staticwebapp show \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod \
  --query "customDomains[].{domain:name,status:status}" -o table

# Wait for "Ready" status (can take 5-60 minutes)
```

### Verify SSL Certificates
```bash
# Test HTTPS
curl -I https://sanbud24.pl
curl -I https://www.sanbud24.pl
curl -I https://api.sanbud24.pl

# Check SSL rating
# https://www.ssllabs.com/ssltest/analyze.html?d=sanbud24.pl
```

---

## ✅ Verification & Testing

### Automated Verification
```bash
cd /Users/haos/azure-san-bud
./check-domain.sh
```

### Manual Verification Checklist

#### 1. Website Loading
- [ ] https://sanbud24.pl loads correctly
- [ ] https://www.sanbud24.pl redirects to sanbud24.pl
- [ ] All images load
- [ ] Navigation works
- [ ] Language switcher (PL/EN) works

#### 2. API Endpoints
```bash
# Health check
curl https://api.sanbud24.pl/api/health

# Services list
curl https://api.sanbud24.pl/api/services

# Test client registration
curl -X POST https://api.sanbud24.pl/api/clients/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "phone": "+48123456789"
  }'
```

#### 3. Admin Panel
- [ ] https://sanbud24.pl/admin/login accessible
- [ ] Can login with admin credentials
- [ ] Dashboard loads
- [ ] Can view clients, services, appointments

#### 4. SSL/Security
```bash
# Check security headers
curl -I https://sanbud24.pl | grep -i "strict-transport-security\|x-frame-options\|x-content-type"

# Check SSL certificate
openssl s_client -connect sanbud24.pl:443 -servername sanbud24.pl < /dev/null | grep -A 5 "Certificate chain"
```

#### 5. Performance
- [ ] Page loads in < 3 seconds
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Mobile responsive

### Test User Flows
1. **Book Appointment**: Navigate to services → select service → book
2. **Contact Form**: Fill contact form → submit → verify in admin
3. **Portfolio**: View portfolio page → images load correctly
4. **Partners**: Partners section displays correctly

---

## 📊 Monitoring & Maintenance

### Azure Monitor Setup
```bash
# Enable Application Insights for backend
az monitor app-insights component create \
  --app sanbud-api-insights \
  --location westeurope \
  --resource-group rg-sanbud-prod \
  --application-type web

# Get instrumentation key
INSIGHTS_KEY=$(az monitor app-insights component show \
  --app sanbud-api-insights \
  --resource-group rg-sanbud-prod \
  --query "instrumentationKey" -o tsv)

# Add to Web App
az webapp config appsettings set \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$INSIGHTS_KEY
```

### View Logs
```bash
# Backend logs (real-time)
az webapp log tail \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod

# Download logs
az webapp log download \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --log-file backend-logs.zip

# Frontend logs (Static Web Apps)
az staticwebapp logs show \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod
```

### Scaling
```bash
# Scale backend (if needed)
az appservice plan update \
  --name plan-sanbud-backend-prod \
  --resource-group rg-sanbud-prod \
  --sku P1V2  # Premium plan

# Scale instances
az webapp scale \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --instance-count 2
```

### Backup Configuration
```bash
# Create storage account for backups
az storage account create \
  --name sanbudbackups \
  --resource-group rg-sanbud-prod \
  --location westeurope \
  --sku Standard_LRS

# Configure backup
az webapp backup create \
  --webapp-name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --backup-name initial-backup \
  --container-url "<storage-account-sas-url>"
```

---

## 🔄 Update Procedure

When you make changes to your code:

```bash
# 1. Make changes locally
cd /Users/haos/azure-san-bud

# 2. Test locally
source venv/bin/activate
python run.py  # Backend
cd frontend && npm run dev  # Frontend

# 3. Commit and push
git add .
git commit -m "Your changes"
git push origin main

# 4. GitHub Actions automatically deploys!
gh run watch

# 5. Verify deployment
./check-domain.sh
```

---

## 🆘 Troubleshooting

### Issue: DNS not propagating
```bash
# Check current DNS
dig sanbud24.pl +trace

# Flush local DNS cache (macOS)
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Check from different locations
# https://dnschecker.org/#A/sanbud24.pl
```

### Issue: SSL not working
```bash
# Check certificate status
az staticwebapp show \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod \
  --query "customDomains" -o table

# Force SSL renewal
az webapp config ssl upload \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod
```

### Issue: Backend API errors
```bash
# Check logs
az webapp log tail \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod

# Restart app
az webapp restart \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod

# Check database connection
az webapp ssh --name app-sanbud-api-prod --resource-group rg-sanbud-prod
# Inside SSH: python -c "from app import db; print(db)"
```

### Issue: Frontend not updating
```bash
# Clear Static Web App cache
az staticwebapp reset \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod

# Redeploy
cd frontend
npm run build
# Push to trigger deployment
```

---

## 📝 Post-Deployment Checklist

- [ ] All DNS records configured and propagating
- [ ] HTTPS working on all domains (sanbud24.pl, www, api)
- [ ] Admin password changed from default
- [ ] Application Insights enabled
- [ ] Backup configured
- [ ] Monitoring alerts set up
- [ ] Database migrations ran successfully
- [ ] Admin user created
- [ ] All API endpoints responding correctly
- [ ] Contact form working and creating records
- [ ] Email notifications configured (if applicable)
- [ ] Google Analytics added (if needed)
- [ ] Security headers verified
- [ ] Performance tested (Lighthouse > 90)
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing completed
- [ ] SSL certificate A+ rating

---

## 🎉 Success Indicators

Your site is live when:

1. ✅ **https://sanbud24.pl** loads instantly
2. ✅ **SSL certificate** shows as secure (padlock icon)
3. ✅ **API responds**: `curl https://api.sanbud24.pl/api/health` returns `{"status":"healthy"}`
4. ✅ **Admin panel** accessible and functional
5. ✅ **DNS propagated** globally (check https://dnschecker.org)
6. ✅ **No console errors** in browser DevTools
7. ✅ **All images** loading correctly
8. ✅ **Forms submitting** and creating database records
9. ✅ **Lighthouse score** > 90 for performance

---

## 📞 Support

**Azure Support:**
- Portal: https://portal.azure.com
- Documentation: https://docs.microsoft.com/azure

**Project Repository:**
- GitHub: https://github.com/kozuchowskihubert/azure-san-bud

**Quick Commands Reference:**
```bash
# Check backend status
az webapp show --name app-sanbud-api-prod --resource-group rg-sanbud-prod --query "state"

# Check frontend status  
az staticwebapp show --name swa-sanbud-frontend-prod --resource-group rg-sanbud-prod --query "status"

# View real-time logs
az webapp log tail --name app-sanbud-api-prod --resource-group rg-sanbud-prod

# Restart backend
az webapp restart --name app-sanbud-api-prod --resource-group rg-sanbud-prod
```

---

**Ready to go live? Start with Step 1 and follow the guide! 🚀**
