from django.contrib import admin
from .models import MaintenanceLog, FuelLog

@admin.register(MaintenanceLog)
class MaintenanceLogAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'service_type', 'service_date', 'cost', 'status')
    list_filter = ('status', 'vehicle')
    search_fields = ('vehicle__name_model', 'service_type')
    list_editable = ('status',)

@admin.register(FuelLog)
class FuelLogAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'date', 'liters', 'total_cost', 'odometer_at_fill')
    list_filter = ('vehicle',)
    search_fields = ('vehicle__name_model',)
