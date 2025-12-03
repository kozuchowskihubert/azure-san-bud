"""Public API routes for client-facing features."""
from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
from app import db
from app.models.customer import Customer
from app.models.message import Message
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

bp = Blueprint('api', __name__, url_prefix='/api')


def send_email(to_email, subject, body_html, body_text=None):
    """
    Send email using Gmail SMTP.
    Uses app config for email credentials.
    """
    try:
        # Get email configuration from environment
        smtp_server = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('MAIL_PORT', '587'))
        sender_email = os.getenv('MAIL_USERNAME')
        sender_password = os.getenv('MAIL_PASSWORD')
        
        if not sender_email or not sender_password:
            current_app.logger.warning('Email credentials not configured')
            return False
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f"SanBud Hydraulika <{sender_email}>"
        msg['To'] = to_email
        
        # Add text and HTML parts
        if body_text:
            part1 = MIMEText(body_text, 'plain')
            msg.attach(part1)
        
        part2 = MIMEText(body_html, 'html')
        msg.attach(part2)
        
        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, to_email, msg.as_string())
        
        return True
        
    except Exception as e:
        current_app.logger.error(f'Email sending failed: {str(e)}')
        return False


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
        
        # Send email notification to company
        company_email = os.getenv('CONTACT_EMAIL', 'sanbud.biuro@gmail.com')
        service_info = f"\n<p><strong>Rodzaj usługi:</strong> {data.get('service', 'Nie określono')}</p>" if data.get('service') else ''
        
        email_html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">Nowa wiadomość z formularza kontaktowego</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Dane kontaktowe</h2>
                
                <p><strong>Imię i nazwisko:</strong> {data['name']}</p>
                <p><strong>Email:</strong> <a href="mailto:{data['email']}">{data['email']}</a></p>
                <p><strong>Telefon:</strong> {data.get('phone', 'Nie podano')}</p>
                {service_info}
                
                <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 30px;">Wiadomość</h2>
                <div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin-top: 15px;">
                    <p style="line-height: 1.6; color: #555;">{data['message'].replace(chr(10), '<br>')}</p>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #888; font-size: 12px;">
                    <p>Data wysłania: {datetime.now().strftime('%d.%m.%Y %H:%M:%S')}</p>
                    <p>IP: {request.remote_addr}</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
                <p>SanBud Hydraulika - System zarządzania</p>
            </div>
        </body>
        </html>
        """
        
        email_text = f"""
        Nowa wiadomość z formularza kontaktowego
        
        Dane kontaktowe:
        - Imię i nazwisko: {data['name']}
        - Email: {data['email']}
        - Telefon: {data.get('phone', 'Nie podano')}
        {f"- Rodzaj usługi: {data.get('service', 'Nie określono')}" if data.get('service') else ''}
        
        Wiadomość:
        {data['message']}
        
        ---
        Data wysłania: {datetime.now().strftime('%d.%m.%Y %H:%M:%S')}
        """
        
        # Send email
        email_sent = send_email(
            to_email=company_email,
            subject=f"Nowa wiadomość kontaktowa od {data['name']}",
            body_html=email_html,
            body_text=email_text
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
