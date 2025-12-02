# Terraform Infrastructure Documentation

## Overview

This directory contains Terraform configurations for deploying and managing the Plumbing & Sanitary Services application infrastructure on Azure.

## Architecture

The infrastructure is organized into reusable modules:

- **database** - PostgreSQL Flexible Server
- **app-service** - Azure App Service (Web App + App Service Plan)
- **networking** - Virtual Network and subnets (optional)

## Directory Structure

```
terraform/
├── main.tf                    # Main Terraform configuration
├── variables.tf               # Variable definitions
├── outputs.tf                 # Output definitions
├── modules/                   # Reusable modules
│   ├── database/             # PostgreSQL module
│   ├── app-service/          # App Service module
│   └── networking/           # Networking module
└── environments/             # Environment-specific configurations
    ├── dev/                  # Development environment
    │   ├── terraform.tfvars
    │   ├── secrets.tfvars.example
    │   └── backend.tfvars
    ├── staging/              # Staging environment
    └── prod/                 # Production environment
```

## Prerequisites

1. **Azure CLI** - Installed and authenticated
   ```bash
   az login
   az account set --subscription <subscription-id>
   ```

2. **Terraform** - Version >= 1.0
   ```bash
   terraform version
   ```

3. **Azure Service Principal** (for CI/CD)
   ```bash
   az ad sp create-for-rbac --name "terraform-sp" --role="Contributor" --scopes="/subscriptions/<subscription-id>"
   ```

## Quick Start

### 1. Setup Backend Storage

First, create Azure storage for Terraform state:

```bash
make setup-backend ENV=dev
```

This creates:
- Resource group: `rg-terraform-state`
- Storage account: `stsanitarytfstate<env>`
- Container: `tfstate`

### 2. Configure Secrets

Copy the example secrets file and update with real values:

```bash
cp terraform/environments/dev/secrets.tfvars.example terraform/environments/dev/secrets.tfvars
```

Edit `terraform/environments/dev/secrets.tfvars`:
```hcl
postgresql_admin_password = "YourStrongPassword123!"
flask_secret_key = "your-flask-secret-key-here"
```

**IMPORTANT:** Never commit `secrets.tfvars` to version control!

### 3. Initialize Terraform

```bash
make init ENV=dev
```

### 4. Review the Plan

```bash
make plan ENV=dev
```

### 5. Apply Changes

```bash
make apply ENV=dev
```

## Makefile Commands

The Makefile provides convenient commands for managing infrastructure:

| Command | Description | Example |
|---------|-------------|---------|
| `make help` | Show all available commands | `make help` |
| `make init ENV=<env>` | Initialize Terraform | `make init ENV=prod` |
| `make plan ENV=<env>` | Create execution plan | `make plan ENV=dev` |
| `make apply ENV=<env>` | Apply changes | `make apply ENV=prod` |
| `make destroy ENV=<env>` | Destroy infrastructure | `make destroy ENV=dev` |
| `make output ENV=<env>` | Show outputs | `make output ENV=prod` |
| `make fmt` | Format Terraform files | `make fmt` |
| `make validate ENV=<env>` | Validate configuration | `make validate ENV=dev` |
| `make clean` | Clean Terraform files | `make clean` |

### Shortcuts

```bash
make dev-plan      # Same as: make plan ENV=dev
make dev-apply     # Same as: make apply ENV=dev
make prod-plan     # Same as: make plan ENV=prod
make prod-apply    # Same as: make apply ENV=prod
```

## Environment Configuration

### Development (`dev`)

- **Purpose:** Development and testing
- **SKU:** Basic tier (B1)
- **Backups:** 7 days retention
- **Geo-redundancy:** Disabled
- **Cost:** ~$50-100/month

### Production (`prod`)

- **Purpose:** Production workloads
- **SKU:** Basic tier (upgrade to Premium for production)
- **Backups:** 30 days retention
- **Geo-redundancy:** Enabled
- **Cost:** ~$100-200/month

## Required GitHub Secrets

For CI/CD via GitHub Actions, configure these secrets:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `AZURE_CLIENT_ID` | Service Principal App ID | From `az ad sp create-for-rbac` output |
| `AZURE_CLIENT_SECRET` | Service Principal Password | From `az ad sp create-for-rbac` output |
| `AZURE_SUBSCRIPTION_ID` | Azure Subscription ID | `az account show --query id -o tsv` |
| `AZURE_TENANT_ID` | Azure Tenant ID | `az account show --query tenantId -o tsv` |
| `POSTGRESQL_ADMIN_PASSWORD` | PostgreSQL admin password | Generate secure password |
| `FLASK_SECRET_KEY` | Flask secret key | `python -c "import secrets; print(secrets.token_hex(32))"` |

