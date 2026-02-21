from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaintenanceLogViewSet, FuelLogViewSet

router = DefaultRouter()
router.register(r'maintenance', MaintenanceLogViewSet)
router.register(r'fuel', FuelLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
