# Development Environment Configuration

environment = "dev"
location    = "eastus"

# Resource Naming
resource_group_name    = "rg-sanitary-services-dev"
postgresql_server_name = "psql-sanitary-dev"
database_name          = "sanitary_services_dev"
app_service_plan_name  = "plan-sanitary-dev"
app_service_name       = "app-sanitary-dev"
key_vault_name         = "kv-sanitary-dev"
vnet_name              = "vnet-sanitary-dev"
subnet_name            = "subnet-app-dev"

# PostgreSQL Configuration
postgresql_admin_user         = "adminuser"
postgresql_version            = "14"
postgresql_sku_name           = "B_Standard_B1ms"
postgresql_storage_mb         = 32768
backup_retention_days         = 7
geo_redundant_backup_enabled  = false

# Allowed IP Addresses for PostgreSQL
allowed_ip_addresses = []

# App Service Configuration
app_service_sku = "B1"
python_version  = "3.11"

# Features
enable_vnet_integration = false
enable_key_vault        = false

# Networking Configuration
vnet_address_space     = ["10.1.0.0/16"]
subnet_address_prefix  = ["10.1.1.0/24"]

# Tags
tags = {
  Environment = "Development"
  Project     = "SanitaryServices"
  ManagedBy   = "Terraform"
  CostCenter  = "Development"
}
