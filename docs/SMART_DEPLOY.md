# Smart CI/CD with Change Detection

## Overview

Intelligent CI/CD pipeline that detects which components changed and **only deploys what's necessary**, saving time and resources.

## 🎯 How It Works

### Change Detection
The workflow analyzes git changes and determines:
- **Backend changed?** → Deploy backend to staging → Swap to production
- **Frontend changed?** → Deploy frontend to Azure Static Web Apps
- **Both changed?** → Deploy both independently
- **Only docs?** → Skip deployment entirely

### Path Mapping

```yaml
Backend triggers:
  - app/**                 # Flask application code
  - config/**              # Configuration files
  - scripts/**             # Backend scripts
  - migrations/**          # Database migrations
  - requirements.txt       # Python dependencies
  - run.py                 # Application entry point
  - Dockerfile*            # Container configurations

Frontend triggers:
  - frontend/**            # Next.js application

Docs only (no deployment):
  - docs/**                # Documentation
  - *.md                   # Markdown files
  - README.md
```

## 🚀 Deployment Scenarios

### Scenario 1: Backend Code Change
```bash
# You changed: app/routes/admin.py
git commit -m "Fix admin login"
git push

# CI/CD executes:
✅ Validate backend
❌ Skip frontend validation
✅ Deploy backend to staging
✅ Health check staging
✅ Swap to production
❌ Skip frontend deployment

# Time saved: ~5 minutes (no frontend build)
```

### Scenario 2: Frontend Code Change
```bash
# You changed: frontend/components/Header.tsx
git commit -m "Update header design"
git push

# CI/CD executes:
❌ Skip backend validation
✅ Validate frontend
❌ Skip backend deployment
✅ Deploy frontend to Azure Static Web Apps

# Time saved: ~8 minutes (no backend deployment)
```

### Scenario 3: Both Changed
```bash
# You changed: app/routes/api.py + frontend/pages/index.tsx
git commit -m "Add new API endpoint and UI"
git push

# CI/CD executes:
✅ Validate backend
✅ Validate frontend
✅ Deploy backend (staging → production)
✅ Deploy frontend

# Full deployment (both components needed)
```

### Scenario 4: Documentation Only
```bash
# You changed: docs/API_GUIDE.md
git commit -m "Update API documentation"
git push

# CI/CD executes:
✅ Detect changes
❌ Skip backend (no code changes)
❌ Skip frontend (no code changes)
✅ Complete (no deployment needed)

# Time saved: ~15 minutes (entire deployment skipped)
```

## 📊 Benefits

### Time Savings
| Scenario | Traditional | Smart Deploy | Time Saved |
|----------|------------|--------------|------------|
| Backend only | 15 min | 10 min | **5 min** |
| Frontend only | 15 min | 7 min | **8 min** |
| Docs only | 15 min | 1 min | **14 min** |

### Cost Savings
- **Fewer backend deployments** = Less Azure App Service deployment time
- **Fewer frontend builds** = Less GitHub Actions minutes
- **Skip unnecessary deploys** = Lower CI/CD costs

### Better Developer Experience
- **Faster feedback** - See results quicker
- **Clearer logs** - Only relevant jobs run
- **Focused testing** - Test what changed

## 🔧 Workflow Files

### Primary Workflow: `smart-deploy.yml`
**File:** `.github/workflows/smart-deploy.yml`

**When to use:**
- ✅ Automatic deploys on push to main
- ✅ Daily development work
- ✅ Most deployments

**Features:**
- Change detection
- Conditional job execution
- Smart resource usage

### Blue-Green Workflow: `deploy-with-slots.yml`
**File:** `.github/workflows/deploy-with-slots.yml`

**When to use:**
- Critical production releases
- Manual deployments
- Testing slot swap mechanism

**Features:**
- Always deploys both components
- Blue-green deployment
- Manual swap control

### Original Workflow: `azure-sanbud-deploy.yml`
**File:** `.github/workflows/azure-sanbud-deploy.yml`

**When to use:**
- Backup deployment method
- Debugging CI/CD issues
- Legacy compatibility

**Features:**
- Simple, always runs all steps
- Well-tested, stable
- No change detection

## 🎮 Manual Controls

### Force Backend Deployment
```bash
# GitHub Actions UI:
# 1. Go to Actions tab
# 2. Select "Smart Deploy (Change Detection)"
# 3. Click "Run workflow"
# 4. Check "Force backend deployment"
# 5. Run

# Even if backend didn't change, it will deploy
```

### Force Frontend Deployment
```bash
# Same as above, but check "Force frontend deployment"
```

### Deploy to Staging Only (No Swap)
```bash
# Use for testing:
# 1. Run workflow
# 2. Check "Deploy to staging only"
# 3. Test on staging URL
# 4. Manual swap later with: ./scripts/manage-slots.sh swap
```

## 📋 Workflow Jobs Breakdown

### 1. `detect-changes`
**Always runs first**
- Analyzes git diff
- Compares current commit to previous
- Sets output flags: `backend`, `frontend`, `docs`
- Creates summary table

**Outputs:**
```yaml
outputs:
  backend: 'true'      # Backend changed
  frontend: 'false'    # Frontend didn't change
  docs: 'false'        # Docs didn't change
  any_code: 'true'     # Any code changed
```

### 2. `validate-backend`
**Runs if:** `backend == 'true'`
- Setup Python 3.11
- Install requirements.txt
- Run pytest tests
- Lint with flake8

