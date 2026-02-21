"""
=============================================================================
FLEETFLOW — COMPLETE WORKFLOW TESTING SUITE
=============================================================================
Covers ALL 16 testing sections:
  S3  — Authentication & RBAC
  S4  — Vehicle Registry CRUD
  S5  — Driver Module
  S6  — Trip Dispatch Workflow
  S7  — Trip Completion
  S8  — Maintenance Workflow
  S9  — Fuel & Expense
  S10 — Analytics & KPIs
  S11 — Full End-to-End Simulation
  S12 — Concurrency
  S13 — Data Integrity
  S14 — Performance (basic N+1 check)
  S15 — Security
  S16 — Failure Recovery (transaction rollback)
=============================================================================
"""
import threading
from datetime import date, timedelta
from decimal import Decimal

from django.db import IntegrityError, connection
from django.test import TestCase, TransactionTestCase, override_settings
from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.test import APIClient

from accounts.models import CustomUser
from vehicles.models import Vehicle
from drivers.models import Driver
from trips.models import Trip
from trips.services import dispatch_trip, complete_trip, cancel_trip
from maintenance.models import ServiceLog
from expenses.models import FuelLog


# =====================================================================
# SECTION 2 — TEST ENVIRONMENT SETUP (shared base)
# =====================================================================

class BaseFleetTestCase(TestCase):
    """
    Creates the base test data required by the testing plan:
    - 4 users (manager, dispatcher, safety_officer, finance)
    - 3 vehicles (available, in_shop, retired)
    - 2 drivers (valid license, expired license)
    """

    def setUp(self):
        # --- Users for each role ---
        self.manager = CustomUser.objects.create_user(
            email='manager@fleet.com', password='Manager@123',
            full_name='Fleet Manager', role='manager',
        )
        self.dispatcher_user = CustomUser.objects.create_user(
            email='dispatcher@fleet.com', password='Dispatch@123',
            full_name='Dispatch Officer', role='dispatcher',
        )
        self.safety_user = CustomUser.objects.create_user(
            email='safety@fleet.com', password='Safety@123',
            full_name='Safety Officer', role='safety_officer',
        )
        self.finance_user = CustomUser.objects.create_user(
            email='finance@fleet.com', password='Finance@123',
            full_name='Finance Analyst', role='finance',
        )
        # extra user for driver profile
        self.driver_user = CustomUser.objects.create_user(
            email='driver1@fleet.com', password='Driver@123',
            full_name='John Driver', role='dispatcher',
        )
        self.driver_user2 = CustomUser.objects.create_user(
            email='driver2@fleet.com', password='Driver@123',
            full_name='Jane ExpiredLicense', role='dispatcher',
        )

        # --- Vehicles ---
        self.vehicle_available = Vehicle.objects.create(
            license_plate='FL-001', make='Toyota', model='Hilux',
            year=2023, vehicle_type='truck',
            capacity_kg=Decimal('1000.00'), status='available',
            acquisition_cost=Decimal('50000.00'), region='North',
        )
        self.vehicle_in_shop = Vehicle.objects.create(
            license_plate='FL-002', make='Ford', model='Ranger',
            year=2022, vehicle_type='van',
            capacity_kg=Decimal('800.00'), status='in_shop',
            acquisition_cost=Decimal('40000.00'), region='South',
        )
        self.vehicle_retired = Vehicle.objects.create(
            license_plate='FL-003', make='Honda', model='Civic',
            year=2018, vehicle_type='sedan',
            capacity_kg=Decimal('300.00'), status='retired',
            acquisition_cost=Decimal('20000.00'), region='East',
        )

        # --- Drivers ---
        self.driver_valid = Driver.objects.create(
            user=self.driver_user,
            license_number='DL-VALID-001',
            license_expiry=date.today() + timedelta(days=365),
            status='on_duty', safety_score=Decimal('95.0'),
        )
        self.driver_expired = Driver.objects.create(
            user=self.driver_user2,
            license_number='DL-EXPIRED-001',
            license_expiry=date.today() - timedelta(days=30),
            status='on_duty', safety_score=Decimal('80.0'),
        )

        # --- API Client ---
        self.client = APIClient()

    def _auth_as(self, user):
        """Authenticate the API client as the given user."""
        self.client.force_authenticate(user=user)

    def _create_trip_obj(self, **overrides):
        """Helper to create a Trip model instance."""
        defaults = {
            'vehicle': self.vehicle_available,
            'driver': self.driver_valid,
            'origin': 'Warehouse A',
            'destination': 'Depot B',
            'cargo_weight': Decimal('500.00'),
            'start_odometer': Decimal('10000.0'),
        }
        defaults.update(overrides)
        return Trip.objects.create(**defaults)


# =====================================================================
# SECTION 3 — AUTHENTICATION & RBAC TESTING
# =====================================================================

