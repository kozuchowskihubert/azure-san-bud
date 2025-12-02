# SanBud Development Environment Configuration

project_name = "sanbud"
environment  = "dev"
location     = "polandcentral"
location_secondary = "westeurope"

# Tags
tags = {
  Project     = "SanBud Hydraulika"
  Environment = "Development"
  ManagedBy   = "Terraform"
  Company     = "SanBud"
  CostCenter  = "Development"
  Owner       = "DevTeam"
}

# Database Configuration - Development
db_name                 = "sanbud_dev_db"
db_admin_user           = "sanbud_admin"
db_sku_name             = "B_Standard_B1ms"  # Basic tier
db_storage_mb           = 32768               # 32 GB
db_version              = "14"
db_backup_retention     = 7
db_geo_redundant_backup = false

# App Service Configuration - Development
app_service_sku_name = "B1"      # Basic B1
app_service_sku_tier = "Basic"
python_version       = "3.11"

# Static Web App - Development
enable_static_web_app = true
static_web_app_sku    = "Free"

# Optional Features - Development
enable_vnet          = false
enable_key_vault     = false
enable_app_insights  = true
enable_cdn           = false
enable_frontdoor     = false

# Allowed IPs (Add your development IPs here)
allowed_ips = [
  # "YOUR.DEV.IP.ADDRESS/32"
]
