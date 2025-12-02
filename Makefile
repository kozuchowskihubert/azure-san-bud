.PHONY: help build dev prod up down logs shell test clean docker-build docker-push deploy tf-init tf-plan tf-apply tf-destroy

# ============================================
# SanBud Hydraulika - Makefile
# Docker + Terraform Quick Rebuild System
# ============================================

# Configuration
APP_NAME := sanbud
ENV ?= dev
DOCKER_REGISTRY := sanbudacr$(ENV).azurecr.io
IMAGE_TAG ?= latest
DOCKER_IMAGE := $(DOCKER_REGISTRY)/$(APP_NAME)-api:$(IMAGE_TAG)

# Azure Configuration
RESOURCE_GROUP := rg-sanbud-$(ENV)
APP_SERVICE := app-sanbud-api-$(ENV)
ACR_NAME := sanbudacr$(ENV)

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m

# ============================================
# Help
# ============================================

help: ## Show this help message
	@echo '$(BLUE)╔═══════════════════════════════════════════════════╗$(NC)'
	@echo '$(BLUE)║  SanBud Hydraulika - Quick Rebuild System        ║$(NC)'
	@echo '$(BLUE)╚═══════════════════════════════════════════════════╝$(NC)'
	@echo ''
	@echo '$(GREEN)🐳 Docker Commands:$(NC)'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep "Docker" | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ''
	@echo '$(GREEN)🏗️  Build & Deploy:$(NC)'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E "(Build|Deploy)" | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ''
	@echo '$(GREEN)☁️  Terraform:$(NC)'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep "Terraform" | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ''
	@echo '$(GREEN)🔧 Utilities:$(NC)'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E "(Test|Clean|Init|Setup)" | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ''
	@echo '$(GREEN)Examples:$(NC)'
	@echo '  make dev              # Start development environment'
	@echo '  make quick-deploy     # Quick rebuild and deploy'
	@echo '  make docker-build ENV=prod  # Build production image'
	@echo '  make deploy ENV=prod  # Deploy to production'

# ============================================
# Docker Development
# ============================================

dev: ## Docker: Start development environment
	@echo '$(BLUE)🚀 Starting SanBud development environment...$(NC)'
	docker compose -f docker compose.dev.yml up --build

dev-down: ## Docker: Stop development environment
	@echo '$(YELLOW)🛑 Stopping development environment...$(NC)'
	docker compose -f docker compose.dev.yml down

dev-logs: ## Docker: Show development logs
	docker compose -f docker compose.dev.yml logs -f

dev-shell: ## Docker: Shell into development container
	docker compose -f docker compose.dev.yml exec api /bin/bash

# ============================================
# Docker Build & Push
# ============================================

docker-build: ## Build: Docker image for current environment
	@echo '$(BLUE)🐳 Building Docker image for $(ENV)...$(NC)'
	@if [ "$(ENV)" = "dev" ]; then \
		docker build -f Dockerfile.dev -t $(APP_NAME)-api:dev .; \
	else \
		docker build -f Dockerfile.production -t $(DOCKER_IMAGE) .; \
	fi
	@echo '$(GREEN)✅ Build complete: $(DOCKER_IMAGE)$(NC)'

docker-run: docker-build ## Build: Run Docker container locally
	@echo '$(BLUE)🏃 Running container locally...$(NC)'
	docker run -p 8000:8000 \
		-e DATABASE_URL=${DATABASE_URL} \
		-e FLASK_ENV=development \
		--name sanbud-api-local \
		$(APP_NAME)-api:dev

docker-push: docker-build ## Build: Push image to Azure Container Registry
	@echo '$(BLUE)📤 Logging into Azure Container Registry...$(NC)'
	az acr login --name $(ACR_NAME)
	@echo '$(BLUE)📤 Pushing image to registry...$(NC)'
	docker push $(DOCKER_IMAGE)
	@echo '$(GREEN)✅ Image pushed: $(DOCKER_IMAGE)$(NC)'

