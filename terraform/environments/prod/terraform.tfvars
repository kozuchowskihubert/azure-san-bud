# SanBud Production Environment Configuration
# Sensitive values should be passed via GitHub Secrets

environment = "prod"
location    = "westeurope"
location_secondary = "northeurope"

# Database Configuration
db_name           = "sanbud_prod_db"
db_admin_user     = "sanbud_admin"
# db_admin_password - Set via GitHub Secret: TF_VAR_db_admin_password

# App Service
app_service_sku_name = "B1"
app_service_sku_tier = "Basic"
python_version       = "3.11"

# Static Web App
enable_static_web_app = true
static_web_app_sku    = "Free"

# Features
enable_app_insights = true
enable_key_vault    = false
enable_vnet         = false
enable_cdn          = false

# Admin Configuration
admin_username = "admin"
admin_email    = "admin@sanbud.pl"
# admin_init_secret - Set via GitHub Secret: TF_VAR_admin_init_secret
# admin_init_password - Set via GitHub Secret: TF_VAR_admin_init_password

# SMTP Configuration  
smtp_host       = "smtp.gmail.com"
smtp_port       = 587
smtp_user       = "sanbud.kontakt@gmail.com"
smtp_from_email = "sanbud.kontakt@gmail.com"
smtp_from_name  = "SanBud - Usługi Hydrauliczne"
contact_email   = "sanbud.kontakt@gmail.com"
booking_email   = "sanbud.kontakt@gmail.com"
# smtp_password - Set via GitHub Secret: TF_VAR_smtp_password

# Tags
tags = {
  Project     = "SanBud Hydraulika"
  Environment = "Production"
  ManagedBy   = "Terraform"
  Company     = "SanBud"
  CostCenter  = "Operations"
}
