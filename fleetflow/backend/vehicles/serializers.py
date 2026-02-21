from rest_framework import serializers
from .models import Vehicle


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def validate(self, attrs):
        instance = self.instance
        # Cannot edit capacity while vehicle is on_trip
        if instance and instance.status == 'on_trip' and 'capacity_kg' in attrs:
            if attrs['capacity_kg'] != instance.capacity_kg:
                raise serializers.ValidationError(
                    {"capacity_kg": "Cannot change capacity while vehicle is on a trip."}
                )
        return attrs
