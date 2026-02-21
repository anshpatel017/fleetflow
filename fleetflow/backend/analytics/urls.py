from django.urls import path
from .views import DashboardKPIView, VehicleAnalyticsView

urlpatterns = [
    path('dashboard/', DashboardKPIView.as_view(), name='dashboard-kpi'),
    path('vehicles/', VehicleAnalyticsView.as_view(), name='vehicle-analytics'),
]
