#!/bin/bash

# Domain Management Script for sanbud24.pl
# This script helps verify DNS configuration and domain setup

set -e

DOMAIN="sanbud24.pl"
WWW_DOMAIN="www.sanbud24.pl"
API_DOMAIN="api.sanbud24.pl"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🌐 Domain Management - sanbud24.pl"
echo "=================================="
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required tools
echo "📋 Checking required tools..."
if ! command_exists dig; then
    echo -e "${RED}❌ 'dig' not found. Please install dnsutils${NC}"
    exit 1
fi
echo -e "${GREEN}✅ All required tools found${NC}"
echo ""

# Function to check DNS record
check_dns() {
    local domain=$1
    local record_type=$2
    
    echo "Checking ${record_type} record for ${domain}..."
    result=$(dig +short $domain $record_type)
    
    if [ -z "$result" ]; then
        echo -e "${RED}❌ No ${record_type} record found${NC}"
        return 1
    else
        echo -e "${GREEN}✅ ${record_type}: $result${NC}"
        return 0
    fi
}

# Main Domain Check
echo -e "${BLUE}=== Main Domain Check ===${NC}"
check_dns $DOMAIN A
echo ""

# WWW Subdomain Check
echo -e "${BLUE}=== WWW Subdomain Check ===${NC}"
check_dns $WWW_DOMAIN CNAME || check_dns $WWW_DOMAIN A
echo ""

# API Subdomain Check
echo -e "${BLUE}=== API Subdomain Check (Optional) ===${NC}"
check_dns $API_DOMAIN A || echo -e "${YELLOW}⚠️  API subdomain not configured (optional)${NC}"
echo ""

# MX Records Check
echo -e "${BLUE}=== Email (MX) Records Check ===${NC}"
check_dns $DOMAIN MX || echo -e "${YELLOW}⚠️  No MX records (email not configured)${NC}"
echo ""

# TXT Records Check (SPF/DMARC)
echo -e "${BLUE}=== TXT Records Check ===${NC}"
txt_records=$(dig +short $DOMAIN TXT)
if [ -z "$txt_records" ]; then
    echo -e "${YELLOW}⚠️  No TXT records found${NC}"
else
    echo -e "${GREEN}✅ TXT Records found:${NC}"
    echo "$txt_records"
fi
echo ""

# SSL Certificate Check
echo -e "${BLUE}=== SSL Certificate Check ===${NC}"
if command_exists openssl; then
    echo "Checking SSL certificate for https://${DOMAIN}..."
    if timeout 5 bash -c "echo | openssl s_client -connect ${DOMAIN}:443 -servername ${DOMAIN} 2>/dev/null" > /dev/null; then
        cert_info=$(echo | openssl s_client -connect ${DOMAIN}:443 -servername ${DOMAIN} 2>/dev/null | openssl x509 -noout -subject -dates 2>/dev/null)
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ SSL Certificate:${NC}"
            echo "$cert_info"
        else
            echo -e "${RED}❌ SSL certificate not valid${NC}"
        fi
    else
        echo -e "${RED}❌ Cannot connect to ${DOMAIN}:443${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  OpenSSL not found, skipping SSL check${NC}"
fi
echo ""

# HTTP/HTTPS Check
echo -e "${BLUE}=== HTTP/HTTPS Check ===${NC}"
if command_exists curl; then
    echo "Testing HTTP → HTTPS redirect..."
    http_code=$(curl -s -o /dev/null -w "%{http_code}" -L http://${DOMAIN}/ 2>/dev/null || echo "000")
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ Site accessible${NC}"
    elif [ "$http_code" = "000" ]; then
        echo -e "${RED}❌ Cannot connect to site${NC}"
    else
        echo -e "${YELLOW}⚠️  HTTP Status: $http_code${NC}"
    fi
    
    echo "Testing HTTPS..."
    https_code=$(curl -s -o /dev/null -w "%{http_code}" https://${DOMAIN}/ 2>/dev/null || echo "000")
    if [ "$https_code" = "200" ]; then
        echo -e "${GREEN}✅ HTTPS working${NC}"
    elif [ "$https_code" = "000" ]; then
        echo -e "${RED}❌ HTTPS not accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  HTTPS Status: $https_code${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  curl not found, skipping HTTP checks${NC}"
fi
echo ""

# API Health Check
echo -e "${BLUE}=== API Health Check ===${NC}"
if command_exists curl; then
    echo "Testing API endpoint..."
    api_response=$(curl -s https://${DOMAIN}/api/health 2>/dev/null || echo "")
    if echo "$api_response" | grep -q "healthy"; then
        echo -e "${GREEN}✅ API is healthy${NC}"
        echo "Response: $api_response"
    else
        echo -e "${YELLOW}⚠️  API health check failed or not configured${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  curl not found, skipping API check${NC}"
fi
echo ""

# DNS Propagation Check
echo -e "${BLUE}=== DNS Propagation Check ===${NC}"
echo "Checking DNS from multiple servers..."

dns_servers=("8.8.8.8" "1.1.1.1" "9.9.9.9")
for dns in "${dns_servers[@]}"; do
    result=$(dig @${dns} +short $DOMAIN A 2>/dev/null || echo "timeout")
    if [ "$result" != "timeout" ] && [ -n "$result" ]; then
        echo -e "${GREEN}✅ ${dns}: $result${NC}"
    else
        echo -e "${RED}❌ ${dns}: Not resolved${NC}"
    fi
done
echo ""

# Summary
echo -e "${BLUE}=== Summary ===${NC}"
echo ""
echo "📍 Domain Information:"
echo "   Main: $DOMAIN"
echo "   WWW:  $WWW_DOMAIN"
echo "   API:  $API_DOMAIN"
echo ""
echo "🔗 Useful Links:"
echo "   Site:        https://$DOMAIN"
echo "   Admin:       https://$DOMAIN/admin/login"
echo "   API Health:  https://$DOMAIN/api/health"
echo "   SSL Check:   https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
echo "   DNS Check:   https://www.whatsmydns.net/#A/$DOMAIN"
echo ""
echo "✅ DNS check complete!"
echo ""
echo "💡 Tips:"
echo "   - DNS changes can take 1-48 hours to propagate globally"
echo "   - Clear your DNS cache if changes aren't visible"
echo "   - Use https://www.whatsmydns.net for global propagation check"
echo ""
