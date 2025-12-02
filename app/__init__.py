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
    
    # Enable CORS for Azure Static Web App and local development
    CORS(app, resources={
        r"/*": {
            "origins": [
                "http://localhost:3000",
                "http://localhost:5002",
                "https://delightful-ocean-078488b03.3.azurestaticapps.net",
                "https://swa-sanbud-web-dev.azurestaticapps.net"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Register blueprints
    from app.routes import main, services, appointments
    app.register_blueprint(main.bp)
    app.register_blueprint(services.bp)
    app.register_blueprint(appointments.bp)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app
