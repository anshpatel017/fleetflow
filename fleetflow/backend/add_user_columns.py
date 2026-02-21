import os, sys, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.db import connection

print("Adding missing columns to users table...")
with connection.cursor() as cur:
    # Add phone column if not exists
    cur.execute("""
        ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20) DEFAULT NULL;
    """)
    print("  ✅ phone column added (or already exists)")

    # Add profile_image column if not exists
    cur.execute("""
        ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(255) DEFAULT NULL;
    """)
    print("  ✅ profile_image column added (or already exists)")

print("\nVerifying columns now:")
cur_check = connection.cursor()
cur_check.execute("SELECT column_name FROM information_schema.columns WHERE table_name='users' ORDER BY ordinal_position")
cols = [r[0] for r in cur_check.fetchall()]
print("  users columns:", cols)
