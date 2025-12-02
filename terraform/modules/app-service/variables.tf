variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "app_service_plan_name" {
  description = "Name of the App Service Plan"
  type        = string
}

variable "app_service_name" {
  description = "Name of the App Service"
  type        = string
}

variable "sku_name" {
  description = "SKU for the App Service Plan"
  type        = string
  default     = "B1"
}

variable "python_version" {
  description = "Python version"
  type        = string
  default     = "3.11"
}

variable "flask_env" {
  description = "Flask environment"
  type        = string
  default     = "production"
}

variable "secret_key" {
  description = "Flask secret key"
  type        = string
  sensitive   = true
}

variable "database_host" {
  description = "Database host"
  type        = string
}

variable "database_name" {
  description = "Database name"
  type        = string
}

variable "database_user" {
  description = "Database user"
  type        = string
}

variable "database_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "always_on" {
  description = "Enable always on"
  type        = bool
  default     = false
}

variable "enable_vnet_integration" {
  description = "Enable VNet integration"
  type        = bool
  default     = false
}

variable "subnet_id" {
  description = "Subnet ID for VNet integration"
  type        = string
  default     = null
}

variable "tags" {
  description = "Tags for resources"
  type        = map(string)
  default     = {}
}
