import os
import django
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from accounts.models import CustomUser
from fleet.models import Vehicle
from drivers.models import Driver
from trips.models import Trip
from operations.models import MaintenanceLog, FuelLog

def seed():
    # Admin
    if not CustomUser.objects.filter(email="admin@fleetflow.com").exists():
        CustomUser.objects.create_superuser("admin@fleetflow.com", "admin123", full_name="Admin User")
        print("Superuser created.")

    # Vehicle
    v1, _ = Vehicle.objects.get_or_create(
        license_plate="TRK-100", 
        defaults={
            "name_model": "Volvo FH16", 
            "vehicle_type": "truck", 
            "max_capacity_kg": 25000, 
            "acquisition_cost": 120000, 
            "odometer_km": 10500,
            "status": "available"
        }
    )
    v2, _ = Vehicle.objects.get_or_create(
        license_plate="VAN-200", 
        defaults={
            "name_model": "Mercedes Sprinter", 
            "vehicle_type": "van", 
            "max_load_capacity_kg": 3500, 
            "acquisition_cost": 45000, 
            "odometer_km": 15400,
            "status": "available"
        }
    )

    # Driver
    d1, _ = Driver.objects.get_or_create(
        license_number="LIC-1122", 
        defaults={
            "full_name": "John Driver", 
            "license_category": "truck", 
            "license_expiry": "2027-12-31", 
            "phone": "555-0111",
            "status": "on_duty"
        }
    )

    print("Seeding complete.")

if __name__ == "__main__":
    seed()
