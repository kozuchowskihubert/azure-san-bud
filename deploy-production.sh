#!/bin/bash

# San-Bud Production Deployment Script
# This script helps deploy the application to ssl.hitme.net.pl

set -e  # Exit on error

echo "🚀 San-Bud Production Deployment"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="sanbud24.pl"
FRONTEND_DIR="frontend"
BACKEND_DIR="."
BUILD_DIR="build"

# Step 1: Check prerequisites
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Step 2: Build Frontend
echo "🔨 Building frontend..."
cd $FRONTEND_DIR

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Build production version
echo "Building Next.js production bundle..."
NODE_ENV=production npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

cd ..
echo ""

# Step 3: Prepare Backend
echo "🐍 Preparing backend..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Backend setup failed${NC}"
    exit 1
fi

echo ""

# Step 4: Create deployment package
echo "📦 Creating deployment package..."
mkdir -p $BUILD_DIR

# Copy frontend build
echo "Copying frontend build..."
cp -r $FRONTEND_DIR/.next $BUILD_DIR/
cp -r $FRONTEND_DIR/public $BUILD_DIR/
cp $FRONTEND_DIR/package.json $BUILD_DIR/
cp $FRONTEND_DIR/next.config.js $BUILD_DIR/
cp $FRONTEND_DIR/.env.production $BUILD_DIR/.env.local

# Copy backend files
echo "Copying backend files..."
cp -r app $BUILD_DIR/
cp -r config $BUILD_DIR/
cp -r migrations $BUILD_DIR/
cp requirements.txt $BUILD_DIR/
cp run.py $BUILD_DIR/
cp init_db.py $BUILD_DIR/
cp init_admin.py $BUILD_DIR/

# Copy configuration files
cp frontend/.htaccess $BUILD_DIR/

echo -e "${GREEN}✅ Deployment package created in $BUILD_DIR/${NC}"
echo ""

# Step 5: Instructions
echo "📝 Deployment Instructions"
echo "=========================="
echo ""
echo "1. Upload the contents of the '$BUILD_DIR' directory to your hosting:"
echo "   - Frontend files → /public_html/"
echo "   - Backend files → /public_html/api/ (or your preferred location)"
echo ""
echo "2. On your hosting server, run:"
echo "   cd /path/to/your/app"
echo "   python3 -m venv venv"
echo "   source venv/bin/activate"
echo "   pip install -r requirements.txt"
echo "   python init_db.py"
echo "   python init_admin.py"
echo ""
echo "3. Configure your web server to:"
echo "   - Serve frontend from root: https://$DOMAIN"
echo "   - Proxy API requests to Flask: https://$DOMAIN/api"
echo ""
echo "4. Start the services:"
echo "   - Frontend: npm run start:production"
echo "   - Backend: python run.py"
echo ""
echo "5. Test your deployment:"
echo "   - Frontend: https://$DOMAIN"
echo "   - API: https://$DOMAIN/api/services"
echo "   - Admin: https://$DOMAIN/admin/login"
echo ""
echo -e "${GREEN}✅ Build complete! Ready for deployment${NC}"
echo ""
echo "📄 See HOSTING_DEPLOYMENT.md for detailed instructions"
echo ""

# Deactivate virtual environment
deactivate
