#!/bin/bash

# Database Password Rotation Script
# This script rotates the PostgreSQL password after credential exposure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Database Password Rotation - Security Remediation             ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Configuration
RESOURCE_GROUP="rg-sanbud-prod"
DB_SERVER="psql-sanbud-prod"
DB_NAME="sanbud_db"
DB_USER="sanbud_admin"
BACKEND_APP="app-sanbud-api-prod"

# Generate new secure password
echo -e "${YELLOW}🔐 Generating new secure password...${NC}"
NEW_PASSWORD=$(python3 -c "import secrets, string; chars = string.ascii_letters + string.digits + '!@#$%^&*'; print(''.join(secrets.choice(chars) for _ in range(32)))")
echo -e "${GREEN}✓${NC} New password generated (32 characters)"
echo ""

echo -e "${RED}⚠️  CRITICAL SECURITY ACTION${NC}"
echo -e "This will:"
echo "1. Change the PostgreSQL admin password in Azure"
echo "2. Update GitHub secret DATABASE_URL"
echo "3. Update Azure App Service environment variables"
echo "4. Restart the backend application"
echo ""
read -p "Continue with password rotation? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${YELLOW}Password rotation cancelled${NC}"
    exit 0
fi

# Step 1: Update PostgreSQL password
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Step 1/4: Updating PostgreSQL password in Azure...${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"

az postgres flexible-server update \
    --resource-group $RESOURCE_GROUP \
    --name $DB_SERVER \
    --admin-password "$NEW_PASSWORD"

echo -e "${GREEN}✓${NC} Database password updated in Azure"

# Step 2: Build new connection string
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Step 2/4: Building new connection string...${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"

DB_HOST="${DB_SERVER}.postgres.database.azure.com"
NEW_DATABASE_URL="postgresql://${DB_USER}:${NEW_PASSWORD}@${DB_HOST}/${DB_NAME}?sslmode=require"

echo -e "${GREEN}✓${NC} Connection string prepared"

# Step 3: Update GitHub Secret
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Step 3/4: Updating GitHub secret DATABASE_URL...${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"

gh secret set DATABASE_URL --body "$NEW_DATABASE_URL"

echo -e "${GREEN}✓${NC} GitHub secret updated"

# Step 4: Update App Service environment variable
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Step 4/4: Updating Azure App Service configuration...${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"

az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP \
    --settings DATABASE_URL="$NEW_DATABASE_URL"

echo -e "${GREEN}✓${NC} App Service environment variable updated"

# Restart backend app
echo ""
echo -e "${YELLOW}Restarting backend application...${NC}"
az webapp restart \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP

echo -e "${GREEN}✓${NC} Backend application restarted"

# Update local credentials file
echo ""
echo -e "${YELLOW}Updating local credentials file...${NC}"

if [ -f "deployment-credentials.local.sh" ]; then
    # Backup old file
    cp deployment-credentials.local.sh deployment-credentials.local.sh.backup
    
    # Update password in file
    sed -i.bak "s|DB_PASSWORD=.*|DB_PASSWORD=\"$NEW_PASSWORD\"|g" deployment-credentials.local.sh
    sed -i.bak "s|DB_CONNECTION=.*|DB_CONNECTION=\"$NEW_DATABASE_URL\"|g" deployment-credentials.local.sh
    rm deployment-credentials.local.sh.bak
    
    echo -e "${GREEN}✓${NC} Local credentials file updated (backup saved as .backup)"
else
    echo -e "${YELLOW}⚠${NC} deployment-credentials.local.sh not found, skipping"
fi

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✓ Password Rotation Complete!                        ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Summary:${NC}"
echo "- Old password: SanBud2024SecureDB! (INVALIDATED)"
echo "- New password: $NEW_PASSWORD"
echo "- Updated locations:"
echo "  ✓ Azure PostgreSQL server"
echo "  ✓ GitHub secret DATABASE_URL"
echo "  ✓ Azure App Service environment"
echo "  ✓ deployment-credentials.local.sh"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Verify backend is running: curl https://app-sanbud-api-prod.azurewebsites.net/api/health"
echo "2. Test database connection"
echo "3. Update any local .env files if needed"
echo ""
echo -e "${GREEN}Security remediation complete!${NC}"
