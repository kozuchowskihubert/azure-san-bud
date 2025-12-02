output "postgresql_server_name" {
  description = "Name of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.main.name
}

output "postgresql_server_id" {
  description = "ID of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.main.id
}

output "postgresql_fqdn" {
  description = "FQDN of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.main.fqdn
}

output "postgresql_database_name" {
  description = "Name of the database"
  value       = azurerm_postgresql_flexible_server_database.main.name
}

output "postgresql_database_id" {
  description = "ID of the database"
  value       = azurerm_postgresql_flexible_server_database.main.id
}