**Skips if:** Only frontend changed

### 3. `validate-frontend`
**Runs if:** `frontend == 'true'`
- Setup Node.js 20
- npm ci (clean install)
- npm run lint
- npm run build (test build)

**Skips if:** Only backend changed

### 4. `deploy-backend`
**Runs if:**
- Backend validation passed
- Backend code changed OR force_backend=true

**Steps:**
1. Create deployment zip
2. Deploy to staging slot
3. Restart staging
4. Wait 30s for warmup
5. Health check (10 attempts)

**Fails if:** Health check fails (swap is cancelled)

### 5. `swap-to-production`
**Runs if:**
- Backend deployment succeeded
- skip_swap != true
- Not a pull request

**Steps:**
1. Azure login
2. Swap staging ↔ production
3. Wait 20s
4. Verify production health

**Instant rollback available:** Previous production is now in staging

### 6. `deploy-frontend`
**Runs if:**
- Frontend validation passed
- Frontend code changed OR force_frontend=true
- Not a pull request

**Steps:**
1. Build Next.js
2. Deploy to Azure Static Web Apps
3. Automatic distribution to CDN

### 7. `summary`
**Always runs last**
- Aggregates results from all jobs
- Creates deployment summary
- Shows what was deployed
- Lists live URLs

## 🔍 How to Check What Will Deploy

### Before Pushing
```bash
# Check what you changed
git status
git diff main

# If you see changes in app/, config/, scripts/:
#   → Backend will deploy

# If you see changes in frontend/:
#   → Frontend will deploy

# If you only see changes in docs/, *.md:
#   → Nothing will deploy (docs only)
```

### After Pushing
1. Go to GitHub Actions
2. Click on the running workflow
3. Look at "Detect Changes" job
4. See the summary table:

```
| Component | Changed |
|-----------|---------|
| Backend   | true    |
| Frontend  | false   |
| Docs      | false   |

✅ Backend will be deployed
⏭️  Frontend deployment skipped (no changes)
```

## ⚙️ Configuration

### Add More Backend Paths
Edit `.github/workflows/smart-deploy.yml`:

```yaml
backend:
  - 'app/**'
  - 'config/**'
  - 'your-new-backend-path/**'  # Add here
```

### Add More Frontend Paths
```yaml
frontend:
  - 'frontend/**'
  - 'your-new-frontend-path/**'  # Add here
```

### Ignore Certain Files
```yaml
backend:
  - 'app/**'
  - '!app/tests/**'  # Ignore tests directory
```

## 🚨 Troubleshooting

### Change Detection Not Working
```bash
# Check git history depth
# The workflow uses fetch-depth: 0 to get full history

# If issues persist, force deployment:
# GitHub UI → Run workflow → Check force options
```

### Backend Deploys When It Shouldn't
```bash
# Check path filters in workflow
# Verify no backend files in your commit:
git diff HEAD~1 --name-only
```

### Frontend Skips When It Should Deploy
```bash
# Ensure changes are in frontend/ directory
# Check path filters match your structure
# Use force_frontend option if needed
```

## 📚 Related Documentation

- **Deployment Slots:** [`docs/DEPLOYMENT_SLOTS.md`](DEPLOYMENT_SLOTS.md)
- **Slot Management:** [`docs/deployment-slots-quickstart.md`](deployment-slots-quickstart.md)
- **GitHub Secrets:** [`docs/GITHUB_SECRETS.md`](GITHUB_SECRETS.md)

## 🎯 Best Practices

### 1. Separate Commits
```bash
# Good: Backend and frontend in separate commits
git commit -m "Backend: Add new API endpoint" app/
git commit -m "Frontend: Add API integration" frontend/

# Better for change detection
# Each can deploy independently
```

### 2. Use Semantic Commits
```bash
git commit -m "feat(backend): Add user profile API"
git commit -m "docs: Update API documentation"
git commit -m "fix(frontend): Correct header alignment"

# Clear indication of what changed
```

### 3. Test Staging Before Swap
```bash
# For critical changes:
# 1. Push with skip_swap=true
# 2. Test staging URL manually
# 3. Swap manually: ./scripts/manage-slots.sh swap
```

### 4. Monitor First Few Runs
```bash
# Watch the change detection job closely
# Verify correct components are being deployed
# Adjust path filters if needed
```

## 📈 Metrics to Track

- **Average deployment time** (before vs after)
- **Number of skipped deployments**
- **GitHub Actions minutes used**
- **False positives** (deployed when shouldn't)
- **False negatives** (skipped when shouldn't)

## 🔄 Migration from Old Workflow

### Option 1: Replace Entirely (Recommended)
```bash
cd .github/workflows
mv azure-sanbud-deploy.yml azure-sanbud-deploy.yml.backup
mv smart-deploy.yml azure-sanbud-deploy.yml
```

### Option 2: Run Both Temporarily
Keep both workflows:
- `smart-deploy.yml` - For most commits
- `azure-sanbud-deploy.yml` - For critical releases

Disable one after testing:
```yaml
on:
  push:
    branches:
      - main-old  # Rename branch to disable
```

### Option 3: Gradual Rollout
1. Week 1: Test `smart-deploy.yml` manually
2. Week 2: Make it automatic, keep old as backup
3. Week 3: Remove old workflow

---

**Questions?** Check the workflow file: `.github/workflows/smart-deploy.yml`
