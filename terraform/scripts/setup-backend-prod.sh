#!/bin/bash
# Setup Terraform Backend for SanBud Production
# This script creates the Azure resources needed for Terraform remote state

set -e

echo "🔧 Setting up Terraform Backend for SanBud Production"
echo "===================================================="
echo ""

# Configuration
RESOURCE_GROUP="rg-sanbud-terraform-state-prod"
STORAGE_ACCOUNT="stsanbudtfstateprod"
CONTAINER_NAME="tfstate"
LOCATION="westeurope"

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    echo "❌ Not logged in to Azure"
    echo "   Please run: az login"
    exit 1
fi

echo "✅ Logged in to Azure"
echo ""

# Create Resource Group
echo "📦 Creating resource group: $RESOURCE_GROUP"
az group create \
    --name "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --tags \
        Project="SanBud" \
        Environment="Production" \
        Purpose="TerraformState" \
        ManagedBy="Manual" \
    --output table

echo ""

# Create Storage Account
echo "💾 Creating storage account: $STORAGE_ACCOUNT"
az storage account create \
    --name "$STORAGE_ACCOUNT" \
    --resource-group "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --sku Standard_LRS \
    --encryption-services blob \
    --https-only true \
    --min-tls-version TLS1_2 \
    --allow-blob-public-access false \
    --tags \
        Project="SanBud" \
        Environment="Production" \
        Purpose="TerraformState" \
    --output table

echo ""

# Get storage account key
echo "🔑 Retrieving storage account key..."
ACCOUNT_KEY=$(az storage account keys list \
    --resource-group "$RESOURCE_GROUP" \
    --account-name "$STORAGE_ACCOUNT" \
    --query '[0].value' -o tsv)

# Create blob container
echo "📁 Creating blob container: $CONTAINER_NAME"
az storage container create \
    --name "$CONTAINER_NAME" \
    --account-name "$STORAGE_ACCOUNT" \
    --account-key "$ACCOUNT_KEY" \
    --output table

echo ""
echo "✅ Terraform backend setup complete!"
echo ""
echo "=" * 60
echo "BACKEND CONFIGURATION"
echo "===================================================="
echo "Resource Group:    $RESOURCE_GROUP"
echo "Storage Account:   $STORAGE_ACCOUNT"
echo "Container:         $CONTAINER_NAME"
echo "Location:          $LOCATION"
echo "===================================================="
echo ""
echo "📝 Add to GitHub Secrets:"
echo "   ARM_ACCESS_KEY = [Storage Account Key]"
echo ""
echo "🚀 You can now run Terraform init with:"
echo "   terraform init -backend-config=environments/prod/sanbud-backend.tfvars"
echo ""
