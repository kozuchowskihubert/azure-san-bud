#!/bin/bash
# Setup Google Places API Credentials
# Run this after obtaining API key and Place ID

set -e

echo "🔐 Google Places API Credentials Setup"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Check if credentials are provided
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <GOOGLE_API_KEY> <PLACE_ID>"
    echo ""
    echo "Example:"
    echo "  $0 'AIza...' 'ChIJ...'"
    echo ""
    echo "How to get credentials:"
    echo "1. API Key: https://console.cloud.google.com/apis/credentials"
    echo "2. Place ID: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
    echo ""
    exit 1
fi

GOOGLE_API_KEY="$1"
PLACE_ID="$2"

echo "📝 Configuration:"
echo "  API Key: ${GOOGLE_API_KEY:0:10}...${GOOGLE_API_KEY: -4}"
echo "  Place ID: $PLACE_ID"
echo ""

# Confirm
read -p "Continue with these values? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "❌ Cancelled"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Step 1/2: Adding to GitHub Secrets"
echo "════════════════════════════════════════════════════════════════"

gh secret set GOOGLE_PLACES_API_KEY --body "$GOOGLE_API_KEY"
echo "✅ GOOGLE_PLACES_API_KEY added to GitHub Secrets"

gh secret set GOOGLE_PLACE_ID --body "$PLACE_ID"
echo "✅ GOOGLE_PLACE_ID added to GitHub Secrets"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Step 2/2: Adding to Azure App Service"
echo "════════════════════════════════════════════════════════════════"

az webapp config appsettings set \
  --name app-sanbud-api-prod \
  --resource-group rg-sanbud-prod \
  --settings \
    GOOGLE_PLACES_API_KEY="$GOOGLE_API_KEY" \
    GOOGLE_PLACE_ID="$PLACE_ID" \
  --output none

echo "✅ Added to Azure App Service"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✅ Google Places API Credentials Configured Successfully!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "1. Restart backend: az webapp restart --name app-sanbud-api-prod --resource-group rg-sanbud-prod"
echo "2. Test endpoint: curl https://api.sanbud24.pl/api/google/reviews"
echo "3. Check frontend: https://sanbud24.pl"
echo ""
