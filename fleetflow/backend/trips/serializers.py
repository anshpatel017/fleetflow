from rest_framework import serializers
from .models import Trip

class TripSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='trip_id', read_only=True)
    class Meta:
        model = Trip
        fields = ['id', 'trip_id', 'vehicle', 'driver', 'created_by', 'origin', 'destination', 'cargo_weight_kg', 'cargo_description', 'status', 'scheduled_at', 'dispatched_at', 'completed_at', 'odometer_start', 'odometer_end', 'distance_km', 'revenue', 'notes']
        read_only_fields = ('created_at', 'distance_km')

    def validate(self, data):
        # Create a temporary instance to run the model's clean() method
        instance = Trip(**data)
        try:
            instance.clean()
        except Exception as e:
            raise serializers.ValidationError(e.message_dict if hasattr(e, 'message_dict') else str(e))
        return data