docker-clean: ## Docker: Clean up containers and images
	@echo '$(YELLOW)🧹 Cleaning Docker resources...$(NC)'
	docker compose down -v || true
	docker rm -f sanbud-api-local || true
	docker system prune -f
	@echo '$(GREEN)✅ Cleaned$(NC)'

# ============================================
# Quick Deploy (Docker + Azure)
# ============================================

quick-deploy: docker-build docker-push deploy-restart ## Deploy: Quick rebuild and deploy
	@echo '$(GREEN)✅ Quick deploy complete!$(NC)'

deploy-restart: ## Deploy: Restart Azure App Service
	@echo '$(BLUE)🔄 Restarting App Service...$(NC)'
	az webapp restart --name $(APP_SERVICE) --resource-group $(RESOURCE_GROUP)
	@echo '$(GREEN)✅ App Service restarted$(NC)'

deploy-logs: ## Deploy: View Azure App Service logs
	@echo '$(BLUE)📋 Fetching logs from $(APP_SERVICE)...$(NC)'
	az webapp log tail --name $(APP_SERVICE) --resource-group $(RESOURCE_GROUP)

deploy-config: ## Deploy: Update App Service configuration
	@echo '$(BLUE)⚙️  Updating App Service configuration...$(NC)'
	az webapp config container set \
		--name $(APP_SERVICE) \
		--resource-group $(RESOURCE_GROUP) \
		--docker-custom-image-name $(DOCKER_IMAGE) \
		--docker-registry-server-url https://$(DOCKER_REGISTRY)
	@echo '$(GREEN)✅ Configuration updated$(NC)'

# ============================================
# Terraform Operations
# ============================================

check-env: ## Setup: Verify environment is valid
	@if [ "$(ENV)" != "dev" ] && [ "$(ENV)" != "staging" ] && [ "$(ENV)" != "prod" ]; then \
		echo "$(RED)Error: Invalid environment '$(ENV)'. Must be dev, staging, or prod.$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)✓ Environment: $(ENV)$(NC)"

tf-init: check-env ## Terraform: Initialize
	@echo '$(BLUE)🏗️  Initializing Terraform for $(ENV)...$(NC)'
	cd terraform && terraform init \
		-backend-config="environments/$(ENV)/sanbud-backend.tfvars" \
		-upgrade
	@echo '$(GREEN)✅ Terraform initialized$(NC)'

tf-plan: check-env tf-init ## Terraform: Show plan
	@echo '$(BLUE)📋 Creating Terraform plan for $(ENV)...$(NC)'
	cd terraform && terraform plan \
		-var-file="environments/$(ENV)/sanbud.tfvars" \
		-var-file="environments/$(ENV)/secrets.tfvars" \
		-out=tfplan
	@echo '$(GREEN)✅ Plan created$(NC)'

tf-apply: check-env tf-init ## Terraform: Apply changes
	@echo '$(YELLOW)⚠️  Applying Terraform changes for $(ENV)...$(NC)'
	@read -p "Continue? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		cd terraform && terraform apply \
			-var-file="environments/$(ENV)/sanbud.tfvars" \
			-var-file="environments/$(ENV)/secrets.tfvars" \
			-auto-approve; \
		echo "$(GREEN)✅ Changes applied$(NC)"; \
	else \
		echo "$(RED)❌ Apply cancelled$(NC)"; \
	fi

tf-destroy: check-env tf-init ## Terraform: Destroy infrastructure
	@echo '$(RED)⚠️  WARNING: This will destroy $(ENV) infrastructure!$(NC)'
	@read -p "Type '$(ENV)' to confirm: " -r; \
	echo; \
	if [ "$$REPLY" = "$(ENV)" ]; then \
		cd terraform && terraform destroy \
			-var-file="environments/$(ENV)/sanbud.tfvars" \
			-var-file="environments/$(ENV)/secrets.tfvars" \
			-auto-approve; \
		echo "$(GREEN)✅ Infrastructure destroyed$(NC)"; \
	else \
		echo "$(RED)❌ Destroy cancelled$(NC)"; \
	fi

