from rest_framework import serializers
from .models import Driver


class DriverSerializer(serializers.ModelSerializer):
    is_license_valid = serializers.BooleanField(read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_full_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = Driver
        fields = (
            'id', 'user', 'user_email', 'user_full_name',
            'license_number', 'license_expiry', 'status',
            'safety_score', 'is_license_valid',
            'created_at', 'updated_at',
        )
        read_only_fields = ('created_at', 'updated_at')
