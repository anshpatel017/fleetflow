from django.contrib import admin
from .models import Vehicle


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('license_plate', 'make', 'model', 'vehicle_type', 'status', 'capacity_kg', 'region')
    list_filter = ('status', 'vehicle_type', 'region')
    search_fields = ('license_plate', 'make', 'model')
    ordering = ('-created_at',)
