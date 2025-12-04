# 🚀 Blue-Green Deployment with Azure Slots

Quick start guide for zero-downtime deployments using Azure deployment slots.

## 📋 Overview

**Blue-Green Deployment** strategy using Azure App Service slots:
- Deploy to **STAGING** slot first
- Validate health checks
- **SWAP** to production (instant, zero downtime)
- Instant rollback capability

## 🎯 Quick Start

### 1. Create Staging Slot (One-time setup)

```bash
./scripts/create-deployment-slot.sh
```

This creates the `staging` slot with proper configuration.

### 2. Deploy Using New Workflow

```bash
# Push to main triggers automatic deployment
git push origin main

# Workflow: .github/workflows/deploy-with-slots.yml
# Steps:
#   1. ✅ Validate code
#   2. 🚀 Deploy to staging
#   3. 🏥 Health check staging
#   4. 🔄 Swap to production
#   5. ✅ Verify production
```

### 3. Manage Slots

```bash
# Check status
./scripts/manage-slots.sh status

# Manual swap
./scripts/manage-slots.sh swap

# Rollback
./scripts/manage-slots.sh rollback

# Test staging
./scripts/manage-slots.sh test

# View logs
./scripts/manage-slots.sh logs
```

## 📊 Deployment Flow

```
┌─────────────┐
│   GitHub    │
│     Push    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Validate   │
│  & Build    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Deploy to STAGING  │  ← New code here first
│  (staging slot)     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────┐
│  Health Check   │
│  10 attempts    │
│  5s interval    │
└──────┬──────────┘
       │
    ✅ Healthy?
       │
       ├─ NO → ❌ STOP (production untouched)
       │
       └─ YES → Continue
                  │
                  ▼
           ┌──────────────┐
           │  SWAP SLOTS  │  ← Instant switch
           │  ~2 seconds  │
           └──────┬───────┘
                  │
                  ▼
           ┌──────────────┐
           │  Production  │  ← New code live
           │  + Staging   │  ← Old code preserved
           └──────┬───────┘
                  │
                  ▼
           ┌──────────────┐
           │    Verify    │
           │  Production  │
           └──────────────┘
```

## 🔧 Available Scripts

### `create-deployment-slot.sh`
Creates Azure staging slot with configuration
```bash
./scripts/create-deployment-slot.sh
```

### `manage-slots.sh`
Manage deployment slots operations
```bash
# Show status
./scripts/manage-slots.sh status

# Swap staging → production
./scripts/manage-slots.sh swap

# Rollback (swap back)
./scripts/manage-slots.sh rollback

# Test staging health
./scripts/manage-slots.sh test

# View staging logs
./scripts/manage-slots.sh logs

# Restart staging
./scripts/manage-slots.sh restart
```

## 🎛️ Workflow Options

### Deploy to Staging Only (No Swap)
Use when testing without affecting production:

1. Go to GitHub Actions
2. Run workflow: "Deploy with Slots (Blue-Green)"
3. Check: **"Deploy to staging only"**
4. Test on: `https://app-sanbud-api-prod-staging.azurewebsites.net`

### Manual Swap After Testing
```bash
./scripts/manage-slots.sh swap
```

### Rollback to Previous Version
```bash
# Option 1: Script
./scripts/manage-slots.sh rollback

# Option 2: GitHub Actions
# Run workflow → Check "rollback"

# Option 3: Azure CLI
az webapp deployment slot swap \
  --resource-group rg-sanbud-prod \
  --name app-sanbud-api-prod \
  --slot staging \
  --target-slot production
```

## 🔍 Health Checks

### Staging Health Validation
Before swap, workflow checks:
- `GET /health` (10 attempts, 5s interval)
- Must return HTTP 200
- Response: `{"status": "healthy"}`

### Production Verification
After swap, workflow verifies:
- Azure URL: `https://app-sanbud-api-prod.azurewebsites.net/health`
- Custom domain: `https://api.sanbud24.pl/health`

## 📍 URLs

### Production
- Azure: `https://app-sanbud-api-prod.azurewebsites.net`
- Custom: `https://api.sanbud24.pl`

### Staging
- Azure: `https://app-sanbud-api-prod-staging.azurewebsites.net`

## ⚙️ Sticky Settings

These settings **stay with the slot** (don't swap):
```bash
DEPLOYMENT_SLOT=staging
WEBSITE_SLOT_NAME=staging
SLOT_SWAP_ENABLED=true
```

These settings **swap with code**:
```bash
DATABASE_URL
FLASK_SECRET_KEY
JWT_SECRET_KEY
ADMIN_INIT_PASSWORD
SMTP_*
GOOGLE_PLACES_API_KEY
```

## 🚨 Troubleshooting

### Staging Health Check Fails
```bash
# View logs
./scripts/manage-slots.sh logs

# Test manually
curl https://app-sanbud-api-prod-staging.azurewebsites.net/health

# Restart staging
./scripts/manage-slots.sh restart
```

### Production Issues After Swap
```bash
# Immediate rollback
./scripts/manage-slots.sh rollback

# Check production logs
az webapp log tail \
  --resource-group rg-sanbud-prod \
  --name app-sanbud-api-prod
```

### Swap Fails
```bash
# Check if slot exists
./scripts/manage-slots.sh status

# Verify Azure login
az account show

# Check resource group
az group show --name rg-sanbud-prod
```

## 📚 Documentation

Full documentation: [`docs/DEPLOYMENT_SLOTS.md`](../docs/DEPLOYMENT_SLOTS.md)

Topics covered:
- Architecture diagrams
- Detailed workflow steps
- Slot configuration
- Best practices
- Migration plan
- Common commands

## ✅ Benefits

### Zero Downtime
- Instant swap (~2 seconds)
- No service interruption
- No connection drops

### Safe Deployments
- Test in staging first
- Health checks required
- Auto-abort on failure

### Quick Rollback
- Instant swap back
- Previous version in staging
- No rebuild needed

### Pre-Production Testing
- Production-like environment
- Same configuration
- Same Azure region

## 🎯 Next Steps

1. **Create slot** (one-time):
   ```bash
   ./scripts/create-deployment-slot.sh
   ```

2. **Test deployment**:
   ```bash
   git push origin main
   # Watch GitHub Actions
   ```

3. **Verify**:
   ```bash
   ./scripts/manage-slots.sh status
   ```

4. **Practice rollback**:
   ```bash
   ./scripts/manage-slots.sh rollback
   ```

---

**Questions?** See full docs: `docs/DEPLOYMENT_SLOTS.md`
