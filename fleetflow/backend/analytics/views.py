from django.db.models import Count, Sum, Q, F, ExpressionWrapper, FloatField
from rest_framework.views import APIView
from rest_framework.response import Response

from accounts.permissions import IsFinance
from vehicles.models import Vehicle
from drivers.models import Driver
from trips.models import Trip
from maintenance.models import ServiceLog
from expenses.models import FuelLog


class DashboardView(APIView):
    """GET /api/dashboard/ — all KPIs computed dynamically."""
    permission_classes = [IsFinance]

    def get(self, request):
        # ---- Fleet counts ----
        total_vehicles = Vehicle.objects.exclude(status='retired').count()
        active_vehicles = Vehicle.objects.filter(status='on_trip').count()
        in_shop_vehicles = Vehicle.objects.filter(status='in_shop').count()
        available_vehicles = Vehicle.objects.filter(status='available').count()

        # ---- Utilization rate ----
        utilization_rate = (
            (active_vehicles / total_vehicles * 100) if total_vehicles > 0 else 0
        )

        # ---- Driver counts ----
        total_drivers = Driver.objects.count()
        on_duty_drivers = Driver.objects.filter(status='on_duty').count()
        suspended_drivers = Driver.objects.filter(status='suspended').count()

        # ---- Trip counts ----
        total_trips = Trip.objects.count()
        active_trips = Trip.objects.filter(status='dispatched').count()
        completed_trips = Trip.objects.filter(status='completed').count()

        # ---- Fuel efficiency ----
        # For completed trips: distance / total liters
        completed_with_fuel = (
            Trip.objects.filter(status='completed', end_odometer__isnull=False)
            .prefetch_related('fuel_logs')
        )
        total_distance = 0
        total_liters = 0
        for trip in completed_with_fuel:
            dist = trip.distance
            if dist and dist > 0:
                total_distance += dist
                trip_liters = trip.fuel_logs.aggregate(s=Sum('liters'))['s'] or 0
                total_liters += float(trip_liters)

        fuel_efficiency = (total_distance / total_liters) if total_liters > 0 else None

        # ---- Cost totals ----
        total_fuel_cost = FuelLog.objects.aggregate(s=Sum('cost'))['s'] or 0
        total_maintenance_cost = ServiceLog.objects.aggregate(s=Sum('cost'))['s'] or 0

        # ---- Vehicle ROI (per vehicle) ----
        vehicle_roi = []
        vehicles_with_costs = (
            Vehicle.objects
            .exclude(status='retired')
            .annotate(
                fuel_cost=Sum('fuel_logs__cost'),
                maintenance_cost=Sum('service_logs__cost'),
            )
        )
        for v in vehicles_with_costs:
            fuel = float(v.fuel_cost or 0)
            maint = float(v.maintenance_cost or 0)
            acq = float(v.acquisition_cost) if v.acquisition_cost else 0
            roi = (-(fuel + maint) / acq * 100) if acq > 0 else None
            vehicle_roi.append({
                'id': v.id,
                'license_plate': v.license_plate,
                'make': v.make,
                'model': v.model,
                'fuel_cost': fuel,
                'maintenance_cost': maint,
                'acquisition_cost': acq,
                'roi_pct': round(roi, 2) if roi is not None else None,
            })

        return Response({
            'fleet': {
                'total': total_vehicles,
                'active': active_vehicles,
                'available': available_vehicles,
                'in_shop': in_shop_vehicles,
                'utilization_rate': round(utilization_rate, 2),
            },
            'drivers': {
                'total': total_drivers,
                'on_duty': on_duty_drivers,
                'suspended': suspended_drivers,
            },
            'trips': {
                'total': total_trips,
                'active': active_trips,
                'completed': completed_trips,
            },
            'fuel_efficiency_km_per_liter': round(fuel_efficiency, 2) if fuel_efficiency else None,
            'costs': {
                'total_fuel': float(total_fuel_cost),
                'total_maintenance': float(total_maintenance_cost),
            },
            'vehicle_roi': vehicle_roi,
        })
