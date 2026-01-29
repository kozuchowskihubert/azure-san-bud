#!/bin/bash
# 🚀 Azure Live Deployment Script for sanbud24.pl
# This script automates the Azure deployment process

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   SanBud Azure Live Deployment Script   ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI not found!${NC}"
    echo -e "${YELLOW}Install with: brew install azure-cli${NC}"
    exit 1
fi

# Check if logged into Azure
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}🔐 Not logged into Azure. Please login...${NC}"
    az login
fi

# Configuration
RESOURCE_GROUP="rg-sanbud-prod"
LOCATION="westeurope"
BACKEND_APP_NAME="app-sanbud-api-prod"
FRONTEND_APP_NAME="swa-sanbud-frontend-prod"
DB_SERVER_NAME="psql-sanbud-prod"
DB_NAME="sanbud_db"
DB_USER="sanbud_admin"
DOMAIN="sanbud24.pl"

echo ""
echo -e "${GREEN}📋 Deployment Configuration:${NC}"
echo -e "   Resource Group: ${BLUE}$RESOURCE_GROUP${NC}"
echo -e "   Location: ${BLUE}$LOCATION${NC}"
echo -e "   Domain: ${BLUE}$DOMAIN${NC}"
echo -e "   Backend: ${BLUE}$BACKEND_APP_NAME${NC}"
echo -e "   Frontend: ${BLUE}$FRONTEND_APP_NAME${NC}"
echo ""

# Ask for confirmation
read -p "Do you want to proceed with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏸️  Deployment cancelled.${NC}"
    exit 0
fi

# Function to check if resource exists
resource_exists() {
    az $1 show --name $2 --resource-group $RESOURCE_GROUP &> /dev/null
    return $?
}

