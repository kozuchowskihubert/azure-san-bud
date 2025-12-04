#!/bin/bash
# =============================================================================
# Manage Azure Deployment Slots
# =============================================================================
#
# Quick management tool for deployment slots operations
#
# Usage:
#   ./scripts/manage-slots.sh [command]
#
# Commands:
#   status    - Show current slot status
#   swap      - Swap staging to production
#   rollback  - Swap production back to staging
#   logs      - View staging slot logs
#   test      - Test staging slot health
#   restart   - Restart staging slot
#
# =============================================================================

set -e

RESOURCE_GROUP="rg-sanbud-prod"
WEBAPP_NAME="app-sanbud-api-prod"
SLOT_NAME="staging"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo ""
    echo "================================================"
    echo "$1"
    echo "================================================"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Get URLs
get_urls() {
    PROD_URL=$(az webapp show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$WEBAPP_NAME" \
        --query "defaultHostName" \
        -o tsv 2>/dev/null || echo "unknown")
    
    STAGING_URL=$(az webapp deployment slot list \
        --resource-group "$RESOURCE_GROUP" \
        --name "$WEBAPP_NAME" \
        --query "[?name=='$SLOT_NAME'].defaultHostName" \
        -o tsv 2>/dev/null || echo "unknown")
}

# Command: status
cmd_status() {
    print_header "Deployment Slots Status"
    
    get_urls
    
    echo "Production:"
    echo "  URL: https://$PROD_URL"
    echo "  Custom Domain: https://api.sanbud24.pl"
    echo ""
    
    if [ "$STAGING_URL" != "unknown" ]; then
        echo "Staging:"
        echo "  URL: https://$STAGING_URL"
        echo ""
        
        # Check staging health
        print_info "Checking staging health..."
        if curl -f -s "https://$STAGING_URL/health" > /dev/null 2>&1; then
            print_success "Staging is healthy"
        else
            print_warning "Staging is not responding or unhealthy"
        fi
    else
        print_warning "Staging slot not found"
        echo ""
        echo "Create staging slot with:"
        echo "  ./scripts/create-deployment-slot.sh"
    fi
    
    # Check production health
    print_info "Checking production health..."
    if curl -f -s "https://$PROD_URL/health" > /dev/null 2>&1; then
        print_success "Production is healthy"
    else
        print_warning "Production is not responding or unhealthy"
    fi
    
    echo ""
}

# Command: swap
cmd_swap() {
    print_header "Swap Staging → Production"
    
    get_urls
    
    if [ "$STAGING_URL" = "unknown" ]; then
        print_error "Staging slot not found!"
        echo ""
        echo "Create staging slot first:"
        echo "  ./scripts/create-deployment-slot.sh"
        exit 1
    fi
    
    # Health check staging
    print_info "Checking staging health before swap..."
    if ! curl -f -s "https://$STAGING_URL/health" > /dev/null 2>&1; then
        print_error "Staging is not healthy! Aborting swap."
        echo ""
        echo "Fix staging issues first or use: ./scripts/manage-slots.sh logs"
        exit 1
    fi
    print_success "Staging is healthy"
    
    echo ""
    echo "This will:"
    echo "  • Move current PRODUCTION → staging slot"
    echo "  • Move current STAGING → production slot"
    echo "  • Zero downtime swap (~2 seconds)"
    echo ""
    read -p "Continue with swap? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Swap cancelled"
        exit 0
    fi
    
    print_info "Performing slot swap..."
    az webapp deployment slot swap \
        --resource-group "$RESOURCE_GROUP" \
        --name "$WEBAPP_NAME" \
        --slot "$SLOT_NAME" \
        --target-slot production
    
    print_success "Swap completed!"
    
    echo ""
    print_info "Waiting 10 seconds for production to stabilize..."
    sleep 10
    
    print_info "Verifying production health..."
    if curl -f -s "https://$PROD_URL/health" > /dev/null 2>&1; then
        print_success "Production is healthy after swap!"
    else
        print_error "Production health check failed!"
        echo ""
        echo "Consider rollback with:"
        echo "  ./scripts/manage-slots.sh rollback"
    fi
    
    echo ""
}

# Command: rollback
cmd_rollback() {
    print_header "Rollback: Swap Production → Staging"
    
    get_urls
    
    echo "⚠️  WARNING: This will rollback production to the previous version"
    echo ""
    echo "This will:"
    echo "  • Move current PRODUCTION → staging slot"
    echo "  • Move current STAGING → production slot"
    echo ""
    read -p "Continue with rollback? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Rollback cancelled"
        exit 0
    fi
    
    print_info "Performing rollback..."
    az webapp deployment slot swap \
        --resource-group "$RESOURCE_GROUP" \
        --name "$WEBAPP_NAME" \
        --slot "$SLOT_NAME" \
        --target-slot production
    
    print_success "Rollback completed!"
    
    echo ""
    print_info "Waiting 10 seconds..."
    sleep 10
    
    print_info "Verifying production health..."
    if curl -f -s "https://$PROD_URL/health" > /dev/null 2>&1; then
        print_success "Production is healthy after rollback!"
    else
        print_error "Production health check failed after rollback!"
    fi
    
    echo ""
}

# Command: logs
cmd_logs() {
    print_header "Staging Slot Logs (Live Tail)"
    
    print_info "Tailing logs from staging slot..."
    print_info "Press Ctrl+C to stop"
    echo ""
    
    az webapp log tail \
        --resource-group "$RESOURCE_GROUP" \
        --name "$WEBAPP_NAME" \
        --slot "$SLOT_NAME"
}

# Command: test
cmd_test() {
    print_header "Test Staging Slot"
    
    get_urls
    
    if [ "$STAGING_URL" = "unknown" ]; then
        print_error "Staging slot not found!"
        exit 1
    fi
    
    STAGING_FULL="https://$STAGING_URL"
    
    echo "Testing endpoints on: $STAGING_FULL"
    echo ""
    
    # Test /health
    print_info "Testing GET /health"
    if curl -f -s "$STAGING_FULL/health" | jq . 2>/dev/null; then
        print_success "/health endpoint working"
    else
        print_error "/health endpoint failed"
    fi
    echo ""
    
    # Test /api/health
    print_info "Testing GET /api/health"
    if curl -f -s "$STAGING_FULL/api/health" | jq . 2>/dev/null; then
        print_success "/api/health endpoint working"
    else
        print_warning "/api/health endpoint failed (may not exist)"
    fi
    echo ""
    
    # Response time test
    print_info "Testing response time..."
    RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}\n' "$STAGING_FULL/health")
    echo "  Response time: ${RESPONSE_TIME}s"
    
    if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
        print_success "Response time is good"
    else
        print_warning "Response time is slow"
    fi
    
    echo ""
}

