"""Message model for contact form and booking inquiries."""
from app import db
from datetime import datetime


class Message(db.Model):
    """Message model for storing contact and booking messages."""
    
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    subject = db.Column(db.String(200))
    message = db.Column(db.Text, nullable=False)
    message_type = db.Column(db.String(50), default='contact')  # contact, booking, inquiry
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    replied = db.Column(db.Boolean, default=False, nullable=False)
    priority = db.Column(db.String(20), default='normal')  # low, normal, high, urgent
    notes = db.Column(db.Text)  # Admin notes
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    read_at = db.Column(db.DateTime)
    
    def mark_as_read(self):
        """Mark message as read."""
        if not self.is_read:
            self.is_read = True
            self.read_at = datetime.utcnow()
            db.session.commit()
    
    def to_dict(self):
        """Convert message to dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'subject': self.subject,
            'message': self.message,
            'message_type': self.message_type,
            'is_read': self.is_read,
            'replied': self.replied,
            'priority': self.priority,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'read_at': self.read_at.isoformat() if self.read_at else None
        }
    
    def __repr__(self):
        return f'<Message {self.id} from {self.name}>'
