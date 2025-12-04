"""Admin routes for authentication and management."""
from flask import Blueprint, request, jsonify, session, render_template, current_app
from app import db
from app.models.admin import Admin
from app.models.customer import Customer
from app.models.service import Service
from app.models.appointment import Appointment
from functools import wraps
from datetime import datetime, timedelta
import jwt

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')


def token_required(f):
    """Decorator to require valid JWT token."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # Check for token in Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]  # Format: "Bearer <token>"
            except IndexError:
                return jsonify({'error': 'Invalid authorization header format'}), 401
        
        if not token:
            return jsonify({'error': 'Unauthorized', 'message': 'Token is missing'}), 401
        
        try:
            # Decode and verify token
            data = jwt.decode(
                token,
                current_app.config['JWT_SECRET_KEY'],
                algorithms=['HS256']
            )
            current_admin_id = data['admin_id']
            
            # Verify admin still exists and is active
            admin = Admin.query.get(current_admin_id)
            if not admin or not admin.is_active:
                return jsonify({'error': 'Unauthorized', 'message': 'Admin account not found or inactive'}), 401
            
            # Store admin info for use in route
            request.current_admin = admin
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Unauthorized', 'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Unauthorized', 'message': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    return decorated_function


def login_required(f):
    """Decorator to require admin login (legacy session-based, kept for backward compatibility)."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return jsonify({'error': 'Unauthorized', 'message': 'Admin login required'}), 401
        return f(*args, **kwargs)
    return decorated_function


# ==================== FRONTEND ROUTES ====================

@admin_bp.route('', strict_slashes=False)
@admin_bp.route('/', strict_slashes=False)
def admin_dashboard():
    """Admin dashboard page."""
    return render_template('admin/dashboard.html')


@admin_bp.route('/login', strict_slashes=False)
def admin_login_page():
    """Admin login page."""
    return render_template('admin/login.html')


@admin_bp.route('/clients', strict_slashes=False)
def admin_clients():
    """Admin clients management page."""
    return render_template('admin/clients.html')


@admin_bp.route('/services', strict_slashes=False)
def admin_services():
    """Admin services management page."""
    return render_template('admin/services.html')


@admin_bp.route('/appointments', strict_slashes=False)
def admin_appointments():
    """Admin appointments management page."""
    return render_template('admin/appointments.html')


# ==================== API ROUTES ====================

