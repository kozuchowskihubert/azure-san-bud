"""Public API routes for client-facing features."""
from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
from app import db
from app.models.customer import Customer
from app.models.message import Message
from config.email import send_contact_email, send_booking_confirmation

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


@bp.route('/book-appointment', methods=['POST'])
def book_appointment():
    """
    Public endpoint for booking appointments.
    Creates appointment, customer records, and sends confirmation emails.
    """
    try:
        from app.models.appointment import Appointment
        from app.models.customer import Customer
        from app.models.service import Service
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'service', 'date', 'time']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Brakujące wymagane pola: {", ".join(missing_fields)}'
            }), 400
        
        # Parse date and time
        from datetime import datetime
        try:
            appointment_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            appointment_time = datetime.strptime(data['time'], '%H:%M').time()
        except ValueError:
            return jsonify({
                'success': False,
                'error': 'Nieprawidłowy format daty lub godziny'
            }), 400
        
        # Find or create customer
        customer = Customer.query.filter_by(email=data['email']).first()
        
        if customer:
            # Update existing customer
            customer.first_name = data['name'].split()[0] if data['name'] else 'Klient'
            customer.last_name = ' '.join(data['name'].split()[1:]) if len(data['name'].split()) > 1 else ''
            customer.phone = data['phone']
            if data.get('address'):
                customer.address = data['address']
            customer.updated_at = datetime.utcnow()
        else:
            # Create new customer
            customer = Customer(
                first_name=data['name'].split()[0] if data['name'] else 'Klient',
                last_name=' '.join(data['name'].split()[1:]) if len(data['name'].split()) > 1 else '',
                email=data['email'],
                phone=data['phone'],
                address=data.get('address', '')
            )
            db.session.add(customer)
            db.session.flush()  # Get customer ID
        
        # Find service (try by name first, then create if needed)
        service = Service.query.filter_by(name=data['service']).first()
        if not service:
            # Create basic service entry
            service = Service(
                name=data['service'],
                description=f"Usługa: {data['service']}",
                category='repair',  # default category
                duration_minutes=60,  # default 1 hour
                price=0,  # price to be determined
                is_active=True
            )
            db.session.add(service)
            db.session.flush()  # Get service ID
        
        # Create appointment
        appointment = Appointment(
            customer_id=customer.id,
            service_id=service.id,
            scheduled_date=appointment_date,
            scheduled_time=appointment_time,
            notes=data.get('description', ''),
            status='pending'
        )
        db.session.add(appointment)
        db.session.commit()
        
        # Prepare booking data for email
        booking_data = {
            'id': appointment.id,
            'name': data['name'],
            'email': data['email'],
            'phone': data['phone'],
            'service': data['service'],
            'date': appointment_date.strftime('%d.%m.%Y'),
            'time': appointment_time.strftime('%H:%M'),
            'address': data.get('address', 'Do uzgodnienia'),
            'description': data.get('description', '')
        }
        
        # Send booking confirmation emails
        email_sent = send_booking_confirmation(booking_data)
        
        return jsonify({
            'success': True,
            'message': 'Rezerwacja została przyjęta! Skontaktujemy się wkrótce.',
            'appointment_id': appointment.id,
            'booking_data': {
                'service': data['service'],
                'date': data['date'],
                'time': data['time'],
                'duration': service.duration_minutes,
                'customerName': data['name'],
                'customerEmail': data['email'],
                'address': data.get('address'),
                'description': data.get('description')
            },
            'email_sent': email_sent
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Booking error: {str(e)}')
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


@bp.route('/init-db', methods=['POST'])
def init_database():
    """Initialize database tables - TEMPORARY ENDPOINT."""
    from sqlalchemy import inspect
    
    try:
        # Import all models to ensure they're registered
        from app.models.appointment import Appointment
        from app.models.service import Service
        from app.models.customer import Customer
        from app.models.message import Message
        from app.models.admin import Admin
        
        current_app.logger.info("Checking database tables...")
        
        # Get current tables
        inspector = inspect(db.engine)
        existing_tables = inspector.get_table_names()
        current_app.logger.info(f"Existing tables: {existing_tables}")
        
        # Create all tables
        current_app.logger.info("Creating missing tables...")
        db.create_all()
        
        # Check tables after creation
        inspector = inspect(db.engine)
        final_tables = inspector.get_table_names()
        current_app.logger.info(f"Final tables: {final_tables}")
        
        required_tables = ['customers', 'services', 'appointments', 'messages', 'admins']
        missing_tables = [table for table in required_tables if table not in final_tables]
        
        if missing_tables:
            return jsonify({
                'success': False,
                'error': f'Still missing tables: {missing_tables}',
                'existing_tables': final_tables
            }), 500
        else:
            return jsonify({
                'success': True,
                'message': 'All required tables created successfully!',
                'tables': final_tables
            }), 200
            
    except Exception as e:
        current_app.logger.error(f'Database initialization error: {str(e)}')
        return jsonify({
            'success': False,
            'error': f'Database error: {str(e)}'
        }), 500
