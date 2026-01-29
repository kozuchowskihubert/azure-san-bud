#!/bin/bash

# DNS Configuration Automation for sanbud24.pl
# This script automates DNS record creation using Azure DNS or DNS provider API

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="sanbud24.pl"
RESOURCE_GROUP="rg-sanbud-prod"
BACKEND_APP="app-sanbud-api-prod"
FRONTEND_APP="swa-sanbud-frontend-prod"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Automated DNS Configuration for sanbud24.pl                   ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get Azure endpoints
echo -e "${YELLOW}📡 Retrieving Azure endpoints...${NC}"
BACKEND_HOSTNAME=$(az webapp show --name $BACKEND_APP --resource-group $RESOURCE_GROUP --query "defaultHostName" -o tsv)
FRONTEND_HOSTNAME=$(az staticwebapp show --name $FRONTEND_APP --resource-group $RESOURCE_GROUP --query "defaultHostname" -o tsv)
VERIFICATION_ID=$(az webapp show --name $BACKEND_APP --resource-group $RESOURCE_GROUP --query "customDomainVerificationId" -o tsv)

echo -e "${GREEN}✓${NC} Backend:  ${BACKEND_HOSTNAME}"
echo -e "${GREEN}✓${NC} Frontend: ${FRONTEND_HOSTNAME}"
echo -e "${GREEN}✓${NC} Verification ID: ${VERIFICATION_ID}"
echo ""

