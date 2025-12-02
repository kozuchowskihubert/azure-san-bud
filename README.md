# Plumbing & Sanitary Services Application

A professional Flask-based web application for managing plumbing and sanitary services business operations, deployed on Azure.

## 🚀 Features

- **Service Management**: Browse and manage plumbing and sanitary services
- **Online Booking**: Customers can book appointments online
- **Customer Management**: Store and manage customer information
- **Appointment Scheduling**: Schedule and track service appointments
- **Responsive Design**: Mobile-friendly interface using Bootstrap 5
- **RESTful API**: JSON API endpoints for integration
- **Azure Ready**: Configured for Azure App Service deployment
- **PostgreSQL Database**: Robust data storage with SQLAlchemy ORM

## 🛠️ Tech Stack

- **Backend**: Python 3.11, Flask, SQLAlchemy, Flask-Migrate
- **Database**: PostgreSQL (Azure PostgreSQL Flexible Server)
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5, Bootstrap Icons
- **Deployment**: Azure App Service (Linux)
- **CI/CD**: GitHub Actions
- **Containerization**: Docker, Docker Compose
- **Web Server**: Gunicorn

## 📁 Project Structure

```
azure-san-bud/
├── app/
│   ├── models/          # Database models
│   ├── routes/          # API endpoints and views
│   ├── static/          # Static files (CSS, JS, images)
│   └── templates/       # HTML templates
├── config/              # Configuration files
├── migrations/          # Database migrations
├── .github/
│   └── workflows/       # GitHub Actions CI/CD
├── run.py              # Application entry point
├── requirements.txt    # Python dependencies
├── Dockerfile          # Docker configuration
└── docker-compose.yml  # Docker Compose configuration
```

## 🚦 Getting Started

### Prerequisites

- Python 3.11 or higher
- PostgreSQL 14 or higher
- Git
- Docker (optional, for containerized deployment)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd azure-san-bud
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb sanitary_services
   
   # Or using psql
   psql -U postgres -c "CREATE DATABASE sanitary_services;"
   ```

6. **Initialize database**
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

7. **Run the application**
   ```bash
   python run.py
   # Or use Flask CLI
   flask run
   ```

8. **Access the application**
   - Open browser: http://localhost:5000

### Docker Development Setup

1. **Using Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access services**
   - Web App: http://localhost:8000
   - pgAdmin: http://localhost:5050 (admin@sanitaryservices.com / admin)

3. **Run migrations**
   ```bash
   docker-compose exec web flask db upgrade
   ```

4. **Stop services**
   ```bash
   docker-compose down
   ```

## 🌐 Azure Deployment

### Deployment Methods

This project supports two deployment methods:

1. **Terraform (Recommended)** - Infrastructure as Code
2. **Manual Azure CLI** - For quick testing

### Option 1: Terraform Deployment (Recommended)

Terraform automates the entire infrastructure deployment. See [terraform/README.md](terraform/README.md) for detailed instructions.

**Quick Start:**

```bash
# 1. Setup Terraform backend
make setup-backend ENV=prod

# 2. Configure secrets
cp terraform/environments/prod/secrets.tfvars.example terraform/environments/prod/secrets.tfvars
# Edit with your secrets

# 3. Deploy infrastructure
make init ENV=prod
make plan ENV=prod
make apply ENV=prod
```

**What gets deployed:**
- Resource Group
- PostgreSQL Flexible Server with database
- App Service Plan + Web App
- Firewall rules and security settings
- (Optional) Virtual Network
- (Optional) Azure Key Vault

**Cost Estimate:**
- Development: ~$50-100/month
- Production: ~$100-200/month

### Option 2: Manual Azure CLI Deployment

See [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) for manual deployment instructions.

**Quick deployment:**

```bash
# Deploy using webapp up command
az webapp up \
  --name app-sanitary-prod \
  --resource-group rg-sanitary-services-prod \
  --runtime "PYTHON:3.11" \
  --sku B1 \
  --location eastus
```

### GitHub Actions CI/CD

Both deployment methods support automated CI/CD:

1. **Terraform Workflow** - `.github/workflows/terraform.yml`
   - Automatically runs on Terraform file changes
   - Creates and applies infrastructure changes
   - Requires Azure service principal secrets

2. **App Deployment Workflow** - `.github/workflows/azure-deploy.yml`
   - Deploys application code to App Service
   - Runs on push to main branch
   - Requires publish profile secret

**Required GitHub Secrets:**

For Terraform:
- `AZURE_CLIENT_ID`
- `AZURE_CLIENT_SECRET`
- `AZURE_SUBSCRIPTION_ID`
- `AZURE_TENANT_ID`
- `POSTGRESQL_ADMIN_PASSWORD`
- `FLASK_SECRET_KEY`

For App Deployment:
- `AZURE_WEBAPP_PUBLISH_PROFILE`

## 📊 Database Models

### Customer
- Personal information (name, email, phone)
- Address details
- Related appointments

### Service
- Service details (name, description, category)
- Pricing and duration
- Active/inactive status

### Appointment
- Customer and service association
- Scheduled date and time
- Status tracking (pending, confirmed, completed, cancelled)
- Additional notes

## 🔌 API Endpoints

### Services
- `GET /services/api` - List all services
- `GET /services/api/<id>` - Get specific service

### Appointments
- `POST /appointments/api` - Create appointment

### Web Routes
- `GET /` - Home page
- `GET /services` - Services list
- `GET /services/<id>` - Service details
- `GET /appointments/book` - Booking form
- `POST /appointments/book` - Create booking
- `GET /appointments` - List appointments
- `GET /about` - About page
- `GET /contact` - Contact page

## 🧪 Testing

```bash
# Install test dependencies
pip install pytest pytest-cov flake8

# Run tests
pytest tests/

# Run linter
flake8 app/

# Check coverage
pytest --cov=app tests/
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FLASK_ENV` | Environment (development/production) | Yes |
| `SECRET_KEY` | Secret key for sessions | Yes |
| `DB_HOST` | PostgreSQL host | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_USER` | Database user | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `DB_PORT` | Database port (default: 5432) | No |
| `PORT` | Application port (default: 5000) | No |

## 🔧 Development

### Adding a new model

1. Create model in `app/models/`
2. Import in `app/models/__init__.py`
3. Run migrations:
   ```bash
   flask db migrate -m "Add new model"
   flask db upgrade
   ```

### Adding a new route

1. Create route file in `app/routes/`
2. Register blueprint in `app/__init__.py`
3. Create corresponding templates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Flask documentation
- Azure documentation
- Bootstrap team

## 📞 Support

For support, email info@sanitaryservices.com or create an issue in the repository.

## 🗺️ Roadmap

- [ ] Add authentication and authorization
- [ ] Implement payment processing
- [ ] Add SMS notifications
- [ ] Create admin dashboard
- [ ] Add service provider management
- [ ] Implement calendar integration
- [ ] Add invoice generation
- [ ] Multi-language support

## 🔐 Security

- Environment variables for sensitive data
- HTTPS enforced in production
- CSRF protection enabled
- SQL injection prevention via ORM
- Input validation and sanitization

## 🚀 Performance

- Database query optimization
- Static file caching
- CDN for Bootstrap and icons
- Gunicorn for production serving
- Azure App Service scaling options

## 📚 Documentation

- [Azure Deployment Guide](AZURE_DEPLOYMENT.md)
- [GitHub Copilot Instructions](.github/copilot-instructions.md)
