from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from accounts.permissions import IsDispatcher
from .models import Trip
from .serializers import TripSerializer, TripCreateSerializer, TripCompleteSerializer
from .services import dispatch_trip, complete_trip, cancel_trip


class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.select_related('vehicle', 'driver__user').all()
    permission_classes = [IsDispatcher]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'vehicle', 'driver']

    def get_serializer_class(self):
        if self.action == 'create':
            return TripCreateSerializer
        return TripSerializer

    def create(self, request, *args, **kwargs):
        """Create and dispatch a trip — validates all business rules."""
        serializer = TripCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        trip = serializer.save()

        # Run dispatch business rules
        dispatch_trip(trip)

        return Response(
            TripSerializer(trip).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=['post'], url_path='complete')
    def complete(self, request, pk=None):
        trip = self.get_object()
        serializer = TripCompleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        complete_trip(trip, serializer.validated_data['end_odometer'])

        return Response(TripSerializer(trip).data)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, pk=None):
        trip = self.get_object()
        cancel_trip(trip)
        return Response(TripSerializer(trip).data)
