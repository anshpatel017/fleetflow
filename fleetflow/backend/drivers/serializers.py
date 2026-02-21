from rest_framework import serializers
from .models import Driver

class DriverSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='driver_id', read_only=True)
    class Meta:
        model = Driver
        fields = ['id', 'driver_id', 'full_name', 'license_number', 'license_category', 'license_expiry', 'status', 'safety_score', 'trips_completed', 'trips_cancelled', 'phone', 'created_at']
        read_only_fields = ('created_at',)