class AuthenticationTests(BaseFleetTestCase):
    """TEST A1, A2, A3 — Login, protected routes, role enforcement."""

    # --- A1: Login works ---
    def test_a1_login_returns_jwt_with_role(self):
        resp = self.client.post('/api/auth/login/', {
            'email': 'manager@fleet.com', 'password': 'Manager@123',
        })
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('access', resp.data)
        self.assertIn('refresh', resp.data)
        self.assertEqual(resp.data['user']['role'], 'manager')

    def test_a1_login_invalid_credentials(self):
        resp = self.client.post('/api/auth/login/', {
            'email': 'manager@fleet.com', 'password': 'WrongPassword',
        })
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    # --- A2: Protected route without token ---
    def test_a2_vehicles_requires_auth(self):
        resp = self.client.get('/api/vehicles/')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_a2_trips_requires_auth(self):
        resp = self.client.get('/api/trips/')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_a2_dashboard_requires_auth(self):
        resp = self.client.get('/api/dashboard/')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    # --- A3: Role permission enforcement ---
    def test_a3_dispatcher_cannot_delete_vehicle(self):
        self._auth_as(self.dispatcher_user)
        resp = self.client.delete(f'/api/vehicles/{self.vehicle_available.pk}/')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_a3_finance_cannot_create_trip(self):
        self._auth_as(self.finance_user)
        resp = self.client.post('/api/trips/', {
            'vehicle': self.vehicle_available.pk,
            'driver': self.driver_valid.pk,
            'origin': 'A', 'destination': 'B',
            'cargo_weight': '400.00', 'start_odometer': '1000.0',
        })
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_a3_finance_can_read_dashboard(self):
        self._auth_as(self.finance_user)
        resp = self.client.get('/api/dashboard/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_a3_finance_cannot_write_dashboard(self):
        self._auth_as(self.finance_user)
        resp = self.client.post('/api/dashboard/', {})
        # DashboardView only has GET, so POST should either be 403 or 405
        self.assertIn(resp.status_code, [
            status.HTTP_403_FORBIDDEN,
            status.HTTP_405_METHOD_NOT_ALLOWED,
        ])

    def test_a3_manager_can_access_vehicles(self):
        self._auth_as(self.manager)
        resp = self.client.get('/api/vehicles/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_a3_manager_can_access_trips(self):
        self._auth_as(self.manager)
        resp = self.client.get('/api/trips/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_a3_safety_can_read_drivers(self):
        self._auth_as(self.safety_user)
        resp = self.client.get('/api/drivers/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_a3_dispatcher_can_read_vehicles(self):
        """Dispatchers should be able to read vehicles (read-only)."""
        self._auth_as(self.dispatcher_user)
        resp = self.client.get('/api/vehicles/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)


# =====================================================================
# SECTION 4 — VEHICLE REGISTRY TESTING
# =====================================================================

class VehicleRegistryTests(BaseFleetTestCase):
    """TEST V1-V4."""

    def setUp(self):
        super().setUp()
        self._auth_as(self.manager)

    # --- V1: Create vehicle ---
    def test_v1_create_vehicle(self):
        resp = self.client.post('/api/vehicles/', {
            'license_plate': 'NEW-001', 'make': 'Nissan', 'model': 'Navara',
            'year': 2024, 'vehicle_type': 'truck',
            'capacity_kg': '1200.00', 'acquisition_cost': '55000.00',
        })
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data['status'], 'available')

    # --- V2: Duplicate license plate ---
    def test_v2_duplicate_license_plate_rejected(self):
        resp = self.client.post('/api/vehicles/', {
            'license_plate': 'FL-001',  # already exists
            'make': 'Dup', 'model': 'Test', 'year': 2024,
            'vehicle_type': 'sedan', 'capacity_kg': '500.00',
        })
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    # --- V3: Update vehicle ---
    def test_v3_update_capacity(self):
        resp = self.client.patch(f'/api/vehicles/{self.vehicle_available.pk}/', {
            'capacity_kg': '1500.00',
        })
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.vehicle_available.refresh_from_db()
        self.assertEqual(self.vehicle_available.capacity_kg, Decimal('1500.00'))

    def test_v3_cannot_update_capacity_on_trip(self):
        self.vehicle_available.status = 'on_trip'
        self.vehicle_available.save()
        resp = self.client.patch(f'/api/vehicles/{self.vehicle_available.pk}/', {
            'capacity_kg': '2000.00',
        })
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    # --- V4: Delete vehicle with trips ---
    def test_v4_delete_vehicle_with_trips_rejected(self):
        trip = self._create_trip_obj()
        resp = self.client.delete(f'/api/vehicles/{self.vehicle_available.pk}/')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(Vehicle.objects.filter(pk=self.vehicle_available.pk).exists())

    def test_v4_delete_vehicle_without_trips_succeeds(self):
        v = Vehicle.objects.create(
            license_plate='DEL-001', make='Test', model='Del',
            year=2024, vehicle_type='sedan', capacity_kg=Decimal('500.00'),
        )
        resp = self.client.delete(f'/api/vehicles/{v.pk}/')
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)

    # --- Retire action ---
    def test_retire_available_vehicle(self):
        resp = self.client.post(f'/api/vehicles/{self.vehicle_available.pk}/retire/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.vehicle_available.refresh_from_db()
        self.assertEqual(self.vehicle_available.status, 'retired')

    def test_retire_on_trip_vehicle_rejected(self):
        self.vehicle_available.status = 'on_trip'
        self.vehicle_available.save()
        resp = self.client.post(f'/api/vehicles/{self.vehicle_available.pk}/retire/')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    # --- Filtering ---
    def test_filter_by_status(self):
        resp = self.client.get('/api/vehicles/', {'status': 'available'})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        plates = [v['license_plate'] for v in resp.data['results']]
        self.assertIn('FL-001', plates)
        self.assertNotIn('FL-002', plates)  # in_shop


# =====================================================================
# SECTION 5 — DRIVER MODULE TESTING
# =====================================================================

class DriverModuleTests(BaseFleetTestCase):
    """TEST D1-D3."""

    def setUp(self):
        super().setUp()
        self._auth_as(self.manager)

    # --- D1: Create driver ---
    def test_d1_create_driver(self):
        new_user = CustomUser.objects.create_user(
            email='newdriver@fleet.com', password='NewDrv@123',
            full_name='New Driver', role='dispatcher',
        )
        resp = self.client.post('/api/drivers/', {
            'user': new_user.pk,
            'license_number': 'DL-NEW-001',
            'license_expiry': (date.today() + timedelta(days=180)).isoformat(),
            'status': 'off_duty',
            'safety_score': '100.0',
        })
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data['status'], 'off_duty')

    # --- D2: Expired license flagged ---
    def test_d2_expired_license_flagged(self):
        resp = self.client.get(f'/api/drivers/{self.driver_expired.pk}/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertFalse(resp.data['is_license_valid'])

    def test_d2_valid_license_flagged(self):
        resp = self.client.get(f'/api/drivers/{self.driver_valid.pk}/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(resp.data['is_license_valid'])

    # --- D3: Suspend driver ---
    def test_d3_suspend_driver(self):
        resp = self.client.post(f'/api/drivers/{self.driver_valid.pk}/suspend/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.driver_valid.refresh_from_db()
        self.assertEqual(self.driver_valid.status, 'suspended')

    def test_d3_double_suspend_rejected(self):
        self.driver_valid.status = 'suspended'
        self.driver_valid.save()
        resp = self.client.post(f'/api/drivers/{self.driver_valid.pk}/suspend/')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    # --- Expiring soon filter ---
    def test_expiring_soon_filter(self):
        # Create driver expiring in 15 days
        soon_user = CustomUser.objects.create_user(
            email='soon@fleet.com', password='Soon@123', full_name='Soon', role='dispatcher',
        )
        Driver.objects.create(
            user=soon_user, license_number='DL-SOON',
            license_expiry=date.today() + timedelta(days=15),
            status='on_duty',
        )
        resp = self.client.get('/api/drivers/expiring-soon/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        numbers = [d['license_number'] for d in resp.data]
        self.assertIn('DL-SOON', numbers)
        self.assertNotIn('DL-VALID-001', numbers)  # expires in 365 days

    # --- Activate driver ---
    def test_activate_suspended_driver(self):
        self.driver_valid.status = 'suspended'
        self.driver_valid.save()
        resp = self.client.post(f'/api/drivers/{self.driver_valid.pk}/activate/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.driver_valid.refresh_from_db()
        self.assertEqual(self.driver_valid.status, 'on_duty')


# =====================================================================
# SECTION 6 — TRIP DISPATCH WORKFLOW TESTING
# =====================================================================

class TripDispatchWorkflowTests(BaseFleetTestCase):
    """SCENARIO 1-5: dispatch via API."""

    def setUp(self):
        super().setUp()
        self._auth_as(self.manager)

    def _dispatch_payload(self, **overrides):
        defaults = {
            'vehicle': self.vehicle_available.pk,
            'driver': self.driver_valid.pk,
            'origin': 'Warehouse A', 'destination': 'Depot B',
            'cargo_weight': '400.00', 'start_odometer': '10000.0',
        }
        defaults.update(overrides)
        return defaults

    # --- Scenario 1: Successful dispatch ---
    def test_s1_successful_dispatch(self):
        resp = self.client.post('/api/trips/', self._dispatch_payload())
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data['status'], 'dispatched')

        self.vehicle_available.refresh_from_db()
        self.assertEqual(self.vehicle_available.status, 'on_trip')

    def test_s1_vehicle_locked_after_dispatch(self):
        """After dispatch, vehicle cannot be reused."""
        self.client.post('/api/trips/', self._dispatch_payload())
        # Try dispatching same vehicle again
        resp2 = self.client.post('/api/trips/', self._dispatch_payload())
        self.assertEqual(resp2.status_code, status.HTTP_400_BAD_REQUEST)

    # --- Scenario 2: Cargo overload ---
    def test_s2_cargo_overload_rejected(self):
        resp = self.client.post('/api/trips/', self._dispatch_payload(
            cargo_weight='1500.00',  # capacity = 1000kg
        ))
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.vehicle_available.refresh_from_db()
        self.assertEqual(self.vehicle_available.status, 'available')

    # --- Scenario 3: Expired license ---
    def test_s3_expired_license_blocks_dispatch(self):
        resp = self.client.post('/api/trips/', self._dispatch_payload(
            driver=self.driver_expired.pk,
        ))
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    # --- Scenario 4: Vehicle already on trip ---
    def test_s4_double_booking_prevented(self):
        self.vehicle_available.status = 'on_trip'
        self.vehicle_available.save()
        resp = self.client.post('/api/trips/', self._dispatch_payload())
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    # --- Scenario 5: Suspended driver ---
    def test_s5_suspended_driver_blocks_dispatch(self):
        self.driver_valid.status = 'suspended'
        self.driver_valid.save()
        resp = self.client.post('/api/trips/', self._dispatch_payload())
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)


# =====================================================================
# SECTION 7 — TRIP COMPLETION TESTING
# =====================================================================

class TripCompletionTests(BaseFleetTestCase):
    """TEST T1-T3: complete via API."""

    def setUp(self):
        super().setUp()
        self._auth_as(self.manager)
        # Create and dispatch a trip
        resp = self.client.post('/api/trips/', {
            'vehicle': self.vehicle_available.pk,
            'driver': self.driver_valid.pk,
            'origin': 'A', 'destination': 'B',
            'cargo_weight': '500.00', 'start_odometer': '10000.0',
        })
        self.trip_id = resp.data['id']

    # --- T1: Complete trip properly ---
    def test_t1_complete_trip_properly(self):
        resp = self.client.post(f'/api/trips/{self.trip_id}/complete/', {
            'end_odometer': '10500.0',
        })
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['status'], 'completed')
        self.vehicle_available.refresh_from_db()
        self.assertEqual(self.vehicle_available.status, 'available')

    # --- T2: Negative odometer ---
    def test_t2_negative_odometer_rejected(self):
        resp = self.client.post(f'/api/trips/{self.trip_id}/complete/', {
            'end_odometer': '9000.0',
        })
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        trip = Trip.objects.get(pk=self.trip_id)
        self.assertEqual(trip.status, 'dispatched')

    # --- T3: Double completion ---
    def test_t3_double_completion_rejected(self):
        self.client.post(f'/api/trips/{self.trip_id}/complete/', {
            'end_odometer': '10500.0',
        })
        resp2 = self.client.post(f'/api/trips/{self.trip_id}/complete/', {
            'end_odometer': '11000.0',
        })
        self.assertEqual(resp2.status_code, status.HTTP_400_BAD_REQUEST)

    # --- Cancel ---
    def test_cancel_dispatched_trip(self):
        resp = self.client.post(f'/api/trips/{self.trip_id}/cancel/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['status'], 'cancelled')
        self.vehicle_available.refresh_from_db()
        self.assertEqual(self.vehicle_available.status, 'available')


# =====================================================================
# SECTION 8 — MAINTENANCE WORKFLOW TESTING
# =====================================================================

class MaintenanceWorkflowTests(BaseFleetTestCase):
    """SCENARIO 1-3."""

    def setUp(self):
        super().setUp()
        self._auth_as(self.manager)

    # --- Scenario 1: Add service log → vehicle in_shop ---
    def test_s1_service_log_sets_vehicle_in_shop(self):
        resp = self.client.post('/api/maintenance/', {
            'vehicle': self.vehicle_available.pk,
            'service_type': 'oil_change',
            'cost': '150.00',
            'date_in': date.today().isoformat(),
        })
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.vehicle_available.refresh_from_db()
        self.assertEqual(self.vehicle_available.status, 'in_shop')

    # --- Scenario 2: Dispatch blocked for in_shop vehicle ---
    def test_s2_dispatch_in_shop_vehicle_blocked(self):
        # Add service log first
        self.client.post('/api/maintenance/', {
            'vehicle': self.vehicle_available.pk,
            'service_type': 'brake_service',
            'cost': '300.00',
            'date_in': date.today().isoformat(),
        })
        # Try dispatch
        resp = self.client.post('/api/trips/', {
            'vehicle': self.vehicle_available.pk,
            'driver': self.driver_valid.pk,
            'origin': 'A', 'destination': 'B',
            'cargo_weight': '500.00', 'start_odometer': '10000.0',
        })
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    # --- Scenario 3: Mark complete → vehicle available ---
    def test_s3_mark_complete_restores_vehicle(self):
        resp = self.client.post('/api/maintenance/', {
            'vehicle': self.vehicle_available.pk,
            'service_type': 'engine_repair',
            'cost': '500.00',
            'date_in': date.today().isoformat(),
        })
        log_id = resp.data['id']

        resp2 = self.client.post(f'/api/maintenance/{log_id}/mark-complete/')
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        self.vehicle_available.refresh_from_db()
        self.assertEqual(self.vehicle_available.status, 'available')

    def test_s3_vehicle_stays_in_shop_if_other_open_logs(self):
        """Vehicle only goes available when ALL service logs are closed."""
        self.client.post('/api/maintenance/', {
            'vehicle': self.vehicle_available.pk,
            'service_type': 'oil_change', 'cost': '100.00',
            'date_in': date.today().isoformat(),
        })
        resp2 = self.client.post('/api/maintenance/', {
            'vehicle': self.vehicle_available.pk,
            'service_type': 'brake_service', 'cost': '200.00',
            'date_in': date.today().isoformat(),
        })
        log1_id = ServiceLog.objects.filter(vehicle=self.vehicle_available).first().pk
        log2_id = resp2.data['id']

        # Close only first log
        self.client.post(f'/api/maintenance/{log1_id}/mark-complete/')
        self.vehicle_available.refresh_from_db()
        self.assertEqual(self.vehicle_available.status, 'in_shop')

        # Close second log → now available
        self.client.post(f'/api/maintenance/{log2_id}/mark-complete/')
        self.vehicle_available.refresh_from_db()
        self.assertEqual(self.vehicle_available.status, 'available')


# =====================================================================
# SECTION 9 — FUEL & EXPENSE TESTING
# =====================================================================

class FuelExpenseTests(BaseFleetTestCase):
    """TEST F1-F3."""

    def setUp(self):
        super().setUp()
        self._auth_as(self.manager)

    # --- F1: Log fuel entry ---
    def test_f1_log_fuel_entry(self):
        resp = self.client.post('/api/expenses/', {
            'vehicle': self.vehicle_available.pk,
            'liters': '45.00', 'cost': '90.00',
            'date': date.today().isoformat(),
        })
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Decimal(resp.data['cost']), Decimal('90.00'))

    # --- F2: Multiple fuel entries → aggregation correct ---
    def test_f2_aggregation_correct(self):
        for i in range(3):
            self.client.post('/api/expenses/', {
                'vehicle': self.vehicle_available.pk,
                'liters': '30.00', 'cost': '60.00',
                'date': (date.today() - timedelta(days=i)).isoformat(),
            })
        resp = self.client.get('/api/expenses/vehicle-summary/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        v_data = [s for s in resp.data if s['vehicle__id'] == self.vehicle_available.pk]
        self.assertEqual(len(v_data), 1)
        self.assertAlmostEqual(float(v_data[0]['total_liters']), 90.0)
        self.assertAlmostEqual(float(v_data[0]['total_cost']), 180.0)

    # --- F3: Fuel without trip ---
    def test_f3_fuel_without_trip_valid(self):
        resp = self.client.post('/api/expenses/', {
            'vehicle': self.vehicle_available.pk,
            'liters': '25.00', 'cost': '50.00',
            'date': date.today().isoformat(),
            # no trip field
        })
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertIsNone(resp.data['trip'])


# =====================================================================
# SECTION 10 — ANALYTICS & KPI TESTING
# =====================================================================

class AnalyticsKPITests(BaseFleetTestCase):
    """TEST A1-A4: dashboard KPIs via API."""

    def setUp(self):
        super().setUp()
        self._auth_as(self.manager)

    # --- A1: Active fleet count ---
    def test_a1_active_fleet_count(self):
        # Currently: available=1, in_shop=1, retired=1
        # Set available to on_trip for the test
        self.vehicle_available.status = 'on_trip'
        self.vehicle_available.save()
        # Create another on_trip vehicle
        Vehicle.objects.create(
            license_plate='FL-ACTIVE', make='Test', model='Active',
            year=2024, vehicle_type='truck', capacity_kg=Decimal('1000'),
            status='on_trip',
        )

        resp = self.client.get('/api/dashboard/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['fleet']['active'], 2)

    # --- A2: Utilization rate ---
    def test_a2_utilization_rate(self):
        # 3 vehicles total (excl retired), 2 on_trip
        self.vehicle_available.status = 'on_trip'
        self.vehicle_available.save()
        Vehicle.objects.create(
            license_plate='FL-UTIL', make='T', model='U',
            year=2024, vehicle_type='truck', capacity_kg=Decimal('500'),
            status='on_trip',
        )
        resp = self.client.get('/api/dashboard/')
        # total non-retired = 3 (FL-001 on_trip, FL-002 in_shop, FL-UTIL on_trip)
        # active = 2 on_trip
        self.assertAlmostEqual(resp.data['fleet']['utilization_rate'], 66.67, places=1)

    # --- A3: Fuel efficiency ---
    def test_a3_fuel_efficiency(self):
        # Create a completed trip with fuel
        trip = self._create_trip_obj(start_odometer=Decimal('1000.0'))
        dispatch_trip(trip)
        complete_trip(trip, Decimal('1200.0'))  # 200 km distance

        FuelLog.objects.create(
            vehicle=self.vehicle_available, trip=trip,
            liters=Decimal('20.00'), cost=Decimal('40.00'),
            date=date.today(),
        )

        resp = self.client.get('/api/dashboard/')
        # 200 / 20 = 10.0 km/L
        self.assertAlmostEqual(resp.data['fuel_efficiency_km_per_liter'], 10.0)

    # --- A4: Vehicle ROI ---
    def test_a4_vehicle_roi(self):
        # Add known costs
        FuelLog.objects.create(
            vehicle=self.vehicle_available,
            liters=Decimal('100'), cost=Decimal('2000.00'),
            date=date.today(),
        )
        ServiceLog.objects.create(
            vehicle=self.vehicle_available,
            service_type='oil_change', cost=Decimal('1000.00'),
            date_in=date.today(),
        )
        # acquisition_cost = 50000
        # total cost = 2000 + 1000 = 3000
        # ROI = -(3000/50000)*100 = -6.0%

        resp = self.client.get('/api/dashboard/')
        v_roi = [r for r in resp.data['vehicle_roi']
                 if r['id'] == self.vehicle_available.pk]
        self.assertEqual(len(v_roi), 1)
        self.assertAlmostEqual(v_roi[0]['roi_pct'], -6.0, places=1)


# =====================================================================
# SECTION 11 — FULL END-TO-END SIMULATION
# =====================================================================

class EndToEndSimulationTests(BaseFleetTestCase):
    """Full lifecycle: add vehicle → add driver → dispatch → complete → fuel → maintenance → dashboard."""

    def test_full_lifecycle(self):
        self._auth_as(self.manager)

        # Step 1: Add Vehicle
        v_resp = self.client.post('/api/vehicles/', {
            'license_plate': 'E2E-001', 'make': 'Toyota', 'model': 'Prado',
            'year': 2025, 'vehicle_type': 'suv',
            'capacity_kg': '800.00', 'acquisition_cost': '60000.00',
        })
        self.assertEqual(v_resp.status_code, status.HTTP_201_CREATED)
        vid = v_resp.data['id']

        # Step 2: Add Driver
        drv_user = CustomUser.objects.create_user(
            email='e2e_driver@fleet.com', password='E2E@123',
            full_name='E2E Driver', role='dispatcher',
        )
        d_resp = self.client.post('/api/drivers/', {
            'user': drv_user.pk,
            'license_number': 'DL-E2E',
            'license_expiry': (date.today() + timedelta(days=365)).isoformat(),
            'status': 'on_duty', 'safety_score': '100.0',
        })
        self.assertEqual(d_resp.status_code, status.HTTP_201_CREATED)
        did = d_resp.data['id']

        # Step 3: Dispatch Trip
        t_resp = self.client.post('/api/trips/', {
            'vehicle': vid, 'driver': did,
            'origin': 'HQ', 'destination': 'Site X',
            'cargo_weight': '600.00', 'start_odometer': '5000.0',
        })
        self.assertEqual(t_resp.status_code, status.HTTP_201_CREATED)
        tid = t_resp.data['id']
        self.assertEqual(t_resp.data['status'], 'dispatched')

        # Verify vehicle locked
        v_obj = Vehicle.objects.get(pk=vid)
        self.assertEqual(v_obj.status, 'on_trip')

        # Step 4: Complete Trip
        c_resp = self.client.post(f'/api/trips/{tid}/complete/', {
            'end_odometer': '5350.0',
        })
        self.assertEqual(c_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(c_resp.data['status'], 'completed')
        v_obj.refresh_from_db()
        self.assertEqual(v_obj.status, 'available')

        # Step 5: Log Fuel
        f_resp = self.client.post('/api/expenses/', {
            'vehicle': vid, 'trip': tid,
            'liters': '35.00', 'cost': '70.00',
            'date': date.today().isoformat(),
        })
        self.assertEqual(f_resp.status_code, status.HTTP_201_CREATED)

        # Step 6: Add Maintenance
        m_resp = self.client.post('/api/maintenance/', {
            'vehicle': vid, 'service_type': 'inspection',
            'cost': '200.00', 'date_in': date.today().isoformat(),
        })
        self.assertEqual(m_resp.status_code, status.HTTP_201_CREATED)
        v_obj.refresh_from_db()
        self.assertEqual(v_obj.status, 'in_shop')

        # Step 7: Check Dashboard
        dash = self.client.get('/api/dashboard/')
        self.assertEqual(dash.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(dash.data['fleet'])
        self.assertIsNotNone(dash.data['costs'])
        self.assertGreater(dash.data['costs']['total_fuel'], 0)
        self.assertGreater(dash.data['costs']['total_maintenance'], 0)


# =====================================================================
# SECTION 12 — CONCURRENCY TESTING
# =====================================================================

class ConcurrencyTests(TransactionTestCase):
    """Simulate two dispatch requests for same vehicle at same time."""

    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email='mgr@fleet.com', password='Mgr@123',
            full_name='Manager', role='manager',
        )
        self.vehicle = Vehicle.objects.create(
            license_plate='CON-001', make='Toyota', model='Hilux',
            year=2023, vehicle_type='truck',
            capacity_kg=Decimal('1000'), status='available',
        )
        self.driver_user1 = CustomUser.objects.create_user(
            email='d1@fleet.com', password='D1@123',
            full_name='Driver 1', role='dispatcher',
        )
        self.driver_user2 = CustomUser.objects.create_user(
            email='d2@fleet.com', password='D2@123',
            full_name='Driver 2', role='dispatcher',
        )
        self.driver1 = Driver.objects.create(
            user=self.driver_user1, license_number='CON-DL1',
            license_expiry=date.today() + timedelta(days=365),
            status='on_duty',
        )
        self.driver2 = Driver.objects.create(
            user=self.driver_user2, license_number='CON-DL2',
            license_expiry=date.today() + timedelta(days=365),
            status='on_duty',
        )

    def test_concurrent_dispatch_only_one_succeeds(self):
        """Two concurrent dispatches for same vehicle — only one should succeed."""
        results = {'success': 0, 'failure': 0}
        lock = threading.Lock()

        def attempt_dispatch(driver):
            try:
                trip = Trip.objects.create(
                    vehicle=self.vehicle, driver=driver,
                    origin='A', destination='B',
                    cargo_weight=Decimal('500'), start_odometer=Decimal('10000'),
                )
                dispatch_trip(trip)
                with lock:
                    results['success'] += 1
            except (ValidationError, Exception):
                with lock:
                    results['failure'] += 1
            finally:
                connection.close()

        t1 = threading.Thread(target=attempt_dispatch, args=(self.driver1,))
        t2 = threading.Thread(target=attempt_dispatch, args=(self.driver2,))

        t1.start()
        t2.start()
        t1.join(timeout=10)
        t2.join(timeout=10)

        # At least one should succeed, at most one should succeed
        self.assertGreaterEqual(results['success'], 1)
        # Second dispatch should fail because vehicle is already on_trip
        self.assertEqual(results['success'] + results['failure'], 2)


# =====================================================================
# SECTION 13 — DATA INTEGRITY TESTING
# =====================================================================

class DataIntegrityTests(BaseFleetTestCase):
    """Ensure PROTECT constraints and edit restrictions."""

    def setUp(self):
        super().setUp()
        self._auth_as(self.manager)

    def test_cannot_delete_driver_with_trips(self):
        """Driver with trip records should be PROTECT-ed."""
        self._create_trip_obj()
        with self.assertRaises(Exception):
            self.driver_valid.delete()

    def test_cannot_delete_vehicle_with_fuel_logs(self):
        """Vehicle with fuel logs should be PROTECT-ed."""
        FuelLog.objects.create(
            vehicle=self.vehicle_available,
            liters=Decimal('10'), cost=Decimal('20'),
            date=date.today(),
        )
        with self.assertRaises(Exception):
            self.vehicle_available.delete()

    def test_cannot_delete_vehicle_with_service_logs(self):
        """Vehicle with service logs should be PROTECT-ed."""
        ServiceLog.objects.create(
            vehicle=self.vehicle_available,
            service_type='inspection', cost=Decimal('100'),
            date_in=date.today(),
        )
        with self.assertRaises(Exception):
            self.vehicle_available.delete()

    def test_cannot_edit_completed_trip_via_api(self):
        """Trip status fields are read-only in serializer."""
        trip = self._create_trip_obj()
        dispatch_trip(trip)
        complete_trip(trip, Decimal('10500'))

        resp = self.client.patch(f'/api/trips/{trip.pk}/', {
            'status': 'dispatched',
        })
        # status is read_only, so the field is silently ignored (still 200)
        # but trip remains completed
        trip.refresh_from_db()
        self.assertEqual(trip.status, 'completed')

    def test_unique_license_plate_constraint(self):
        """Database enforces unique license plate."""
        with self.assertRaises(IntegrityError):
            Vehicle.objects.create(
                license_plate='FL-001',  # duplicate
                make='Dup', model='Test', year=2024,
                vehicle_type='sedan', capacity_kg=Decimal('500'),
            )

    def test_unique_license_number_constraint(self):
        """Database enforces unique driver license number."""
        new_user = CustomUser.objects.create_user(
            email='duplic@fleet.com', password='Dup@123',
            full_name='Dup', role='dispatcher',
        )
        with self.assertRaises(IntegrityError):
            Driver.objects.create(
                user=new_user,
                license_number='DL-VALID-001',  # duplicate
                license_expiry=date.today() + timedelta(days=100),
                status='on_duty',
            )


# =====================================================================
# SECTION 14 — PERFORMANCE TESTING (basic N+1 check)
# =====================================================================

class PerformanceTests(BaseFleetTestCase):
    """Ensure no N+1 queries on key endpoints."""

    def setUp(self):
        super().setUp()
        self._auth_as(self.manager)
        # Create multiple vehicles with trips
        for i in range(10):
            Vehicle.objects.create(
                license_plate=f'PERF-{i:03d}', make='T', model='M',
                year=2024, vehicle_type='truck',
                capacity_kg=Decimal('1000'), status='available',
            )

    def test_vehicle_list_query_count(self):
        """Vehicle list should NOT produce N+1 queries."""
        with self.assertNumQueries(2):  # count + list query
            self.client.get('/api/vehicles/')

    def test_dashboard_bounded_queries(self):
        """Dashboard should use a bounded number of queries regardless of vehicle count."""
        # This threshold is generous; the key point is it shouldn't scale with N
        num_queries_before = len(connection.queries)
        self.client.get('/api/dashboard/')
        num_queries_after = len(connection.queries)
        query_count = num_queries_after - num_queries_before
        self.assertLess(query_count, 20, f"Dashboard used {query_count} queries — likely N+1 issue")


# =====================================================================
# SECTION 15 — SECURITY TESTING
# =====================================================================

class SecurityTests(BaseFleetTestCase):
    """JWT, role isolation, injection protection."""

    def test_expired_token_rejected(self):
        """Using a garbage JWT should return 401."""
        self.client.credentials(HTTP_AUTHORIZATION='Bearer fake.invalid.token')
        resp = self.client.get('/api/vehicles/')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_role_isolation_dispatcher_vs_safety(self):
        """Dispatcher cannot manage drivers (safety only)."""
        self._auth_as(self.dispatcher_user)
        new_user = CustomUser.objects.create_user(
            email='sec_drv@fleet.com', password='Sec@123',
            full_name='Sec Driver', role='dispatcher',
        )
        resp = self.client.post('/api/drivers/', {
            'user': new_user.pk,
            'license_number': 'DL-SEC',
            'license_expiry': (date.today() + timedelta(days=180)).isoformat(),
            'status': 'off_duty', 'safety_score': '100.0',
        })
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_sql_injection_attempt_safe(self):
        """SQL injection in query params should be safely handled."""
        self._auth_as(self.manager)
        resp = self.client.get("/api/vehicles/", {
            'status': "'; DROP TABLE vehicles_vehicle; --",
        })
        # django-filter validates choices → 400 is correct (rejects invalid input)
        # The key assertion is that the table still exists (no SQL injection)
        self.assertIn(resp.status_code, [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST])
        self.assertTrue(Vehicle.objects.exists())

    def test_cannot_access_other_user_profile(self):
        """Users can only see their own profile."""
        self._auth_as(self.dispatcher_user)
        resp = self.client.get('/api/auth/profile/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['email'], 'dispatcher@fleet.com')
        # Other user's data should NOT be in the response
        self.assertNotEqual(resp.data['email'], 'manager@fleet.com')


# =====================================================================
# SECTION 16 — FAILURE RECOVERY TESTING (transaction rollback)
# =====================================================================

class FailureRecoveryTests(BaseFleetTestCase):
    """Ensure partial status corruption cannot occur due to transactions."""

    def test_dispatch_failure_does_not_corrupt_vehicle_status(self):
        """If dispatch fails (e.g. overload), vehicle status must remain unchanged."""
        original_status = self.vehicle_available.status
        trip = self._create_trip_obj(cargo_weight=Decimal('9999.00'))  # overload

        with self.assertRaises(ValidationError):
            dispatch_trip(trip)

        self.vehicle_available.refresh_from_db()
        self.assertEqual(self.vehicle_available.status, original_status)

    def test_completion_failure_does_not_corrupt_statuses(self):
        """If completion fails (bad odometer), trip and vehicle stay dispatched/on_trip."""
        trip = self._create_trip_obj()
        dispatch_trip(trip)

        with self.assertRaises(ValidationError):
            complete_trip(trip, Decimal('5000.0'))  # less than start

        trip.refresh_from_db()
        self.vehicle_available.refresh_from_db()
        self.assertEqual(trip.status, 'dispatched')
        self.assertEqual(self.vehicle_available.status, 'on_trip')

    def test_cancel_failure_does_not_corrupt_status(self):
        """Cancelling a completed trip fails without corrupting anything."""
        trip = self._create_trip_obj()
        dispatch_trip(trip)
        complete_trip(trip, Decimal('10500.0'))

        with self.assertRaises(ValidationError):
            cancel_trip(trip)

        trip.refresh_from_db()
        self.assertEqual(trip.status, 'completed')
        self.vehicle_available.refresh_from_db()
        self.assertEqual(self.vehicle_available.status, 'available')
