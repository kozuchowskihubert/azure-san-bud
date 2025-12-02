"""Main routes for the application."""
from flask import Blueprint, render_template

bp = Blueprint('main', __name__)


@bp.route('/')
def index():
    """Home page."""
    return render_template('index.html')


@bp.route('/about')
def about():
    """About page."""
    return render_template('about.html')


@bp.route('/contact')
def contact():
    """Contact page."""
    return render_template('contact.html')
