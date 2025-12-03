"""Appointment model."""
from datetime import datetime
from app import db


class Appointment(db.Model):
    """Appointment model for scheduling services."""
    
    __tablename__ = 'appointments'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    scheduled_date = db.Column(db.Date, nullable=False)
    scheduled_time = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, confirmed, completed, cancelled
    notes = db.Column(db.Text)
    
    # Calendar integration fields
    calendar_event_sent = db.Column(db.Boolean, default=False)  # Whether calendar event was sent
    calendar_platforms = db.Column(db.String(255))  # Comma-separated list of supported platforms
    event_title = db.Column(db.String(255))  # Title for calendar event
    event_location = db.Column(db.String(500))  # Location for calendar event
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Appointment {self.id} - {self.status}>'
    
    def to_dict(self):
        """Convert appointment to dictionary."""
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'service_id': self.service_id,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'scheduled_time': self.scheduled_time.isoformat() if self.scheduled_time else None,
            'status': self.status,
            'notes': self.notes,
            'calendar_event_sent': self.calendar_event_sent,
            'calendar_platforms': self.calendar_platforms.split(',') if self.calendar_platforms else [],
            'event_title': self.event_title,
            'event_location': self.event_location,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
