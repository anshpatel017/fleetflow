from django.contrib import admin
from .models import ServiceLog


@admin.register(ServiceLog)
class ServiceLogAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'service_type', 'cost', 'date_in', 'date_out')
    list_filter = ('service_type',)
    search_fields = ('vehicle__license_plate', 'description')
    ordering = ('-date_in',)
