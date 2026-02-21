import os
import django
from datetime import date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from fleet.models import Vehicle

def test_insert():
    try:
        v, created = Vehicle.objects.get_or_create(
            license_plate="TEST-999",
            defaults={
                "name_model": "Test Model",
                "vehicle_type": "truck",
                "max_load_capacity_kg": 1000,
                "odometer_km": 0,
                "status": "available"
            }
        )
        print(f"Success! Vehicle created: {v}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    test_insert()
