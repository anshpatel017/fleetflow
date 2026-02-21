from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from accounts.permissions import IsManagerOrReadOnly
from .models import Vehicle
from .serializers import VehicleSerializer


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsManagerOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'vehicle_type', 'region']

    def destroy(self, request, *args, **kwargs):
        vehicle = self.get_object()
        if vehicle.trips.exists():
            return Response(
                {"error": "Cannot delete a vehicle that has trip records."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'], url_path='retire')
    def retire(self, request, pk=None):
        vehicle = self.get_object()
        if vehicle.status == 'on_trip':
            return Response(
                {"error": "Cannot retire a vehicle that is currently on a trip."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        vehicle.status = 'retired'
        vehicle.save(update_fields=['status', 'updated_at'])
        return Response(VehicleSerializer(vehicle).data)
