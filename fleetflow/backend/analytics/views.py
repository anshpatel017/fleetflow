from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import connection

class DashboardKPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM view_dashboard_kpis")
            row = cursor.fetchone()
            
        if row:
            columns = [col[0] for col in cursor.description]
            data = dict(zip(columns, row))
            # Map SQL view names to frontend expected names if different
            return Response({
                'active_fleet': data.get('active_fleet_count'),
                'in_shop': data.get('maintenance_alerts'),
                'utilization_rate': data.get('utilization_rate'),
                'pending_cargo': data.get('pending_cargo'),
                'total_active_vehicles': data.get('idle_vehicles') + data.get('active_fleet_count') + data.get('maintenance_alerts')
            })
        return Response({})

class VehicleAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM view_vehicle_financials")
            rows = cursor.fetchall()
            columns = [col[0] for col in cursor.description]
            
        data = []
        for row in rows:
            v_data = dict(zip(columns, row))
            # Calculate cost_per_km and total_ops_cost which might not be in the view
            total_ops_cost = float(v_data.get('total_fuel_cost', 0)) + float(v_data.get('total_maintenance_cost', 0))
            total_distance = float(v_data.get('total_distance_km', 0))
            cost_per_km = (total_ops_cost / total_distance) if total_distance > 0 else 0
            
            data.append({
                'id': v_data.get('vehicle_id'),
                'name': v_data.get('name_model'),
                'license_plate': v_data.get('license_plate'),
                'total_distance': total_distance,
                'fuel_efficiency': float(v_data.get('fuel_efficiency_km_per_l', 0)),
                'total_ops_cost': total_ops_cost,
                'roi': float(v_data.get('roi_percent', 0)),
                'cost_per_km': cost_per_km,
                'total_revenue': float(v_data.get('total_revenue', 0))
            })
        
        return Response(data)