# Function to check if Azure DNS zone exists
check_azure_dns() {
    if az network dns zone show --name $DOMAIN --resource-group $RESOURCE_GROUP &>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Ask user which method to use
echo -e "${YELLOW}Choose DNS configuration method:${NC}"
echo "1) Use Azure DNS (recommended - fully automated)"
echo "2) Use external DNS provider (manual - displays records to add)"
echo "3) Export records to Terraform"
echo "4) Generate DNS provider API script (for supported providers)"
echo ""
read -p "Select option (1-4): " DNS_METHOD

case $DNS_METHOD in
    1)
        echo ""
        echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
        echo -e "${BLUE}  OPTION 1: Azure DNS (Fully Automated)${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
        echo ""
        
        # Check if zone exists
        if check_azure_dns; then
            echo -e "${GREEN}✓${NC} Azure DNS zone already exists for ${DOMAIN}"
        else
            echo -e "${YELLOW}Creating Azure DNS zone for ${DOMAIN}...${NC}"
            az network dns zone create \
                --resource-group $RESOURCE_GROUP \
                --name $DOMAIN \
                --tags Environment=Production Component=DNS
            
            echo -e "${GREEN}✓${NC} Azure DNS zone created"
            echo ""
            echo -e "${RED}⚠️  IMPORTANT: Update nameservers at your domain registrar!${NC}"
            echo ""
            echo "Get nameservers with:"
            echo "  az network dns zone show --name $DOMAIN --resource-group $RESOURCE_GROUP --query nameServers"
            echo ""
        fi
        
        echo -e "${YELLOW}Adding DNS records...${NC}"
        
        # Add WWW CNAME
        echo -e "${BLUE}Adding WWW CNAME record...${NC}"
        az network dns record-set cname set-record \
            --resource-group $RESOURCE_GROUP \
            --zone-name $DOMAIN \
            --record-set-name "www" \
            --cname $FRONTEND_HOSTNAME \
            --ttl 300 2>/dev/null || \
        az network dns record-set cname create \
            --resource-group $RESOURCE_GROUP \
            --zone-name $DOMAIN \
            --name "www" \
            --ttl 300 && \
        az network dns record-set cname set-record \
            --resource-group $RESOURCE_GROUP \
            --zone-name $DOMAIN \
            --record-set-name "www" \
            --cname $FRONTEND_HOSTNAME
        echo -e "${GREEN}✓${NC} WWW CNAME added"
        
        # Add API CNAME
        echo -e "${BLUE}Adding API CNAME record...${NC}"
        az network dns record-set cname set-record \
            --resource-group $RESOURCE_GROUP \
            --zone-name $DOMAIN \
            --record-set-name "api" \
            --cname $BACKEND_HOSTNAME \
            --ttl 300 2>/dev/null || \
        az network dns record-set cname create \
            --resource-group $RESOURCE_GROUP \
            --zone-name $DOMAIN \
            --name "api" \
            --ttl 300 && \
        az network dns record-set cname set-record \
            --resource-group $RESOURCE_GROUP \
            --zone-name $DOMAIN \
            --record-set-name "api" \
            --cname $BACKEND_HOSTNAME
        echo -e "${GREEN}✓${NC} API CNAME added"
        
        # Add root domain TXT for verification
        echo -e "${BLUE}Adding verification TXT record...${NC}"
        az network dns record-set txt add-record \
            --resource-group $RESOURCE_GROUP \
            --zone-name $DOMAIN \
            --record-set-name "@" \
            --value $VERIFICATION_ID \
            --ttl 300 2>/dev/null || \
        az network dns record-set txt create \
            --resource-group $RESOURCE_GROUP \
            --zone-name $DOMAIN \
            --name "@" \
            --ttl 300 && \
        az network dns record-set txt add-record \
            --resource-group $RESOURCE_GROUP \
            --zone-name $DOMAIN \
            --record-set-name "@" \
            --value $VERIFICATION_ID
        echo -e "${GREEN}✓${NC} Verification TXT added"
        
        # Add API verification TXT
        echo -e "${BLUE}Adding API verification TXT record...${NC}"
        az network dns record-set txt add-record \
            --resource-group $RESOURCE_GROUP \
            --zone-name $DOMAIN \
            --record-set-name "asuid.api" \
            --value $VERIFICATION_ID \
            --ttl 300 2>/dev/null || \
        az network dns record-set txt create \
            --resource-group $RESOURCE_GROUP \
            --zone-name $DOMAIN \
            --name "asuid.api" \
            --ttl 300 && \
        az network dns record-set txt add-record \
            --resource-group $RESOURCE_GROUP \
            --zone-name $DOMAIN \
            --record-set-name "asuid.api" \
            --value $VERIFICATION_ID
        echo -e "${GREEN}✓${NC} API verification TXT added"
        
        # Add root domain A record pointing to frontend
        echo -e "${BLUE}Adding root domain A record...${NC}"
        FRONTEND_IP=$(dig +short $FRONTEND_HOSTNAME | head -1)
        if [ -n "$FRONTEND_IP" ]; then
            az network dns record-set a add-record \
                --resource-group $RESOURCE_GROUP \
                --zone-name $DOMAIN \
                --record-set-name "@" \
                --ipv4-address $FRONTEND_IP \
                --ttl 300 2>/dev/null || \
            az network dns record-set a create \
                --resource-group $RESOURCE_GROUP \
                --zone-name $DOMAIN \
                --name "@" \
                --ttl 300 && \
            az network dns record-set a add-record \
                --resource-group $RESOURCE_GROUP \
                --zone-name $DOMAIN \
                --record-set-name "@" \
                --ipv4-address $FRONTEND_IP
            echo -e "${GREEN}✓${NC} Root domain A record added"
        else
            echo -e "${YELLOW}⚠${NC} Could not resolve frontend IP, skipping A record"
            echo "   You may need to add this manually after DNS propagation"
        fi
        
        echo ""
        echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║                    ✓ DNS Records Created!                         ║${NC}"
        echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${YELLOW}Next steps:${NC}"
        echo "1. Verify DNS propagation (wait 5-10 minutes):"
        echo "   dig www.sanbud24.pl +short"
        echo "   dig api.sanbud24.pl +short"
        echo ""
        echo "2. Add custom domains to Azure:"
        echo "   ./add-custom-domains.sh"
        echo ""
        ;;
        
    2)
        echo ""
        echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
        echo -e "${BLUE}  OPTION 2: External DNS Provider (Manual Configuration)${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
        echo ""
        
        # Run the display script
        ./dns-records-to-add.sh
        ;;
        
    3)
        echo ""
        echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
        echo -e "${BLUE}  OPTION 3: Export to Terraform${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
        echo ""
        
        TERRAFORM_FILE="terraform/dns-records.tf"
        
        cat > $TERRAFORM_FILE << EOF
# DNS Records for sanbud24.pl
# Auto-generated on $(date)

# Azure DNS Zone
resource "azurerm_dns_zone" "sanbud" {
  name                = "${DOMAIN}"
  resource_group_name = "${RESOURCE_GROUP}"
  
  tags = {
    Environment = "Production"
    Component   = "DNS"
  }
}

# WWW CNAME record
resource "azurerm_dns_cname_record" "www" {
  name                = "www"
  zone_name           = azurerm_dns_zone.sanbud.name
  resource_group_name = "${RESOURCE_GROUP}"
  ttl                 = 300
  record              = "${FRONTEND_HOSTNAME}"
}

