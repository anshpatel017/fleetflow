from django.db import models
from django.conf import settings
from vehicles.models import Vehicle
from drivers.models import Driver


class Trip(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('dispatched', 'Dispatched'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT, related_name='trips')
    driver = models.ForeignKey(Driver, on_delete=models.PROTECT, related_name='trips')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='draft', db_index=True)

    origin = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    cargo_weight = models.DecimalField(max_digits=10, decimal_places=2)

    start_odometer = models.DecimalField(max_digits=12, decimal_places=1)
    end_odometer = models.DecimalField(max_digits=12, decimal_places=1, null=True, blank=True)

    scheduled_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    notes = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"Trip #{self.pk} — {self.origin} → {self.destination}"

    @property
    def distance(self):
        if self.end_odometer and self.start_odometer:
            return float(self.end_odometer - self.start_odometer)
        return None
