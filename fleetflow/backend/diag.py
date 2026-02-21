import os, sys, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.db import connection

with connection.cursor() as cur:
    # Show all columns
    cur.execute("""
        SELECT column_name FROM information_schema.columns 
        WHERE table_name='users' ORDER BY ordinal_position
    """)
    cols = [r[0] for r in cur.fetchall()]
    print("users columns:", cols)

    # Check pending migrations
    cur.execute("SELECT app, name FROM django_migrations WHERE app='accounts' ORDER BY id")
    for row in cur.fetchall():
        print("  migration:", row)

    # Now try a raw insert
    import uuid
    from django.contrib.auth.hashers import make_password
    test_id = str(uuid.uuid4())
    test_email = 'coltest@fleetflow.com'
    
    # Delete first if exists
    cur.execute("DELETE FROM users WHERE email=%s", [test_email])
    
    try:
        cur.execute("""
            INSERT INTO users (user_id, name, email, password_hash, role)
            VALUES (%s, %s, %s, %s, %s)
        """, [test_id, 'Col Test', test_email, make_password('pass123'), 'dispatcher'])
        print("Direct INSERT: SUCCESS")
        cur.execute("DELETE FROM users WHERE email=%s", [test_email])
    except Exception as e:
        print(f"Direct INSERT FAILED: {e}")
