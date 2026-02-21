import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def check_connection():
    with connection.cursor() as cursor:
        cursor.execute("SELECT current_database()")
        db = cursor.fetchone()
        print(f"Django is connected to: {db[0]}")
        
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = [t[0] for t in cursor.fetchall()]
        print(f"Django sees tables: {tables}")
        
        if 'vehicles' in tables:
            cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'vehicles'")
            columns = [c[0] for c in cursor.fetchall()]
            print(f"Django sees columns in 'vehicles': {columns}")

if __name__ == "__main__":
    check_connection()