# API CNAME record
resource "azurerm_dns_cname_record" "api" {
  name                = "api"
  zone_name           = azurerm_dns_zone.sanbud.name
  resource_group_name = "${RESOURCE_GROUP}"
  ttl                 = 300
  record              = "${BACKEND_HOSTNAME}"
}

# Root domain verification TXT
resource "azurerm_dns_txt_record" "root_verification" {
  name                = "@"
  zone_name           = azurerm_dns_zone.sanbud.name
  resource_group_name = "${RESOURCE_GROUP}"
  ttl                 = 300
  
  record {
    value = "${VERIFICATION_ID}"
  }
}

# API verification TXT
resource "azurerm_dns_txt_record" "api_verification" {
  name                = "asuid.api"
  zone_name           = azurerm_dns_zone.sanbud.name
  resource_group_name = "${RESOURCE_GROUP}"
  ttl                 = 300
  
  record {
    value = "${VERIFICATION_ID}"
  }
}

# Output nameservers
output "nameservers" {
  value       = azurerm_dns_zone.sanbud.name_servers
  description = "Update these nameservers at your domain registrar"
}
EOF
        
        echo -e "${GREEN}✓${NC} Terraform configuration created: ${TERRAFORM_FILE}"
        echo ""
        echo "To apply:"
        echo "  cd terraform"
        echo "  terraform init"
        echo "  terraform plan"
        echo "  terraform apply"
        echo ""
        ;;
        
    4)
        echo ""
        echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
        echo -e "${BLUE}  OPTION 4: DNS Provider API Script${NC}"
        echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
        echo ""
        
        echo "Select your DNS provider:"
        echo "1) Cloudflare"
        echo "2) DigitalOcean"
        echo "3) AWS Route53"
        echo "4) GoDaddy"
        echo "5) Namecheap"
        echo ""
        read -p "Select provider (1-5): " PROVIDER
        
        case $PROVIDER in
            1)
                # Cloudflare
                cat > configure-dns-cloudflare.sh << 'EOF'
#!/bin/bash
# Cloudflare DNS Configuration

set -e

# Configuration
CLOUDFLARE_EMAIL="${CLOUDFLARE_EMAIL:-your-email@example.com}"
CLOUDFLARE_API_KEY="${CLOUDFLARE_API_KEY:-your-api-key}"
ZONE_ID="${CLOUDFLARE_ZONE_ID:-your-zone-id}"

# Get Azure values
BACKEND_HOSTNAME=$(az webapp show --name app-sanbud-api-prod --resource-group rg-sanbud-prod --query "defaultHostName" -o tsv)
FRONTEND_HOSTNAME=$(az staticwebapp show --name swa-sanbud-frontend-prod --resource-group rg-sanbud-prod --query "defaultHostname" -o tsv)
VERIFICATION_ID=$(az webapp show --name app-sanbud-api-prod --resource-group rg-sanbud-prod --query "customDomainVerificationId" -o tsv)

# Function to create DNS record
create_record() {
    local type=$1
    local name=$2
    local content=$3
    
    curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
         -H "X-Auth-Email: ${CLOUDFLARE_EMAIL}" \
         -H "X-Auth-Key: ${CLOUDFLARE_API_KEY}" \
         -H "Content-Type: application/json" \
         --data "{\"type\":\"${type}\",\"name\":\"${name}\",\"content\":\"${content}\",\"ttl\":300,\"proxied\":false}"
}

# Create records
echo "Creating WWW CNAME..."
create_record "CNAME" "www" "$FRONTEND_HOSTNAME"

echo "Creating API CNAME..."
create_record "CNAME" "api" "$BACKEND_HOSTNAME"

echo "Creating verification TXT..."
create_record "TXT" "@" "$VERIFICATION_ID"

echo "Creating API verification TXT..."
create_record "TXT" "asuid.api" "$VERIFICATION_ID"

echo "Done!"
EOF
                chmod +x configure-dns-cloudflare.sh
                echo -e "${GREEN}✓${NC} Created: configure-dns-cloudflare.sh"
                echo ""
                echo "Set environment variables:"
                echo "  export CLOUDFLARE_EMAIL='your-email@example.com'"
                echo "  export CLOUDFLARE_API_KEY='your-api-key'"
                echo "  export CLOUDFLARE_ZONE_ID='your-zone-id'"
                echo ""
                echo "Then run: ./configure-dns-cloudflare.sh"
                ;;
                
            2)
                # DigitalOcean
                cat > configure-dns-digitalocean.sh << 'EOF'
