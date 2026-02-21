"""
Registers all existing migration files into django_migrations table
WITHOUT actually running them (since tables already exist in the DB).
This is equivalent to running manage.py migrate --fake for all apps.
"""
import os, sys, django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.db import connection
import importlib
from pathlib import Path

BASE = Path(__file__).parent

def get_migrations_for_app(app_name):
    mig_dir = BASE / app_name / 'migrations'
    if not mig_dir.exists():
        return []
    files = sorted(mig_dir.glob('0*.py'))
    return [f.stem for f in files]

# Map of app_label -> subfolder name
APPS = {
    'contenttypes': None,  # built-in, skip
    'auth': None,           # built-in, skip
    'accounts': 'accounts',
    'admin': None,
    'sessions': None,
    'fleet': 'fleet',
    'drivers': 'drivers',
    'trips': 'trips',
    'operations': 'operations',
    'token_blacklist': None,
}

print("=== Registering migration history ===\n")

with connection.cursor() as cur:
    # First, clear any bad existing records
    cur.execute("DELETE FROM django_migrations WHERE app IN %s", [
        tuple(APPS.keys())
    ])

    # Register builtin app migrations using Django's migration loader
    from django.db.migrations.loader import MigrationLoader
    loader = MigrationLoader(connection, ignore_no_migrations=True)
    loader.load_disk()

    for (app_label, migration_name), migration in loader.disk_migrations.items():
        if app_label in APPS:
            cur.execute(
                "INSERT INTO django_migrations (app, name, applied) VALUES (%s, %s, NOW()) "
                "ON CONFLICT DO NOTHING",
                [app_label, migration_name]
            )
            print(f"  ✅ Registered: {app_label}.{migration_name}")

print("\n✅ All migrations registered. DB tables remain untouched.")
print("Run: python manage.py migrate --fake to confirm state.")
