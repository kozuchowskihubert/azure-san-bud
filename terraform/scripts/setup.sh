#!/bin/bash

# Setup script for Terraform infrastructure
# Usage: ./terraform/scripts/setup.sh <environment>

set -e

ENVIRONMENT=${1:-dev}
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Terraform Setup Script ===${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo ""

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
    echo -e "${RED}Error: Invalid environment. Must be dev, staging, or prod.${NC}"
    exit 1
fi

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v az &> /dev/null; then
    echo -e "${RED}Error: Azure CLI not found. Please install it first.${NC}"
    exit 1
fi

if ! command -v terraform &> /dev/null; then
    echo -e "${RED}Error: Terraform not found. Please install it first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites OK${NC}"
echo ""

# Check Azure login
echo -e "${BLUE}Checking Azure authentication...${NC}"
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Not logged in to Azure. Logging in...${NC}"
    az login
fi

SUBSCRIPTION_ID=$(az account show --query id -o tsv)
echo -e "${GREEN}✓ Logged in to Azure${NC}"
echo -e "${GREEN}  Subscription: ${SUBSCRIPTION_ID}${NC}"
echo ""

# Setup backend storage
echo -e "${BLUE}Setting up Terraform backend storage...${NC}"
RG_NAME="rg-terraform-state"
STORAGE_NAME="stsanitarytfstate${ENVIRONMENT}"
CONTAINER_NAME="tfstate"

echo -e "Creating resource group: ${RG_NAME}"
az group create --name $RG_NAME --location eastus --output none || true

echo -e "Creating storage account: ${STORAGE_NAME}"
az storage account create \
    --name $STORAGE_NAME \
    --resource-group $RG_NAME \
    --location eastus \
    --sku Standard_LRS \
    --encryption-services blob \
    --output none || true

echo -e "Creating storage container: ${CONTAINER_NAME}"
az storage container create \
    --name $CONTAINER_NAME \
    --account-name $STORAGE_NAME \
    --output none || true

echo -e "${GREEN}✓ Backend storage created${NC}"
echo ""

# Setup secrets file
SECRETS_FILE="terraform/environments/${ENVIRONMENT}/secrets.tfvars"
SECRETS_EXAMPLE="terraform/environments/${ENVIRONMENT}/secrets.tfvars.example"

if [ ! -f "$SECRETS_FILE" ]; then
    echo -e "${YELLOW}Secrets file not found. Creating from example...${NC}"
    cp "$SECRETS_EXAMPLE" "$SECRETS_FILE"
    
    # Generate passwords
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    FLASK_SECRET=$(python3 -c "import secrets; print(secrets.token_hex(32))" 2>/dev/null || openssl rand -hex 32)
    
    # Update secrets file with generated values
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/CHANGE-ME-STRONG-PASSWORD-HERE/${DB_PASSWORD}/" "$SECRETS_FILE"
        sed -i '' "s/CHANGE-ME-FLASK-SECRET-KEY-HERE/${FLASK_SECRET}/" "$SECRETS_FILE"
    else
        sed -i "s/CHANGE-ME-STRONG-PASSWORD-HERE/${DB_PASSWORD}/" "$SECRETS_FILE"
        sed -i "s/CHANGE-ME-FLASK-SECRET-KEY-HERE/${FLASK_SECRET}/" "$SECRETS_FILE"
    fi
    
    echo -e "${GREEN}✓ Secrets file created with generated passwords${NC}"
    echo -e "${YELLOW}  File: ${SECRETS_FILE}${NC}"
    echo -e "${YELLOW}  Please review and update if needed!${NC}"
else
    echo -e "${GREEN}✓ Secrets file already exists${NC}"
fi
echo ""

# Initialize Terraform
echo -e "${BLUE}Initializing Terraform...${NC}"
cd terraform
terraform init \
    -backend-config="environments/${ENVIRONMENT}/backend.tfvars" \
    -upgrade

echo -e "${GREEN}✓ Terraform initialized${NC}"
echo ""

# Validate configuration
echo -e "${BLUE}Validating Terraform configuration...${NC}"
terraform validate
echo -e "${GREEN}✓ Configuration valid${NC}"
echo ""

# Summary
echo -e "${GREEN}=== Setup Complete ===${NC}"
echo -e ""
echo -e "${GREEN}Next steps:${NC}"
echo -e "1. Review secrets file: ${SECRETS_FILE}"
echo -e "2. Run: ${YELLOW}make plan ENV=${ENVIRONMENT}${NC}"
echo -e "3. If plan looks good: ${YELLOW}make apply ENV=${ENVIRONMENT}${NC}"
echo -e ""
echo -e "${BLUE}Useful commands:${NC}"
echo -e "  make help                 - Show all available commands"
echo -e "  make output ENV=${ENVIRONMENT}  - Show deployed resources"
echo -e "  make destroy ENV=${ENVIRONMENT} - Destroy infrastructure"
echo -e ""
