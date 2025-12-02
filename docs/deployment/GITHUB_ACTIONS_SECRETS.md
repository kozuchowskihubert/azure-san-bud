# GitHub Secrets Setup for SanBud24.pl CI/CD

This document explains how to configure GitHub Secrets for the automated deployment workflow.

## Required Secrets

### 1. AZURE_CREDENTIALS (Service Principal)

This secret contains the Azure Service Principal credentials for deploying resources.

**Format:** JSON

```json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "your-client-secret",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

**How to create:**

```bash
# Get your subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

# Create a service principal with Contributor role
az ad sp create-for-rbac \
  --name "github-sanbud-deploy" \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/rg-sanbud-prod \
  --sdk-auth

# Copy the entire JSON output and save it as AZURE_CREDENTIALS
```

**Permissions needed:**
- Contributor role on `rg-sanbud-prod` resource group
- Permissions to deploy to App Service and Static Web Apps

---

### 2. AZURE_STATIC_WEB_APPS_API_TOKEN (Frontend Deployment)

This secret contains the deployment token for Azure Static Web Apps.

**Format:** Plain text token

**How to get:**

```bash
# Method 1: Azure Portal
# 1. Go to Azure Portal → Static Web Apps → swa-sanbud-frontend-prod
# 2. Click "Manage deployment token"
# 3. Copy the token

# Method 2: Azure CLI
az staticwebapp secrets list \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod \
  --query "properties.apiKey" -o tsv
```

**Current value (if needed):**
```
06394a10ef9c8e7431b29067caad80505aba06381da84be772f6f661b9313b4003-8a3439a7-2445-4e2f-9263-50ad9f2b775f0031804078488b03
```

---

### 3. AZURE_WEBAPP_PUBLISH_PROFILE (Legacy - Optional)

⚠️ **Note:** The new workflow uses Service Principal (AZURE_CREDENTIALS) instead of publish profiles for better security. This secret is kept for backward compatibility but is no longer required.

If you still want to set it:

```bash
az webapp deployment list-publishing-profiles \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --xml
```

---

## Setting Secrets via GitHub CLI

```bash
# Install GitHub CLI if not already installed
brew install gh

# Authenticate
gh auth login

# Set AZURE_CREDENTIALS (replace with your actual JSON)
gh secret set AZURE_CREDENTIALS --body '{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "your-client-secret",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}'

# Set AZURE_STATIC_WEB_APPS_API_TOKEN
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --body "your-token-here"
```

---

## Setting Secrets via GitHub Web UI

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:
   - Name: `AZURE_CREDENTIALS`
   - Value: Paste the JSON from service principal creation
   - Click **Add secret**
5. Repeat for `AZURE_STATIC_WEB_APPS_API_TOKEN`

---

## Verifying Secrets

After setting up secrets, verify they're configured:

```bash
# List all secrets (values are hidden)
gh secret list

# Expected output:
# AZURE_CREDENTIALS                Updated 2025-XX-XX
# AZURE_STATIC_WEB_APPS_API_TOKEN  Updated 2025-XX-XX
```

---

## Security Best Practices

1. **Never commit secrets to git** - Always use GitHub Secrets
2. **Rotate regularly** - Regenerate service principal credentials every 90 days
3. **Least privilege** - Grant only necessary permissions (Contributor on specific resource group)
4. **Monitor usage** - Check Azure Activity Log for service principal actions
5. **Use environments** - Configure production environment protection rules

---

## Troubleshooting

### Service Principal Authentication Fails

```bash
# Reset service principal credentials
SP_APP_ID="your-client-id-here"
az ad sp credential reset --id $SP_APP_ID --query password -o tsv

# Update AZURE_CREDENTIALS secret with new clientSecret
```

### Static Web App Token Invalid

```bash
# Regenerate the token
az staticwebapp secrets reset-api-key \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod

# Get new token
az staticwebapp secrets list \
  --name swa-sanbud-frontend-prod \
  --resource-group rg-sanbud-prod \
  --query "properties.apiKey" -o tsv

# Update GitHub secret
```

---

## Additional Resources

- [Azure Service Principal Documentation](https://learn.microsoft.com/en-us/azure/developer/github/connect-from-azure)
- [GitHub Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Azure Static Web Apps Deployment Token](https://learn.microsoft.com/en-us/azure/static-web-apps/deployment-token-management)

---

**Last Updated:** 2025-01-24  
**Workflow Version:** 2.0 (Azure CLI deployment)
