from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from django_filters.rest_framework import DjangoFilterBackend

from accounts.permissions import IsManagerOrReadOnly
from .models import FuelLog
from .serializers import FuelLogSerializer


class FuelLogViewSet(viewsets.ModelViewSet):
    queryset = FuelLog.objects.select_related('vehicle', 'trip').all()
    serializer_class = FuelLogSerializer
    permission_classes = [IsManagerOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['vehicle', 'trip']

    @action(detail=False, methods=['get'], url_path='vehicle-summary')
    def vehicle_summary(self, request):
        """Aggregate fuel cost and liters per vehicle."""
        summary = (
            FuelLog.objects
            .values('vehicle__id', 'vehicle__license_plate', 'vehicle__make', 'vehicle__model')
            .annotate(
                total_liters=Sum('liters'),
                total_cost=Sum('cost'),
            )
            .order_by('-total_cost')
        )
        return Response(list(summary))