echo ""
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 1: Create Resource Group${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"

if az group exists --name $RESOURCE_GROUP | grep -q "true"; then
    echo -e "${YELLOW}ℹ️  Resource group already exists${NC}"
else
    echo -e "${GREEN}✨ Creating resource group...${NC}"
    az group create \
        --name $RESOURCE_GROUP \
        --location $LOCATION \
        --tags Environment=Production Project=SanBud
    echo -e "${GREEN}✅ Resource group created${NC}"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 2: Create PostgreSQL Database${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"

if resource_exists "postgres flexible-server" $DB_SERVER_NAME; then
    echo -e "${YELLOW}ℹ️  PostgreSQL server already exists${NC}"
else
    echo -e "${GREEN}🗄️  Creating PostgreSQL server...${NC}"
    read -sp "Enter database admin password: " DB_PASSWORD
    echo
    
    az postgres flexible-server create \
        --name $DB_SERVER_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --admin-user $DB_USER \
        --admin-password "$DB_PASSWORD" \
        --sku-name Standard_B1ms \
        --tier Burstable \
        --version 14 \
        --storage-size 32 \
        --public-access 0.0.0.0-255.255.255.255
    
    az postgres flexible-server db create \
        --resource-group $RESOURCE_GROUP \
        --server-name $DB_SERVER_NAME \
        --database-name $DB_NAME
    
    echo -e "${GREEN}✅ PostgreSQL server created${NC}"
    
    # Save connection string
    DB_CONNECTION_STRING="postgresql://$DB_USER:$DB_PASSWORD@$DB_SERVER_NAME.postgres.database.azure.com/$DB_NAME?sslmode=require"
    echo -e "${YELLOW}📝 Save this connection string:${NC}"
    echo -e "${BLUE}$DB_CONNECTION_STRING${NC}"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 3: Create App Service (Backend)${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"

# Create App Service Plan
PLAN_NAME="plan-sanbud-backend-prod"
if resource_exists "appservice plan" $PLAN_NAME; then
    echo -e "${YELLOW}ℹ️  App Service Plan already exists${NC}"
else
    echo -e "${GREEN}📦 Creating App Service Plan...${NC}"
    az appservice plan create \
        --name $PLAN_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --is-linux \
        --sku B1
    echo -e "${GREEN}✅ App Service Plan created${NC}"
fi

# Create Web App
if resource_exists "webapp" $BACKEND_APP_NAME; then
    echo -e "${YELLOW}ℹ️  Web App already exists${NC}"
else
    echo -e "${GREEN}🌐 Creating Web App...${NC}"
    az webapp create \
        --name $BACKEND_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --plan $PLAN_NAME \
        --runtime "PYTHON:3.11"
    
    az webapp update \
        --name $BACKEND_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --https-only true
    
    az webapp config set \
        --name $BACKEND_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --startup-file "gunicorn --bind=0.0.0.0:8000 --timeout 600 run:app"
    
    echo -e "${GREEN}✅ Web App created${NC}"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 4: Configure Backend Settings${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"

echo -e "${GREEN}🔧 Setting environment variables...${NC}"
SECRET_KEY=$(openssl rand -hex 32)

az webapp config appsettings set \
    --name $BACKEND_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --settings \
        FLASK_ENV=production \
        FLASK_APP=run.py \
        SECRET_KEY="$SECRET_KEY" \
        DATABASE_URL="${DB_CONNECTION_STRING:-postgresql://localhost/sanbud}" \
        CORS_ORIGINS="https://$DOMAIN,https://www.$DOMAIN,https://api.$DOMAIN" \
        ALLOWED_HOSTS="$DOMAIN,www.$DOMAIN,api.$DOMAIN,$BACKEND_APP_NAME.azurewebsites.net" \
        SCM_DO_BUILD_DURING_DEPLOYMENT=true \
        WEBSITES_PORT=8000 \
        > /dev/null

echo -e "${GREEN}✅ Environment variables configured${NC}"

echo ""
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 5: Create Static Web App (Frontend)${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"

if resource_exists "staticwebapp" $FRONTEND_APP_NAME; then
    echo -e "${YELLOW}ℹ️  Static Web App already exists${NC}"
else
    echo -e "${GREEN}🎨 Creating Static Web App...${NC}"
    az staticwebapp create \
        --name $FRONTEND_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --sku Standard
    echo -e "${GREEN}✅ Static Web App created${NC}"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 6: Get Deployment Credentials${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"

echo -e "${GREEN}📄 Getting backend publish profile...${NC}"
az webapp deployment list-publishing-profiles \
    --name $BACKEND_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --xml > azure-backend-publish-profile.xml

echo -e "${GREEN}🔑 Getting frontend deployment token...${NC}"
FRONTEND_TOKEN=$(az staticwebapp secrets list \
    --name $FRONTEND_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --query "properties.apiKey" -o tsv)

echo ""
echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Azure Resources Created Successfully!${NC}"
echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo ""
echo -e "${BLUE}1. Add GitHub Secrets:${NC}"
echo -e "   Go to: https://github.com/kozuchowskihubert/azure-san-bud/settings/secrets/actions"
echo ""
echo -e "   ${GREEN}AZURE_WEBAPP_PUBLISH_PROFILE${NC}"
echo -e "   Content from: ${YELLOW}azure-backend-publish-profile.xml${NC}"
echo ""
echo -e "   ${GREEN}AZURE_STATIC_WEB_APPS_API_TOKEN${NC}"
echo -e "   Value: ${YELLOW}$FRONTEND_TOKEN${NC}"
echo ""
echo -e "   ${GREEN}DATABASE_URL${NC}"
echo -e "   Value: ${YELLOW}$DB_CONNECTION_STRING${NC}"
echo ""
echo -e "   ${GREEN}SECRET_KEY${NC}"
echo -e "   Value: ${YELLOW}$SECRET_KEY${NC}"
echo ""
echo -e "${BLUE}2. Deploy via GitHub Actions:${NC}"
echo -e "   ${YELLOW}git push origin main${NC}"
echo ""
echo -e "${BLUE}3. Configure DNS Records:${NC}"
echo -e "   Login to your domain registrar and add:"
echo ""
echo -e "   ${GREEN}Root domain (sanbud24.pl):${NC}"
echo -e "   ALIAS  @    → ${YELLOW}$FRONTEND_APP_NAME.azurestaticapps.net${NC}"
echo ""
echo -e "   ${GREEN}WWW subdomain:${NC}"
echo -e "   CNAME  www  → ${YELLOW}$FRONTEND_APP_NAME.azurestaticapps.net${NC}"
echo ""
echo -e "   ${GREEN}API subdomain:${NC}"
echo -e "   CNAME  api  → ${YELLOW}$BACKEND_APP_NAME.azurewebsites.net${NC}"
echo ""
echo -e "${BLUE}4. Add Custom Domains in Azure:${NC}"
echo -e "   ${YELLOW}az staticwebapp hostname set --name $FRONTEND_APP_NAME --resource-group $RESOURCE_GROUP --hostname $DOMAIN${NC}"
echo -e "   ${YELLOW}az staticwebapp hostname set --name $FRONTEND_APP_NAME --resource-group $RESOURCE_GROUP --hostname www.$DOMAIN${NC}"
echo -e "   ${YELLOW}az webapp config hostname add --webapp-name $BACKEND_APP_NAME --resource-group $RESOURCE_GROUP --hostname api.$DOMAIN${NC}"
echo ""
echo -e "${BLUE}5. Initialize Database:${NC}"
echo -e "   ${YELLOW}az webapp ssh --name $BACKEND_APP_NAME --resource-group $RESOURCE_GROUP${NC}"
echo -e "   Then run: ${YELLOW}python init_db.py && python init_admin.py${NC}"
echo ""
echo -e "${BLUE}6. Verify Deployment:${NC}"
echo -e "   ${YELLOW}./check-domain.sh${NC}"
echo ""
echo -e "${GREEN}🎉 Deployment script completed!${NC}"
echo -e "${YELLOW}📖 For detailed instructions, see: AZURE_LIVE_DEPLOYMENT.md${NC}"
echo ""
