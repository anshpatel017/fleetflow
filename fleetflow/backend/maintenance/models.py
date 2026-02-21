from django.db import models
from vehicles.models import Vehicle


class ServiceLog(models.Model):
    SERVICE_TYPES = (
        ('oil_change', 'Oil Change'),
        ('tire_rotation', 'Tire Rotation'),
        ('brake_service', 'Brake Service'),
        ('engine_repair', 'Engine Repair'),
        ('transmission', 'Transmission'),
        ('inspection', 'Inspection'),
        ('other', 'Other'),
    )

    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT, related_name='service_logs')
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPES)
    description = models.TextField(blank=True, default='')
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    date_in = models.DateField()
    date_out = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_in']

    def __str__(self):
        return f"{self.get_service_type_display()} — {self.vehicle.license_plate}"
