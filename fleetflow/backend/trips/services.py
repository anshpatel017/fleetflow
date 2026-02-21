from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError


def dispatch_trip(trip):
    """
    Validate all business rules and atomically dispatch a trip.
    Sets trip → dispatched, vehicle → on_trip.
    """
    vehicle = trip.vehicle
    driver = trip.driver

    errors = {}

    # Vehicle must be available
    if vehicle.status != 'available':
        errors['vehicle'] = f"Vehicle is currently '{vehicle.get_status_display()}' and cannot be dispatched."

    # Driver must be on_duty
    if driver.status != 'on_duty':
        errors['driver_status'] = f"Driver is currently '{driver.get_status_display()}' and cannot be assigned."

    # Driver license must be valid
    if not driver.is_license_valid:
        errors['license'] = "Driver's license has expired. Cannot assign trip."

    # Cargo weight must not exceed vehicle capacity
    if trip.cargo_weight > vehicle.capacity_kg:
        errors['cargo_weight'] = (
            f"Cargo weight ({trip.cargo_weight} kg) exceeds "
            f"vehicle capacity ({vehicle.capacity_kg} kg)."
        )

    if errors:
        raise ValidationError(errors)

    with transaction.atomic():
        trip.status = 'dispatched'
        trip.started_at = timezone.now()
        trip.save()

        vehicle.status = 'on_trip'
        vehicle.save(update_fields=['status', 'updated_at'])


def complete_trip(trip, end_odometer):
    """
    Validate odometer and atomically complete a trip.
    Sets trip → completed, vehicle → available.
    """
    if trip.status != 'dispatched':
        raise ValidationError({"status": "Only dispatched trips can be completed."})

    if end_odometer <= trip.start_odometer:
        raise ValidationError({
            "end_odometer": "End odometer must be greater than start odometer."
        })

    with transaction.atomic():
        trip.status = 'completed'
        trip.end_odometer = end_odometer
        trip.completed_at = timezone.now()
        trip.save()

        trip.vehicle.status = 'available'
        trip.vehicle.save(update_fields=['status', 'updated_at'])


def cancel_trip(trip):
    """
    Atomically cancel a trip.
    Sets trip → cancelled, vehicle → available (if it was on_trip).
    """
    if trip.status not in ('draft', 'dispatched'):
        raise ValidationError({"status": "Only draft or dispatched trips can be cancelled."})

    with transaction.atomic():
        was_dispatched = trip.status == 'dispatched'
        trip.status = 'cancelled'
        trip.save()

        if was_dispatched:
            trip.vehicle.status = 'available'
            trip.vehicle.save(update_fields=['status', 'updated_at'])
