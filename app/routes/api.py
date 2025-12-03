"""Public API routes for client-facing features."""
from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
from app import db
from app.models.customer import Customer
from app.models.message import Message
from config.email import send_contact_email

bp = Blueprint('api', __name__, url_prefix='/api')


@bp.route('/clients/register', methods=['POST'])
def register_client():
    """
    Public endpoint for client registration.
    Creates a new customer record and optionally a message.
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'email', 'phone']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        # Check if customer already exists
        existing_customer = Customer.query.filter_by(email=data['email']).first()
        
        if existing_customer:
            # Update existing customer if provided
            if data.get('address'):
                existing_customer.address = data['address']
            if data.get('city'):
                existing_customer.city = data['city']
            if data.get('postal_code'):
                existing_customer.postal_code = data['postal_code']
            existing_customer.updated_at = datetime.utcnow()
            
            customer = existing_customer
            is_new = False
        else:
            # Create new customer
            customer = Customer(
                first_name=data['first_name'],
                last_name=data['last_name'],
                email=data['email'],
                phone=data['phone'],
                address=data.get('address'),
                city=data.get('city'),
                postal_code=data.get('postal_code')
            )
            db.session.add(customer)
            is_new = True
        
        # Create a message if there's a message or subject
        if data.get('message') or data.get('subject'):
            message = Message(
                name=f"{data['first_name']} {data['last_name']}",
                email=data['email'],
                phone=data['phone'],
                subject=data.get('subject', 'Zapytanie z formularza kontaktowego'),
                message=data.get('message', 'Nowy klient zarejestrowany przez formularz'),
                message_type=data.get('message_type', 'inquiry'),
                priority='normal'
            )
            db.session.add(message)
        
        # Commit all changes
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Dziękujemy za rejestrację! Skontaktujemy się wkrótce.' if is_new else 'Dane zaktualizowane pomyślnie!',
            'customer_id': customer.id,
            'is_new': is_new
        }), 201 if is_new else 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Błąd serwera: {str(e)}'
        }), 500


@bp.route('/contact', methods=['POST'])
def contact_form():
    """
    Public endpoint for contact form submissions.
    Creates a message record and sends email notification.
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Brakujące wymagane pola: {", ".join(missing_fields)}'
            }), 400
        
        # Create message record
        message = Message(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone', ''),
            subject=data.get('subject', f"Wiadomość od {data['name']}"),
            message=data['message'],
            message_type=data.get('message_type', 'contact'),
            priority=data.get('priority', 'normal')
        )
        db.session.add(message)
        db.session.commit()
        
        # Send email notification using new email system
        email_sent = send_contact_email(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone', 'Nie podano'),
            message=data['message']
        )
        
        return jsonify({
            'success': True,
            'message': 'Dziękujemy za wiadomość! Odpowiemy najszybciej jak to możliwe.',
            'email_sent': email_sent
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Contact form error: {str(e)}')
        return jsonify({
            'success': False,
            'error': 'Przepraszamy, wystąpił błąd. Spróbuj ponownie lub zadzwoń: +48 503 691 808'
        }), 500


@bp.route('/services', methods=['GET'])
def list_services():
    """
    Public endpoint to list available services.
    """
    from app.models.service import Service
    
    try:
        services = Service.query.filter_by(is_active=True).all()
        return jsonify({
            'success': True,
            'services': [service.to_dict() for service in services]
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Błąd serwera: {str(e)}'
        }), 500


@bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    }), 200
