"""Service model."""
from datetime import datetime
from app import db


class Service(db.Model):
    """Service model for plumbing and sanitary services."""
    
    __tablename__ = 'services'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100), nullable=False)  # plumbing, sanitary, installation, repair, etc.
    price = db.Column(db.Numeric(10, 2), nullable=False)
    duration_minutes = db.Column(db.Integer, nullable=False)  # Estimated duration in minutes
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    appointments = db.relationship('Appointment', backref='service', lazy=True)
    
    def __repr__(self):
        return f'<Service {self.name}>'
    
    def to_dict(self):
        """Convert service to dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'price': float(self.price),
            'duration_minutes': self.duration_minutes,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
