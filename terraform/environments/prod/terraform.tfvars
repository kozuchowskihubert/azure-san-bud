# Production Environment Configuration

environment = "prod"
location    = "eastus"

# Resource Naming
resource_group_name    = "rg-sanitary-services-prod"
postgresql_server_name = "psql-sanitary-prod"
database_name          = "sanitary_services"
app_service_plan_name  = "plan-sanitary-prod"
app_service_name       = "app-sanitary-prod"
key_vault_name         = "kv-sanitary-prod"
vnet_name              = "vnet-sanitary-prod"
subnet_name            = "subnet-app-prod"

# PostgreSQL Configuration
postgresql_admin_user         = "adminuser"
postgresql_version            = "14"
postgresql_sku_name           = "B_Standard_B1ms"
postgresql_storage_mb         = 32768
backup_retention_days         = 30
geo_redundant_backup_enabled  = true

# Allowed IP Addresses for PostgreSQL
allowed_ip_addresses = [
  # {
  #   name             = "Office"
  #   start_ip_address = "1.2.3.4"
  #   end_ip_address   = "1.2.3.4"
  # }
]

# App Service Configuration
app_service_sku = "B1"  # Basic tier - upgrade to P1V2 or higher for production workloads
python_version  = "3.11"

# Features
enable_vnet_integration = false  # Set to true to enable VNet integration
enable_key_vault        = false  # Set to true to enable Azure Key Vault

# Networking Configuration (if VNet enabled)
vnet_address_space     = ["10.0.0.0/16"]
subnet_address_prefix  = ["10.0.1.0/24"]

# Tags
tags = {
  Environment = "Production"
  Project     = "SanitaryServices"
  ManagedBy   = "Terraform"
  CostCenter  = "Operations"
  Owner       = "DevOps"
}
