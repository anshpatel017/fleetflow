import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.db import connection

def check_connection():
    print("=" * 60)
    print("FleetFlow — Database Connection Check")
    print("=" * 60)

    try:
        with connection.cursor() as cursor:
            # 1. Basic connectivity
            cursor.execute("SELECT version();")
            version = cursor.fetchone()[0]
            print(f"\n✅ Connected to: {version[:50]}...")

            # 2. List all tables in public schema
            cursor.execute("""
                SELECT table_name, table_type
                FROM information_schema.tables
                WHERE table_schema = 'public'
                ORDER BY table_type, table_name;
            """)
            rows = cursor.fetchall()
            print(f"\n📋 Tables & Views ({len(rows)} total):")
            for name, ttype in rows:
                tag = "📊 VIEW" if ttype == "VIEW" else "📁 TABLE"
                print(f"   {tag}: {name}")

            # 3. Verify core FleetFlow tables
            core_tables = ['users', 'vehicles', 'drivers', 'trips', 'maintenance_logs', 'fuel_logs']
            print("\n🔍 Core Table Row Counts:")
            for table in core_tables:
                try:
                    cursor.execute(f"SELECT COUNT(*) FROM {table};")
                    count = cursor.fetchone()[0]
                    print(f"   ✅ {table}: {count} rows")
                except Exception as e:
                    print(f"   ❌ {table}: ERROR — {e}")

            # 4. Check Django migration table
            cursor.execute("SELECT COUNT(*) FROM django_migrations;")
            mig_count = cursor.fetchone()[0]
            print(f"\n🔧 Django Migrations Applied: {mig_count}")

    except Exception as e:
        print(f"\n❌ Connection FAILED: {e}")

if __name__ == "__main__":
    check_connection()
