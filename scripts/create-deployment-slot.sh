#!/bin/bash
# =============================================================================
# Create Azure App Service Deployment Slot for Blue-Green Deployment
# =============================================================================
#
# This script creates a 'staging' slot for the backend API to enable
# zero-downtime deployments using slot swap strategy.
#
# Usage:
#   ./scripts/create-deployment-slot.sh
#
# Prerequisites:
#   - Azure CLI installed and authenticated
#   - Proper permissions on the resource group
#
# =============================================================================

set -e

# Configuration
RESOURCE_GROUP="rg-sanbud-prod"
WEBAPP_NAME="app-sanbud-api-prod"
SLOT_NAME="staging"
REGION="westeurope"

echo "================================================"
echo "Creating Azure App Service Deployment Slot"
echo "================================================"
echo ""
echo "Resource Group: $RESOURCE_GROUP"
echo "Web App:        $WEBAPP_NAME"
echo "Slot Name:      $SLOT_NAME"
echo "Region:         $REGION"
echo ""

# Check if slot already exists
echo "🔍 Checking if slot already exists..."
if az webapp deployment slot list \
    --resource-group "$RESOURCE_GROUP" \
    --name "$WEBAPP_NAME" \
    --query "[?name=='$SLOT_NAME'].name" \
    -o tsv | grep -q "$SLOT_NAME"; then
    echo "⚠️  Slot '$SLOT_NAME' already exists"
    echo ""
    read -p "Do you want to reconfigure it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted"
        exit 1
    fi
else
    echo "✅ Slot does not exist, creating..."
    
    # Create the deployment slot
    echo ""
    echo "🚀 Creating deployment slot '$SLOT_NAME'..."
    az webapp deployment slot create \
        --resource-group "$RESOURCE_GROUP" \
        --name "$WEBAPP_NAME" \
        --slot "$SLOT_NAME" \
        --configuration-source "$WEBAPP_NAME"
    
    echo "✅ Slot created successfully"
fi

echo ""
echo "🔧 Configuring slot settings..."

# Configure slot-specific settings (these will NOT swap)
# Mark certain settings as "sticky" to the slot
echo ""
echo "📌 Setting sticky (slot-specific) app settings..."

az webapp config appsettings set \
    --resource-group "$RESOURCE_GROUP" \
    --name "$WEBAPP_NAME" \
    --slot "$SLOT_NAME" \
    --slot-settings \
        DEPLOYMENT_SLOT="staging" \
        WEBSITE_SLOT_NAME="staging" \
        SLOT_SWAP_ENABLED="true"

echo "✅ Sticky settings configured"

# Configure general app settings for the staging slot
echo ""
echo "⚙️  Configuring staging slot app settings..."

az webapp config appsettings set \
    --resource-group "$RESOURCE_GROUP" \
    --name "$WEBAPP_NAME" \
    --slot "$SLOT_NAME" \
    --settings \
        FLASK_ENV="staging" \
        FLASK_DEBUG="false" \
        PYTHON_VERSION="3.11"

echo "✅ App settings configured"

# Configure deployment source (GitHub Actions will deploy here)
echo ""
echo "📦 Configuring deployment settings..."

az webapp config set \
    --resource-group "$RESOURCE_GROUP" \
    --name "$WEBAPP_NAME" \
    --slot "$SLOT_NAME" \
    --startup-file "gunicorn --bind=0.0.0.0:8000 --timeout 600 --workers 4 run:app"

echo "✅ Deployment settings configured"

# Enable health check for slot
echo ""
echo "🏥 Enabling health check endpoint..."

az webapp config set \
    --resource-group "$RESOURCE_GROUP" \
    --name "$WEBAPP_NAME" \
    --slot "$SLOT_NAME" \
    --health-check-path "/health"

echo "✅ Health check enabled"

# Get slot URLs
SLOT_URL=$(az webapp deployment slot list \
    --resource-group "$RESOURCE_GROUP" \
    --name "$WEBAPP_NAME" \
    --query "[?name=='$SLOT_NAME'].defaultHostName" \
    -o tsv)

PRODUCTION_URL=$(az webapp show \
    --resource-group "$RESOURCE_GROUP" \
    --name "$WEBAPP_NAME" \
    --query "defaultHostName" \
    -o tsv)

echo ""
echo "================================================"
echo "✅ Deployment Slot Created Successfully!"
echo "================================================"
echo ""
echo "Production URL: https://$PRODUCTION_URL"
echo "Staging URL:    https://$SLOT_URL"
echo ""
echo "Next steps:"
echo "  1. Deploy to staging slot first"
echo "  2. Validate staging slot health"
echo "  3. Swap staging to production"
echo ""
echo "To swap slots manually:"
echo "  az webapp deployment slot swap \\"
echo "    --resource-group $RESOURCE_GROUP \\"
echo "    --name $WEBAPP_NAME \\"
echo "    --slot $SLOT_NAME \\"
echo "    --target-slot production"
echo ""
