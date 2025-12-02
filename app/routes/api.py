"""Public API routes for client-facing features."""
from flask import Blueprint, request, jsonify
from datetime import datetime
from app import db
from app.models.customer import Customer
from app.models.message import Message

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
    Creates a message record for admin to review.
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'message']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Brakujące wymagane pola: {", ".join(missing_fields)}'
            }), 400
        
        # Create message
        message = Message(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            subject=data.get('subject', 'Wiadomość z formularza kontaktowego'),
            message=data['message'],
            message_type=data.get('message_type', 'contact'),
            priority=data.get('priority', 'normal')
        )
        db.session.add(message)
        
        # Optionally create/update customer record
        if data.get('create_customer', False):
            # Extract first and last name from full name
            name_parts = data['name'].split(' ', 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ''
            
            existing_customer = Customer.query.filter_by(email=data['email']).first()
            
            if not existing_customer:
                customer = Customer(
                    first_name=first_name,
                    last_name=last_name,
                    email=data['email'],
                    phone=data['phone'],
                    address=data.get('address'),
                    city=data.get('city'),
                    postal_code=data.get('postal_code')
                )
                db.session.add(customer)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Dziękujemy za wiadomość! Odpowiemy najszybciej jak to możliwe.'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Błąd serwera: {str(e)}'
        }), 500


@bp.route('/services', methods=['GET'])
def list_services():
    """
    Public endpoint to list available services.
    """
    from app.models.service import Service
    
    try:
        services = Service.query.filter_by(active=True).all()
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
