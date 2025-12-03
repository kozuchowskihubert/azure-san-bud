"""Service routes."""
from flask import Blueprint, render_template, request, jsonify, redirect, url_for
from app import db
from app.models.service import Service

bp = Blueprint('services', __name__, url_prefix='/services')


@bp.route('', strict_slashes=False)
@bp.route('/', strict_slashes=False)
def list_services():
    """List all active services."""
    services = Service.query.filter_by(is_active=True).all()
    return render_template('services/list.html', services=services)


@bp.route('/<int:service_id>')
def view_service(service_id):
    """View a specific service."""
    service = Service.query.get_or_404(service_id)
    return render_template('services/view.html', service=service)


@bp.route('/api', methods=['GET'])
def api_list_services():
    """API endpoint to list all services with error handling."""
    try:
        services = Service.query.filter_by(is_active=True).all()
        return jsonify({
            'success': True,
            'services': [service.to_dict() for service in services],
            'count': len(services)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to fetch services'
        }), 500


@bp.route('/api/<int:service_id>', methods=['GET'])
def api_get_service(service_id):
    """API endpoint to get a specific service."""
    try:
        service = Service.query.get_or_404(service_id)
        return jsonify({
            'success': True,
            'service': service.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': f'Service {service_id} not found'
        }), 404
