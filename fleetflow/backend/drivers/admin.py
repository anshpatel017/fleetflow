from django.contrib import admin
from .models import Driver

@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'license_number', 'license_category', 'license_expiry', 'status', 'safety_score')
    list_filter = ('status', 'license_category')
    search_fields = ('full_name', 'license_number')
    list_editable = ('status', 'safety_score')
    readonly_fields = ('created_at',)
