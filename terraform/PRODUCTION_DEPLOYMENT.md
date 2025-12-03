# Terraform Production Deployment Guide

## Prerequisites

1. **Azure CLI** installed and configured
2. **Terraform** v1.6.0+ installed
3. **Azure Service Principal** with Contributor access
4. **GitHub account** with admin access to repository

## Step 1: Setup Terraform Backend

The Terraform state must be stored in Azure Storage:

```bash
# Run the backend setup script
cd terraform/scripts
./setup-backend-prod.sh
```

This creates:
- Resource Group: `rg-sanbud-terraform-state-prod`
- Storage Account: `stsanbudtfstateprod`
- Blob Container: `tfstate`

## Step 2: Configure GitHub Secrets

Go to: https://github.com/kozuchowskihubert/azure-san-bud/settings/secrets/actions

Add these secrets:

### Azure Authentication
```
AZURE_CLIENT_ID=<service-principal-app-id>
AZURE_CLIENT_SECRET=<service-principal-password>
AZURE_SUBSCRIPTION_ID=<azure-subscription-id>
AZURE_TENANT_ID=<azure-tenant-id>
```

Or use AZURE_CREDENTIALS (JSON format):
```json
{
  "clientId": "<service-principal-app-id>",
  "clientSecret": "<service-principal-password>",
  "subscriptionId": "<subscription-id>",
  "tenantId": "<tenant-id>"
}
```

### Database & Admin Secrets
```
DB_ADMIN_PASSWORD=<strong-postgresql-password>
ADMIN_INIT_SECRET=SanBud2025!InitAdmin!Zaj
ADMIN_INIT_PASSWORD=Admin123!@#$Zaj
```

### Optional (for Terraform backend if using Service Principal)
```
ARM_ACCESS_KEY=<storage-account-key>
```

## Step 3: Test Terraform Locally (Optional but Recommended)

```bash
cd terraform

# Initialize Terraform with production backend
terraform init -backend-config=environments/prod/sanbud-backend.tfvars

# Validate configuration
terraform validate

# Plan deployment (requires secrets)
terraform plan \
  -var-file=environments/prod/sanbud.tfvars \
  -var="db_admin_password=YourStrongPassword" \
  -var="admin_init_secret=SanBud2025!InitAdmin!Zaj" \
  -var="admin_init_password=Admin123!@#$Zaj"
```

## Step 4: Deploy via GitHub Actions

### Automatic Deployment (on push to main)

```bash
git add terraform/
git commit -m "Update Terraform configuration"
git push origin main
```

The workflow `.github/workflows/terraform-sanbud.yml` will automatically:
1. Run `terraform plan`
2. On main branch push, run `terraform apply`

### Manual Deployment (workflow_dispatch)

1. Go to: https://github.com/kozuchowskihubert/azure-san-bud/actions
2. Select "SanBud Terraform Infrastructure"
3. Click "Run workflow"
4. Choose:
   - Action: `plan` or `apply`
   - Environment: `prod`
5. Click "Run workflow"

## Step 5: Verify Deployment

After Terraform completes:

```bash
# Check resource group
az group show --name rg-sanbud-prod

# Check App Service
az webapp show --resource-group rg-sanbud-prod --name app-sanbud-api-prod

# Check PostgreSQL
az postgres flexible-server show --resource-group rg-sanbud-prod --name psql-sanbud-prod

# Check Static Web App (if enabled)
az staticwebapp show --resource-group rg-sanbud-prod --name swa-sanbud-frontend-prod
```

## Step 6: Initialize Admin User

After infrastructure is deployed, initialize the admin user:

```bash
curl -X POST https://app-sanbud-api-prod.azurewebsites.net/admin/api/init-admin-secure \
  -H "Content-Type: application/json" \
  -d '{"secret": "SanBud2025!InitAdmin!Zaj"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "admin": {
    "username": "admin",
    "email": "admin@sanbud.pl"
  }
}
```

## Step 7: Login to Admin Panel

Visit: https://app-sanbud-api-prod.azurewebsites.net/admin/login

```
Username: admin
Password: Admin123!@#$Zaj
```

## Troubleshooting

### Terraform Backend Error

```
Error: Failed to get existing workspaces: storage account not found
```

**Solution:** Run `terraform/scripts/setup-backend-prod.sh` to create backend resources.

### Variable Not Set Error

```
Error: No value for required variable
```

**Solution:** Ensure all GitHub Secrets are configured (ADMIN_INIT_SECRET, ADMIN_INIT_PASSWORD, DB_ADMIN_PASSWORD).

### Azure Authentication Failed

```
Error: building AzureRM Client: obtain subscription(...) from Azure CLI: parsing json result...
```

**Solution:** Ensure AZURE_CREDENTIALS secret is properly formatted JSON.

### State Lock Error

```
Error: Error acquiring the state lock
```

**Solution:** Someone else is running Terraform. Wait or break the lock if safe:
```bash
terraform force-unlock <lock-id>
```

## Rollback Plan

If deployment fails:

```bash
# Destroy specific resources
terraform destroy -target=azurerm_app_service.main

# Full rollback
terraform destroy \
  -var-file=environments/prod/sanbud.tfvars \
  -var="db_admin_password=..." \
  -var="admin_init_secret=..." \
  -var="admin_init_password=..."
```

## Cost Estimation

Production configuration (sanbud.tfvars):
- PostgreSQL: ~$200/month (GP_Standard_D2s_v3, 128GB)
- App Service: ~$100/month (P1v3 Premium)
- Static Web App: ~$9/month (Standard tier)
- Storage/Networking: ~$10/month
- **Total: ~$320/month**

## Security Checklist

- [ ] GitHub Secrets configured
- [ ] Storage account has public access disabled
- [ ] PostgreSQL has firewall rules configured
- [ ] TLS 1.2+ enforced on all services
- [ ] Admin password changed after first login
- [ ] Backup retention configured (35 days)
- [ ] Geo-redundant backup enabled

## Next Steps

1. Configure custom domain (sanbud24.pl)
2. Set up SSL certificates
3. Configure DNS records
4. Enable monitoring and alerts
5. Set up backup verification
6. Create disaster recovery plan
