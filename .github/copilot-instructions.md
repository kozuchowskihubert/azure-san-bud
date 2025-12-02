# Plumbing and Sanitary Services Application

## Project Overview
Flask-based web application for managing plumbing and sanitary services business operations, deployed on Azure.

## Tech Stack
- **Backend**: Python 3.11+, Flask, SQLAlchemy
- **Database**: Azure PostgreSQL Flexible Server
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Deployment**: Azure App Service (Linux)
- **CI/CD**: GitHub Actions
- **Containerization**: Docker

## Project Structure
- `app/` - Flask application code
  - `models/` - SQLAlchemy database models
  - `routes/` - API endpoints and view routes
  - `templates/` - HTML templates
  - `static/` - CSS, JavaScript, images
- `migrations/` - Database migration scripts
- `config/` - Configuration files
- `.github/workflows/` - CI/CD pipelines

## Development Guidelines
- Follow PEP 8 style guide for Python code
- Use environment variables for sensitive configuration
- Write descriptive commit messages
- Test locally before pushing to Azure
- Keep dependencies in requirements.txt updated

## Azure Resources Naming Convention
- Resource Group: rg-sanitary-services-[env]
- App Service: app-sanitary-[env]
- PostgreSQL Server: psql-sanitary-[env]
- [env] = dev, staging, prod