#!/bin/bash
# DigitalOcean DNS Configuration

set -e

# Configuration
DO_TOKEN="${DO_TOKEN:-your-digitalocean-token}"
DOMAIN="sanbud24.pl"

# Get Azure values
BACKEND_HOSTNAME=$(az webapp show --name app-sanbud-api-prod --resource-group rg-sanbud-prod --query "defaultHostName" -o tsv)
FRONTEND_HOSTNAME=$(az staticwebapp show --name swa-sanbud-frontend-prod --resource-group rg-sanbud-prod --query "defaultHostname" -o tsv)
VERIFICATION_ID=$(az webapp show --name app-sanbud-api-prod --resource-group rg-sanbud-prod --query "customDomainVerificationId" -o tsv)

# Function to create DNS record
create_record() {
    local type=$1
    local name=$2
    local data=$3
    
    curl -X POST "https://api.digitalocean.com/v2/domains/${DOMAIN}/records" \
         -H "Authorization: Bearer ${DO_TOKEN}" \
         -H "Content-Type: application/json" \
         --data "{\"type\":\"${type}\",\"name\":\"${name}\",\"data\":\"${data}\",\"ttl\":300}"
}

# Create records
echo "Creating WWW CNAME..."
create_record "CNAME" "www" "$FRONTEND_HOSTNAME"

echo "Creating API CNAME..."
create_record "CNAME" "api" "$BACKEND_HOSTNAME"

echo "Creating verification TXT..."
create_record "TXT" "@" "$VERIFICATION_ID"

echo "Creating API verification TXT..."
create_record "TXT" "asuid.api" "$VERIFICATION_ID"

echo "Done!"
EOF
                chmod +x configure-dns-digitalocean.sh
                echo -e "${GREEN}✓${NC} Created: configure-dns-digitalocean.sh"
                echo ""
                echo "Set environment variable:"
                echo "  export DO_TOKEN='your-digitalocean-token'"
                echo ""
                echo "Then run: ./configure-dns-digitalocean.sh"
                ;;
                
            3)
                # AWS Route53
                cat > configure-dns-route53.sh << 'EOF'
#!/bin/bash
# AWS Route53 DNS Configuration

set -e

# Configuration
DOMAIN="sanbud24.pl"
HOSTED_ZONE_ID="${AWS_HOSTED_ZONE_ID}"

# Get Azure values
BACKEND_HOSTNAME=$(az webapp show --name app-sanbud-api-prod --resource-group rg-sanbud-prod --query "defaultHostName" -o tsv)
FRONTEND_HOSTNAME=$(az staticwebapp show --name swa-sanbud-frontend-prod --resource-group rg-sanbud-prod --query "defaultHostname" -o tsv)
VERIFICATION_ID=$(az webapp show --name app-sanbud-api-prod --resource-group rg-sanbud-prod --query "customDomainVerificationId" -o tsv)

# Create change batch JSON
cat > /tmp/route53-changes.json << EOFX
{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "www.${DOMAIN}",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{"Value": "${FRONTEND_HOSTNAME}"}]
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "api.${DOMAIN}",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [{"Value": "${BACKEND_HOSTNAME}"}]
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "${DOMAIN}",
        "Type": "TXT",
        "TTL": 300,
        "ResourceRecords": [{"Value": "\"${VERIFICATION_ID}\""}]
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "asuid.api.${DOMAIN}",
        "Type": "TXT",
        "TTL": 300,
        "ResourceRecords": [{"Value": "\"${VERIFICATION_ID}\""}]
      }
    }
  ]
}
EOFX

# Apply changes
aws route53 change-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch file:///tmp/route53-changes.json

echo "Done!"
rm /tmp/route53-changes.json
EOF
                chmod +x configure-dns-route53.sh
                echo -e "${GREEN}✓${NC} Created: configure-dns-route53.sh"
                echo ""
                echo "Set environment variable:"
                echo "  export AWS_HOSTED_ZONE_ID='your-zone-id'"
                echo ""
                echo "Then run: ./configure-dns-route53.sh"
                ;;
                
            *)
                echo -e "${RED}Provider not yet supported. Use manual configuration.${NC}"
                ./dns-records-to-add.sh
                ;;
        esac
        ;;
        
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Configuration complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
