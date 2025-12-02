"""Flask database migration configuration."""
from flask import current_app
from app import db
from app.models import Customer, Service, Appointment

# This file is used by Flask-Migrate
# Import all models here so they are registered with SQLAlchemy
