from django.db import models
from django.conf import settings
from django.utils import timezone


class Driver(models.Model):
    STATUS_CHOICES = (
        ('on_duty', 'On Duty'),
        ('off_duty', 'Off Duty'),
        ('suspended', 'Suspended'),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='driver_profile',
    )
    license_number = models.CharField(max_length=50, unique=True)
    license_expiry = models.DateField(db_index=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='off_duty', db_index=True)
    safety_score = models.DecimalField(max_digits=4, decimal_places=1, default=100.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_license_valid(self):
        return self.license_expiry >= timezone.now().date()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.full_name} ({self.license_number})"
