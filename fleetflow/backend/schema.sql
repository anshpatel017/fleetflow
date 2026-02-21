-- FleetFlow: Complete PostgreSQL Database Schema
-- Prepared by: Antigravity
-- Date: February 2026

BEGIN;

-- 0. Reset Schema
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- 0. Enable Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create ENUM Types
CREATE TYPE user_role AS ENUM ('manager', 'dispatcher', 'safety_officer', 'analyst');
CREATE TYPE vehicle_type_enum AS ENUM ('truck', 'van', 'bike');
CREATE TYPE vehicle_status_enum AS ENUM ('available', 'on_trip', 'in_shop', 'retired');
CREATE TYPE driver_status_enum AS ENUM ('on_duty', 'off_duty', 'on_trip', 'suspended');
CREATE TYPE trip_status_enum AS ENUM ('draft', 'dispatched', 'completed', 'cancelled');
CREATE TYPE license_category_enum AS ENUM ('truck', 'van', 'bike', 'all');
CREATE TYPE service_type_enum AS ENUM ('oil_change', 'tire_change', 'brake_service', 'engine_repair', 'inspection', 'other');
CREATE TYPE maintenance_status_enum AS ENUM ('in_progress', 'completed');

-- 2. Create Tables

-- 2.1 Users Table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- 2.2 Vehicles Table
CREATE TABLE vehicles (
    vehicle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    name_model VARCHAR(100) NOT NULL,
    vehicle_type vehicle_type_enum NOT NULL,
    max_capacity_kg DECIMAL(10,2) NOT NULL CHECK (max_capacity_kg > 0),
    odometer_km DECIMAL(10,2) DEFAULT 0 CHECK (odometer_km >= 0),
    status vehicle_status_enum DEFAULT 'available',
    region VARCHAR(100),
    acquisition_cost DECIMAL(12,2),
    is_retired BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2.3 Drivers Table
CREATE TABLE drivers (
    driver_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_category license_category_enum NOT NULL,
    license_expiry DATE NOT NULL,
    status driver_status_enum DEFAULT 'on_duty',
    safety_score DECIMAL(4,2) CHECK (safety_score IS NULL OR (safety_score >= 0 AND safety_score <= 100)),
    trips_completed INT DEFAULT 0,
    trips_cancelled INT DEFAULT 0,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2.4 Trips Table
CREATE TABLE trips (
    trip_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id),
    driver_id UUID NOT NULL REFERENCES drivers(driver_id),
    created_by UUID REFERENCES users(user_id),
    origin VARCHAR(200) NOT NULL,
    destination VARCHAR(200) NOT NULL,
    cargo_weight_kg DECIMAL(10,2) NOT NULL CHECK (cargo_weight_kg > 0),
    cargo_description TEXT,
    status trip_status_enum DEFAULT 'draft',
    scheduled_at TIMESTAMP,
    dispatched_at TIMESTAMP,
    completed_at TIMESTAMP,
    odometer_start DECIMAL(10,2),
    odometer_end DECIMAL(10,2),
    distance_km DECIMAL(10,2),
    revenue DECIMAL(12,2),
    notes TEXT
);

-- 2.5 Maintenance Logs Table
CREATE TABLE maintenance_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id),
    logged_by UUID REFERENCES users(user_id),
    service_type service_type_enum NOT NULL,
    description TEXT NOT NULL,
    service_date DATE NOT NULL,
    cost DECIMAL(10,2),
    odometer_at_service DECIMAL(10,2),
    status maintenance_status_enum DEFAULT 'in_progress',
    completed_date DATE,
    next_service_km DECIMAL(10,2)
);

-- 2.6 Fuel Logs Table
CREATE TABLE fuel_logs (
    fuel_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id),
    trip_id UUID REFERENCES trips(trip_id),
    logged_by UUID REFERENCES users(user_id),
    date DATE NOT NULL,
    liters DECIMAL(8,2) NOT NULL CHECK (liters > 0),
    cost_per_liter DECIMAL(6,2) NOT NULL CHECK (cost_per_liter > 0),
    total_cost DECIMAL(10,2) NOT NULL,
    odometer_at_fill DECIMAL(10,2),
    station_name VARCHAR(100)
);

