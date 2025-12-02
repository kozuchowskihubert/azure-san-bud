"""Flask application factory."""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config.settings import get_config

db = SQLAlchemy()
migrate = Migrate()


def create_app(config_name='production'):
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Load configuration
    config = get_config(config_name)
    app.config.from_object(config)
    
    # Enable CORS for production domain, Azure Static Web App and local development
    CORS(app, resources={
        r"/*": {
            "origins": [
                # Production domain
                "https://sanbud24.pl",
                "https://www.sanbud24.pl",
                "https://api.sanbud24.pl",
                # Local development
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:5002",
                # Azure Static Web Apps
                "https://delightful-ocean-078488b03.3.azurestaticapps.net",
                "https://swa-sanbud-web-dev.azurestaticapps.net"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
            "supports_credentials": True,
            "expose_headers": ["Content-Range", "X-Content-Range"]
        }
    })
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Register blueprints
    from app.routes import main, services, appointments, admin, api
    app.register_blueprint(main.bp)
    app.register_blueprint(services.bp)
    app.register_blueprint(appointments.bp)
    app.register_blueprint(admin.admin_bp)
    app.register_blueprint(api.bp)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app
