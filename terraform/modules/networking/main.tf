# Networking Module for VNet Integration

# Virtual Network
resource "azurerm_virtual_network" "main" {
  name                = var.vnet_name
  location            = var.location
  resource_group_name = var.resource_group_name
  address_space       = var.vnet_address_space
  
  tags = merge(
    var.tags,
    {
      Environment = var.environment
      Component   = "Networking"
    }
  )
}

# Subnet for App Service Integration
resource "azurerm_subnet" "app" {
  name                 = var.subnet_name
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = var.subnet_address_prefix
  
  delegation {
    name = "app-service-delegation"
    
    service_delegation {
      name = "Microsoft.Web/serverFarms"
      actions = [
        "Microsoft.Network/virtualNetworks/subnets/action"
      ]
    }
  }
}

# Network Security Group
resource "azurerm_network_security_group" "app" {
  name                = "${var.subnet_name}-nsg"
  location            = var.location
  resource_group_name = var.resource_group_name
  
  # Outbound rules
  security_rule {
    name                       = "AllowHTTPSOutbound"
    priority                   = 100
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  
  security_rule {
    name                       = "AllowPostgreSQLOutbound"
    priority                   = 110
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "5432"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  
  tags = merge(
    var.tags,
    {
      Environment = var.environment
    }
  )
}

# Associate NSG with Subnet
resource "azurerm_subnet_network_security_group_association" "app" {
  subnet_id                 = azurerm_subnet.app.id
  network_security_group_id = azurerm_network_security_group.app.id
}
