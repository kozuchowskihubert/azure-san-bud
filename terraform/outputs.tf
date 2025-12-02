# Outputs for Plumbing & Sanitary Services Infrastructure

# Resource Group
output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "resource_group_id" {
  description = "ID of the resource group"
  value       = azurerm_resource_group.main.id
}

# Database
output "postgresql_server_name" {
  description = "Name of the PostgreSQL server"
  value       = module.database.postgresql_server_name
}

output "postgresql_server_fqdn" {
  description = "FQDN of the PostgreSQL server"
  value       = module.database.postgresql_fqdn
}

output "postgresql_database_name" {
  description = "Name of the PostgreSQL database"
  value       = module.database.postgresql_database_name
}

output "database_connection_string" {
  description = "PostgreSQL connection string (without password)"
  value       = "postgresql://${var.postgresql_admin_user}@${var.postgresql_server_name}:****@${module.database.postgresql_fqdn}:5432/${var.database_name}?sslmode=require"
  sensitive   = false
}

# App Service
output "app_service_name" {
  description = "Name of the App Service"
  value       = module.app_service.app_service_name
}

output "app_service_default_hostname" {
  description = "Default hostname of the App Service"
  value       = module.app_service.app_service_default_hostname
}

output "app_service_url" {
  description = "URL of the App Service"
  value       = "https://${module.app_service.app_service_default_hostname}"
}

output "app_service_id" {
  description = "ID of the App Service"
  value       = module.app_service.app_service_id
}

output "app_service_plan_name" {
  description = "Name of the App Service Plan"
  value       = module.app_service.app_service_plan_name
}

# Networking (if enabled)
output "vnet_id" {
  description = "ID of the Virtual Network"
  value       = var.enable_vnet_integration ? module.networking[0].vnet_id : null
}

output "subnet_id" {
  description = "ID of the App Service subnet"
  value       = var.enable_vnet_integration ? module.networking[0].app_subnet_id : null
}

# Key Vault (if enabled)
output "key_vault_name" {
  description = "Name of the Key Vault"
  value       = var.enable_key_vault ? azurerm_key_vault.main[0].name : null
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = var.enable_key_vault ? azurerm_key_vault.main[0].vault_uri : null
}

# Deployment Information
output "deployment_info" {
  description = "Summary of deployed resources"
  value = {
    environment         = var.environment
    resource_group      = azurerm_resource_group.main.name
    location            = azurerm_resource_group.main.location
    app_service_url     = "https://${module.app_service.app_service_default_hostname}"
    database_server     = module.database.postgresql_fqdn
    vnet_enabled        = var.enable_vnet_integration
    key_vault_enabled   = var.enable_key_vault
  }
}
