"""Initialize admin user for the application."""
import sys
import os

# Add project root directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../..'))

from app import create_app, db
from app.models.admin import Admin


def init_admin():
    """Create initial admin user."""
    app = create_app('development')
    
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Check if admin already exists
        existing_admin = Admin.query.filter_by(username='admin').first()
        
        if existing_admin:
            print("Admin user already exists!")
            print(f"Username: {existing_admin.username}")
            print(f"Email: {existing_admin.email}")
            
            # Ask if user wants to reset password
            reset = input("\nDo you want to reset the password? (yes/no): ").strip().lower()
            if reset == 'yes':
                new_password = input("Enter new password: ").strip()
                if new_password:
                    existing_admin.set_password(new_password)
                    db.session.commit()
                    print("✓ Password reset successfully!")
                else:
                    print("✗ Password cannot be empty")
            return
        
        # Create new admin
        print("Creating new admin user...")
        print()
        
        username = input("Enter username (default: admin): ").strip() or 'admin'
        email = input("Enter email (default: admin@sanbud.pl): ").strip() or 'admin@sanbud.pl'
        password = input("Enter password (default: admin123): ").strip() or 'admin123'
        first_name = input("Enter first name (default: Admin): ").strip() or 'Admin'
        last_name = input("Enter last name (default: SanBud): ").strip() or 'SanBud'
        
        admin = Admin(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_active=True,
            is_super_admin=True
        )
        admin.set_password(password)
        
        db.session.add(admin)
        db.session.commit()
        
        print()
        print("=" * 50)
        print("✓ Admin user created successfully!")
        print("=" * 50)
        print(f"Username: {admin.username}")
        print(f"Email: {admin.email}")
        print(f"Name: {admin.first_name} {admin.last_name}")
        print(f"Super Admin: {admin.is_super_admin}")
        print("=" * 50)
        print()
        print("You can now login at: http://localhost:3001/admin/login")
        print()


if __name__ == '__main__':
    init_admin()
