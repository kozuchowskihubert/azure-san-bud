"""Flask application factory."""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config.settings import get_config
from config.email import init_email

db = SQLAlchemy()
migrate = Migrate()


def create_app(config_name='production'):
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Load configuration
    config = get_config(config_name)
    app.config.from_object(config)
    
    # Configure session cookies for cross-domain authentication
    # Required for frontend (sanbud24.pl) to use backend (app-sanbud-api-prod.azurewebsites.net)
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Allow cross-site cookie access
    app.config['SESSION_COOKIE_SECURE'] = True      # Required when SameSite=None (HTTPS only)
    app.config['SESSION_COOKIE_HTTPONLY'] = True    # Security: prevent JavaScript access
    app.config['SESSION_COOKIE_PATH'] = '/'         # Cookie available for all paths
    
    # Enable CORS for production domain, Azure Static Web App and local development
    # Note: support_credentials MUST be set at top level for Access-Control-Allow-Credentials header
    CORS(app, 
         origins=[
             # Production domain
             "https://sanbud24.pl",
             "https://www.sanbud24.pl",
             "https://api.sanbud24.pl",
             # Local development
             "http://localhost:3000",
             "http://localhost:3001",
             "http://localhost:3002",
             "http://localhost:3003",
             "http://localhost:5002",
             # Azure Static Web Apps
             "https://delightful-ocean-078488b03.3.azurestaticapps.net",
             "https://swa-sanbud-web-dev.azurestaticapps.net"
         ],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
         support_credentials=True,
         expose_headers=["Content-Range", "X-Content-Range"]
    )
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Initialize email
    init_email(app)
    
    # Register blueprints
    from app.routes import main, services, appointments, admin, api, init
    app.register_blueprint(main.bp)
    app.register_blueprint(services.bp)
    app.register_blueprint(appointments.bp)
    app.register_blueprint(admin.admin_bp)
    app.register_blueprint(api.bp)
    app.register_blueprint(init.init_bp)
    
    # Create database tables (commented out - use migrations instead)
    # with app.app_context():
    #     db.create_all()
    
    return app