-- 3. Create Indexes
CREATE INDEX idx_trips_vehicle ON trips(vehicle_id);
CREATE INDEX idx_trips_driver ON trips(driver_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_composite_v ON trips(vehicle_id, status);
CREATE INDEX idx_trips_composite_d ON trips(driver_id, status);

CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_drivers_status ON drivers(status);

CREATE INDEX idx_maintenance_vehicle ON maintenance_logs(vehicle_id);
CREATE INDEX idx_fuel_vehicle ON fuel_logs(vehicle_id);
CREATE INDEX idx_fuel_trip ON fuel_logs(trip_id);

-- 4. Create Trigger Functions

-- Trigger 1 & 2: Maintenance Status Handling
CREATE OR REPLACE FUNCTION fn_handle_maintenance_status()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' AND NEW.status = 'in_progress') THEN
        UPDATE vehicles SET status = 'in_shop' WHERE vehicle_id = NEW.vehicle_id;
    ELSIF (TG_OP = 'UPDATE' AND NEW.status = 'completed' AND OLD.status != 'completed') THEN
        UPDATE vehicles SET status = 'available' WHERE vehicle_id = NEW.vehicle_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger 3: Trip Dispatch
CREATE OR REPLACE FUNCTION fn_handle_trip_dispatch()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.status = 'dispatched' AND (OLD.status IS NULL OR OLD.status != 'dispatched')) THEN
        UPDATE vehicles SET status = 'on_trip' WHERE vehicle_id = NEW.vehicle_id;
        UPDATE drivers SET status = 'on_trip' WHERE driver_id = NEW.driver_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger 4: Trip Completion
CREATE OR REPLACE FUNCTION fn_handle_trip_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.status IN ('completed', 'cancelled') AND OLD.status = 'dispatched') THEN
        UPDATE vehicles SET status = 'available' WHERE vehicle_id = NEW.vehicle_id;
        UPDATE drivers SET status = 'on_duty' WHERE driver_id = NEW.driver_id;
        
        IF (NEW.status = 'completed' AND NEW.odometer_end IS NOT NULL) THEN
            UPDATE vehicles SET odometer_km = NEW.odometer_end WHERE vehicle_id = NEW.vehicle_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger 5: Distance Calculation
CREATE OR REPLACE FUNCTION fn_calculate_trip_distance()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.odometer_end IS NOT NULL AND NEW.odometer_start IS NOT NULL) THEN
        NEW.distance_km := NEW.odometer_end - NEW.odometer_start;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Attach Triggers

CREATE TRIGGER trg_maintenance_status
AFTER INSERT OR UPDATE ON maintenance_logs
FOR EACH ROW EXECUTE FUNCTION fn_handle_maintenance_status();

CREATE TRIGGER trg_trip_dispatch
AFTER UPDATE ON trips
FOR EACH ROW EXECUTE FUNCTION fn_handle_trip_dispatch();

CREATE TRIGGER trg_trip_completion
AFTER UPDATE ON trips
FOR EACH ROW EXECUTE FUNCTION fn_handle_trip_completion();

CREATE TRIGGER trg_trip_distance
BEFORE INSERT OR UPDATE ON trips
FOR EACH ROW EXECUTE FUNCTION fn_calculate_trip_distance();

-- 6. Create Views

-- View 1: Vehicle Financials
CREATE VIEW view_vehicle_financials AS
SELECT 
    v.vehicle_id,
    v.name_model,
    v.license_plate,
    COALESCE(SUM(f.total_cost), 0) AS total_fuel_cost,
    COALESCE(SUM(m.cost), 0) AS total_maintenance_cost,
    COALESCE(SUM(t.revenue), 0) AS total_revenue,
    COALESCE(SUM(t.distance_km), 0) AS total_distance_km,
    (COALESCE(SUM(t.distance_km), 0) / NULLIF(SUM(f.liters), 0)) AS fuel_efficiency_km_per_l,
    ((COALESCE(SUM(t.revenue), 0) - (COALESCE(SUM(f.total_cost), 0) + COALESCE(SUM(m.cost), 0))) / NULLIF(v.acquisition_cost, 0) * 100) AS roi_percent
