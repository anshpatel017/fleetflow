from rest_framework import serializers
from .models import MaintenanceLog, FuelLog

class MaintenanceLogSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='log_id', read_only=True)
    class Meta:
        model = MaintenanceLog
        fields = ['id', 'log_id', 'vehicle', 'logged_by', 'service_type', 'description', 'service_date', 'cost', 'odometer_at_service', 'status', 'completed_date', 'next_service_km']
        read_only_fields = ('created_at',)

class FuelLogSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='fuel_id', read_only=True)
    class Meta:
        model = FuelLog
        fields = ['id', 'fuel_id', 'vehicle', 'trip', 'logged_by', 'date', 'liters', 'cost_per_liter', 'total_cost', 'odometer_at_fill', 'station_name']
        read_only_fields = ('created_at',)
