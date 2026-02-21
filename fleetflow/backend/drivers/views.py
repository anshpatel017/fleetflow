from datetime import timedelta

from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from accounts.permissions import IsSafetyOfficer, IsSafetyOfficerOrDispatcher
from .models import Driver
from .serializers import DriverSerializer


class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.select_related('user').all()
    serializer_class = DriverSerializer
    permission_classes = [IsSafetyOfficer]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

    def get_permissions(self):
        """Allow dispatchers and safety officers to list/retrieve drivers."""
        if self.action in ('list', 'retrieve', 'on_duty'):
            return [IsSafetyOfficerOrDispatcher()]
        return super().get_permissions()

    @action(detail=False, methods=['get'])
    def on_duty(self, request):
        """Returns only drivers with status='on_duty'."""
        drivers = Driver.objects.select_related('user').filter(status='on_duty')
        serializer = self.get_serializer(drivers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='expiring-soon')
    def expiring_soon(self, request):
        """Drivers whose license expires within the next 30 days."""
        threshold = timezone.now().date() + timedelta(days=30)
        drivers = Driver.objects.select_related('user').filter(
            license_expiry__lte=threshold,
            license_expiry__gte=timezone.now().date(),
        )
        serializer = self.get_serializer(drivers, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='suspend')
    def suspend(self, request, pk=None):
        driver = self.get_object()
        if driver.status == 'suspended':
            return Response(
                {"error": "Driver is already suspended."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        driver.status = 'suspended'
        driver.save(update_fields=['status', 'updated_at'])
        return Response(DriverSerializer(driver).data)

    @action(detail=True, methods=['post'], url_path='activate')
    def activate(self, request, pk=None):
        driver = self.get_object()
        driver.status = 'on_duty'
        driver.save(update_fields=['status', 'updated_at'])
        return Response(DriverSerializer(driver).data)