FROM vehicles v
LEFT JOIN fuel_logs f ON v.vehicle_id = f.vehicle_id
LEFT JOIN maintenance_logs m ON v.vehicle_id = m.vehicle_id
LEFT JOIN trips t ON v.vehicle_id = t.vehicle_id AND t.status = 'completed'
GROUP BY v.vehicle_id, v.name_model, v.license_plate, v.acquisition_cost;

-- View 2: Dashboard KPIs
CREATE VIEW view_dashboard_kpis AS
SELECT
    (SELECT COUNT(*) FROM vehicles WHERE status = 'on_trip') AS active_fleet_count,
    (SELECT COUNT(*) FROM vehicles WHERE status = 'in_shop') AS maintenance_alerts,
    (SELECT COUNT(*) FROM vehicles WHERE status = 'available' AND is_retired = FALSE) AS idle_vehicles,
    ((SELECT COUNT(*)::DECIMAL FROM vehicles WHERE status = 'on_trip') / NULLIF((SELECT COUNT(*) FROM vehicles WHERE is_retired = FALSE), 0) * 100) AS utilization_rate,
    (SELECT COUNT(*) FROM trips WHERE status = 'draft') AS pending_cargo;

-- View 3: Dispatcher Vehicles Pool
CREATE VIEW view_dispatcher_vehicles AS
SELECT * FROM vehicles WHERE status = 'available' AND is_retired = FALSE;

-- View 4: Dispatcher Drivers Pool
CREATE VIEW view_dispatcher_drivers AS
SELECT * FROM drivers WHERE status = 'on_duty' AND license_expiry > CURRENT_DATE;

-- 7. Seed Data

-- 7.1 Sample Users
INSERT INTO users (name, email, password_hash, role) VALUES
('System Admin', 'admin@fleetflow.com', 'hash_here', 'manager'),
('Jane Dispatch', 'jane@fleetflow.com', 'hash_here', 'dispatcher'),
('Officer Safety', 'safety@fleetflow.com', 'hash_here', 'safety_officer'),
('Financial Analyst', 'analyst@fleetflow.com', 'hash_here', 'analyst');

-- 7.2 Sample Vehicles
INSERT INTO vehicles (license_plate, name_model, vehicle_type, max_capacity_kg, odometer_km, acquisition_cost) VALUES
('TRK-100', 'Volvo FH16', 'truck', 25000, 10500, 120000),
('VAN-200', 'Mercedes Sprinter', 'van', 3500, 15400, 45000),
('BIK-300', 'Honda Cub', 'bike', 50, 1200, 2500);

-- 7.3 Sample Drivers
INSERT INTO drivers (full_name, license_number, license_category, license_expiry, phone) VALUES
('John Driver', 'LIC-1122', 'truck', '2027-12-31', '555-0111'),
('Sarah Van', 'LIC-3344', 'van', '2026-06-30', '555-0222'),
('Mike Bike', 'LIC-5566', 'bike', '2028-01-15', '555-0333');

-- 7.4 Sample Trips
INSERT INTO trips (vehicle_id, driver_id, created_by, origin, destination, cargo_weight_kg, cargo_description)
SELECT 
    v.vehicle_id, d.driver_id, u.user_id, 'Terminal A', 'Warehouse B', 15000, 'Industrial Parts'
FROM vehicles v, drivers d, users u 
WHERE v.license_plate = 'TRK-100' AND d.license_number = 'LIC-1122' AND u.email = 'jane@fleetflow.com'
LIMIT 1;

INSERT INTO trips (vehicle_id, driver_id, created_by, origin, destination, cargo_weight_kg, cargo_description)
SELECT 
    v.vehicle_id, d.driver_id, u.user_id, 'Hub X', 'Store Y', 200, 'Electronics'
FROM vehicles v, drivers d, users u 
WHERE v.license_plate = 'VAN-200' AND d.license_number = 'LIC-3344' AND u.email = 'jane@fleetflow.com'
LIMIT 1;

COMMIT;
