# SanBud Production Environment Configuration

project_name = "sanbud"
environment  = "prod"
location     = "polandcentral"
location_secondary = "westeurope"

# Tags
tags = {
  Project     = "SanBud Hydraulika"
  Environment = "Production"
  ManagedBy   = "Terraform"
  Company     = "SanBud"
  CostCenter  = "Production"
  Owner       = "Operations"
  Critical    = "true"
  Compliance  = "GDPR"
}

# Database Configuration - Production
db_name                 = "sanbud_prod_db"
db_admin_user           = "sanbud_admin"
db_sku_name             = "GP_Standard_D2s_v3"  # General Purpose
db_storage_mb           = 131072                 # 128 GB
db_version              = "14"
db_backup_retention     = 35                     # 35 days
db_geo_redundant_backup = true

# App Service Configuration - Production
app_service_sku_name = "P1v3"          # Premium v3
app_service_sku_tier = "PremiumV3"
python_version       = "3.11"

# Static Web App - Production
enable_static_web_app = true
static_web_app_sku    = "Standard"     # Standard tier for custom domains

# Optional Features - Production
enable_vnet          = true
enable_key_vault     = true
enable_app_insights  = true
enable_cdn           = true
enable_frontdoor     = false           # Optional: Enable for global distribution

# Allowed IPs (Configure based on your needs)
allowed_ips = [
  # "YOUR.OFFICE.IP.ADDRESS/32",
  # "BACKUP.LOCATION.IP/32"
]
