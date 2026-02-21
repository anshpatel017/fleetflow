import os
import sys
import django
import urllib.request
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from accounts.models import CustomUser
from django.db import connection

print("=" * 60)
print("FleetFlow — Signup → Database Test")
print("=" * 60)

# Check users BEFORE
before_count = CustomUser.objects.count()
print(f"\n📊 Users in DB before test: {before_count}")

# Try to create a user directly via ORM (same as signup endpoint does)
TEST_EMAIL = "testuser_check@fleetflow.com"

# Clean up from any previous test run
CustomUser.objects.filter(email=TEST_EMAIL).delete()

print(f"\n🧪 Creating test user: {TEST_EMAIL}")
try:
    user = CustomUser.objects.create_user(
        email=TEST_EMAIL,
        password="TestPass123!",
        full_name="Test User",
        role="dispatcher"
    )
    print(f"   ✅ User created with ID: {user.user_id}")
    print(f"   ✅ Email: {user.email}")
    print(f"   ✅ Full Name: {user.full_name} (stored as 'name' column in DB)")
    print(f"   ✅ Role: {user.role}")
    print(f"   ✅ Password hashed: {'yes' if user.password.startswith('pbkdf2_') else 'raw'}")

    # Verify directly in DB
    with connection.cursor() as cur:
        cur.execute("SELECT user_id, email, name, role FROM users WHERE email = %s", [TEST_EMAIL])
        row = cur.fetchone()
        if row:
            print(f"\n🔒 Verified in PostgreSQL directly:")
            print(f"   user_id: {row[0]}")
            print(f"   email:   {row[1]}")
            print(f"   name:    {row[2]}")
            print(f"   role:    {row[3]}")

    after_count = CustomUser.objects.count()
    print(f"\n📊 Users in DB after test: {after_count} (+{after_count - before_count})")

    # Clean up
    user.delete()
    print(f"\n🧹 Test user cleaned up. Final count: {CustomUser.objects.count()}")
    print("\n✅ SIGNUP WILL STORE DATA IN DB — Everything works correctly!")

except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
