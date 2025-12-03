# SanBud Azure Infrastructure Variables

variable "project_name" {
  description = "Project name (sanbud)"
  type        = string
  default     = "sanbud"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "location" {
  description = "Primary Azure region (Poland Central recommended)"
  type        = string
  default     = "polandcentral"
}

variable "location_secondary" {
  description = "Secondary Azure region for geo-redundancy"
  type        = string
  default     = "westeurope"
}

# Resource Naming
variable "resource_group_name" {
  description = "Resource group name (auto-generated if empty)"
  type        = string
  default     = ""
}

# Tags
variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Project    = "SanBud Hydraulika"
    ManagedBy  = "Terraform"
    Company    = "SanBud"
  }
}

# PostgreSQL Database
variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "sanbud_db"
}

variable "db_admin_user" {
  description = "PostgreSQL admin username"
  type        = string
  default     = "sanbud_admin"
}

variable "db_admin_password" {
  description = "PostgreSQL admin password"
  type        = string
  sensitive   = true
}

variable "db_sku_name" {
  description = "PostgreSQL SKU"
  type        = string
  default     = "B_Standard_B1ms"
}

variable "db_storage_mb" {
  description = "PostgreSQL storage in MB"
  type        = number
  default     = 32768
}

variable "db_version" {
  description = "PostgreSQL version"
  type        = string
  default     = "14"
}

variable "db_backup_retention" {
  description = "Backup retention days"
  type        = number
  default     = 7
}

variable "db_geo_redundant_backup" {
  description = "Enable geo-redundant backup"
  type        = bool
  default     = false
}

# App Service (Flask Backend)
variable "app_service_sku_name" {
  description = "App Service SKU"
  type        = string
  default     = "B1"
}

variable "app_service_sku_tier" {
  description = "App Service tier"
  type        = string
  default     = "Basic"
}

variable "python_version" {
  description = "Python version for App Service"
  type        = string
  default     = "3.11"
}

# Static Web App (Next.js Frontend)
variable "enable_static_web_app" {
  description = "Deploy Next.js frontend to Azure Static Web Apps"
  type        = bool
  default     = true
}

variable "static_web_app_sku" {
  description = "Static Web App SKU (Free or Standard)"
  type        = string
  default     = "Free"
}

# Optional Features
variable "enable_vnet" {
  description = "Enable Virtual Network"
  type        = bool
  default     = false
}

variable "enable_key_vault" {
  description = "Enable Azure Key Vault for secrets"
  type        = bool
  default     = false
}

variable "enable_app_insights" {
  description = "Enable Application Insights"
  type        = bool
  default     = true
}

variable "enable_cdn" {
  description = "Enable Azure CDN"
  type        = bool
  default     = false
}

variable "enable_frontdoor" {
  description = "Enable Azure Front Door"
  type        = bool
  default     = false
}

# Allowed IP addresses for database firewall
variable "allowed_ips" {
  description = "List of allowed IP addresses"
  type        = list(string)
  default     = []
}

# Admin User Configuration
variable "admin_init_secret" {
  description = "Secret key for admin initialization endpoint"
  type        = string
  sensitive   = true
  default     = "SanBud2025InitSecret!Zaj"
}

variable "admin_init_password" {
  description = "Initial admin password"
  type        = string
  sensitive   = true
  default     = "SanBud2025!InitAdmin!Zaj"
}

variable "admin_username" {
  description = "Admin username"
  type        = string
  default     = "admin"
}

variable "admin_email" {
  description = "Admin email address"
  type        = string
  default     = "admin@sanbud.pl"
}

# SMTP Configuration
variable "smtp_host" {
  description = "SMTP server host"
  type        = string
  default     = "smtp.gmail.com"
}

variable "smtp_port" {
  description = "SMTP server port"
  type        = number
  default     = 587
}

variable "smtp_user" {
  description = "SMTP username (email)"
  type        = string
  sensitive   = true
  default     = "sanbud.kontakt@gmail.com"
}

variable "smtp_password" {
  description = "SMTP app password"
  type        = string
  sensitive   = true
}

variable "smtp_from_email" {
  description = "Email sender address"
  type        = string
  default     = "sanbud.kontakt@gmail.com"
}

variable "smtp_from_name" {
  description = "Email sender name"
  type        = string
  default     = "SanBud - Usługi Hydrauliczne"
}

variable "contact_email" {
  description = "Contact email for receiving messages"
  type        = string
  default     = "sanbud.kontakt@gmail.com"
}

variable "booking_email" {
  description = "Email for receiving booking notifications"
  type        = string
  default     = "sanbud.kontakt@gmail.com"
}
