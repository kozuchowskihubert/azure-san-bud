"""Appointment routes."""
from flask import Blueprint, render_template, request, jsonify, redirect, url_for, flash
from datetime import datetime
from app import db
from app.models.appointment import Appointment
from app.models.customer import Customer
from app.models.service import Service

bp = Blueprint('appointments', __name__, url_prefix='/appointments')


@bp.route('/')
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
