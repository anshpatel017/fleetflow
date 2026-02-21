from django.db import models
from django.conf import settings
import uuid

class MaintenanceLog(models.Model):
    log_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    SERVICE_CHOICES = [
        ('oil_change', 'Oil Change'),
        ('tire_change', 'Tire Change'),
        ('brake_service', 'Brake Service'),
        ('engine_repair', 'Engine Repair'),
        ('inspection', 'Inspection'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    vehicle = models.ForeignKey('fleet.Vehicle', on_delete=models.CASCADE, related_name='maintenance_logs', db_column='vehicle_id')
    logged_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, db_column='logged_by')
    
    service_type = models.CharField(max_length=20, choices=SERVICE_CHOICES)
    description = models.TextField(blank=True, default='')
    service_date = models.DateField(null=True, blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    odometer_at_service = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='in_progress')
    completed_date = models.DateField(blank=True, null=True)
    next_service_km = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        db_table = 'maintenance_logs'

    def __str__(self):
        return f"{self.vehicle.license_plate} - {self.service_type}"


class FuelLog(models.Model):
    fuel_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    vehicle = models.ForeignKey('fleet.Vehicle', on_delete=models.CASCADE, related_name='fuel_logs', db_column='vehicle_id')
    trip = models.ForeignKey('trips.Trip', on_delete=models.SET_NULL, null=True, blank=True, related_name='fuel_logs', db_column='trip_id')
    logged_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, db_column='logged_by')
    
    date = models.DateField()
    liters = models.DecimalField(max_digits=8, decimal_places=2)
    cost_per_liter = models.DecimalField(max_digits=6, decimal_places=2)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    odometer_at_fill = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    station_name = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'fuel_logs'

    def __str__(self):
        return f"{self.vehicle.license_plate} - {self.date}"
