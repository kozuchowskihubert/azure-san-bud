"""Flask application factory."""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config.settings import get_config

db = SQLAlchemy()
migrate = Migrate()


def create_app(config_name='production'):
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Load configuration
    config = get_config(config_name)
    app.config.from_object(config)
    
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
