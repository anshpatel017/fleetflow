from django.contrib import admin
from .models import Driver


@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ('user', 'license_number', 'license_expiry', 'status', 'safety_score')
    list_filter = ('status',)
    search_fields = ('user__email', 'user__full_name', 'license_number')
    ordering = ('-created_at',)
