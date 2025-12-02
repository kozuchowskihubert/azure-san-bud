# App Service Module

# App Service Plan
resource "azurerm_service_plan" "main" {
  name                = var.app_service_plan_name
  location            = var.location
  resource_group_name = var.resource_group_name
  os_type             = "Linux"
  sku_name            = var.sku_name
  
  tags = merge(
    var.tags,
    {
      Environment = var.environment
      Component   = "AppService"
    }
  )
}

# Linux Web App
resource "azurerm_linux_web_app" "main" {
  name                = var.app_service_name
  location            = var.location
  resource_group_name = var.resource_group_name
  service_plan_id     = azurerm_service_plan.main.id
  
  https_only = true
  
  site_config {
    always_on = var.always_on
    
    application_stack {
      python_version = var.python_version
    }
    
    # Health check
    health_check_path = "/"
    
    # Enable detailed error messages
    detailed_error_logging_enabled = true
    
    # HTTP logging
    http_logging_enabled = true
  }
  
  app_settings = {
    # Flask configuration
    "FLASK_ENV"    = var.flask_env
    "SECRET_KEY"   = var.secret_key
    "WEBSITE_HTTPLOGGING_RETENTION_DAYS" = "7"
    
    # Database configuration
    "DB_HOST"     = var.database_host
    "DB_NAME"     = var.database_name
    "DB_USER"     = var.database_user
    "DB_PASSWORD" = var.database_password
    "DB_PORT"     = "5432"
    
    # Azure-specific settings
    "SCM_DO_BUILD_DURING_DEPLOYMENT" = "true"
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    
    # Python-specific settings
    "PYTHON_VERSION" = var.python_version
  }
  
  # Connection strings
  connection_string {
    name  = "DefaultConnection"
    type  = "PostgreSQL"
    value = "Host=${var.database_host};Database=${var.database_name};Username=${var.database_user};Password=${var.database_password};SSL Mode=Require;"
  }
  
  identity {
    type = "SystemAssigned"
  }
  
  logs {
    detailed_error_messages = true
    failed_request_tracing  = true
    
    http_logs {
      file_system {
        retention_in_days = 7
        retention_in_mb   = 35
      }
    }
    
    application_logs {
      file_system_level = "Information"
    }
  }
  
  tags = merge(
    var.tags,
    {
      Environment = var.environment
      Component   = "WebApp"
    }
  )
}

# VNet Integration (if enabled)
resource "azurerm_app_service_virtual_network_swift_connection" "main" {
  count = var.enable_vnet_integration ? 1 : 0
  
  app_service_id = azurerm_linux_web_app.main.id
  subnet_id      = var.subnet_id
}
