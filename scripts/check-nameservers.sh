#!/bin/bash

# Nameserver Update Verification Script
# Checks if DNS nameservers have been updated and propagated

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DOMAIN="sanbud24.pl"

# Expected Azure DNS nameservers
EXPECTED_NS=(
    "ns1-07.azure-dns.com."
    "ns2-07.azure-dns.net."
    "ns3-07.azure-dns.org."
    "ns4-07.azure-dns.info."
)

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         DNS Nameserver Verification for sanbud24.pl               ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}🔍 Checking current nameservers for ${DOMAIN}...${NC}"
echo ""

# Get current nameservers
CURRENT_NS=$(dig NS $DOMAIN +short | sort)

if [ -z "$CURRENT_NS" ]; then
    echo -e "${RED}❌ Unable to retrieve nameservers${NC}"
    echo "This could mean:"
    echo "  1. DNS query failed"
    echo "  2. Domain doesn't exist"
    echo "  3. Network connectivity issue"
    exit 1
fi

echo -e "${BLUE}Current nameservers:${NC}"
echo "$CURRENT_NS"
echo ""

# Check if Azure nameservers are present
AZURE_NS_COUNT=0
for ns in "${EXPECTED_NS[@]}"; do
    if echo "$CURRENT_NS" | grep -q "$ns"; then
        ((AZURE_NS_COUNT++))
    fi
done

if [ $AZURE_NS_COUNT -eq 4 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║              ✓ SUCCESS! Nameservers Updated!                       ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}✓${NC} All 4 Azure DNS nameservers are active"
    echo ""
    
    echo -e "${YELLOW}Checking DNS record propagation...${NC}"
    echo ""
    
    # Check WWW record
    WWW_RESULT=$(dig www.$DOMAIN +short | head -1)
    if [ -n "$WWW_RESULT" ]; then
        echo -e "${GREEN}✓${NC} www.$DOMAIN → $WWW_RESULT"
    else
        echo -e "${YELLOW}⏳${NC} www.$DOMAIN → Still propagating..."
    fi
    
    # Check API record
    API_RESULT=$(dig api.$DOMAIN +short | head -1)
    if [ -n "$API_RESULT" ]; then
        echo -e "${GREEN}✓${NC} api.$DOMAIN → $API_RESULT"
    else
        echo -e "${YELLOW}⏳${NC} api.$DOMAIN → Still propagating..."
    fi
    
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Wait a few more minutes for full DNS propagation"
    echo "2. Run: ./scripts/add-custom-domains.sh"
    echo "3. Run: ./scripts/rotate-database-password.sh"
    
elif [ $AZURE_NS_COUNT -gt 0 ]; then
    echo -e "${YELLOW}╔═══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║         ⏳ PARTIAL UPDATE - Propagation in Progress                ║${NC}"
    echo -e "${YELLOW}╚═══════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}⏳${NC} Found $AZURE_NS_COUNT of 4 Azure nameservers"
    echo ""
    echo "DNS is propagating globally. This is normal and can take time."
    echo ""
    echo -e "${BLUE}What to do:${NC}"
    echo "  • Wait 5-10 more minutes"
    echo "  • Run this script again to check progress"
    echo "  • Once all 4 nameservers appear, DNS records will follow"
    
else
    echo -e "${RED}╔═══════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║         ❌ NOT UPDATED - Action Required                           ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}❌${NC} Azure DNS nameservers are NOT configured yet"
    echo ""
    
    echo -e "${YELLOW}Expected nameservers:${NC}"
    for ns in "${EXPECTED_NS[@]}"; do
        echo "  • $ns"
    done
    echo ""
    
    echo -e "${BLUE}Action Required:${NC}"
    echo ""
    echo "1. Login to: https://ssl.hitme.net.pl/clientarea.php"
    echo "   Email: sanbud.biuro@gmail.com"
    echo "   Password: [see deployment-credentials.local.sh]"
    echo ""
    echo "2. Navigate to: Domeny → sanbud24.pl → Zarządzaj"
    echo ""
    echo "3. Find 'Nameservery' or 'Serwery nazw' section"
    echo ""
    echo "4. Replace ALL nameservers with:"
    echo "   ns1-07.azure-dns.com"
    echo "   ns2-07.azure-dns.net"
    echo "   ns3-07.azure-dns.org"
    echo "   ns4-07.azure-dns.info"
    echo ""
    echo "5. Click 'Zapisz' (Save)"
    echo ""
    echo "6. Wait 10-30 minutes, then run this script again"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Detailed DNS Information:${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo ""

# Show all DNS query details
echo "Full NS query:"
dig NS $DOMAIN +short

echo ""
echo "Nameserver propagation worldwide:"
for server in 8.8.8.8 1.1.1.1 208.67.222.222; do
    result=$(dig @$server NS $DOMAIN +short | head -1)
    echo "  $server → $result"
done

echo ""
echo -e "${YELLOW}Last checked:${NC} $(date)"