# Command: restart
cmd_restart() {
    print_header "Restart Staging Slot"
    
    print_info "Restarting staging slot..."
    az webapp restart \
        --resource-group "$RESOURCE_GROUP" \
        --name "$WEBAPP_NAME" \
        --slot "$SLOT_NAME"
    
    print_success "Staging slot restarted"
    
    echo ""
    print_info "Waiting 15 seconds for restart..."
    sleep 15
    
    cmd_test
}

# Command: help
cmd_help() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  status    - Show current slot status and health"
    echo "  swap      - Swap staging to production (with health check)"
    echo "  rollback  - Rollback production to previous version"
    echo "  logs      - View staging slot logs (live tail)"
    echo "  test      - Test staging slot endpoints"
    echo "  restart   - Restart staging slot"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 status"
    echo "  $0 swap"
    echo "  $0 rollback"
    echo ""
}

# Main
COMMAND="${1:-help}"

case "$COMMAND" in
    status)
        cmd_status
        ;;
    swap)
        cmd_swap
        ;;
    rollback)
        cmd_rollback
        ;;
    logs)
        cmd_logs
        ;;
    test)
        cmd_test
        ;;
    restart)
        cmd_restart
        ;;
    help|--help|-h)
        cmd_help
        ;;
    *)
        print_error "Unknown command: $COMMAND"
        echo ""
        cmd_help
        exit 1
        ;;
esac
