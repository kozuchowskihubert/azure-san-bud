# Azure Deployment Slots - Blue-Green Deployment Strategy

## Overview

This document describes the blue-green deployment strategy using Azure App Service deployment slots for zero-downtime deployments.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     DEPLOYMENT FLOW                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. GitHub Push → CI/CD Trigger                             │
│                                                              │
│  2. Build & Test                                            │
│     ├─ Python tests                                         │
│     ├─ Frontend build                                       │
│     └─ Validation                                           │
│                                                              │
│  3. Deploy to STAGING Slot                                  │
│     ├─ Upload deployment package                            │
│     ├─ Restart slot                                         │
│     └─ Warm up (30s)                                        │
│                                                              │
│  4. Health Check Staging                                    │
│     ├─ /health endpoint (10 attempts)                       │
│     ├─ /api/health validation                               │
│     └─ Pass/Fail decision                                   │
│                                                              │
│  5. SWAP Staging ↔ Production                               │
│     ├─ Zero-downtime swap                                   │
│     ├─ Instant switch                                       │
│     └─ Previous prod → staging                              │
│                                                              │
│  6. Verify Production                                       │
│     ├─ Health checks                                        │
│     ├─ Custom domain check                                  │
│     └─ Monitoring                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Slots Configuration

### Production Slot
- **Name**: `app-sanbud-api-prod`
- **URL**: https://app-sanbud-api-prod.azurewebsites.net
- **Custom Domain**: https://api.sanbud24.pl
- **Purpose**: Live production traffic

### Staging Slot
- **Name**: `app-sanbud-api-prod/staging`
- **URL**: https://app-sanbud-api-prod-staging.azurewebsites.net
- **Purpose**: Pre-production validation

## Slot-Specific Settings (Sticky)

These settings are "sticky" to their slot and **do NOT swap**:

```bash
DEPLOYMENT_SLOT=staging          # Identifies which slot
WEBSITE_SLOT_NAME=staging        # Azure internal slot name
SLOT_SWAP_ENABLED=true           # Enables slot swapping
```

## Settings That SWAP

These settings move with the code during swap:

```bash
DATABASE_URL                     # PostgreSQL connection
FLASK_SECRET_KEY                 # Application secret
JWT_SECRET_KEY                   # JWT signing key
ADMIN_INIT_PASSWORD             # Admin credentials
SMTP_*                          # Email configuration
GOOGLE_PLACES_API_KEY           # API keys
```

## Deployment Workflows

### 1. Standard Deployment (Blue-Green)

```bash
# Trigger: Push to main branch
git push origin main

# Workflow: deploy-with-slots.yml
# Steps:
#   1. Validate code
#   2. Deploy to staging slot
#   3. Health check staging
#   4. Swap to production (if healthy)
#   5. Verify production
```

### 2. Deploy to Staging Only (Testing)

```bash
# Use workflow dispatch with skip_swap=true
# GitHub Actions UI → Run workflow → Check "skip_swap"

# This deploys to staging but does NOT swap to production
# Useful for:
#   - Testing new features
#   - Pre-production validation
#   - Load testing on staging URL
```

### 3. Manual Rollback

```bash
# Option A: GitHub Actions UI
# Run workflow → Check "rollback" option

# Option B: Azure CLI
az webapp deployment slot swap \
  --resource-group rg-sanbud-prod \
  --name app-sanbud-api-prod \
  --slot staging \
  --target-slot production
```

## Setup Instructions

### 1. Create Deployment Slot

```bash
cd /Users/haos/azure-san-bud
./scripts/create-deployment-slot.sh
```

This script:
- Creates `staging` slot
- Configures sticky settings
- Enables health checks
- Sets up deployment configuration

### 2. Configure GitHub Secrets

Ensure these secrets exist in GitHub:
- `AZURE_CREDENTIALS` - Service Principal for Azure login
- `ADMIN_INIT_PASSWORD` - Admin password
- `DATABASE_URL` - PostgreSQL connection string

### 3. Update Workflow

The new workflow `deploy-with-slots.yml` is ready to use. You can:

**Option A**: Replace current workflow
```bash
mv .github/workflows/azure-sanbud-deploy.yml .github/workflows/azure-sanbud-deploy.yml.backup
mv .github/workflows/deploy-with-slots.yml .github/workflows/azure-sanbud-deploy.yml
```

