# Production Backend Configuration
# This file configures where Terraform state is stored

resource_group_name  = "rg-terraform-state"
storage_account_name = "stsanitarytfstateprod"
container_name       = "tfstate"
key                  = "prod/sanitary-services.tfstate"
