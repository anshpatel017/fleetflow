import os, sys, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.db import connection

with connection.cursor() as cur:
    cur.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name='users' 
        ORDER BY ordinal_position
    """)
    print("=== users table columns ===")
    for row in cur.fetchall():
        print(f"  {row[0]:30s} {row[1]}")
