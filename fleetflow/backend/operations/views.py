from rest_framework import viewsets
from .models import MaintenanceLog, FuelLog
from .serializers import MaintenanceLogSerializer, FuelLogSerializer

class MaintenanceLogViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceLog.objects.all()
    serializer_class = MaintenanceLogSerializer
    filterset_fields = ['vehicle', 'status']

class FuelLogViewSet(viewsets.ModelViewSet):
    queryset = FuelLog.objects.all()
    serializer_class = FuelLogSerializer
    filterset_fields = ['vehicle', 'trip']
