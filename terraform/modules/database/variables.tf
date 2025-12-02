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

variable "postgresql_server_name" {
  description = "Name of the PostgreSQL server"
  type        = string
}

variable "postgresql_admin_user" {
  description = "PostgreSQL administrator username"
  type        = string
}

variable "postgresql_admin_password" {
  description = "PostgreSQL administrator password"
  type        = string
  sensitive   = true
}

variable "database_name" {
  description = "Name of the database"
  type        = string
}

variable "postgresql_version" {
  description = "PostgreSQL version"
  type        = string
  default     = "14"
}

variable "sku_name" {
  description = "SKU name for PostgreSQL"
  type        = string
  default     = "B_Standard_B1ms"
}

variable "storage_mb" {
  description = "Storage size in MB"
  type        = number
  default     = 32768
}

variable "backup_retention_days" {
  description = "Backup retention in days"
  type        = number
  default     = 7
}

variable "geo_redundant_backup_enabled" {
  description = "Enable geo-redundant backups"
  type        = bool
  default     = false
}

variable "enable_high_availability" {
  description = "Enable high availability"
  type        = bool
  default     = false
}

variable "allowed_ip_addresses" {
  description = "Allowed IP addresses for firewall rules"
  type = list(object({
    name             = string
    start_ip_address = string
    end_ip_address   = string
  }))
  default = []
}

variable "tags" {
  description = "Tags for resources"
  type        = map(string)
  default     = {}
}
