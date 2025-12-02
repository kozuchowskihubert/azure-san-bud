"""Application entry point."""
import os
from app import create_app

# Get environment from environment variable, default to production
config_name = os.environ.get('FLASK_ENV', 'production')
app = create_app(config_name)

if __name__ == '__main__':
    # For local development
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
