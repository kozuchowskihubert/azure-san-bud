# Database Scripts

Scripts for database initialization, table creation, and database management.

## Scripts

### `init_db.py`
- **Purpose**: Initialize database with sample data for development
- **Usage**: `python scripts/python/database/init_db.py`
- **Description**: Creates tables and populates them with sample services, customers, and appointments

### `init_production_db.py`
- **Purpose**: Initialize production database tables
- **Usage**: `python scripts/python/database/init_production_db.py`
- **Description**: Creates missing tables in Azure production environment

### `create_missing_tables.py`
- **Purpose**: Create any missing database tables
- **Usage**: `python scripts/python/database/create_missing_tables.py`
- **Description**: Checks for missing tables and creates them with verification

### `init_db_endpoint.py`
- **Purpose**: Database initialization via HTTP endpoint
- **Usage**: Called internally by Flask API
- **Description**: Creates tables through web app HTTP interface

## Environment Variables

Some scripts require environment variables:
- `FLASK_ENV`: Environment (development/production)
- Database connection variables for production scripts

## Notes

- All scripts automatically handle database transactions
- Production scripts include safety checks
- Sample data is only created in development environment