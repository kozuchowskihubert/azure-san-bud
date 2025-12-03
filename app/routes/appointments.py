"""Appointment routes."""
from flask import Blueprint, render_template, request, jsonify, redirect, url_for, flash
from datetime import datetime
from app import db
from app.models.appointment import Appointment
from app.models.customer import Customer
from app.models.service import Service
from config.email import send_booking_confirmation

bp = Blueprint('appointments', __name__, url_prefix='/appointments')


@bp.route('', strict_slashes=False)
@bp.route('/', strict_slashes=False)
def list_appointments():
    """List all appointments."""
    appointments = Appointment.query.order_by(Appointment.scheduled_date.desc()).all()
    return render_template('appointments/list.html', appointments=appointments)


@bp.route('/book', methods=['GET', 'POST'])
def book_appointment():
    """Book a new appointment."""
    if request.method == 'POST':
        # Get or create customer
        email = request.form.get('email')
        customer = Customer.query.filter_by(email=email).first()
        
        if not customer:
            customer = Customer(
                first_name=request.form.get('first_name'),
                last_name=request.form.get('last_name'),
                email=email,
                phone=request.form.get('phone'),
                address=request.form.get('address'),
                city=request.form.get('city'),
                postal_code=request.form.get('postal_code')
            )
            db.session.add(customer)
            db.session.flush()
        
        # Create appointment
        appointment = Appointment(
            customer_id=customer.id,
            service_id=request.form.get('service_id'),
            scheduled_date=datetime.strptime(request.form.get('scheduled_date'), '%Y-%m-%d').date(),
            scheduled_time=datetime.strptime(request.form.get('scheduled_time'), '%H:%M').time(),
            notes=request.form.get('notes'),
            status='pending'
        )
        
        db.session.add(appointment)
        db.session.commit()
        
        flash('Appointment booked successfully!', 'success')
        return redirect(url_for('appointments.list_appointments'))
    
    # GET request - show form
    services = Service.query.filter_by(is_active=True).all()
    return render_template('appointments/book.html', services=services)


@bp.route('/<int:appointment_id>')
def view_appointment(appointment_id):
    """View appointment details."""
    appointment = Appointment.query.get_or_404(appointment_id)
    return render_template('appointments/view.html', appointment=appointment)


@bp.route('/api', methods=['POST'])
def api_create_appointment():
    """API endpoint to create an appointment."""
    data = request.get_json()
    
    # Get or create customer
    customer = Customer.query.filter_by(email=data.get('email')).first()
    if not customer:
        customer = Customer(
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            email=data.get('email'),
            phone=data.get('phone'),
            address=data.get('address'),
            city=data.get('city'),
            postal_code=data.get('postal_code')
        )
        db.session.add(customer)
        db.session.flush()
    
    # Create appointment
    appointment = Appointment(
        customer_id=customer.id,
        service_id=data.get('service_id'),
        scheduled_date=datetime.strptime(data.get('scheduled_date'), '%Y-%m-%d').date(),
        scheduled_time=datetime.strptime(data.get('scheduled_time'), '%H:%M').time(),
        notes=data.get('notes'),
        status='pending'
    )
    
    db.session.add(appointment)
    db.session.commit()
    
    return jsonify(appointment.to_dict()), 201


@bp.route('/api/book', methods=['POST'])
def api_book_online():
    """API endpoint for online booking calendar."""
    try:
        data = request.get_json()
        
        # Parse name (combined first and last name)
        name_parts = data.get('name', '').split(' ', 1)
        first_name = name_parts[0] if len(name_parts) > 0 else ''
        last_name = name_parts[1] if len(name_parts) > 1 else ''
        
        # Get or create customer
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        
        # Find customer by email or phone
        customer = None
        if email:
            customer = Customer.query.filter_by(email=email).first()
        if not customer and phone:
            customer = Customer.query.filter_by(phone=phone).first()
        
        if not customer:
            customer = Customer(
                first_name=first_name,
                last_name=last_name,
                email=email if email else None,
                phone=phone
            )
            db.session.add(customer)
            db.session.flush()
        
        # Find service by name or create generic service
        service_name = data.get('service', 'Instalacje wodne')
        service = Service.query.filter_by(name=service_name).first()
        
        if not service:
            # Use first available service as fallback
            service = Service.query.first()
            if not service:
                return jsonify({'error': 'No services available'}), 400
        
        # Parse date and time
        scheduled_date = datetime.strptime(data.get('date'), '%Y-%m-%d').date()
        scheduled_time = datetime.strptime(data.get('time'), '%H:%M').time()
        
        # Create appointment
        appointment = Appointment(
            customer_id=customer.id,
            service_id=service.id,
            scheduled_date=scheduled_date,
            scheduled_time=scheduled_time,
            notes=data.get('description', ''),
            status='pending'
        )
        
        db.session.add(appointment)
        db.session.commit()
        
        # Send confirmation email
        booking_data = {
            'name': f"{first_name} {last_name}".strip() or 'Klient',
            'email': email,
            'phone': phone,
            'date': data.get('date'),
            'time': data.get('time'),
            'service': service_name,
            'description': data.get('description', '')
        }
        
        email_sent = send_booking_confirmation(booking_data)
        
        return jsonify({
            'success': True,
            'appointment': appointment.to_dict(),
            'message': 'Rezerwacja została pomyślnie utworzona',
            'email_sent': email_sent
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Wystąpił błąd podczas tworzenia rezerwacji'
        }), 500


@bp.route('/api/availability/<date_str>')
def api_check_availability(date_str):
    """Check available time slots for a specific date."""
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        
        # Get all appointments for this date
        appointments = Appointment.query.filter_by(
            scheduled_date=date
        ).filter(
            Appointment.status.in_(['pending', 'confirmed'])
        ).all()
        
        # Convert to list of booked times
        booked_times = [apt.scheduled_time.strftime('%H:%M') for apt in appointments]
        
        return jsonify({
            'date': date_str,
            'booked_times': booked_times
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500
