#!/bin/bash
# Add Custom Domains to Azure after DNS is configured
# Run this AFTER DNS records have propagated (wait 10 minutes after adding)

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Adding Custom Domains to Azure Resources                 ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Configuration
RESOURCE_GROUP="rg-sanbud-prod"
BACKEND_APP="app-sanbud-api-prod"
FRONTEND_APP="swa-sanbud-frontend-prod"
ROOT_DOMAIN="sanbud24.pl"
WWW_DOMAIN="www.sanbud24.pl"
API_DOMAIN="api.sanbud24.pl"

echo -e "${GREEN}📋 Checking DNS propagation first...${NC}"
echo ""

# Check WWW CNAME
echo -n "Checking www.sanbud24.pl... "
WWW_CHECK=$(dig www.sanbud24.pl +short | head -1)
if [ -z "$WWW_CHECK" ]; then
    echo -e "${RED}❌ NOT FOUND${NC}"
    echo -e "${YELLOW}Please wait longer for DNS propagation or check if records were added correctly${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Found: $WWW_CHECK${NC}"
fi

# Check API CNAME
echo -n "Checking api.sanbud24.pl... "
API_CHECK=$(dig api.sanbud24.pl +short | head -1)
if [ -z "$API_CHECK" ]; then
    echo -e "${RED}❌ NOT FOUND${NC}"
    echo -e "${YELLOW}Please wait longer for DNS propagation or check if records were added correctly${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Found: $API_CHECK${NC}"
fi

# Check TXT record
echo -n "Checking TXT record... "
TXT_CHECK=$(dig sanbud24.pl TXT +short | grep -i "07557C0B02D6FEF6E51231B7B6F76868B466FFCA18F3FDE9E390B354F5D50C95" | head -1)
if [ -z "$TXT_CHECK" ]; then
    echo -e "${YELLOW}⚠️  NOT FOUND (may still work)${NC}"
else
    echo -e "${GREEN}✓ Found${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 1: Add WWW Subdomain to Static Web App${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"

echo "Adding www.sanbud24.pl..."
az staticwebapp hostname set \
  --name $FRONTEND_APP \
  --resource-group $RESOURCE_GROUP \
  --hostname $WWW_DOMAIN

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ WWW subdomain added successfully${NC}"
else
    echo -e "${RED}❌ Failed to add WWW subdomain${NC}"
    echo -e "${YELLOW}This may be due to DNS not fully propagated. Wait and try again.${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 2: Add Root Domain to Static Web App${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"

echo "Adding sanbud24.pl (apex domain with DNS TXT validation)..."
az staticwebapp hostname set \
  --name $FRONTEND_APP \
  --resource-group $RESOURCE_GROUP \
  --hostname $ROOT_DOMAIN \
  --validation-method dns-txt-token

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Root domain added successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Root domain add failed or pending${NC}"
    echo -e "${YELLOW}This is normal - Azure needs to validate TXT record first${NC}"
    echo -e "${YELLOW}It may take 5-60 minutes for validation to complete${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 3: Add API Subdomain to App Service${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"

echo "Adding api.sanbud24.pl..."
az webapp config hostname add \
  --webapp-name $BACKEND_APP \
  --resource-group $RESOURCE_GROUP \
  --hostname $API_DOMAIN

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ API subdomain added successfully${NC}"
else
    echo -e "${RED}❌ Failed to add API subdomain${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 4: Enable SSL for API (Managed Certificate)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"

echo "Enabling managed SSL for api.sanbud24.pl..."
az webapp config ssl create \
  --name $BACKEND_APP \
  --resource-group $RESOURCE_GROUP \
  --hostname $API_DOMAIN

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ SSL certificate requested${NC}"
else
    echo -e "${YELLOW}⚠️  SSL configuration pending${NC}"
    echo -e "${YELLOW}Azure will automatically provision SSL certificate${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Step 5: Check Custom Domain Status${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"

echo ""
echo "Frontend custom domains:"
az staticwebapp show \
  --name $FRONTEND_APP \
  --resource-group $RESOURCE_GROUP \
  --query "customDomains[].{domain:name,status:status,validationToken:validationToken}" -o table

echo ""
echo "Backend custom domains:"
az webapp config hostname list \
  --webapp-name $BACKEND_APP \
  --resource-group $RESOURCE_GROUP \
  --query "[].{name:name,sslState:sslState,thumbprint:thumbprint}" -o table

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Custom Domain Configuration Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}⏱️  SSL Certificate Provisioning:${NC}"
echo "   - Static Web Apps: Automatic (5-60 minutes)"
echo "   - App Service: Automatic (5-60 minutes)"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo ""
echo "1. Wait for SSL certificates to be provisioned (check status above)"
echo ""
echo "2. Deploy your code:"
echo "   ${YELLOW}cd /Users/haos/azure-san-bud${NC}"
echo "   ${YELLOW}git push origin main${NC}"
echo "   ${YELLOW}gh run watch${NC}"
echo ""
echo "3. Initialize database:"
echo "   ${YELLOW}az webapp ssh --name $BACKEND_APP --resource-group $RESOURCE_GROUP${NC}"
echo "   ${YELLOW}python init_db.py && python init_admin.py${NC}"
echo ""
echo "4. Verify deployment:"
echo "   ${YELLOW}./check-domain.sh${NC}"
echo ""
echo -e "${GREEN}🎉 Your site will be live at:${NC}"
echo "   ${BLUE}https://sanbud24.pl${NC}"
echo "   ${BLUE}https://www.sanbud24.pl${NC}"
echo "   ${BLUE}https://api.sanbud24.pl${NC}"
echo ""
