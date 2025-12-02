# SanBud Azure Infrastructure - Outputs

output "resource_group_name" {
  description = "Resource Group name"
  value       = azurerm_resource_group.main.name
}

output "resource_group_location" {
  description = "Resource Group location"
  value       = azurerm_resource_group.main.location
}

# Database Outputs
output "postgresql_server_fqdn" {
  description = "PostgreSQL server FQDN"
  value       = azurerm_postgresql_flexible_server.main.fqdn
  sensitive   = true
}

output "postgresql_database_name" {
  description = "PostgreSQL database name"
  value       = azurerm_postgresql_flexible_server_database.main.name
}

output "database_connection_string" {
  description = "Database connection string"
  value       = "postgresql://${var.db_admin_user}:${var.db_admin_password}@${azurerm_postgresql_flexible_server.main.fqdn}:5432/${var.db_name}"
  sensitive   = true
}

# App Service (Flask API) Outputs
output "api_app_service_name" {
  description = "Flask API App Service name"
  value       = azurerm_linux_web_app.api.name
}

output "api_app_service_url" {
  description = "Flask API URL"
  value       = "https://${azurerm_linux_web_app.api.default_hostname}"
}

output "api_app_service_identity" {
  description = "API App Service Managed Identity"
  value       = azurerm_linux_web_app.api.identity[0].principal_id
}

# Static Web App (Frontend) Outputs
output "static_web_app_name" {
  description = "Static Web App name"
  value       = var.enable_static_web_app ? azurerm_static_site.frontend[0].name : null
}

output "static_web_app_url" {
  description = "Static Web App URL"
  value       = var.enable_static_web_app ? "https://${azurerm_static_site.frontend[0].default_host_name}" : null
}

output "static_web_app_api_key" {
  description = "Static Web App deployment token"
  value       = var.enable_static_web_app ? azurerm_static_site.frontend[0].api_key : null
  sensitive   = true
}

# Application Insights Outputs
output "app_insights_instrumentation_key" {
  description = "Application Insights instrumentation key"
  value       = var.enable_app_insights ? azurerm_application_insights.main[0].instrumentation_key : null
  sensitive   = true
}

output "app_insights_connection_string" {
  description = "Application Insights connection string"
  value       = var.enable_app_insights ? azurerm_application_insights.main[0].connection_string : null
  sensitive   = true
}

# Key Vault Outputs
output "key_vault_uri" {
  description = "Key Vault URI"
  value       = var.enable_key_vault ? azurerm_key_vault.main[0].vault_uri : null
}

# Deployment Information
output "deployment_instructions" {
  description = "Next steps for deployment"
  value = <<-EOT
  
  ✅ SanBud Azure Infrastructure Deployed Successfully!
  
  📦 Resources Created:
  - Resource Group: ${azurerm_resource_group.main.name}
  - PostgreSQL Server: ${azurerm_postgresql_flexible_server.main.name}
  - Flask API: ${azurerm_linux_web_app.api.name}
  ${var.enable_static_web_app ? "- Frontend: ${azurerm_static_site.frontend[0].name}" : ""}
  
  🌐 URLs:
  - API: https://${azurerm_linux_web_app.api.default_hostname}
  ${var.enable_static_web_app ? "- Website: https://${azurerm_static_site.frontend[0].default_host_name}" : ""}
  
  🚀 Next Steps:
  
  1. Deploy Flask Backend:
     az webapp deployment source config-zip --resource-group ${azurerm_resource_group.main.name} --name ${azurerm_linux_web_app.api.name} --src backend.zip
  
  2. Deploy Next.js Frontend (if Static Web App enabled):
     - Use GitHub Actions with deployment token
     - Or: swa deploy ./frontend --deployment-token <token>
  
  3. Configure Custom Domain (Optional):
     - API: Add custom domain to App Service
     - Frontend: Add custom domain to Static Web App
  
  4. Set up SSL Certificates (Automatic with Azure)
  
  5. Configure Environment Variables:
     - Update frontend .env with API URL
     - Verify database connection
  
  📝 Important:
  - Database password is stored securely
  - Enable Key Vault for production secrets
  - Configure backup policies
  - Set up monitoring alerts
  
  EOT
}
