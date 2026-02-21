from django.contrib import admin
from .models import Trip

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('trip_id', 'vehicle', 'driver', 'status', 'cargo_weight_kg', 'revenue')
    list_filter = ('status', 'vehicle', 'driver')
    search_fields = ('trip_id', 'vehicle__name_model', 'driver__full_name')
    list_editable = ('status',)
