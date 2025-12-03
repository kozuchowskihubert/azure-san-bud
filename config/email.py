"""
Email Configuration Module - Updated for reliable delivery
Handles email sending with multiple fallback methods
"""

import os
import logging
import json
from datetime import datetime
from typing import Dict, Any, Optional
from dotenv import load_dotenv
from flask import Flask, current_app
from flask_mail import Mail, Message

# Load environment variables from .env file
load_dotenv()

mail = Mail()

# Setup logging for email notifications
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def log_email_to_file(email_type: str, recipient: str, subject: str, content: str, data: Dict = None):
    """Log email to file for manual processing"""
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'type': email_type,
        'recipient': recipient,
        'subject': subject,
        'content': content,
        'data': data or {},
        'status': 'logged_for_manual_processing'
    }
    
    # Ensure logs directory exists
    os.makedirs('logs', exist_ok=True)
    
    # Write to daily log file
    date_str = datetime.now().strftime('%Y-%m-%d')
    log_file = f'logs/email_notifications_{date_str}.json'
    
    try:
        # Read existing logs
        if os.path.exists(log_file):
            with open(log_file, 'r', encoding='utf-8') as f:
                logs = json.load(f)
        else:
            logs = []
        
        # Add new log entry
        logs.append(log_entry)
        
        # Write back to file
        with open(log_file, 'w', encoding='utf-8') as f:
            json.dump(logs, f, ensure_ascii=False, indent=2)
        
        # Also write to console
        print(f"📧 EMAIL NOTIFICATION LOGGED:")
        print(f"   Type: {email_type}")
        print(f"   To: {recipient}")
        print(f"   Subject: {subject}")
        print(f"   Time: {log_entry['timestamp']}")
        print(f"   File: {log_file}")
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to log email: {str(e)}")
        return False

def init_email(app: Flask):
    """Initialize email configuration with Flask-Mail"""
    app.config['MAIL_SERVER'] = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.environ.get('SMTP_PORT', 587))
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = os.environ.get('SMTP_USER', 'apikey')
    app.config['MAIL_PASSWORD'] = os.environ.get('SMTP_PASS')
    app.config['MAIL_DEFAULT_SENDER'] = (
        os.environ.get('SMTP_FROM_NAME', 'SanBud'),
        os.environ.get('SMTP_FROM_EMAIL', 'noreply@sanbud.pl')
    )
    
    mail.init_app(app)
    logger.info(f"✅ Email initialized: {app.config['MAIL_SERVER']}:{app.config['MAIL_PORT']}")

def send_formsubmit_email(name: str, email: str, phone: str, message: str) -> bool:
    """Send real email using FormSubmit.co service"""
    import requests
    
    url = "https://formsubmit.co/hubertkozuchowski@gmail.com"
    
    form_data = {
        '_subject': f'🔧 SanBud - Nowa wiadomość od {name}',
        '_captcha': 'false',
        '_template': 'box',
        'name': name,
        'email': email,
        'phone': phone,
        'message': f'''
        Nowa wiadomość z formularza kontaktowego SanBud:
        
        👤 Imię i nazwisko: {name}
        📧 Email: {email}
        📱 Telefon: {phone}
        
        💬 Wiadomość:
        {message}
        
        ⏰ Data wysłania: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        
        --
        Wysłane z formularza kontaktowego SanBud
        '''
    }
    
    try:
        response = requests.post(url, data=form_data, timeout=10)
        if response.status_code == 200:
            logger.info(f"✅ Email sent successfully via FormSubmit to {email}")
            return True
        else:
            logger.error(f"❌ FormSubmit failed: {response.status_code}")
            return False
    except Exception as e:
        logger.error(f"❌ FormSubmit error: {str(e)}")
        return False

