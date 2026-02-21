from rest_framework import serializers
from .models import Trip


class TripSerializer(serializers.ModelSerializer):
    distance = serializers.FloatField(read_only=True)
    vehicle_plate = serializers.CharField(source='vehicle.license_plate', read_only=True)
    driver_name = serializers.CharField(source='driver.user.full_name', read_only=True)

    class Meta:
        model = Trip
        fields = (
            'id', 'vehicle', 'vehicle_plate', 'driver', 'driver_name',
            'status', 'origin', 'destination', 'cargo_weight',
            'start_odometer', 'end_odometer', 'distance',
            'scheduled_at', 'started_at', 'completed_at', 'notes',
            'created_at', 'updated_at',
        )
        read_only_fields = (
            'status', 'started_at', 'completed_at',
            'end_odometer', 'created_at', 'updated_at',
        )


class TripCreateSerializer(serializers.ModelSerializer):
    """Used for creating and dispatching a trip."""
    class Meta:
        model = Trip
        fields = (
            'vehicle', 'driver', 'origin', 'destination',
            'cargo_weight', 'start_odometer', 'scheduled_at', 'notes',
        )


class TripCompleteSerializer(serializers.Serializer):
    end_odometer = serializers.DecimalField(max_digits=12, decimal_places=1)
