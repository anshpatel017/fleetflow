from rest_framework import viewsets
from .models import Driver
from .serializers import DriverSerializer

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    filterset_fields = ['status', 'license_category']
    search_fields = ['full_name', 'license_number']