## Terraform State Management

Terraform state is stored in Azure Blob Storage:

- **Resource Group:** `rg-terraform-state`
- **Storage Account:** `stsanitarytfstate<env>`
- **Container:** `tfstate`
- **State File:** `<env>/sanitary-services.tfstate`

### State Commands

```bash
# List resources in state
make state ENV=prod

# Refresh state
make refresh ENV=prod

# Import existing resource
make import ENV=prod ADDR=module.database.azurerm_resource_group.main ID=/subscriptions/.../resourceGroups/...
```

## Common Workflows

### Deploying to Development

```bash
# 1. Setup backend (first time only)
make setup-backend ENV=dev

# 2. Configure secrets
cp terraform/environments/dev/secrets.tfvars.example terraform/environments/dev/secrets.tfvars
# Edit secrets.tfvars with your values

# 3. Initialize
make init ENV=dev

# 4. Plan and review
make plan ENV=dev

# 5. Apply
make apply ENV=dev

# 6. Get outputs
make output ENV=dev
```

### Deploying to Production

```bash
# 1. Setup backend (first time only)
make setup-backend ENV=prod

# 2. Configure secrets
cp terraform/environments/prod/secrets.tfvars.example terraform/environments/prod/secrets.tfvars
# Edit with production secrets

# 3. Plan
make plan ENV=prod

# 4. Review plan carefully!

# 5. Apply
make apply ENV=prod
```

### Updating Infrastructure

```bash
# 1. Make changes to Terraform files

# 2. Format code
make fmt

# 3. Plan changes
make plan ENV=dev

# 4. Review plan

# 5. Apply if acceptable
make apply ENV=dev
```

### Destroying Infrastructure

```bash
# For development (requires typing 'dev' to confirm)
make destroy ENV=dev

# For production (requires typing 'prod' to confirm)
make destroy ENV=prod
```

## Modules Documentation

### Database Module

Creates:
- PostgreSQL Flexible Server
- Database
- Firewall rules
- Secure transport configuration

Key variables:
- `postgresql_server_name`
- `postgresql_admin_user`
- `postgresql_admin_password`
- `sku_name`
- `storage_mb`

### App Service Module

Creates:
- App Service Plan (Linux)
- Linux Web App with Python runtime
- System-assigned managed identity
- Application settings for Flask
- Connection strings
- Logging configuration

Key variables:
- `app_service_name`
- `sku_name`
- `python_version`
- `database_host`, `database_name`, `database_user`, `database_password`

### Networking Module

Creates (when enabled):
- Virtual Network
- Subnet with delegation for App Service
- Network Security Group
- NSG association

Key variables:
- `vnet_name`
- `vnet_address_space`
- `subnet_address_prefix`

## Security Best Practices

1. **Secrets Management**
   - Never commit `secrets.tfvars` to git
   - Use Azure Key Vault for production secrets
   - Rotate credentials regularly

2. **State File Security**
   - State files contain sensitive data
   - Use Azure Blob Storage with encryption
   - Enable soft delete on storage account

3. **Network Security**
   - Use VNet integration for production
   - Configure NSG rules appropriately
   - Enable SSL/TLS for all connections

4. **Access Control**
   - Use service principals with minimal permissions
   - Enable Azure AD authentication where possible
   - Review and audit access regularly

## Troubleshooting

### Common Issues

**Issue:** Backend initialization fails
```bash
# Solution: Ensure storage account exists
make setup-backend ENV=dev
```

**Issue:** Authentication errors
```bash
# Solution: Re-authenticate Azure CLI
az login
az account set --subscription <subscription-id>
```

**Issue:** State lock conflicts
```bash
# Solution: Force unlock (use with caution)
cd terraform
terraform force-unlock <lock-id>
```

**Issue:** Resource already exists
```bash
# Solution: Import existing resource
make import ENV=dev ADDR=<resource-address> ID=<azure-resource-id>
```

## Cost Optimization

### Development Environment
- Use B1 tier for App Service
- Use Burstable SKU for PostgreSQL
- Disable geo-redundant backups
- Stop resources when not in use

### Production Environment
- Right-size based on actual usage
- Enable autoscaling for App Service
- Use reserved instances for predictable workloads
- Enable Azure Cost Management alerts

## Additional Resources

- [Terraform Azure Provider Documentation](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure PostgreSQL Documentation](https://docs.microsoft.com/en-us/azure/postgresql/)
- [Terraform Best Practices](https://www.terraform.io/docs/cloud/guides/recommended-practices/index.html)

## Support

For issues or questions:
1. Check this documentation
2. Review Terraform plan output
3. Check Azure Portal for resource status
4. Review GitHub Actions logs for CI/CD issues
5. Create an issue in the repository
