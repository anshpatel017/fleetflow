from rest_framework import serializers
from .models import ServiceLog


class ServiceLogSerializer(serializers.ModelSerializer):
    vehicle_plate = serializers.CharField(source='vehicle.license_plate', read_only=True)

    class Meta:
        model = ServiceLog
        fields = (
            'id', 'vehicle', 'vehicle_plate', 'service_type',
            'description', 'cost', 'date_in', 'date_out',
            'created_at', 'updated_at',
        )
        read_only_fields = ('created_at', 'updated_at')
