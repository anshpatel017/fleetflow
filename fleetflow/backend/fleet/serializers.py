from rest_framework import serializers
from .models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='vehicle_id', read_only=True)
    class Meta:
        model = Vehicle
        fields = ['id', 'vehicle_id', 'license_plate', 'name_model', 'vehicle_type', 'max_capacity_kg', 'odometer_km', 'status', 'region', 'acquisition_cost', 'is_retired', 'created_at']
        read_only_fields = ('created_at',)
