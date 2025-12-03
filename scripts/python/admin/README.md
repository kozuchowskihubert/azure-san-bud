# Admin Scripts

Scripts for managing admin users and administrative functions.

## Scripts

### `init_admin.py`
- **Purpose**: Initialize admin user for the application
- **Usage**: `python scripts/python/admin/init_admin.py`
- **Description**: Creates admin user with credentials for accessing the admin panel

## Environment Variables

Admin scripts may use:
- `ADMIN_USERNAME`: Admin username (default: admin)
- `ADMIN_PASSWORD`: Admin password
- `ADMIN_EMAIL`: Admin email address

## Security Notes

- Admin passwords should be strong and unique
- Credentials should be stored securely
- Consider rotating admin passwords periodically
- Use environment variables for sensitive information