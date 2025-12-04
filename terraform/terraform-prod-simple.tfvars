# Simple Production Config - PostgreSQL Only
project_name = "sanbud"
environment  = "prod"
location     = "westeurope"

# Database - match existing DATABASE_URL
db_name                 = "sanbud_db"
db_admin_user           = "sanbud_admin"
db_admin_password       = "SanBud2024SecureDB!"
db_sku_name             = "B_Standard_B1ms"
db_storage_mb           = 32768
db_version              = "14"
db_backup_retention     = 7
db_geo_redundant_backup = false

# App Service
app_service_sku_name = "B1"
python_version       = "3.11"

# Features - minimal for now
enable_vnet          = false
enable_key_vault     = false
enable_app_insights  = false
enable_cdn           = false
enable_static_web_app = false
