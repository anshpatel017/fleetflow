from django.db import models
from django.conf import settings
import uuid

class Trip(models.Model):
    trip_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('dispatched', 'Dispatched'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    vehicle = models.ForeignKey('fleet.Vehicle', on_delete=models.CASCADE, related_name='trips', db_column='vehicle_id')
    driver = models.ForeignKey('drivers.Driver', on_delete=models.CASCADE, related_name='trips', db_column='driver_id')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, db_column='created_by')
    
    origin = models.CharField(max_length=200, blank=True, default='')
    destination = models.CharField(max_length=200, blank=True, default='')
    cargo_weight_kg = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    cargo_description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='draft')
    
    scheduled_at = models.DateTimeField(blank=True, null=True)
    dispatched_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    
    odometer_start = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    odometer_end = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    distance_km = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    revenue = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'trips'

    def __str__(self):
        return f"Trip {self.trip_id} from {self.origin} to {self.destination}"
