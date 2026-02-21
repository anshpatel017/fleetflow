from django.contrib import admin
from .models import FuelLog


@admin.register(FuelLog)
class FuelLogAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'liters', 'cost', 'date', 'trip')
    list_filter = ('date',)
    search_fields = ('vehicle__license_plate',)
    ordering = ('-date',)
