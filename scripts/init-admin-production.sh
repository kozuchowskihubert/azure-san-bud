#!/bin/bash
# Script to initialize admin user on Azure App Service production

set -e

echo "🚀 Initializing Admin User on Azure Production"
echo "=============================================="
echo ""

# Configuration
RESOURCE_GROUP="rg-sanbud"
APP_NAME="app-sanbud-api-prod"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "Resource Group: $RESOURCE_GROUP"
echo "App Name: $APP_NAME"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed${NC}"
    echo "Install it from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in
echo -e "${YELLOW}🔐 Checking Azure login...${NC}"
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Please login to Azure...${NC}"
    az login
fi

echo -e "${GREEN}✅ Azure login confirmed${NC}"
echo ""

# Create a temporary Python script for admin initialization
echo -e "${YELLOW}📝 Creating initialization script...${NC}"
cat > /tmp/init_admin_azure.py << 'EOFPYTHON'
"""Initialize admin user on Azure production."""
import os
from app import create_app, db
from app.models.admin import Admin

def init_admin():
    """Create initial admin user."""
    app = create_app('production')
    
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Check if admin already exists
        existing_admin = Admin.query.filter_by(username='admin').first()
        
        if existing_admin:
            print("✓ Admin user already exists!")
            print(f"Username: {existing_admin.username}")
            print(f"Email: {existing_admin.email}")
            return
        
        # Create new admin with default credentials
        print("Creating new admin user...")
        
        admin = Admin(
            username='admin',
            email='admin@sanbud.pl',
            first_name='Admin',
            last_name='SanBud',
            is_active=True,
            is_super_admin=True
        )
        admin.set_password('Admin123!@#$Zaj')
        
        db.session.add(admin)
        db.session.commit()
        
        print("=" * 50)
        print("✓ Admin user created successfully!")
        print("=" * 50)
        print(f"Username: {admin.username}")
        print(f"Email: {admin.email}")
        print(f"Password: Admin123!@#$Zaj")
        print("=" * 50)
        print("You can now login at: https://sanbud24.pl/admin/login")

if __name__ == '__main__':
    init_admin()
EOFPYTHON

echo -e "${GREEN}✅ Script created${NC}"
echo ""

# Option 1: Run via SSH (if enabled)
echo -e "${YELLOW}🔧 Method 1: SSH into App Service${NC}"
echo "Run the following commands:"
echo ""
echo "  az webapp ssh --name $APP_NAME --resource-group $RESOURCE_GROUP"
echo ""
echo "Once connected, run:"
echo "  cd /home/site/wwwroot"
echo "  python init_admin.py"
echo ""
echo "----------------------------------------"
echo ""

# Option 2: Run via az webapp command
echo -e "${YELLOW}🔧 Method 2: Run command directly (attempting now...)${NC}"
echo ""

# Try to run the init script directly
echo -e "${YELLOW}Uploading and executing initialization script...${NC}"

# Upload the script
az webapp deploy --name $APP_NAME \
                 --resource-group $RESOURCE_GROUP \
                 --src-path /tmp/init_admin_azure.py \
                 --type static \
                 --target-path /tmp/init_admin_azure.py \
                 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Direct upload not supported, using SSH method...${NC}"
}

# Try to execute via SSH command
echo -e "${YELLOW}Executing initialization...${NC}"
az webapp ssh --name $APP_NAME \
              --resource-group $RESOURCE_GROUP \
              --command "cd /home/site/wwwroot && python init_admin.py" \
              2>/dev/null || {
    echo -e "${YELLOW}⚠️  SSH execution not available${NC}"
    echo ""
    echo -e "${YELLOW}📌 Please use one of these manual methods:${NC}"
    echo ""
    echo "1. Azure Portal:"
    echo "   - Go to: https://portal.azure.com"
    echo "   - Find your App Service: $APP_NAME"
    echo "   - Go to 'SSH' or 'Console'"
    echo "   - Run: python init_admin.py"
    echo ""
    echo "2. Azure Cloud Shell:"
    echo "   - Open Cloud Shell in Azure Portal"
    echo "   - Run: az webapp ssh --name $APP_NAME --resource-group $RESOURCE_GROUP"
    echo "   - Then: cd /home/site/wwwroot && python init_admin.py"
    echo ""
}

echo ""
echo -e "${GREEN}=============================================="
echo "📋 Admin Login Details"
echo "=============================================="
echo "URL: https://sanbud24.pl/admin/login"
echo "Username: admin"
echo "Password: Admin123!@#$Zaj"
echo "=============================================="
echo -e "${NC}"

# Cleanup
rm -f /tmp/init_admin_azure.py

echo -e "${GREEN}✅ Script completed!${NC}"
