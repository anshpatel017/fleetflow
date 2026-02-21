from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from accounts.permissions import IsManagerOrReadOnly
from .models import ServiceLog
from .serializers import ServiceLogSerializer


class ServiceLogViewSet(viewsets.ModelViewSet):
    queryset = ServiceLog.objects.select_related('vehicle').all()
    serializer_class = ServiceLogSerializer
    permission_classes = [IsManagerOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['vehicle', 'service_type']

    def perform_create(self, serializer):
        """Auto-set vehicle to in_shop when a service log is created."""
        service_log = serializer.save()
        vehicle = service_log.vehicle
        if vehicle.status != 'retired':
            vehicle.status = 'in_shop'
            vehicle.save(update_fields=['status', 'updated_at'])

    @action(detail=True, methods=['post'], url_path='mark-complete')
    def mark_complete(self, request, pk=None):
        """Mark service as complete and set vehicle back to available."""
        service_log = self.get_object()
        from django.utils import timezone
        service_log.date_out = timezone.now().date()
        service_log.save(update_fields=['date_out', 'updated_at'])

        vehicle = service_log.vehicle
        # Only set to available if no other open service logs exist
        open_logs = ServiceLog.objects.filter(
            vehicle=vehicle,
            date_out__isnull=True,
        ).exclude(pk=service_log.pk).exists()

        if not open_logs and vehicle.status == 'in_shop':
            vehicle.status = 'available'
            vehicle.save(update_fields=['status', 'updated_at'])

        return Response(ServiceLogSerializer(service_log).data)
