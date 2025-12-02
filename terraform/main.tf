# Main Terraform configuration for Plumbing & Sanitary Services Application
# This file orchestrates all modules and creates the core infrastructure

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
  
  backend "azurerm" {
    # Backend configuration is provided via backend.tfvars or environment variables
    # resource_group_name  = "rg-terraform-state"
    # storage_account_name = "stsanitarytfstate"
    # container_name       = "tfstate"
    # key                  = "sanitary-services.tfstate"
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
    
    key_vault {
      purge_soft_delete_on_destroy    = true
      recover_soft_deleted_key_vaults = true
    }
  }
}

# Data source for current Azure client configuration
data "azurerm_client_config" "current" {}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
  
  tags = merge(
    var.tags,
    {
      Environment = var.environment
      Project     = "SanitaryServices"
      ManagedBy   = "Terraform"
    }
  )
}

# Database Module
module "database" {
  source = "./modules/database"
  
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  environment         = var.environment
  
  postgresql_server_name = var.postgresql_server_name
  postgresql_admin_user  = var.postgresql_admin_user
  postgresql_admin_password = var.postgresql_admin_password
  database_name          = var.database_name
  
  sku_name            = var.postgresql_sku_name
  storage_mb          = var.postgresql_storage_mb
  postgresql_version  = var.postgresql_version
  
  backup_retention_days        = var.backup_retention_days
  geo_redundant_backup_enabled = var.geo_redundant_backup_enabled
  
  allowed_ip_addresses = var.allowed_ip_addresses
  
  tags = var.tags
}

# Networking Module (Optional - for VNet integration)
module "networking" {
  count  = var.enable_vnet_integration ? 1 : 0
  source = "./modules/networking"
  
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  environment         = var.environment
  
  vnet_name          = var.vnet_name
  vnet_address_space = var.vnet_address_space
  subnet_name        = var.subnet_name
  subnet_address_prefix = var.subnet_address_prefix
  
  tags = var.tags
}

# App Service Module
module "app_service" {
  source = "./modules/app-service"
  
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  environment         = var.environment
  
  app_service_plan_name = var.app_service_plan_name
  app_service_name      = var.app_service_name
  
  sku_name = var.app_service_sku
  
  python_version = var.python_version
  
  # Database connection
  database_host     = module.database.postgresql_fqdn
  database_name     = var.database_name
  database_user     = "${var.postgresql_admin_user}@${var.postgresql_server_name}"
  database_password = var.postgresql_admin_password
  
  # App settings
  flask_env  = var.environment == "prod" ? "production" : "development"
  secret_key = var.flask_secret_key
  
  # VNet integration
  enable_vnet_integration = var.enable_vnet_integration
  subnet_id               = var.enable_vnet_integration ? module.networking[0].app_subnet_id : null
  
  # Always On
  always_on = var.environment == "prod" ? true : false
  
  tags = var.tags
  
  depends_on = [module.database]
}

# Key Vault for secrets management (optional)
resource "azurerm_key_vault" "main" {
  count = var.enable_key_vault ? 1 : 0
  
  name                = var.key_vault_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  
  sku_name = "standard"
  
  soft_delete_retention_days = 7
  purge_protection_enabled   = var.environment == "prod" ? true : false
  
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id
    
    secret_permissions = [
      "Get",
      "List",
      "Set",
      "Delete",
      "Purge",
      "Recover"
    ]
  }
  
  # Grant App Service access to Key Vault
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = module.app_service.app_service_identity_principal_id
    
    secret_permissions = [
      "Get",
      "List"
    ]
  }
  
  tags = merge(
    var.tags,
    {
      Environment = var.environment
    }
  )
}

# Store secrets in Key Vault
resource "azurerm_key_vault_secret" "db_password" {
  count = var.enable_key_vault ? 1 : 0
  
  name         = "database-password"
  value        = var.postgresql_admin_password
  key_vault_id = azurerm_key_vault.main[0].id
}

resource "azurerm_key_vault_secret" "flask_secret" {
  count = var.enable_key_vault ? 1 : 0
  
  name         = "flask-secret-key"
  value        = var.flask_secret_key
  key_vault_id = azurerm_key_vault.main[0].id
}
