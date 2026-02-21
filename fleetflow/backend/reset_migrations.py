"""
Clears conflicting migration records so we can re-apply clean.
"""
import os, sys, django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.db import connection

APPS_TO_RESET = ['accounts', 'auth', 'contenttypes', 'fleet', 'drivers', 'trips', 'operations', 'analytics']

with connection.cursor() as cur:
    for app in APPS_TO_RESET:
        cur.execute("DELETE FROM django_migrations WHERE app = %s", [app])
        print(f"  Cleared migration history for: {app}")

    # Also drop stale Django auth tables that conflict with our native schema
    stale_tables = [
        'accounts_customuser_groups',
        'accounts_customuser_user_permissions',
    ]
    for tbl in stale_tables:
        try:
            cur.execute(f'DROP TABLE IF EXISTS "{tbl}" CASCADE')
            print(f"  Dropped stale table: {tbl}")
        except Exception as e:
            print(f"  Could not drop {tbl}: {e}")

print("\nDone. Now run: python manage.py migrate --fake-initial")