tf-output: tf-init ## Terraform: Show outputs
	@cd terraform && terraform output -json | jq

tf-fmt: ## Terraform: Format files
	@echo '$(BLUE)📝 Formatting Terraform files...$(NC)'
	cd terraform && terraform fmt -recursive
	@echo '$(GREEN)✅ Files formatted$(NC)'

# ============================================
# Testing
# ============================================

test: ## Test: Run Python tests
	@echo '$(BLUE)🧪 Running tests...$(NC)'
	source venv/bin/activate && pytest tests/ -v --cov=app

test-docker: ## Test: Run tests in Docker
	docker run --rm $(APP_NAME)-api:dev pytest tests/ -v

lint: ## Test: Lint Python code
	@echo '$(BLUE)🔍 Linting code...$(NC)'
	source venv/bin/activate && flake8 app/ --max-line-length=120

format: ## Test: Format Python code
	@echo '$(BLUE)📝 Formatting code...$(NC)'
	source venv/bin/activate && black app/

# ============================================
# Database
# ============================================

db-migrate: ## Setup: Run database migrations
	@echo '$(BLUE)🗄️  Running migrations...$(NC)'
	source venv/bin/activate && flask db upgrade
	@echo '$(GREEN)✅ Migrations complete$(NC)'

db-init: ## Setup: Initialize database
	@echo '$(BLUE)🗄️  Initializing database...$(NC)'
	source venv/bin/activate && python init_db.py
	@echo '$(GREEN)✅ Database initialized$(NC)'

db-shell: ## Setup: Open database shell
	@echo '$(BLUE)🗄️  Opening database shell...$(NC)'
	psql $(DATABASE_URL)

# ============================================
# Utilities
# ============================================

install: ## Setup: Install Python dependencies
	@echo '$(BLUE)📦 Installing dependencies...$(NC)'
	python -m venv venv
	source venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt
	@echo '$(GREEN)✅ Dependencies installed$(NC)'

clean: ## Clean: Remove temporary files
	@echo '$(YELLOW)🧹 Cleaning temporary files...$(NC)'
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find terraform -type d -name ".terraform" -exec rm -rf {} + 2>/dev/null || true
	find terraform -type f -name "tfplan" -delete 2>/dev/null || true
	@echo '$(GREEN)✅ Cleaned$(NC)'

urls: ## Setup: Show deployed URLs
	@cd terraform && terraform output -json | jq -r '"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🎉 SANBUD HYDRAULIKA - DEPLOYED URLs\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🌐 FRONTEND (Next.js):\n   " + .static_web_app_url.value + "\n\n🔌 BACKEND API (Flask):\n   " + .api_app_service_url.value + "\n\n🗄️  DATABASE (PostgreSQL):\n   " + .postgresql_server_fqdn.value + ":5432\n   Database: " + .postgresql_database_name.value + "\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"'

status: ## Setup: Check deployment status
	@echo '$(BLUE)📊 Checking deployment status...$(NC)'
	@echo ''
	@echo '$(YELLOW)Backend API:$(NC)'
	@curl -s -o /dev/null -w "  Status: %{http_code}\n" https://app-sanbud-api-$(ENV).azurewebsites.net/ || echo "  $(RED)Offline$(NC)"
	@echo ''
	@echo '$(YELLOW)Frontend:$(NC)'
	@curl -s -o /dev/null -w "  Status: %{http_code}\n" https://delightful-ocean-078488b03.3.azurestaticapps.net/ || echo "  $(RED)Offline$(NC)"

# ============================================
# Production Shortcuts
# ============================================
prod-plan: ## Plan for prod environment
	@$(MAKE) plan ENV=prod

prod-apply: ## Apply for prod environment
	@$(MAKE) apply ENV=prod