def send_contact_email(name: str, email: str, phone: str, message: str) -> bool:
    """Send contact form email with real delivery + logging fallback"""
    
    subject = f"Nowa wiadomość z formularza kontaktowego - SanBud"
    contact_email = os.environ.get('CONTACT_EMAIL', 'kontakt@sanbud.pl')
    
    # Try real email delivery first
    email_sent = send_formsubmit_email(name, email, phone, message)
    
    if email_sent:
        print(f"🎉 Real email sent successfully to {contact_email}")
        # Still log for backup
        log_email_to_file("contact_form", contact_email, subject, f"Real email sent via FormSubmit", {
            "name": name, "email": email, "phone": phone, "message": message
        })
        return True
    
    # Fallback to logging if real email fails
    print(f"⚠️ Real email failed, using logging fallback")
    
    # Create email content
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #16a34a 0%, #f97316 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🔧 SanBud</h1>
            <p style="color: white; margin: 5px 0 0 0;">Nowa wiadomość z formularza</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #16a34a; margin-top: 0;">📞 Szczegóły kontaktu:</h2>
            
            <p><strong>👤 Imię:</strong> {name}</p>
            <p><strong>📧 Email:</strong> {email}</p>
            <p><strong>📱 Telefon:</strong> {phone}</p>
            
            <h3 style="color: #f97316; margin-top: 25px;">💬 Wiadomość:</h3>
            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a;">
                {message.replace('\\n', '<br>')}
            </div>
            
            <p style="margin-top: 25px; color: #666; font-size: 14px;">
                <strong>🕐 Data:</strong> {datetime.now().strftime('%d.%m.%Y %H:%M')}<br>
                <strong>🌐 Źródło:</strong> sanbud.pl
            </p>
        </div>
    </div>
    """
    
    # Data for logging
    contact_data = {
        'name': name,
        'email': email,
        'phone': phone,
        'message': message
    }
    
    # Always log to file first (reliable method)
    log_success = log_email_to_file(
        email_type='contact_form',
        recipient=contact_email,
        subject=subject,
        content=html_content,
        data=contact_data
    )
    
    # Try to send email if configured
    smtp_success = False
    if mail and os.environ.get('SMTP_PASS'):
        try:
            msg = Message(
                subject=subject,
                recipients=[contact_email],
                html=html_content,
                sender=current_app.config['MAIL_DEFAULT_SENDER']
            )
            mail.send(msg)
            logger.info(f"✅ Contact email sent successfully to {contact_email}")
            smtp_success = True
        except Exception as e:
            logger.error(f"❌ Failed to send contact email: {str(e)}")
    
    if not smtp_success:
        logger.info("📧 Email SMTP failed or not configured, notification logged to file")
    
    # Return success if either SMTP worked OR logging worked
    return smtp_success or log_success

def send_booking_confirmation(booking_data: Dict[str, Any]) -> bool:
    """Send booking confirmation with logging fallback"""
    
    customer_email = booking_data.get('email')
    booking_email = os.environ.get('BOOKING_EMAIL', 'rezerwacje@sanbud.pl')
    
    # Customer confirmation
    customer_subject = f"Potwierdzenie rezerwacji - SanBud ({booking_data.get('date', 'N/A')})"
    customer_html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #16a34a 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔧 SanBud</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Profesjonalne usługi hydrauliczne</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 40px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #16a34a; margin-top: 0;">✅ Potwierdzenie rezerwacji</h2>
            
            <p style="font-size: 16px;">Dzień dobry <strong>{booking_data.get('name', 'N/A')}</strong>!</p>
            <p>Dziękujemy za wybranie naszych usług. Potwierdzamy Państwa rezerwację:</p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #f97316; margin: 20px 0;">
                <h3 style="color: #f97316; margin-top: 0;">📅 Szczegóły wizyty:</h3>
                <p><strong>🗓️ Data:</strong> {booking_data.get('date', 'N/A')}</p>
                <p><strong>🕐 Godzina:</strong> {booking_data.get('time', 'N/A')}</p>
                <p><strong>🏠 Adres:</strong> {booking_data.get('address', 'N/A')}</p>
                <p><strong>🔧 Usługa:</strong> {booking_data.get('service', 'N/A')}</p>
            </div>
            
            <div style="background: #e6f7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #16a34a; margin: 20px 0;">
                <h4 style="color: #16a34a; margin-top: 0;">💡 Ważne informacje:</h4>
                <ul style="margin: 0; padding-left: 20px; color: #333;">
                    <li>Skontaktujemy się z Państwem 24h przed wizytą</li>
                    <li>W przypadku pytań: <strong>+48 123 456 789</strong></li>
                    <li>Email: <strong>kontakt@sanbud.pl</strong></li>
                </ul>
            </div>
            
            <p style="margin-top: 30px; color: #666; font-size: 14px; text-align: center;">
                Numer rezerwacji: <strong>SB-{datetime.now().strftime('%Y%m%d')}-{booking_data.get('id', '001')}</strong><br>
                Data złożenia: {datetime.now().strftime('%d.%m.%Y %H:%M')}
            </p>
        </div>
    </div>
    """
    
    # Admin notification
    admin_subject = f"Nowa rezerwacja - {booking_data.get('date', 'N/A')} {booking_data.get('time', 'N/A')}"
    admin_html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #f97316 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">⚡ NOWA REZERWACJA</h1>
            <p style="color: white; margin: 5px 0 0 0;">Wymagana szybka reakcja!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #dc2626; margin-top: 0;">📅 Szczegóły rezerwacji:</h2>
            
            <div style="display: grid; gap: 15px;">
                <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a;">
                    <h4 style="margin-top: 0; color: #16a34a;">👤 Dane klienta:</h4>
                    <p><strong>Imię:</strong> {booking_data.get('name', 'N/A')}</p>
                    <p><strong>Email:</strong> {booking_data.get('email', 'N/A')}</p>
                    <p><strong>Telefon:</strong> {booking_data.get('phone', 'N/A')}</p>
                </div>
                
                <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #f97316;">
                    <h4 style="margin-top: 0; color: #f97316;">📅 Termin i lokalizacja:</h4>
                    <p><strong>Data:</strong> {booking_data.get('date', 'N/A')}</p>
                    <p><strong>Godzina:</strong> {booking_data.get('time', 'N/A')}</p>
                    <p><strong>Adres:</strong> {booking_data.get('address', 'N/A')}</p>
                </div>
                
                <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626;">
                    <h4 style="margin-top: 0; color: #dc2626;">🔧 Opis zlecenia:</h4>
                    <p><strong>Usługa:</strong> {booking_data.get('service', 'N/A')}</p>
                    <p><strong>Opis:</strong> {booking_data.get('description', 'Brak opisu')}</p>
                </div>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #f59e0b;">
                <h4 style="margin-top: 0; color: #92400e;">⚡ Akcje do wykonania:</h4>
                <ol style="margin: 0; color: #92400e;">
                    <li>Skontaktuj się z klientem w ciągu 2h</li>
                    <li>Potwierdź dostępność terminu</li>
                    <li>Wyślij SMS przypomnienie 24h przed</li>
                </ol>
            </div>
            
            <p style="margin-top: 25px; color: #666; font-size: 14px; text-align: center;">
                ID rezerwacji: <strong>SB-{datetime.now().strftime('%Y%m%d')}-{booking_data.get('id', '001')}</strong><br>
                Złożono: {datetime.now().strftime('%d.%m.%Y %H:%M')} | Źródło: sanbud.pl
            </p>
        </div>
    </div>
    """
    
    # Log both emails
    customer_logged = log_email_to_file(
        email_type='booking_customer_confirmation',
        recipient=customer_email,
        subject=customer_subject,
        content=customer_html,
        data=booking_data
    )
    
    admin_logged = log_email_to_file(
        email_type='booking_admin_notification',
        recipient=booking_email,
        subject=admin_subject,
        content=admin_html,
        data=booking_data
    )
    
    # Try to send emails if configured
    email_sent = False
    if mail and os.environ.get('SMTP_PASS'):
        try:
            # Send customer confirmation
            customer_msg = Message(
                subject=customer_subject,
                recipients=[customer_email],
                html=customer_html,
                sender=current_app.config['MAIL_DEFAULT_SENDER']
            )
            
            # Send admin notification
            admin_msg = Message(
                subject=admin_subject,
                recipients=[booking_email],
                html=admin_html,
                sender=current_app.config['MAIL_DEFAULT_SENDER']
            )
            
            mail.send(customer_msg)
            mail.send(admin_msg)
            
            logger.info(f"✅ Booking emails sent successfully")
            email_sent = True
            
        except Exception as e:
            logger.error(f"❌ Failed to send booking emails: {str(e)}")
    
    if not email_sent:
        logger.info("📧 Email not configured, booking notifications logged to file")
    
    return customer_logged and admin_logged

def init_email(app: Flask):
    """Initialize email configuration with Flask-Mail"""
    app.config['MAIL_SERVER'] = os.environ.get('SMTP_HOST', 'smtp.sendgrid.net')
    app.config['MAIL_PORT'] = int(os.environ.get('SMTP_PORT', 587))
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = os.environ.get('SMTP_USER', 'apikey')
    app.config['MAIL_PASSWORD'] = os.environ.get('SMTP_PASS')
    app.config['MAIL_DEFAULT_SENDER'] = (
        os.environ.get('SMTP_FROM_NAME', 'SanBud - Usługi Hydrauliczne'),
        os.environ.get('SMTP_FROM_EMAIL', 'noreply@sanbud.pl')
    )
    app.config['MAIL_MAX_EMAILS'] = None
    app.config['MAIL_ASCII_ATTACHMENTS'] = False
    
    mail.init_app(app)
    print(f"✅ Email initialized: {app.config['MAIL_SERVER']}:{app.config['MAIL_PORT']}")
    return mail


def send_contact_email(name, email, phone, message):
    """
    Send contact form email to admin
    
    Args:
        name (str): Customer name
        email (str): Customer email
        phone (str): Customer phone
        message (str): Customer message
        
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    contact_email = os.environ.get('CONTACT_EMAIL', 'kontakt@sanbud.pl')
    
    msg = Message(
        subject=f'🔔 Nowy kontakt od {name}',
        recipients=[contact_email],
        reply_to=email
    )
    
    # Plain text version
    msg.body = f"""
Nowa wiadomość z formularza kontaktowego SanBud.pl

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DANE KONTAKTOWE:
─────────────────
Imię i nazwisko: {name}
Email:           {email}
Telefon:         {phone}

WIADOMOŚĆ:
─────────────────
{message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Wysłano z formularza kontaktowego: https://sanbud.pl
    """
    
    # HTML version
    msg.html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #16a34a 0%, #f97316 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">
                🔔 Nowy Kontakt z Formularza
            </h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px 20px; background-color: #f9fafb;">
            <h2 style="color: #16a34a; font-size: 18px; margin: 0 0 20px 0; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
                Dane kontaktowe
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 15px; font-weight: bold; color: #374151; width: 40%;">
                        👤 Imię i nazwisko:
                    </td>
                    <td style="padding: 15px; color: #1f2937;">
                        {name}
                    </td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 15px; font-weight: bold; color: #374151;">
                        ✉️ Email:
                    </td>
                    <td style="padding: 15px;">
                        <a href="mailto:{email}" style="color: #16a34a; text-decoration: none;">
                            {email}
                        </a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 15px; font-weight: bold; color: #374151;">
                        📞 Telefon:
                    </td>
                    <td style="padding: 15px;">
                        <a href="tel:{phone}" style="color: #f97316; text-decoration: none; font-weight: bold;">
                            {phone}
                        </a>
                    </td>
                </tr>
            </table>
            
            <h2 style="color: #f97316; font-size: 18px; margin: 30px 0 15px 0; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
                💬 Wiadomość
            </h2>
            
            <div style="background: #ffffff; padding: 20px; border-left: 4px solid #16a34a; border-radius: 4px; color: #1f2937; line-height: 1.6;">
                {message.replace(chr(10), '<br>')}
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px;">
                <p style="margin: 0; color: #065f46; font-size: 14px;">
                    <strong>💡 Wskazówka:</strong> Odpowiedz na tę wiadomość, aby bezpośrednio skontaktować się z klientem.
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 20px; background-color: #1f2937; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px; font-weight: bold;">
                SanBud - Profesjonalne Usługi Hydrauliczne
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Wysłano z formularza kontaktowego: <a href="https://sanbud.pl" style="color: #16a34a; text-decoration: none;">sanbud.pl</a>
            </p>
        </div>
    </div>
