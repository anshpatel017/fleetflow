from rest_framework import serializers
from .models import FuelLog


class FuelLogSerializer(serializers.ModelSerializer):
    vehicle_plate = serializers.CharField(source='vehicle.license_plate', read_only=True)

    class Meta:
        model = FuelLog
        fields = (
            'id', 'vehicle', 'vehicle_plate', 'trip',
            'liters', 'cost', 'date', 'odometer_reading',
            'created_at', 'updated_at',
        )
        read_only_fields = ('created_at', 'updated_at')
