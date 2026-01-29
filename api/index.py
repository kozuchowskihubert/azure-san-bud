import os
import sys

# Add the parent directory to sys.path to allow importing 'app'
# This is necessary because this file is in 'api/' but 'app' package is in root
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from app import create_app

# Get environment from environment variable, default to production
config_name = os.environ.get('FLASK_ENV', 'production')
app = create_app(config_name)
