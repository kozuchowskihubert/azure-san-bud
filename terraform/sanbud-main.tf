# SanBud Azure Infrastructure - Main Configuration

terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.80"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
  
  backend "azurerm" {
    # Backend configuration provided via backend.tfvars
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
    key_vault {
      purge_soft_delete_on_destroy = true
    }
  }
}

# Locals for resource naming
locals {
  resource_group_name  = var.resource_group_name != "" ? var.resource_group_name : "rg-${var.project_name}-${var.environment}"
  app_service_name     = "app-${var.project_name}-api-${var.environment}"
  static_web_app_name  = "swa-${var.project_name}-web-${var.environment}"
  postgresql_name      = "psql-${var.project_name}-${var.environment}"
  app_insights_name    = "appi-${var.project_name}-${var.environment}"
  key_vault_name       = "kv-${var.project_name}-${var.environment}"
  
  common_tags = merge(
    var.tags,
    {
      Environment = var.environment
      DeployedBy  = "Terraform"
    }
  )
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = local.resource_group_name
  location = var.location
  tags     = local.common_tags
}

# PostgreSQL Flexible Server
resource "azurerm_postgresql_flexible_server" "main" {
  name                   = local.postgresql_name
  resource_group_name    = azurerm_resource_group.main.name
  location               = azurerm_resource_group.main.location
  version                = var.db_version
  administrator_login    = var.db_admin_user
  administrator_password = var.db_admin_password
  
  sku_name   = var.db_sku_name
  storage_mb = var.db_storage_mb
  
  backup_retention_days        = var.db_backup_retention
  geo_redundant_backup_enabled = var.db_geo_redundant_backup
  
  tags = local.common_tags
}

# PostgreSQL Database
resource "azurerm_postgresql_flexible_server_database" "main" {
  name      = var.db_name
  server_id = azurerm_postgresql_flexible_server.main.id
  collation = "en_US.utf8"
  charset   = "utf8"
}

# PostgreSQL Firewall Rules
resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.main.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# App Service Plan (Linux) for Flask API
resource "azurerm_service_plan" "main" {
  name                = "plan-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = var.app_service_sku_name
  
  tags = local.common_tags
}

# App Service (Flask Backend API)
resource "azurerm_linux_web_app" "api" {
  name                = local.app_service_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.main.id
  
  site_config {
    always_on = var.environment == "prod" ? true : false
    
    application_stack {
      python_version = var.python_version
    }
    
    cors {
      allowed_origins = [
        "https://${local.static_web_app_name}.azurestaticapps.net",
        "https://sanbud24.pl",
        "https://www.sanbud24.pl",
        "http://localhost:3000",
        "http://localhost:5002"
      ]
      support_credentials = true
    }
  }
  
  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE"       = "1"
    "SCM_DO_BUILD_DURING_DEPLOYMENT" = "true"
    "ENABLE_ORYX_BUILD"              = "true"
    "FLASK_APP"                      = "run.py"
    "FLASK_ENV"                      = var.environment
    "DATABASE_URL"                   = "postgresql://${var.db_admin_user}:${var.db_admin_password}@${azurerm_postgresql_flexible_server.main.fqdn}:5432/${var.db_name}"
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = var.enable_app_insights ? azurerm_application_insights.main[0].connection_string : ""
    
    # Admin initialization secrets (should be rotated after first use)
    "ADMIN_INIT_SECRET"   = var.admin_init_secret
    "ADMIN_INIT_PASSWORD" = var.admin_init_password
    "ADMIN_USERNAME"      = var.admin_username
    "ADMIN_EMAIL"         = var.admin_email
  }
  
  identity {
    type = "SystemAssigned"
  }
  
  tags = local.common_tags
}

# Static Web App (Next.js Frontend)
resource "azurerm_static_site" "frontend" {
  count               = var.enable_static_web_app ? 1 : 0
  name                = local.static_web_app_name
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location_secondary  # Static Web Apps have limited regions
  sku_tier            = var.static_web_app_sku
  sku_size            = var.static_web_app_sku
  
  tags = local.common_tags
}

# Application Insights
resource "azurerm_application_insights" "main" {
  count               = var.enable_app_insights ? 1 : 0
  name                = local.app_insights_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  application_type    = "web"
  
  tags = local.common_tags
}

# Key Vault (Optional)
resource "azurerm_key_vault" "main" {
  count               = var.enable_key_vault ? 1 : 0
  name                = local.key_vault_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"
  
  soft_delete_retention_days = 7
  purge_protection_enabled   = var.environment == "prod" ? true : false
  
  tags = local.common_tags
}

# Data source for current Azure client
data "azurerm_client_config" "current" {}
