from django.contrib import admin
from .models import Vehicle

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('name_model', 'license_plate', 'vehicle_type', 'max_capacity_kg', 'odometer_km', 'status', 'is_retired')
    list_filter = ('vehicle_type', 'status', 'is_retired', 'region')
    search_fields = ('name_model', 'license_plate')
    list_editable = ('status', 'is_retired')
    readonly_fields = ('created_at',)
