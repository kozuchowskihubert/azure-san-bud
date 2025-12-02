# PostgreSQL Database Module

resource "azurerm_postgresql_flexible_server" "main" {
  name                = var.postgresql_server_name
  resource_group_name = var.resource_group_name
  location            = var.location
  
  version                      = var.postgresql_version
  administrator_login          = var.postgresql_admin_user
  administrator_password       = var.postgresql_admin_password
  
  sku_name   = var.sku_name
  storage_mb = var.storage_mb
  
  backup_retention_days        = var.backup_retention_days
  geo_redundant_backup_enabled = var.geo_redundant_backup_enabled
  
  high_availability {
    mode = var.enable_high_availability ? "ZoneRedundant" : "Disabled"
  }
  
  tags = merge(
    var.tags,
    {
      Environment = var.environment
      Component   = "Database"
    }
  )
}

# PostgreSQL Database
resource "azurerm_postgresql_flexible_server_database" "main" {
  name      = var.database_name
  server_id = azurerm_postgresql_flexible_server.main.id
  collation = "en_US.utf8"
  charset   = "utf8"
}

# Firewall Rules - Allow Azure Services
resource "azurerm_postgresql_flexible_server_firewall_rule" "azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.main.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# Firewall Rules - Custom IP Addresses
resource "azurerm_postgresql_flexible_server_firewall_rule" "custom" {
  for_each = { for idx, rule in var.allowed_ip_addresses : idx => rule }
  
  name             = each.value.name
  server_id        = azurerm_postgresql_flexible_server.main.id
  start_ip_address = each.value.start_ip_address
  end_ip_address   = each.value.end_ip_address
}

# PostgreSQL Configuration
resource "azurerm_postgresql_flexible_server_configuration" "require_secure_transport" {
  name      = "require_secure_transport"
  server_id = azurerm_postgresql_flexible_server.main.id
  value     = "on"
}