</body>
</html>
    """
    
    try:
        mail.send(msg)
        print(f"✅ Contact email sent to {contact_email}")
        return True
    except Exception as e:
        print(f"❌ Error sending contact email: {e}")
        return False


def send_booking_confirmation(booking_data):
    """
    Send booking confirmation emails to customer and admin
    
    Args:
        booking_data (dict): Dictionary containing booking information
            - name: Customer name
            - email: Customer email
            - phone: Customer phone
            - date: Booking date (YYYY-MM-DD)
            - time: Booking time (HH:MM)
            - service: Service type
            - description: Service description
            
    Returns:
        bool: True if emails sent successfully, False otherwise
    """
    
    # Format date for display
    from datetime import datetime
    try:
        date_obj = datetime.strptime(booking_data['date'], '%Y-%m-%d')
        formatted_date = date_obj.strftime('%d.%m.%Y (%A)')
        # Translate day names to Polish
        day_translation = {
            'Monday': 'Poniedziałek',
            'Tuesday': 'Wtorek',
            'Wednesday': 'Środa',
            'Thursday': 'Czwartek',
            'Friday': 'Piątek',
            'Saturday': 'Sobota',
            'Sunday': 'Niedziela'
        }
        for eng, pol in day_translation.items():
            formatted_date = formatted_date.replace(eng, pol)
    except:
        formatted_date = booking_data['date']
    
    # ========== Customer Confirmation Email ==========
    customer_msg = Message(
        subject=f'✅ Potwierdzenie rezerwacji - {formatted_date} o {booking_data["time"]}',
        recipients=[booking_data['email']]
    )
    
    customer_msg.html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #16a34a 0%, #f97316 100%); padding: 40px 20px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                Rezerwacja Potwierdzona!
            </h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px 20px;">
            <p style="color: #1f2937; font-size: 16px; margin: 0 0 20px 0;">
                Dzień dobry <strong>{booking_data['name']}</strong>,
            </p>
            
            <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 25px 0;">
                Dziękujemy za dokonanie rezerwacji w SanBud. Z przyjemnością potwierdzamy umówioną wizytę naszego specjalisty.
            </p>
            
            <!-- Booking Details Box -->
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #fef3c7 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #16a34a;">
                <h2 style="color: #065f46; font-size: 18px; margin: 0 0 20px 0; text-align: center;">
                    📋 Szczegóły rezerwacji
                </h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 12px 0; font-size: 15px;">
                            <span style="color: #065f46;">📅</span>
                            <strong style="color: #1f2937; margin-left: 8px;">Data:</strong>
                        </td>
                        <td style="padding: 12px 0; text-align: right; font-size: 16px; color: #16a34a; font-weight: bold;">
                            {formatted_date}
                        </td>
                    </tr>
                    <tr style="border-top: 1px solid #d1fae5;">
                        <td style="padding: 12px 0; font-size: 15px;">
                            <span style="color: #f97316;">🕐</span>
                            <strong style="color: #1f2937; margin-left: 8px;">Godzina:</strong>
                        </td>
                        <td style="padding: 12px 0; text-align: right; font-size: 16px; color: #f97316; font-weight: bold;">
                            {booking_data['time']}
                        </td>
                    </tr>
                    <tr style="border-top: 1px solid #d1fae5;">
                        <td style="padding: 12px 0; font-size: 15px;">
                            <span style="color: #065f46;">🔧</span>
                            <strong style="color: #1f2937; margin-left: 8px;">Usługa:</strong>
                        </td>
                        <td style="padding: 12px 0; text-align: right; font-size: 15px; color: #1f2937;">
                            {booking_data['service']}
                        </td>
                    </tr>
                </table>
            </div>
            
            <!-- Description -->
            {f'''
            <div style="margin: 25px 0;">
                <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 10px 0;">
                    📝 Opis zgłoszenia:
                </h3>
                <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #f97316; border-radius: 4px; color: #4b5563; line-height: 1.6;">
                    {booking_data.get('description', 'Brak szczegółowego opisu')}
                </div>
            </div>
            ''' if booking_data.get('description') else ''}
            
            <!-- Contact Info -->
            <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="color: #166534; font-size: 16px; margin: 0 0 15px 0;">
                    📱 Potwierdzenie wysłano również SMS-em
                </h3>
                <p style="color: #15803d; margin: 0; font-size: 14px;">
                    Na numer: <strong style="font-size: 16px;">{booking_data['phone']}</strong>
                </p>
            </div>
            
            <!-- Important Info -->
            <div style="background: #fef3c7; border: 2px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <div style="display: flex; align-items: flex-start;">
                    <div style="font-size: 24px; margin-right: 15px;">ℹ️</div>
                    <div>
                        <h3 style="color: #92400e; font-size: 16px; margin: 0 0 15px 0;">
                            Ważne informacje
                        </h3>
                        <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.8;">
                            <li>Nasz specjalista przyjedzie w umówionym terminie (±15 minut)</li>
                            <li>W razie potrzeby zmiany terminu, prosimy o kontakt <strong>minimum 24h wcześniej</strong></li>
                            <li>Przygotuj dostęp do miejsca wykonywania prac</li>
                            <li>W razie pytań jesteśmy dostępni pod numerem telefonu</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- Contact Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="tel:+48123456789" style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    📞 Zadzwoń w razie pytań
                </a>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 25px 20px; background-color: #1f2937; text-align: center;">
            <h3 style="color: #ffffff; margin: 0 0 10px 0; font-size: 18px;">
                SanBud - Profesjonalne Usługi Hydrauliczne
            </h3>
            <p style="margin: 5px 0; color: #9ca3af; font-size: 14px;">
                📞 Telefon: <a href="tel:+48123456789" style="color: #16a34a; text-decoration: none;">+48 123 456 789</a>
            </p>
            <p style="margin: 5px 0; color: #9ca3af; font-size: 14px;">
                ✉️ Email: <a href="mailto:kontakt@sanbud.pl" style="color: #16a34a; text-decoration: none;">kontakt@sanbud.pl</a>
            </p>
            <p style="margin: 15px 0 5px 0; color: #6b7280; font-size: 12px;">
                <a href="https://sanbud.pl" style="color: #16a34a; text-decoration: none;">www.sanbud.pl</a>
            </p>
        </div>
    </div>
</body>
</html>
    """
    
    # ========== Admin Notification Email ==========
    booking_email = os.environ.get('BOOKING_EMAIL', 'rezerwacje@sanbud.pl')
    
    admin_msg = Message(
        subject=f'📅 Nowa rezerwacja - {formatted_date} o {booking_data["time"]}',
        recipients=[booking_email]
    )
    
    admin_msg.html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: #16a34a; padding: 25px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">
                📅 Nowa Rezerwacja w Systemie
            </h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px 20px; background-color: #f9fafb;">
            <div style="background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #16a34a; font-size: 18px; margin: 0 0 20px 0; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
                    👤 Dane klienta
                </h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #374151; width: 35%;">
                            Klient:
                        </td>
                        <td style="padding: 12px 0; color: #1f2937; font-size: 16px;">
                            <strong>{booking_data['name']}</strong>
                        </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">
                            Telefon:
                        </td>
                        <td style="padding: 12px 0;">
                            <a href="tel:{booking_data['phone']}" style="color: #f97316; text-decoration: none; font-weight: bold; font-size: 16px;">
                                {booking_data['phone']}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">
                            Email:
                        </td>
                        <td style="padding: 12px 0;">
                            <a href="mailto:{booking_data['email']}" style="color: #16a34a; text-decoration: none;">
                                {booking_data['email']}
                            </a>
                        </td>
                    </tr>
                </table>
                
                <h2 style="color: #f97316; font-size: 18px; margin: 30px 0 20px 0; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
                    📋 Szczegóły wizyty
                </h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #374151; width: 35%;">
                            Data:
                        </td>
                        <td style="padding: 12px 0; color: #1f2937; font-weight: bold; font-size: 16px;">
                            {formatted_date}
                        </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">
                            Godzina:
                        </td>
                        <td style="padding: 12px 0; color: #f97316; font-weight: bold; font-size: 18px;">
                            {booking_data['time']}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; font-weight: bold; color: #374151;">
                            Usługa:
                        </td>
                        <td style="padding: 12px 0; color: #1f2937;">
                            {booking_data['service']}
                        </td>
                    </tr>
                </table>
                
                {f'''
                <h2 style="color: #1f2937; font-size: 16px; margin: 30px 0 15px 0;">
                    📝 Opis zgłoszenia:
                </h2>
                <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #16a34a; border-radius: 4px; color: #4b5563; line-height: 1.6;">
                    {booking_data.get('description', 'Brak szczegółowego opisu')}
                </div>
                ''' if booking_data.get('description') else ''}
                
                <div style="margin-top: 30px; padding: 15px; background-color: #dbeafe; border: 1px solid #93c5fd; border-radius: 8px;">
                    <p style="margin: 0; color: #1e40af; font-size: 14px;">
                        <strong>💡 Akcja wymagana:</strong> Potwierdź dostępność specjalisty i przydziel wizytę.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 25px;">
                    <a href="https://sanbud.pl/admin" style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; font-size: 14px;">
                        🔐 Przejdź do panelu administracyjnego
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 20px; background-color: #1f2937; text-align: center;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                System rezerwacji SanBud | <a href="https://sanbud.pl/admin" style="color: #16a34a; text-decoration: none;">Panel administracyjny</a>
            </p>
        </div>
    </div>
</body>
</html>
    """
    
    try:
        # Send both emails
        mail.send(customer_msg)
        print(f"✅ Booking confirmation sent to customer: {booking_data['email']}")
        
        mail.send(admin_msg)
        print(f"✅ Booking notification sent to admin: {booking_email}")
        
        return True
    except Exception as e:
        print(f"❌ Error sending booking confirmation: {e}")
        return False
