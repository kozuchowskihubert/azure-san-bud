# GitHub Actions CI/CD Workflow

## Overview

This workflow provides automated deployment for SanBud24.pl to Azure, including:
- **Backend:** Flask API deployed to Azure Web App
- **Frontend:** Next.js application deployed to Azure Static Web Apps
- **Validation:** Automated testing and linting
- **Verification:** Health checks and endpoint testing

## Workflow Structure

```
┌──────────────┐
│   Validate   │ ← Run tests, linting
└──────┬───────┘
       │
       ├────────────┬─────────────┐
       ▼            ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Build   │  │  Deploy  │  │  Deploy  │
│ Frontend │  │ Backend  │  │ Frontend │
└──────┬───┘  └────┬─────┘  └────┬─────┘
       │           │              │
       └───────────┴──────────────┘
                   │
                   ▼
            ┌──────────┐
            │  Verify  │ ← Health checks
            └────┬─────┘
                 │
                 ▼
            ┌──────────┐
            │  Notify  │ ← Deployment summary
            └──────────┘
```

## Stages

### 1. Validate (3-5 minutes)
- **Backend:** Python tests, dependency installation
- **Frontend:** Node.js linting, build validation
- **Output:** Validation summary in GitHub Actions UI

### 2. Build Frontend (2-3 minutes)
- Installs npm dependencies with caching
- Builds Next.js application for production
- Validates environment variables

### 3. Deploy Backend (3-5 minutes)
- Creates deployment ZIP package
- Authenticates to Azure using Service Principal
- Deploys to Azure Web App via Azure CLI
- Restarts application

### 4. Deploy Frontend (3-5 minutes)
- Builds Next.js with production config
- Deploys to Azure Static Web Apps
- Updates custom domains (www.sanbud24.pl)

### 5. Verify Deployment (1-2 minutes)
- Waits for application startup
- Backend health check (5 retries with backoff)
- Frontend accessibility check
- API endpoint testing

### 6. Notify (< 1 minute)
- Collects all stage results
- Generates deployment summary
- Provides quick links and rollback instructions

---

## Trigger Events

### Automatic Deployment
```yaml
on:
  push:
    branches:
      - main
```

Triggered automatically when code is pushed to `main` branch.

### Manual Deployment
```yaml
on:
  workflow_dispatch:
    inputs:
      skip_verification:
        description: 'Skip verification stage'
        default: 'false'
```

Trigger manually from GitHub Actions UI:
1. Go to **Actions** tab
2. Select **Deploy SanBud to Azure Production**
3. Click **Run workflow**
4. Choose branch and options

---

## Required Secrets

All secrets must be configured in **Settings → Secrets and variables → Actions**

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `AZURE_CREDENTIALS` | Service Principal JSON | See [SECRETS_SETUP.md](.github/SECRETS_SETUP.md) |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Frontend deployment token | Azure Portal or CLI |

See [`.github/SECRETS_SETUP.md`](.github/SECRETS_SETUP.md) for detailed setup instructions.

---

## Environment Variables

### Backend Deployment
```yaml
AZURE_WEBAPP_NAME: app-sanbud-api-prod
RESOURCE_GROUP: rg-sanbud-prod
PYTHON_VERSION: '3.11'
```

### Frontend Deployment
```yaml
NODE_VERSION: '20'
STATIC_WEB_APP_NAME: swa-sanbud-frontend-prod

# Build-time environment variables:
NEXT_PUBLIC_API_URL: https://api.sanbud24.pl/api
NEXT_PUBLIC_DOMAIN: sanbud24.pl
NEXT_PUBLIC_SITE_URL: https://sanbud24.pl
NEXT_PUBLIC_PHONE: +48503691808
NEXT_PUBLIC_EMAIL: kontakt@sanbud24.pl
NEXT_PUBLIC_DEFAULT_LOCALE: pl
```

---

## Deployment Flow

### Success Path
```
1. Code pushed to main
2. Validate stage runs (tests pass)
3. Build frontend (successful)
4. Deploy backend (HTTP 200)
5. Deploy frontend (published)
6. Verify deployment (health checks pass)
7. Notify (success message) ✅
```

### Typical Duration
- **Total:** 12-18 minutes
- **Validate:** 3-5 min
- **Build:** 2-3 min
- **Deploy Backend:** 3-5 min
- **Deploy Frontend:** 3-5 min
- **Verify:** 1-2 min
- **Notify:** < 1 min

---

## Monitoring Deployments

### GitHub Actions UI
1. Go to **Actions** tab in repository
2. Click on the latest workflow run
3. View real-time logs for each stage
4. Check deployment summary at bottom

### Azure CLI
```bash
# Watch backend logs
az webapp log tail \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod

# Check backend status
az webapp show \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --query state -o tsv

# Check frontend status
az staticwebapp show \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod \
  --query status -o tsv
```

