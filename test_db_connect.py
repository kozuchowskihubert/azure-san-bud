import os
os.environ['DATABASE_URL'] = 'postgresql://sanbud_admin:SanBud2024SecureDB!@psql-sanbud-prod.postgres.database.azure.com/sanbud_db?sslmode=require'
os.environ['FLASK_ENV'] = 'production'

print("Testing database connection...")
try:
    from app import create_app, db
    app = create_app('production')
    with app.app_context():
        from sqlalchemy import text
        result = db.session.execute(text('SELECT 1'))
        print("✅ Database connection successful!")
        print(f"Result: {result.fetchone()}")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    import traceback
    traceback.print_exc()