**Option B**: Run both workflows
- Keep current workflow for now
- Test new workflow manually first
- Switch after validation

## Health Check Endpoints

The deployment validates these endpoints:

### Required
- `GET /health` - Basic health check
  - Response: `{"status": "healthy"}`
  - Status: 200 OK

### Optional
- `GET /api/health` - API health check
- `GET /admin/health` - Admin panel check

## Rollback Strategy

### Automatic Rollback
If staging health checks fail:
- ❌ Swap is CANCELLED
- ✅ Previous production remains live
- ⚠️ Staging slot has new code (for debugging)

### Manual Rollback
If production issues detected after swap:

```bash
# 1. Trigger rollback workflow
gh workflow run deploy-with-slots.yml -f rollback=true

# 2. Or use Azure CLI
az webapp deployment slot swap \
  --resource-group rg-sanbud-prod \
  --name app-sanbud-api-prod \
  --slot staging \
  --target-slot production

# 3. Or use Azure Portal
# App Service → Deployment slots → Swap → Confirm
```

## Monitoring

### During Deployment
- GitHub Actions logs (real-time)
- Azure Portal → App Service → Deployment Center
- Staging URL health checks

### After Swap
- Application Insights
- Azure Monitor
- Custom domain health
- Error logs

## Benefits

### Zero Downtime
- Instant slot swap (~2 seconds)
- No service interruption
- No connection drops

### Safe Deployments
- Validate before production
- Health checks required
- Automatic rollback on failure

### Quick Rollback
- Instant swap back (~2 seconds)
- Previous version preserved in staging
- No rebuild required

### Testing in Production-like Environment
- Staging slot uses production configuration
- Same Azure region
- Same app settings (except sticky)

## Common Commands

```bash
# Check slot status
az webapp deployment slot list \
  --resource-group rg-sanbud-prod \
  --name app-sanbud-api-prod

# View slot URL
az webapp deployment slot list \
  --resource-group rg-sanbud-prod \
  --name app-sanbud-api-prod \
  --query "[?name=='staging'].defaultHostName" -o tsv

# Manual swap
az webapp deployment slot swap \
  --resource-group rg-sanbud-prod \
  --name app-sanbud-api-prod \
  --slot staging \
  --target-slot production

# Restart staging slot
az webapp restart \
  --resource-group rg-sanbud-prod \
  --name app-sanbud-api-prod \
  --slot staging

# Check staging logs
az webapp log tail \
  --resource-group rg-sanbud-prod \
  --name app-sanbud-api-prod \
  --slot staging
```

## Troubleshooting

### Staging Health Check Fails
```bash
# Check staging logs
az webapp log tail \
  --resource-group rg-sanbud-prod \
  --name app-sanbud-api-prod \
  --slot staging

# Test staging URL directly
curl https://app-sanbud-api-prod-staging.azurewebsites.net/health

# Check app settings
az webapp config appsettings list \
  --resource-group rg-sanbud-prod \
  --name app-sanbud-api-prod \
  --slot staging
```

### Swap Fails
- Check if slot exists
- Verify permissions
- Ensure no active deployments
- Check Azure service health

### Production Issues After Swap
- Immediate rollback (swap back)
- Check production logs
- Verify database connectivity
- Test custom domain

## Best Practices

1. **Always test staging first**
   - Use staging URL to verify deployment
   - Run smoke tests
   - Check all critical endpoints

2. **Monitor swap process**
   - Watch GitHub Actions logs
   - Monitor Application Insights
   - Check error rates

3. **Keep staging ready for rollback**
   - Don't deploy to staging again until production is stable
   - Staging holds the previous production version after swap

4. **Use health checks**
   - Implement robust `/health` endpoint
   - Check database connectivity
   - Verify external services

5. **Test rollback procedure**
   - Practice rollback in non-critical time
   - Document rollback steps
   - Train team on rollback process

## Migration Plan

### Phase 1: Setup (Now)
- ✅ Create deployment slot script
- ✅ Create new workflow
- ✅ Document strategy

### Phase 2: Testing (Next)
- Run `create-deployment-slot.sh`
- Test deployment to staging
- Validate health checks

### Phase 3: Activation
- Swap workflow files
- First production deployment
- Monitor and validate

### Phase 4: Optimization
- Fine-tune health checks
- Adjust timeouts
- Add more validation steps
