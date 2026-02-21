from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceLogViewSet

router = DefaultRouter()
router.register(r'', ServiceLogViewSet, basename='servicelog')

urlpatterns = [
    path('', include(router.urls)),
]
