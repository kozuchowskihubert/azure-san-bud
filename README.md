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

### Prerequisites

- Azure CLI installed and configured
- Azure subscription
- GitHub repository

### Quick Deployment

See [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) for detailed instructions.

1. **Create Azure resources**
   ```bash
   # Resource Group
   az group create --name rg-sanitary-services-prod --location eastus
   
   # PostgreSQL Server
   az postgres flexible-server create \
     --name psql-sanitary-prod \
     --resource-group rg-sanitary-services-prod \
     --admin-user adminuser \
     --admin-password <YourPassword>
   
   # Web App
   az webapp up \
     --name app-sanitary-prod \
     --resource-group rg-sanitary-services-prod \
     --runtime "PYTHON:3.11"
   ```

2. **Configure environment variables**
   ```bash
   az webapp config appsettings set \
     --name app-sanitary-prod \
     --resource-group rg-sanitary-services-prod \
     --settings \
       FLASK_ENV=production \
       SECRET_KEY="<your-secret-key>" \
       DB_HOST="psql-sanitary-prod.postgres.database.azure.com" \
       DB_NAME="sanitary_services" \
       DB_USER="adminuser" \
       DB_PASSWORD="<YourPassword>"
   ```

3. **Deploy using GitHub Actions**
   - Add `AZURE_WEBAPP_PUBLISH_PROFILE` to GitHub secrets
   - Push to main branch to trigger deployment

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
