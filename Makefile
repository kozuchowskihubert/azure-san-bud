.PHONY: help init plan apply destroy fmt validate clean setup-backend

# Default environment
ENV ?= dev

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Show this help message
	@echo '${BLUE}Terraform Makefile for Plumbing & Sanitary Services${NC}'
	@echo ''
	@echo '${GREEN}Usage:${NC}'
	@echo '  make ${YELLOW}<target>${NC} [ENV=${YELLOW}<environment>${NC}]'
	@echo ''
	@echo '${GREEN}Available targets:${NC}'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  ${YELLOW}%-20s${NC} %s\n", $$1, $$2}'
	@echo ''
	@echo '${GREEN}Environments:${NC}'
	@echo '  - dev (default)'
	@echo '  - staging'
	@echo '  - prod'
	@echo ''
	@echo '${GREEN}Examples:${NC}'
	@echo '  make init ENV=prod'
	@echo '  make plan ENV=dev'
	@echo '  make apply ENV=prod'

check-env: ## Verify environment is valid
	@if [ "$(ENV)" != "dev" ] && [ "$(ENV)" != "staging" ] && [ "$(ENV)" != "prod" ]; then \
		echo "${RED}Error: Invalid environment '$(ENV)'. Must be dev, staging, or prod.${NC}"; \
		exit 1; \
	fi
	@echo "${GREEN}✓ Environment: $(ENV)${NC}"

check-secrets: check-env ## Check if secrets file exists
	@if [ ! -f "terraform/environments/$(ENV)/secrets.tfvars" ]; then \
		echo "${YELLOW}Warning: secrets.tfvars not found for $(ENV) environment${NC}"; \
		echo "${YELLOW}Creating from example...${NC}"; \
		cp terraform/environments/$(ENV)/secrets.tfvars.example terraform/environments/$(ENV)/secrets.tfvars; \
		echo "${RED}Please update terraform/environments/$(ENV)/secrets.tfvars with actual values!${NC}"; \
		exit 1; \
	fi
	@echo "${GREEN}✓ Secrets file found${NC}"

setup-backend: check-env ## Setup Azure backend for Terraform state
	@echo "${BLUE}Setting up Azure backend for $(ENV) environment...${NC}"
	@cd terraform && az group create --name rg-terraform-state --location eastus || true
	@cd terraform && az storage account create \
		--name stsanitarytfstate$(ENV) \
		--resource-group rg-terraform-state \
		--location eastus \
		--sku Standard_LRS \
		--encryption-services blob || true
	@cd terraform && az storage container create \
		--name tfstate \
		--account-name stsanitarytfstate$(ENV) || true
	@echo "${GREEN}✓ Backend setup complete${NC}"

init: check-env ## Initialize Terraform
	@echo "${BLUE}Initializing Terraform for $(ENV) environment...${NC}"
	@cd terraform && terraform init \
		-backend-config="environments/$(ENV)/backend.tfvars" \
		-upgrade
	@echo "${GREEN}✓ Terraform initialized${NC}"

fmt: ## Format Terraform files
	@echo "${BLUE}Formatting Terraform files...${NC}"
	@cd terraform && terraform fmt -recursive
	@echo "${GREEN}✓ Files formatted${NC}"

validate: init ## Validate Terraform configuration
	@echo "${BLUE}Validating Terraform configuration...${NC}"
	@cd terraform && terraform validate
	@echo "${GREEN}✓ Configuration valid${NC}"

plan: check-env check-secrets init ## Show Terraform plan
	@echo "${BLUE}Creating Terraform plan for $(ENV) environment...${NC}"
	@cd terraform && terraform plan \
		-var-file="environments/$(ENV)/terraform.tfvars" \
		-var-file="environments/$(ENV)/secrets.tfvars" \
		-out=tfplan
	@echo "${GREEN}✓ Plan created${NC}"

apply: check-env check-secrets init ## Apply Terraform changes
	@echo "${YELLOW}Applying Terraform changes for $(ENV) environment...${NC}"
	@read -p "Are you sure you want to apply changes to $(ENV)? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		cd terraform && terraform apply \
			-var-file="environments/$(ENV)/terraform.tfvars" \
			-var-file="environments/$(ENV)/secrets.tfvars" \
			-auto-approve; \
		echo "${GREEN}✓ Changes applied${NC}"; \
	else \
		echo "${RED}✗ Apply cancelled${NC}"; \
	fi

destroy: check-env check-secrets init ## Destroy Terraform-managed infrastructure
	@echo "${RED}WARNING: This will destroy all infrastructure for $(ENV) environment!${NC}"
	@read -p "Are you absolutely sure? Type '$(ENV)' to confirm: " -r; \
	echo; \
	if [ "$$REPLY" = "$(ENV)" ]; then \
		cd terraform && terraform destroy \
			-var-file="environments/$(ENV)/terraform.tfvars" \
			-var-file="environments/$(ENV)/secrets.tfvars" \
			-auto-approve; \
		echo "${GREEN}✓ Infrastructure destroyed${NC}"; \
	else \
		echo "${RED}✗ Destroy cancelled${NC}"; \
	fi

output: init ## Show Terraform outputs
	@echo "${BLUE}Terraform outputs for $(ENV) environment:${NC}"
	@cd terraform && terraform output

state: init ## List Terraform state resources
	@echo "${BLUE}Terraform state for $(ENV) environment:${NC}"
	@cd terraform && terraform state list

clean: ## Clean Terraform files
	@echo "${BLUE}Cleaning Terraform files...${NC}"
	@find terraform -type d -name ".terraform" -exec rm -rf {} + 2>/dev/null || true
	@find terraform -type f -name "tfplan" -delete 2>/dev/null || true
	@find terraform -type f -name ".terraform.lock.hcl" -delete 2>/dev/null || true
	@echo "${GREEN}✓ Cleaned${NC}"

refresh: check-env check-secrets init ## Refresh Terraform state
	@echo "${BLUE}Refreshing Terraform state for $(ENV) environment...${NC}"
	@cd terraform && terraform refresh \
		-var-file="environments/$(ENV)/terraform.tfvars" \
		-var-file="environments/$(ENV)/secrets.tfvars"
	@echo "${GREEN}✓ State refreshed${NC}"

import: check-env check-secrets init ## Import existing resource (usage: make import ENV=dev ADDR=module.database.azurerm_resource_group.main ID=/subscriptions/.../resourceGroups/...)
	@if [ -z "$(ADDR)" ] || [ -z "$(ID)" ]; then \
		echo "${RED}Error: ADDR and ID required${NC}"; \
		echo "Usage: make import ENV=dev ADDR=module.database.azurerm_resource_group.main ID=/subscriptions/.../resourceGroups/..."; \
		exit 1; \
	fi
	@cd terraform && terraform import \
		-var-file="environments/$(ENV)/terraform.tfvars" \
		-var-file="environments/$(ENV)/secrets.tfvars" \
		$(ADDR) $(ID)
	@echo "${GREEN}✓ Resource imported${NC}"

# Development shortcuts
dev-plan: ## Plan for dev environment
	@$(MAKE) plan ENV=dev

dev-apply: ## Apply for dev environment
	@$(MAKE) apply ENV=dev

# Production shortcuts
prod-plan: ## Plan for prod environment
	@$(MAKE) plan ENV=prod

prod-apply: ## Apply for prod environment
	@$(MAKE) apply ENV=prod