@admin_bp.route('/api/login', methods=['POST'])
def login():
    """Admin login endpoint with JWT token generation."""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        
        admin = Admin.query.filter_by(username=username).first()
        
        # Debug logging
        if admin:
            print(f"DEBUG: Admin found - ID: {admin.id}, Username: {admin.username}, Active: {admin.is_active}")
            password_check_result = admin.check_password(password)
            print(f"DEBUG: Password check result: {password_check_result}")
        else:
            print(f"DEBUG: No admin found with username: {username}")
        
        if not admin or not admin.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if not admin.is_active:
            return jsonify({'error': 'Account is disabled'}), 403
        
        # Generate JWT token
        token_payload = {
            'admin_id': admin.id,
            'username': admin.username,
            'is_super_admin': admin.is_super_admin,
            'exp': datetime.utcnow() + timedelta(seconds=current_app.config['JWT_ACCESS_TOKEN_EXPIRES']),
            'iat': datetime.utcnow()
        }
        
        token = jwt.encode(
            token_payload,
            current_app.config['JWT_SECRET_KEY'],
            algorithm='HS256'
        )
        
        # Also set session for backward compatibility
        session['admin_id'] = admin.id
        session['admin_username'] = admin.username
        session['is_super_admin'] = admin.is_super_admin
        
        # Update last login
        admin.update_last_login()
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': token,  # JWT token for cross-domain authentication
            'admin': admin.to_dict()
        }), 200
        
    except Exception as e:
        print(f"DEBUG: Login exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/api/logout', methods=['POST'])
@token_required
def logout():
    """Admin logout endpoint."""
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully'}), 200


@admin_bp.route('/api/debug/check', methods=['GET'])
def debug_check_admin():
    """Debug endpoint to check admin status (remove in production)."""
    try:
        admin = Admin.query.filter_by(username='admin').first()
        if not admin:
            return jsonify({'error': 'No admin found'}), 404
        
        return jsonify({
            'found': True,
            'id': admin.id,
            'username': admin.username,
            'email': admin.email,
            'is_active': admin.is_active,
            'is_super_admin': admin.is_super_admin,
            'password_hash_prefix': admin.password_hash[:50] if admin.password_hash else None,
            'hash_length': len(admin.password_hash) if admin.password_hash else 0
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/api/me', methods=['GET'])
@token_required
def get_current_admin():
    """Get current logged-in admin info (JWT-protected)."""
    # Admin is already loaded in request.current_admin by token_required decorator
    return jsonify({'admin': request.current_admin.to_dict()}), 200


# ==================== CLIENTS MANAGEMENT ====================

@admin_bp.route('/api/clients', methods=['GET'])
@token_required
def get_clients():
    """Get list of all clients with optional filtering and pagination."""
    try:
        # Query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '', type=str)
        
        # Build query
        query = Customer.query
        
        # Search filter
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                db.or_(
                    Customer.first_name.ilike(search_filter),
                    Customer.last_name.ilike(search_filter),
                    Customer.email.ilike(search_filter),
                    Customer.phone.ilike(search_filter)
                )
            )
        
        # Order by most recent
        query = query.order_by(Customer.created_at.desc())
        
        # Paginate
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        clients = []
        for customer in pagination.items:
            client_data = customer.to_dict()
            # Add appointment count
            client_data['appointment_count'] = Appointment.query.filter_by(
                customer_id=customer.id
            ).count()
            clients.append(client_data)
        
        return jsonify({
            'clients': clients,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/api/clients/<int:client_id>', methods=['GET'])
@token_required
def get_client(client_id):
    """Get detailed information about a specific client."""
    try:
        customer = Customer.query.get(client_id)
        if not customer:
            return jsonify({'error': 'Client not found'}), 404
        
        client_data = customer.to_dict()
        
        # Get appointments
        appointments = Appointment.query.filter_by(customer_id=client_id).order_by(
            Appointment.appointment_date.desc()
        ).all()
        
        client_data['appointments'] = [
            {
                **appt.to_dict(),
                'service_name': appt.service.name if appt.service else None
            }
            for appt in appointments
        ]
        
        return jsonify({'client': client_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/api/clients/<int:client_id>', methods=['PUT'])
@token_required
def update_client(client_id):
    """Update client information."""
    try:
        customer = Customer.query.get(client_id)
        if not customer:
            return jsonify({'error': 'Client not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'first_name' in data:
            customer.first_name = data['first_name']
        if 'last_name' in data:
            customer.last_name = data['last_name']
        if 'email' in data:
            customer.email = data['email']
        if 'phone' in data:
            customer.phone = data['phone']
        if 'address' in data:
            customer.address = data['address']
        if 'notes' in data:
            customer.notes = data['notes']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Client updated successfully',
            'client': customer.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/api/clients/<int:client_id>', methods=['DELETE'])
@token_required
def delete_client(client_id):
    """Delete a client (soft delete recommended in production)."""
    try:
        customer = Customer.query.get(client_id)
        if not customer:
            return jsonify({'error': 'Client not found'}), 404
        
        # Check if client has appointments
        appointments_count = Appointment.query.filter_by(customer_id=client_id).count()
        
        if appointments_count > 0:
            return jsonify({
                'error': 'Cannot delete client with existing appointments',
                'appointments_count': appointments_count
            }), 400
        
        db.session.delete(customer)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Client deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================== SERVICES MANAGEMENT ====================

@admin_bp.route('/api/services', methods=['GET'])
@token_required
def get_services():
    """Get list of all services."""
    try:
        services = Service.query.order_by(Service.name).all()
        
        services_data = []
        for service in services:
            service_data = service.to_dict()
            # Add appointment count
            service_data['appointment_count'] = Appointment.query.filter_by(
                service_id=service.id
            ).count()
            services_data.append(service_data)
        
        return jsonify({'services': services_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/api/services/<int:service_id>', methods=['GET'])
@token_required
def get_service(service_id):
    """Get detailed information about a specific service."""
    try:
        service = Service.query.get(service_id)
        if not service:
            return jsonify({'error': 'Service not found'}), 404
        
        service_data = service.to_dict()
        
        # Get recent appointments for this service
        appointments = Appointment.query.filter_by(service_id=service_id).order_by(
            Appointment.appointment_date.desc()
        ).limit(10).all()
        
        service_data['recent_appointments'] = [
            {
                **appt.to_dict(),
                'customer_name': f"{appt.customer.first_name} {appt.customer.last_name}"
            }
            for appt in appointments
        ]
        
        return jsonify({'service': service_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/api/services', methods=['POST'])
@token_required
def create_service():
    """Create a new service."""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({'error': 'Service name is required'}), 400
        
        # Check if service already exists
        existing = Service.query.filter_by(name=data['name']).first()
        if existing:
            return jsonify({'error': 'Service with this name already exists'}), 400
        
        service = Service(
            name=data['name'],
            description=data.get('description', ''),
            category=data.get('category', 'general'),
            duration_minutes=data.get('duration', 60),
            price=data.get('price', 0.0),
            is_active=data.get('is_active', True)
        )
        
        db.session.add(service)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Service created successfully',
            'service': service.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/api/services/<int:service_id>', methods=['PUT'])
@token_required
def update_service(service_id):
    """Update service information."""
    try:
        service = Service.query.get(service_id)
        if not service:
            return jsonify({'error': 'Service not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            # Check if new name conflicts with existing service
            existing = Service.query.filter(
                Service.name == data['name'],
                Service.id != service_id
            ).first()
            if existing:
                return jsonify({'error': 'Service with this name already exists'}), 400
            service.name = data['name']
        
        if 'description' in data:
            service.description = data['description']
        if 'duration' in data:
            service.duration_minutes = data['duration']
        if 'price' in data:
            service.price = data['price']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Service updated successfully',
            'service': service.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/api/services/<int:service_id>', methods=['DELETE'])
@token_required
def delete_service(service_id):
    """Delete a service."""
    try:
        service = Service.query.get(service_id)
        if not service:
            return jsonify({'error': 'Service not found'}), 404
        
        # Check if service has appointments
        appointments_count = Appointment.query.filter_by(service_id=service_id).count()
        
        if appointments_count > 0:
            return jsonify({
                'error': 'Cannot delete service with existing appointments',
                'appointments_count': appointments_count
            }), 400
        
        db.session.delete(service)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Service deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================== DASHBOARD STATS ====================

@admin_bp.route('/api/stats', methods=['GET'])
@token_required
def get_stats():
    """Get dashboard statistics."""
    try:
        total_clients = Customer.query.count()
        total_services = Service.query.count()
        total_appointments = Appointment.query.count()
        pending_appointments = Appointment.query.filter_by(status='pending').count()
        confirmed_appointments = Appointment.query.filter_by(status='confirmed').count()
        
        # Recent clients (last 7 days)
        seven_days_ago = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        from datetime import timedelta
        seven_days_ago = seven_days_ago - timedelta(days=7)
        recent_clients = Customer.query.filter(Customer.created_at >= seven_days_ago).count()
        
        return jsonify({
            'stats': {
                'total_clients': total_clients,
                'total_services': total_services,
                'total_appointments': total_appointments,
                'pending_appointments': pending_appointments,
                'confirmed_appointments': confirmed_appointments,
                'recent_clients': recent_clients
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/api/init-admin-secure', methods=['POST'])
def init_admin_secure():
    """
    Secure endpoint to initialize admin user on production.
    Requires secret key for security.
    Set environment variables: ADMIN_INIT_SECRET, ADMIN_INIT_PASSWORD
    """
    try:
        import os
        data = request.get_json()
        secret = data.get('secret')
        
        # Security check - must provide correct secret from environment
        INIT_SECRET = os.environ.get('ADMIN_INIT_SECRET')
        if not INIT_SECRET or secret != INIT_SECRET:
            return jsonify({'error': 'Unauthorized - invalid secret or not configured'}), 401
        
        # Admin credentials from environment variables
        username = os.environ.get('ADMIN_USERNAME', 'admin')
        password = os.environ.get('ADMIN_INIT_PASSWORD')
        email = os.environ.get('ADMIN_EMAIL', 'admin@sanbud.pl')
        
        if not password:
            return jsonify({'error': 'Server configuration error - ADMIN_INIT_PASSWORD not set'}), 500
        
        # Check if admin exists
        existing_admin = Admin.query.filter_by(username=username).first()
        
        if existing_admin:
            # Reset password and ensure active
            existing_admin.set_password(password)
            existing_admin.is_active = True
            existing_admin.is_super_admin = True
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Admin password reset successfully',
                'admin': {
                    'username': username,
                    'email': email,
                    'created_at': existing_admin.created_at.isoformat() if existing_admin.created_at else None
                }
            }), 200
        else:
            # Create new admin
            admin = Admin(
                username=username,
                email=email,
                first_name='Admin',
                last_name='SanBud',
                is_active=True,
                is_super_admin=True
            )
            admin.set_password(password)
            
            db.session.add(admin)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Admin user created successfully',
                'admin': {
                    'username': username,
                    'email': email,
                    'created_at': admin.created_at.isoformat() if admin.created_at else None
                }
            }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============================================================================
# Appointments Management API
# ============================================================================

@admin_bp.route('/api/appointments', methods=['GET'])
@token_required
def get_appointments():
    """Get all appointments with filters."""
    try:
        from app.models.appointment import Appointment
        from app.models.customer import Customer
        from app.models.service import Service
        
        # Query parameters
        status = request.args.get('status')
        customer_id = request.args.get('customer_id', type=int)
        service_id = request.args.get('service_id', type=int)
        date_from = request.args.get('date_from')
        date_to = request.args.get('date_to')
        
        # Base query
        query = Appointment.query
        
        # Apply filters
        if status:
            query = query.filter_by(status=status)
        if customer_id:
            query = query.filter_by(customer_id=customer_id)
        if service_id:
            query = query.filter_by(service_id=service_id)
        if date_from:
            from datetime import datetime
            date_from_obj = datetime.fromisoformat(date_from).date()
            query = query.filter(Appointment.scheduled_date >= date_from_obj)
        if date_to:
            from datetime import datetime
            date_to_obj = datetime.fromisoformat(date_to).date()
            query = query.filter(Appointment.scheduled_date <= date_to_obj)
        
        # Order by date and time
        appointments = query.order_by(
            Appointment.scheduled_date.desc(),
            Appointment.scheduled_time.desc()
        ).all()
        
        # Enrich with customer and service data
        appointments_data = []
        for appt in appointments:
            appt_dict = appt.to_dict()
            
            # Add customer info
            customer = Customer.query.get(appt.customer_id)
            if customer:
                appt_dict['customer'] = {
                    'id': customer.id,
                    'first_name': customer.first_name,
                    'last_name': customer.last_name,
                    'email': customer.email,
                    'phone': customer.phone
                }
            
            # Add service info
            service = Service.query.get(appt.service_id)
            if service:
                appt_dict['service'] = {
                    'id': service.id,
                    'name': service.name,
                    'duration': service.duration_minutes,
                    'price': float(service.price) if service.price else 0
                }
            
            appointments_data.append(appt_dict)
        
        return jsonify({
            'success': True,
            'appointments': appointments_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/api/appointments/<int:appointment_id>', methods=['GET'])
@token_required
def get_appointment(appointment_id):
    """Get single appointment details."""
    try:
        from app.models.appointment import Appointment
        from app.models.customer import Customer
        from app.models.service import Service
        
        appointment = Appointment.query.get_or_404(appointment_id)
        appt_dict = appointment.to_dict()
        
        # Add customer info
        customer = Customer.query.get(appointment.customer_id)
        if customer:
            appt_dict['customer'] = customer.to_dict()
        
        # Add service info
        service = Service.query.get(appointment.service_id)
        if service:
            appt_dict['service'] = service.to_dict()
        
        return jsonify({
            'success': True,
            'appointment': appt_dict
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/api/appointments/<int:appointment_id>', methods=['PUT'])
@token_required
def update_appointment(appointment_id):
    """Update appointment status or details."""
    try:
        from app.models.appointment import Appointment
        
        appointment = Appointment.query.get_or_404(appointment_id)
        data = request.get_json()
        
        # Update allowed fields
        if 'status' in data:
            appointment.status = data['status']
        if 'scheduled_date' in data:
            from datetime import datetime
            appointment.scheduled_date = datetime.fromisoformat(data['scheduled_date']).date()
        if 'scheduled_time' in data:
            from datetime import datetime
            appointment.scheduled_time = datetime.fromisoformat(data['scheduled_time']).time()
        if 'notes' in data:
            appointment.notes = data['notes']
        
        appointment.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Appointment updated successfully',
            'appointment': appointment.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/api/appointments/<int:appointment_id>', methods=['DELETE'])
@token_required
def delete_appointment(appointment_id):
    """Delete an appointment."""
    try:
        from app.models.appointment import Appointment
        
        appointment = Appointment.query.get_or_404(appointment_id)
        db.session.delete(appointment)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Appointment deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ============================================================================
# Messages Management API
# ============================================================================

@admin_bp.route('/api/messages', methods=['GET'])
@token_required
def get_messages():
    """Get all contact messages with filters."""
    try:
        from app.models.message import Message
        
        # Query parameters
        is_read = request.args.get('is_read')
        replied = request.args.get('replied')
        message_type = request.args.get('message_type')
        priority = request.args.get('priority')
        
        # Base query
        query = Message.query
        
        # Apply filters
        if is_read is not None:
            is_read_bool = is_read.lower() in ['true', '1', 'yes']
            query = query.filter_by(is_read=is_read_bool)
        if replied is not None:
            replied_bool = replied.lower() in ['true', '1', 'yes']
            query = query.filter_by(replied=replied_bool)
        if message_type:
            query = query.filter_by(message_type=message_type)
        if priority:
            query = query.filter_by(priority=priority)
        
        # Order by priority and date
        messages = query.order_by(
            Message.created_at.desc()
        ).all()
        
        return jsonify({
            'success': True,
            'messages': [msg.to_dict() for msg in messages]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/api/messages/<int:message_id>', methods=['GET'])
@token_required
def get_message(message_id):
    """Get single message details."""
    try:
        from app.models.message import Message
        
        message = Message.query.get_or_404(message_id)
        
        # Mark as read
        message.mark_as_read()
        
        return jsonify({
            'success': True,
            'message': message.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/api/messages/<int:message_id>', methods=['PUT'])
@token_required
def update_message(message_id):
    """Update message status or notes."""
    try:
        from app.models.message import Message
        
        message = Message.query.get_or_404(message_id)
        data = request.get_json()
        
        # Update allowed fields
        if 'is_read' in data:
            message.is_read = data['is_read']
            if message.is_read and not message.read_at:
                message.read_at = datetime.utcnow()
        if 'replied' in data:
            message.replied = data['replied']
        if 'priority' in data:
            message.priority = data['priority']
        if 'notes' in data:
            message.notes = data['notes']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Message updated successfully',
            'data': message.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/api/messages/<int:message_id>', methods=['DELETE'])
@token_required
def delete_message(message_id):
    """Delete a message."""
    try:
        from app.models.message import Message
        
        message = Message.query.get_or_404(message_id)
        db.session.delete(message)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Message deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
