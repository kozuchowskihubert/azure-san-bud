"""
Production Admin Initialization Route
Special endpoint to initialize admin user in production.
"""

from flask import Blueprint, jsonify, request
from app import db
from app.models.admin import Admin
import os

init_bp = Blueprint('init', __name__, url_prefix='/init')

@init_bp.route('/admin', methods=['POST'])
def init_admin():
    """
    Initialize admin user for production.
    Requires secret key for security.
    """
    try:
        data = request.get_json()
        
        # Security check - require secret key
        secret = data.get('secret')
        expected_secret = "SanBud2025InitSecret!Zaj"
        
        if secret != expected_secret:
            return jsonify({'error': 'Invalid secret key'}), 403
        
        # Check if admin already exists
        existing_admin = Admin.query.filter_by(username='admin').first()
        
        if existing_admin:
            return jsonify({
                'success': True,
                'message': 'Admin user already exists',
                'username': existing_admin.username,
                'email': existing_admin.email
            }), 200
        
        # Create new admin
        admin = Admin(
            username='admin',
            email='admin@sanbud.pl',
            first_name='Admin',
            last_name='SanBud',
            is_active=True,
            is_super_admin=True
        )
        
        # Set password from request or use default
        password = data.get('password', 'SanBud2025!InitAdmin!Zaj')
        admin.set_password(password)
        
        db.session.add(admin)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Admin user created successfully!',
            'username': admin.username,
            'email': admin.email,
            'password': password  # Only return in init response
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@init_bp.route('/check', methods=['GET'])
def check_admin():
    """Check if admin users exist."""
    try:
        admins = Admin.query.all()
        
        if not admins:
            return jsonify({
                'admin_exists': False,
                'count': 0,
                'message': 'No admin users found'
            }), 200
        
        admin_list = []
        for admin in admins:
            admin_list.append({
                'username': admin.username,
                'email': admin.email,
                'is_active': admin.is_active,
                'is_super_admin': admin.is_super_admin,
                'created_at': admin.created_at.isoformat() if admin.created_at else None,
                'password_hash_preview': admin.password_hash[:50] + '...'
            })
        
        return jsonify({
            'admin_exists': True,
            'count': len(admins),
            'admins': admin_list
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@init_bp.route('/test-password', methods=['POST'])
def test_password():
    """Test password verification (for debugging only)."""
    try:
        data = request.get_json()
        username = data.get('username', 'admin')
        password = data.get('password')
        
        if not password:
            return jsonify({'error': 'Password required'}), 400
        
        admin = Admin.query.filter_by(username=username).first()
        
        if not admin:
            return jsonify({'error': 'Admin not found'}), 404
        
        # Test password
        result = admin.check_password(password)
        
        return jsonify({
            'username': admin.username,
            'password_check_result': result,
            'hash_method': admin.password_hash.split('$')[0] if '$' in admin.password_hash else 'unknown',
            'hash_preview': admin.password_hash[:80] + '...'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500