#!/bin/bash

# DNS Propagation Monitor
# Automatically checks DNS every 30 seconds until propagated

set -e

INTERVAL=30
MAX_CHECKS=60  # 30 minutes

echo "🔄 Starting DNS propagation monitor..."
echo "Checking every $INTERVAL seconds (max $MAX_CHECKS checks = ~30 minutes)"
echo ""
echo "Press Ctrl+C to stop monitoring"
echo ""

check_count=0

while [ $check_count -lt $MAX_CHECKS ]; do
    ((check_count++))
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Check $check_count/$MAX_CHECKS - $(date '+%H:%M:%S')"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Run the check
    ./scripts/check-nameservers.sh
    
    # Check if successful
    if dig NS sanbud24.pl +short | grep -q "azure-dns.com"; then
        echo ""
        echo "🎉 SUCCESS! Azure DNS nameservers detected!"
        echo ""
        echo "Next steps:"
        echo "1. ./scripts/add-custom-domains.sh"
        echo "2. git push origin main"
        echo "3. ./scripts/rotate-database-password.sh"
        echo ""
        exit 0
    fi
    
    echo ""
    echo "⏳ Still propagating... Checking again in $INTERVAL seconds"
    echo ""
    
    sleep $INTERVAL
done

echo ""
echo "⚠️  Reached maximum check time (30 minutes)"
echo "DNS may take longer to propagate globally (up to 48 hours in rare cases)"
echo "Continue monitoring manually with: ./scripts/check-nameservers.sh"
