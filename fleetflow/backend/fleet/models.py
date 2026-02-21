from django.db import models
import uuid

class Vehicle(models.Model):
    vehicle_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    TYPE_CHOICES = [
        ('truck', 'Truck'),
        ('van', 'Van'),
        ('bike', 'Bike'),
    ]

    STATUS_CHOICES = [
        ('available', 'Available'),
        ('on_trip', 'On Trip'),
        ('in_shop', 'In Shop'),
        ('retired', 'Retired'),
    ]

    license_plate = models.CharField(max_length=20, unique=True)
    name_model = models.CharField(max_length=100, blank=True, default='')
    vehicle_type = models.CharField(max_length=10, choices=TYPE_CHOICES, blank=True, default='truck')
    max_capacity_kg = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    odometer_km = models.DecimalField(max_digits=10, decimal_places=2, default=0) # Match DECIMAL(10,2)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='available')
    region = models.CharField(max_length=100, blank=True, null=True)
    acquisition_cost = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    is_retired = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'vehicles'

    def __str__(self):
        return f"{self.name_model} ({self.license_plate})"