### Quick Health Checks
```bash
# Backend
curl https://api.sanbud24.pl/health

# Frontend
curl -I https://www.sanbud24.pl

# Services API
curl https://api.sanbud24.pl/api/services
```

---

## Troubleshooting

### Deployment Fails at Validate Stage

**Symptoms:** Tests fail or linting errors

**Solutions:**
```bash
# Run tests locally
cd backend
pytest

# Run linting
cd frontend
npm run lint
```

### Deployment Fails at Backend Deploy

**Symptoms:** Azure CLI authentication fails

**Solutions:**
1. Check `AZURE_CREDENTIALS` secret is valid
2. Verify Service Principal has Contributor role:
   ```bash
   az role assignment list \
     --assignee <client-id> \
     --resource-group rg-sanbud-prod
   ```
3. Reset Service Principal credentials:
   ```bash
   az ad sp credential reset --id <client-id>
   # Update AZURE_CREDENTIALS secret with new clientSecret
   ```

### Deployment Fails at Frontend Deploy

**Symptoms:** Static Web Apps deployment fails

**Solutions:**
1. Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` is correct:
   ```bash
   az staticwebapp secrets list \
     --name swa-sanbud-frontend-prod \
     --resource-group rg-sanbud-prod
   ```
2. Regenerate token if needed:
   ```bash
   az staticwebapp secrets reset-api-key \
     --name swa-sanbud-frontend-prod \
     --resource-group rg-sanbud-prod
   ```

### Health Checks Fail

**Symptoms:** Verify stage reports unhealthy

**Solutions:**
1. Wait 2-3 minutes for app to fully start
2. Check backend logs in Azure Portal
3. Verify database connection:
   ```bash
   az webapp config appsettings list \
     --name app-sanbud-api-prod \
     --resource-group rg-sanbud-prod \
     | grep DATABASE
   ```

---

## Rollback Procedure

If deployment fails or causes issues:

### Method 1: GitHub Actions (Recommended)
```bash
# Find previous working commit
git log --oneline -n 10

# Create a revert commit
git revert <bad-commit-sha>
git push origin main

# Or force push previous commit
git push origin <good-commit-sha>:main --force
```

### Method 2: Azure CLI (Fast)
```bash
# Get previous deployment
az webapp deployment list \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod

# Restore specific deployment
az webapp deployment source sync \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod
```

---

## Comparison with Previous Workflow

### Old Workflow (Publish Profile)
- ❌ Used `azure/webapps-deploy@v3` with publish profiles
- ❌ Publish profile authentication was unstable
- ❌ No comprehensive validation or health checks
- ❌ Limited error reporting

### New Workflow (Service Principal + Azure CLI)
- ✅ Uses Azure CLI with Service Principal (more reliable)
- ✅ Comprehensive validation and testing
- ✅ Automated health checks with retries
- ✅ Detailed deployment summaries and notifications
- ✅ Structured stages with clear dependencies
- ✅ Better error handling and rollback instructions
- ✅ Modeled after proven azure-psql-app workflow

---

## Live URLs

After successful deployment:

| Service | URL | Purpose |
|---------|-----|---------|
| **Website** | https://www.sanbud24.pl | Main public website |
| **API** | https://api.sanbud24.pl | Backend API (custom domain) |
| **Backend Direct** | https://app-sanbud-api-prod.azurewebsites.net | Direct App Service URL |
| **Frontend Direct** | https://delightful-wave-0fb6d2d03.3.azurestaticapps.net | Direct Static Web App URL |
| **Health Check** | https://api.sanbud24.pl/health | Backend health endpoint |

---

## Performance Optimizations

The workflow includes several optimizations:

1. **Dependency Caching**
   - Python: `cache: 'pip'`
   - Node.js: `cache: 'npm'`
   - Speeds up subsequent runs by 30-50%

2. **Parallel Jobs**
   - Backend and frontend validation run in parallel
   - Deployments run concurrently after validation

3. **Smart Retries**
   - Health checks retry 5 times with exponential backoff
   - Reduces false negatives from slow app startups

4. **Deployment Summary**
   - GitHub Step Summary reduces need to check logs
   - Quick links for immediate access to live URLs

---

## References

- **Reference Workflow:** [azure-psql-app](https://github.com/kozuchowskihubert/azure-psql-app/blob/main/.github/workflows/deploy-azure-infrastructure.yml)
- **Azure Web Apps Deploy:** [Azure/webapps-deploy](https://github.com/Azure/webapps-deploy)
- **Static Web Apps Deploy:** [Azure/static-web-apps-deploy](https://github.com/Azure/static-web-apps-deploy)
- **Azure Login:** [azure/login](https://github.com/Azure/login)

---

**Workflow Version:** 2.0  
**Last Updated:** 2025-01-24  
**Status:** ✅ Production Ready
