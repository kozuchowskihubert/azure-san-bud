# Python Scripts

This directory contains organized Python utility scripts for the SanBud application.

## Directory Structure

```
scripts/python/
├── admin/          # Admin user management scripts
├── database/       # Database initialization and migration scripts
└── testing/        # Testing and validation scripts
```

## Usage

All scripts are designed to be run from the project root directory. The scripts automatically add the project root to the Python path for proper imports.

### Running Scripts

```bash
# From project root
cd /path/to/azure-san-bud

# Database scripts
python scripts/python/database/init_db.py
python scripts/python/database/create_missing_tables.py

# Admin scripts
python scripts/python/admin/init_admin.py

# Testing scripts
python scripts/python/testing/test_calendar_integration.py
python scripts/python/testing/test_frontend_booking.py
```

## Dependencies

All scripts require the project dependencies to be installed:
```bash
pip install -r requirements.txt
```