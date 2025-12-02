# Azure App Service Configuration

This file contains Azure-specific configuration instructions.

## Required Azure Resources

### 1. Resource Group
```bash
az group create --name rg-sanitary-services-prod --location eastus
```

### 2. PostgreSQL Flexible Server
```bash
az postgres flexible-server create \
  --name psql-sanitary-prod \
  --resource-group rg-sanitary-services-prod \
  --location eastus \
  --admin-user adminuser \
  --admin-password <YourPassword> \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 14 \
  --storage-size 32 \
  --public-access 0.0.0.0
```

### 3. Database
```bash
az postgres flexible-server db create \
  --resource-group rg-sanitary-services-prod \
  --server-name psql-sanitary-prod \
  --database-name sanitary_services
```

### 4. App Service Plan
```bash
az appservice plan create \
  --name plan-sanitary-prod \
  --resource-group rg-sanitary-services-prod \
  --location eastus \
  --is-linux \
  --sku B1
```

### 5. Web App
```bash
az webapp create \
  --name app-sanitary-prod \
  --resource-group rg-sanitary-services-prod \
  --plan plan-sanitary-prod \
  --runtime "PYTHON:3.11"
```

## Application Settings

Set the following environment variables in Azure App Service:

```bash
az webapp config appsettings set \
  --name app-sanitary-prod \
  --resource-group rg-sanitary-services-prod \
  --settings \
    FLASK_ENV=production \
    SECRET_KEY="<generate-secure-key>" \
    DB_HOST="psql-sanitary-prod.postgres.database.azure.com" \
    DB_NAME="sanitary_services" \
    DB_USER="adminuser" \
    DB_PASSWORD="<YourPassword>" \
    DB_PORT="5432" \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

## Deployment

### Option 1: GitHub Actions (Recommended)

1. Get publish profile:
```bash
az webapp deployment list-publishing-profiles \
  --name app-sanitary-prod \
  --resource-group rg-sanitary-services-prod \
  --xml
```

2. Add `AZURE_WEBAPP_PUBLISH_PROFILE` secret to GitHub repository

3. Push to main branch to trigger deployment

### Option 2: Local Git Deployment

```bash
az webapp deployment source config-local-git \
  --name app-sanitary-prod \
  --resource-group rg-sanitary-services-prod

# Add Azure as remote
git remote add azure <deployment-url>

# Deploy
git push azure main
```

### Option 3: Azure CLI Deployment

```bash
az webapp up \
  --name app-sanitary-prod \
  --resource-group rg-sanitary-services-prod \
  --runtime "PYTHON:3.11" \
  --sku B1 \
  --location eastus
```

## Database Migrations

Run migrations after deployment:

```bash
# SSH into the container
az webapp ssh --name app-sanitary-prod --resource-group rg-sanitary-services-prod

# Run migrations
flask db upgrade
```

## Monitoring

Enable Application Insights:

```bash
az monitor app-insights component create \
  --app insights-sanitary-prod \
  --location eastus \
  --resource-group rg-sanitary-services-prod

# Link to Web App
az monitor app-insights component connect-webapp \
  --app insights-sanitary-prod \
  --resource-group rg-sanitary-services-prod \
  --web-app app-sanitary-prod
```

## Networking

Configure VNet integration if needed:

```bash
az network vnet create \
  --name vnet-sanitary-prod \
  --resource-group rg-sanitary-services-prod \
  --location eastus \
  --address-prefix 10.0.0.0/16

az network vnet subnet create \
  --name subnet-app \
  --resource-group rg-sanitary-services-prod \
  --vnet-name vnet-sanitary-prod \
  --address-prefix 10.0.1.0/24

az webapp vnet-integration add \
  --name app-sanitary-prod \
  --resource-group rg-sanitary-services-prod \
  --vnet vnet-sanitary-prod \
  --subnet subnet-app
```

## Custom Domain (Optional)

```bash
# Add custom domain
az webapp config hostname add \
  --webapp-name app-sanitary-prod \
  --resource-group rg-sanitary-services-prod \
  --hostname www.yourdomain.com

# Enable SSL
az webapp config ssl bind \
  --name app-sanitary-prod \
  --resource-group rg-sanitary-services-prod \
  --certificate-thumbprint <thumbprint> \
  --ssl-type SNI
```
