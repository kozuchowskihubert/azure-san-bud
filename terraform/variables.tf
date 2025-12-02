# Variables for Plumbing & Sanitary Services Infrastructure

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "eastus"
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

# PostgreSQL Variables
variable "postgresql_server_name" {
  description = "Name of the PostgreSQL server"
  type        = string
}

variable "postgresql_admin_user" {
  description = "PostgreSQL administrator username"
  type        = string
  default     = "adminuser"
}

variable "postgresql_admin_password" {
  description = "PostgreSQL administrator password"
  type        = string
  sensitive   = true
}

variable "database_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "sanitary_services"
}

variable "postgresql_version" {
  description = "PostgreSQL server version"
  type        = string
  default     = "14"
}

variable "postgresql_sku_name" {
  description = "PostgreSQL SKU name"
  type        = string
  default     = "B_Standard_B1ms"
}

variable "postgresql_storage_mb" {
  description = "PostgreSQL storage size in MB"
  type        = number
  default     = 32768
}

variable "backup_retention_days" {
  description = "Backup retention days for PostgreSQL"
  type        = number
  default     = 7
}

variable "geo_redundant_backup_enabled" {
  description = "Enable geo-redundant backups"
  type        = bool
  default     = false
}

variable "allowed_ip_addresses" {
  description = "List of allowed IP addresses for database access"
  type = list(object({
    name             = string
    start_ip_address = string
    end_ip_address   = string
  }))
  default = []
}

# App Service Variables
variable "app_service_plan_name" {
  description = "Name of the App Service Plan"
  type        = string
}

variable "app_service_name" {
  description = "Name of the App Service"
  type        = string
}

variable "app_service_sku" {
  description = "SKU for App Service Plan"
  type        = string
  default     = "B1"
}

variable "python_version" {
  description = "Python version for App Service"
  type        = string
  default     = "3.11"
}

# Application Variables
variable "flask_secret_key" {
  description = "Secret key for Flask application"
  type        = string
  sensitive   = true
}

# Networking Variables
variable "enable_vnet_integration" {
  description = "Enable VNet integration for App Service"
  type        = bool
  default     = false
}

variable "vnet_name" {
  description = "Name of the Virtual Network"
  type        = string
  default     = ""
}

variable "vnet_address_space" {
  description = "Address space for VNet"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "subnet_name" {
  description = "Name of the subnet for App Service integration"
  type        = string
  default     = "subnet-app"
}

variable "subnet_address_prefix" {
  description = "Address prefix for App Service subnet"
  type        = list(string)
  default     = ["10.0.1.0/24"]
}

# Key Vault Variables
variable "enable_key_vault" {
  description = "Enable Azure Key Vault for secrets management"
  type        = bool
  default     = false
}

variable "key_vault_name" {
  description = "Name of the Key Vault"
  type        = string
  default     = ""
}

# Tags
variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
