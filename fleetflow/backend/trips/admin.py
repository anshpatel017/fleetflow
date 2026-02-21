from django.contrib import admin
from .models import Trip


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('id', 'vehicle', 'driver', 'status', 'origin', 'destination', 'cargo_weight', 'created_at')
    list_filter = ('status',)
    search_fields = ('origin', 'destination', 'vehicle__license_plate')
    ordering = ('-created_at',)
