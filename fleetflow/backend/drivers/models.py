from django.db import models
import uuid

class Driver(models.Model):
    driver_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    CATEGORY_CHOICES = [
        ('truck', 'Truck'),
        ('van', 'Van'),
        ('bike', 'Bike'),
        ('all', 'All'),
    ]

    STATUS_CHOICES = [
        ('on_duty', 'On Duty'),
        ('off_duty', 'Off Duty'),
        ('on_trip', 'On Trip'),
        ('suspended', 'Suspended'),
    ]

    full_name = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50, unique=True)
    license_category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    license_expiry = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='on_duty')
    safety_score = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    trips_completed = models.IntegerField(default=0)
    trips_cancelled = models.IntegerField(default=0)
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'drivers'

    def __str__(self):
        return self.full_name
