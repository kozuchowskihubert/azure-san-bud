# 🚰 SanBud - Professional Plumbing & Sanitary Services# Plumbing & Sanitary Services Application



[![Azure](https://img.shields.io/badge/Azure-Deployed-blue)](https://azure.microsoft.com)A professional Flask-based web application for managing plumbing and sanitary services business operations, deployed on Azure.

[![Flask](https://img.shields.io/badge/Flask-3.0-green)](https://flask.palletsprojects.com/)

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)## 🚀 Features

[![Python](https://img.shields.io/badge/Python-3.11+-blue)](https://python.org)

- **Service Management**: Browse and manage plumbing and sanitary services

A modern, full-stack web application for managing plumbing and sanitary services business operations. Built with Flask backend and Next.js frontend, deployed on Azure.- **Online Booking**: Customers can book appointments online

- **Customer Management**: Store and manage customer information

## 🌟 Features- **Appointment Scheduling**: Schedule and track service appointments

- **Responsive Design**: Mobile-friendly interface using Bootstrap 5

### For Customers- **RESTful API**: JSON API endpoints for integration

- 🌐 **Bilingual Interface**: Full Polish and English support with i18n- **Azure Ready**: Configured for Azure App Service deployment

- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS- **PostgreSQL Database**: Robust data storage with SQLAlchemy ORM

- 📅 **Online Booking**: Easy appointment scheduling

- 📧 **Contact Form**: Direct email communication with SMTP integration## 🛠️ Tech Stack

- 🎨 **Modern UI**: Green/orange gradient theme with smooth animations

- 💼 **Service Catalog**: Browse plumbing services with detailed descriptions- **Backend**: Python 3.11, Flask, SQLAlchemy, Flask-Migrate

- **Database**: PostgreSQL (Azure PostgreSQL Flexible Server)

### For Business- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5, Bootstrap Icons

- 👥 **Client Management**: Store and manage customer information- **Deployment**: Azure App Service (Linux)

- 📆 **Appointment Scheduling**: Track and manage service appointments- **CI/CD**: GitHub Actions

- 🛠️ **Service Management**: CRUD operations for service offerings- **Containerization**: Docker, Docker Compose

- 📊 **Admin Dashboard**: Bootstrap-based admin panel- **Web Server**: Gunicorn

- 📧 **Email Notifications**: Automated email alerts via Gmail SMTP

- 🔐 **Secure Admin**: Protected admin routes## 📁 Project Structure



## 🛠️ Tech Stack```

azure-san-bud/

### Backend├── app/

- **Framework**: Flask 3.0│   ├── models/          # Database models

- **Database**: PostgreSQL (Azure Flexible Server) / SQLite (local)│   ├── routes/          # API endpoints and views

- **ORM**: SQLAlchemy│   ├── static/          # Static files (CSS, JS, images)

- **Migrations**: Flask-Migrate (Alembic)│   └── templates/       # HTML templates

- **Email**: Flask-Mail with Gmail SMTP├── config/              # Configuration files

- **WSGI Server**: Gunicorn├── migrations/          # Database migrations

├── .github/

### Frontend│   └── workflows/       # GitHub Actions CI/CD

- **Framework**: Next.js 14 (App Router)├── run.py              # Application entry point

- **Language**: TypeScript├── requirements.txt    # Python dependencies

- **Styling**: Tailwind CSS├── Dockerfile          # Docker configuration

- **Internationalization**: next-intl└── docker-compose.yml  # Docker Compose configuration

- **UI Components**: Custom components with shadcn/ui patterns```

- **Icons**: Heroicons, Lucide React

## 🚦 Getting Started

### Infrastructure

- **Deployment**: Azure App Service (Linux)### Prerequisites

- **CI/CD**: GitHub Actions

- **Containerization**: Docker, Docker Compose- Python 3.11 or higher

- **IaC**: Terraform (optional)- PostgreSQL 14 or higher

- Git

## 📁 Project Structure- Docker (optional, for containerized deployment)



```### Local Development Setup

azure-san-bud/

├── app/                          # Flask backend application1. **Clone the repository**

│   ├── models/                   # SQLAlchemy database models   ```bash

│   │   ├── __init__.py   git clone <repository-url>

│   │   ├── service.py           # Service model   cd azure-san-bud

│   │   ├── client.py            # Client model   ```

│   │   └── appointment.py       # Appointment model

│   ├── routes/                   # API endpoints and views2. **Create virtual environment**

│   │   ├── __init__.py   ```bash

│   │   ├── admin.py             # Admin panel routes   python -m venv venv

│   │   ├── api.py               # Public API endpoints   source venv/bin/activate  # On Windows: venv\Scripts\activate

│   │   ├── appointments.py      # Appointment management   ```

│   │   └── services.py          # Service management

│   ├── static/                   # Static files for admin panel3. **Install dependencies**

│   │   ├── css/   ```bash

│   │   └── js/   pip install -r requirements.txt

│   ├── templates/                # Jinja2 templates   ```

│   │   └── admin/               # Admin panel templates

│   └── __init__.py              # Flask app factory4. **Set up environment variables**

│   ```bash

├── frontend/                     # Next.js frontend application   cp .env.example .env

│   ├── app/                      # Next.js App Router   # Edit .env with your configuration

│   │   ├── [locale]/            # Internationalized routes   ```

│   │   │   ├── page.tsx         # Homepage

│   │   │   ├── about/           # About page5. **Set up PostgreSQL database**

│   │   │   ├── contact/         # Contact page   ```bash

│   │   │   ├── portfolio/       # Portfolio page   # Create database

│   │   │   ├── services/        # Services page   createdb sanitary_services

│   │   │   └── layout.tsx       # Locale layout   

│   │   └── layout.tsx           # Root layout   # Or using psql

│   ├── components/               # React components   psql -U postgres -c "CREATE DATABASE sanitary_services;"

│   │   ├── Navigation.tsx   ```

│   │   ├── Footer.tsx

│   │   ├── Hero.tsx6. **Initialize database**

│   │   ├── Services.tsx   ```bash

│   │   └── BookingCalendar.tsx   flask db init

│   ├── messages/                 # i18n translations   flask db migrate -m "Initial migration"

│   │   ├── pl.json              # Polish translations   flask db upgrade

│   │   └── en.json              # English translations   ```

│   ├── public/                   # Static assets

│   │   └── images/7. **Run the application**

│   ├── i18n.ts                  # i18n configuration   ```bash

│   ├── middleware.ts            # Next.js middleware   python run.py

│   ├── next.config.js           # Next.js configuration   # Or use Flask CLI

│   └── package.json   flask run

│   ```

├── config/                       # Flask configuration

│   ├── __init__.py8. **Access the application**

│   ├── settings.py              # App settings   - Open browser: http://localhost:5000

│   └── email.py                 # Email configuration

│### Docker Development Setup

├── migrations/                   # Database migrations (Alembic)

│   ├── versions/1. **Using Docker Compose**

│   └── alembic.ini   ```bash

│   docker-compose up -d

├── scripts/                      # Utility scripts   ```

│   └── init_db.sh

│2. **Access services**

├── docs/                         # Documentation   - Web App: http://localhost:8000

│   ├── deployment/   - pgAdmin: http://localhost:5050 (admin@sanitaryservices.com / admin)

│   └── guides/

│3. **Run migrations**

├── archive/                      # Archived files (gitignored)   ```bash

│   ├── old-docs/   docker-compose exec web flask db upgrade

│   ├── tests/   ```

│   └── deployment/

│4. **Stop services**

├── .github/                      # GitHub configuration   ```bash

│   ├── workflows/               # CI/CD pipelines   docker-compose down

│   │   └── azure-deploy.yml   ```

│   └── copilot-instructions.md

│## 🌐 Azure Deployment

├── run.py                        # Flask application entry point

├── requirements.txt              # Python dependencies### Deployment Methods

├── Dockerfile                    # Production Docker image

├── Dockerfile.dev               # Development Docker imageThis project supports two deployment methods:

├── docker-compose.yml           # Docker Compose for local dev

├── Makefile                     # Common commands1. **Terraform (Recommended)** - Infrastructure as Code

├── .env.example                 # Environment variables template2. **Manual Azure CLI** - For quick testing

├── .gitignore

└── README.md                    # This file### Option 1: Terraform Deployment (Recommended)

```

Terraform automates the entire infrastructure deployment. See [terraform/README.md](terraform/README.md) for detailed instructions.

## 🚀 Getting Started

**Quick Start:**

### Prerequisites

```bash

- **Python 3.11+** (for backend)# 1. Setup Terraform backend

- **Node.js 18+** and npm (for frontend)make setup-backend ENV=prod

- **PostgreSQL 14+** (for production) or SQLite (for local dev)

- **Git**# 2. Configure secrets

- **Docker** (optional, for containerized development)cp terraform/environments/prod/secrets.tfvars.example terraform/environments/prod/secrets.tfvars

# Edit with your secrets

### Local Development Setup

# 3. Deploy infrastructure

#### 1. Clone the Repositorymake init ENV=prod

make plan ENV=prod

```bashmake apply ENV=prod

git clone https://github.com/kozuchowskihubert/azure-san-bud.git```

cd azure-san-bud

```**What gets deployed:**

- Resource Group

#### 2. Backend Setup (Flask)- PostgreSQL Flexible Server with database

- App Service Plan + Web App

```bash- Firewall rules and security settings

# Create virtual environment- (Optional) Virtual Network

python3 -m venv venv- (Optional) Azure Key Vault

source venv/bin/activate  # On Windows: venv\Scripts\activate

**Cost Estimate:**

# Install dependencies- Development: ~$50-100/month

pip install -r requirements.txt- Production: ~$100-200/month



# Copy environment variables### Option 2: Manual Azure CLI Deployment

cp .env.example .env

# Edit .env with your configurationSee [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) for manual deployment instructions.



# Initialize database**Quick deployment:**

python init_db.py

```bash

# Create admin user (optional)# Deploy using webapp up command

python init_admin.pyaz webapp up \

  --name app-sanitary-prod \

# Run Flask development server  --resource-group rg-sanitary-services-prod \

python run.py  --runtime "PYTHON:3.11" \

# Backend runs on http://localhost:5002  --sku B1 \

```  --location eastus

```

#### 3. Frontend Setup (Next.js)

### GitHub Actions CI/CD

```bash

cd frontendBoth deployment methods support automated CI/CD:



# Install dependencies1. **Terraform Workflow** - `.github/workflows/terraform.yml`

npm install   - Automatically runs on Terraform file changes

   - Creates and applies infrastructure changes

# Run Next.js development server   - Requires Azure service principal secrets

npm run dev

# Frontend runs on http://localhost:30002. **App Deployment Workflow** - `.github/workflows/azure-deploy.yml`

```   - Deploys application code to App Service

   - Runs on push to main branch

### Using Docker Compose   - Requires publish profile secret



```bash**Required GitHub Secrets:**

# Build and start all services

docker-compose up --buildFor Terraform:

- `AZURE_CLIENT_ID`

# Access:- `AZURE_CLIENT_SECRET`

# - Frontend: http://localhost:3000- `AZURE_SUBSCRIPTION_ID`

# - Backend: http://localhost:5002- `AZURE_TENANT_ID`

# - PostgreSQL: localhost:5432- `POSTGRESQL_ADMIN_PASSWORD`

```- `FLASK_SECRET_KEY`



## 🔧 ConfigurationFor App Deployment:

- `AZURE_WEBAPP_PUBLISH_PROFILE`

### Environment Variables

## 📊 Database Models

Create a `.env` file in the root directory:

### Customer

```env- Personal information (name, email, phone)

# Flask Configuration- Address details

FLASK_APP=run.py- Related appointments

FLASK_ENV=development

SECRET_KEY=your-secret-key-here### Service

- Service details (name, description, category)

# Database- Pricing and duration

DATABASE_URL=sqlite:///instance/local_app.db- Active/inactive status

# For PostgreSQL: postgresql://user:password@localhost:5432/sanbud

### Appointment

# Email Configuration (Gmail)- Customer and service association

MAIL_SERVER=smtp.gmail.com- Scheduled date and time

MAIL_PORT=587- Status tracking (pending, confirmed, completed, cancelled)

MAIL_USE_TLS=True- Additional notes

MAIL_USERNAME=your-email@gmail.com

MAIL_PASSWORD=your-app-password## 🔌 API Endpoints

MAIL_DEFAULT_SENDER=your-email@gmail.com

### Services

# Frontend API URL- `GET /services/api` - List all services

NEXT_PUBLIC_API_URL=http://localhost:5002- `GET /services/api/<id>` - Get specific service

```

### Appointments

### Gmail SMTP Setup- `POST /appointments/api` - Create appointment



1. Enable 2-Factor Authentication on your Google account### Web Routes

2. Generate an App Password at https://myaccount.google.com/apppasswords- `GET /` - Home page

3. Use the app password in `MAIL_PASSWORD`- `GET /services` - Services list

- `GET /services/<id>` - Service details

## 📊 Database- `GET /appointments/book` - Booking form

- `POST /appointments/book` - Create booking

### Models- `GET /appointments` - List appointments

- `GET /about` - About page

- **Service**: Plumbing services offered (name, description, price, duration)- `GET /contact` - Contact page

- **Client**: Customer information (name, email, phone, address)

- **Appointment**: Scheduled appointments (client, service, date, status)## 🧪 Testing



### Migrations```bash

# Install test dependencies

```bashpip install pytest pytest-cov flake8

# Create a new migration

flask db migrate -m "Description of changes"# Run tests

pytest tests/

# Apply migrations

flask db upgrade# Run linter

flake8 app/

# Rollback migration

flask db downgrade# Check coverage

```pytest --cov=app tests/

```

## 🌐 Internationalization (i18n)

## 📝 Environment Variables

The frontend supports Polish (default) and English:

| Variable | Description | Required |

- Translation files: `frontend/messages/pl.json`, `frontend/messages/en.json`|----------|-------------|----------|

- Locale routing: `/pl/` and `/en/` URL prefixes| `FLASK_ENV` | Environment (development/production) | Yes |

- Automatic locale detection based on browser settings| `SECRET_KEY` | Secret key for sessions | Yes |

- Language switcher in navigation| `DB_HOST` | PostgreSQL host | Yes |

| `DB_NAME` | Database name | Yes |

## 🎨 Customization| `DB_USER` | Database user | Yes |

| `DB_PASSWORD` | Database password | Yes |

### Theme Colors| `DB_PORT` | Database port (default: 5432) | No |

| `PORT` | Application port (default: 5000) | No |

The application uses a green/orange gradient theme:

## 🔧 Development

- **Primary Green**: `#16a34a` (green-600)

- **Secondary Orange**: `#f97316` (orange-500)### Adding a new model

- **Dark variants**: green-900, orange-900

1. Create model in `app/models/`

Modify in `frontend/tailwind.config.ts` and component styles.2. Import in `app/models/__init__.py`

3. Run migrations:

### Contact Information   ```bash

   flask db migrate -m "Add new model"

Update in `frontend/messages/pl.json` and `en.json`:   flask db upgrade

   ```

```json

{### Adding a new route

  "common": {

    "phone": "+48 503 691 808",1. Create route file in `app/routes/`

    "email": "sanbud.biuro@gmail.com"2. Register blueprint in `app/__init__.py`

  }3. Create corresponding templates

}

```## 🤝 Contributing



## 🚢 Deployment1. Fork the repository

2. Create feature branch (`git checkout -b feature/AmazingFeature`)

### Azure App Service3. Commit changes (`git commit -m 'Add AmazingFeature'`)

4. Push to branch (`git push origin feature/AmazingFeature`)

1. **Create Azure Resources**:5. Open Pull Request

   ```bash

   # Using Azure CLI## 📄 License

   az group create --name rg-sanbud --location westeurope

   az appservice plan create --name plan-sanbud --resource-group rg-sanbud --is-linuxThis project is licensed under the MIT License.

   az webapp create --name app-sanbud --resource-group rg-sanbud --plan plan-sanbud --runtime "PYTHON:3.11"

   ```## 👥 Authors



2. **Configure App Settings** in Azure Portal:- Your Name - Initial work

   - Add all environment variables from `.env`

   - Set `SCM_DO_BUILD_DURING_DEPLOYMENT=true`## 🙏 Acknowledgments

   - Set `WEBSITES_PORT=5002`

- Flask documentation

3. **Deploy**:- Azure documentation

   ```bash- Bootstrap team

   # Using GitHub Actions (recommended)

   # Push to main branch triggers automatic deployment## 📞 Support



   # Or manual deploymentFor support, email info@sanitaryservices.com or create an issue in the repository.

   az webapp up --name app-sanbud --resource-group rg-sanbud

   ```## 🗺️ Roadmap



### GitHub Actions CI/CD- [ ] Add authentication and authorization

- [ ] Implement payment processing

The project includes automated deployment pipeline in `.github/workflows/azure-deploy.yml`:- [ ] Add SMS notifications

- [ ] Create admin dashboard

- Triggers on push to `main` branch- [ ] Add service provider management

- Runs tests- [ ] Implement calendar integration

- Builds Docker image- [ ] Add invoice generation

- Deploys to Azure App Service- [ ] Multi-language support



## 📝 API Endpoints## 🔐 Security



### Public API- Environment variables for sensitive data

- HTTPS enforced in production

- `GET /api/services` - List all active services- CSRF protection enabled

- `POST /api/contact` - Send contact form email- SQL injection prevention via ORM

- `POST /api/appointments` - Create appointment- Input validation and sanitization



### Admin Routes## 🚀 Performance



- `GET /admin` - Admin dashboard (requires auth)- Database query optimization

- `GET /admin/services` - Manage services- Static file caching

- `GET /admin/clients` - Manage clients- CDN for Bootstrap and icons

- `GET /admin/appointments` - Manage appointments- Gunicorn for production serving

- Azure App Service scaling options

## 🧪 Testing

## 📚 Documentation

```bash

# Backend tests- [Azure Deployment Guide](AZURE_DEPLOYMENT.md)

python -m pytest- [GitHub Copilot Instructions](.github/copilot-instructions.md)


# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## 📈 Monitoring & Logs

- **Application Logs**: Check `logs/` directory
- **Azure Logs**: Use Azure Portal or CLI
  ```bash
  az webapp log tail --name app-sanbud --resource-group rg-sanbud
  ```

## 🔒 Security

- ✅ Environment variables for sensitive data
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ CSRF protection on forms
- ✅ Secure password hashing (Flask-Bcrypt)
- ✅ HTTPS in production (Azure App Service)
- ✅ Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for SanBud Hydraulika.

## 👨‍💻 Author

**SanBud Hydraulika**
- Website: [sanbud.pl](https://sanbud.pl)
- Email: sanbud.biuro@gmail.com
- Phone: +48 503 691 808
- Facebook: [@sanbud.hydraulika](https://www.facebook.com/sanbud.hydraulika)

## 🙏 Acknowledgments

- Next.js team for the excellent React framework
- Flask community for the lightweight web framework
- Tailwind CSS for the utility-first CSS framework
- Microsoft Azure for hosting infrastructure

---

**Note**: This README is current as of December 2025. For the latest updates, check the repository's commit history.
