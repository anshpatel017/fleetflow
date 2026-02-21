from rest_framework import viewsets
from .models import Vehicle
from .serializers import VehicleSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    filterset_fields = ['type', 'status', 'region', 'is_retired']
    search_fields = ['name', 'license_plate']
