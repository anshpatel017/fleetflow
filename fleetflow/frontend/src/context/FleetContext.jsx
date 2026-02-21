import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
    mockVehicles,
    mockDrivers,
    mockTrips,
    mockExpenses,
    mockMaintenanceLogs,
} from '../data/mockData';

const FleetContext = createContext(null);

export function FleetProvider({ children }) {
    const [vehicles, setVehicles] = useState(mockVehicles);
    const [drivers, setDrivers] = useState(mockDrivers);
    const [trips, setTrips] = useState(mockTrips);
    const [expenses, setExpenses] = useState(mockExpenses);
    const [maintenanceLogs, setMaintenanceLogs] = useState(mockMaintenanceLogs);

    // ═══════════════ VEHICLE ACTIONS ═══════════════
    const addVehicle = useCallback((vehicle) => {
        setVehicles(prev => [vehicle, ...prev]);
    }, []);

    const updateVehicle = useCallback((id, updates) => {
        setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    }, []);

    const removeVehicle = useCallback((id) => {
        setVehicles(prev => prev.filter(v => v.id !== id));
    }, []);

    // ═══════════════ DRIVER ACTIONS ═══════════════
    const addDriver = useCallback((driver) => {
        setDrivers(prev => [driver, ...prev]);
    }, []);

    const updateDriver = useCallback((id, updates) => {
        setDrivers(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    }, []);

    const updateDriverStatus = useCallback((id, status) => {
        setDrivers(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    }, []);

    // ═══════════════ TRIP ACTIONS ═══════════════
    const addTrip = useCallback((trip) => {
        setTrips(prev => [trip, ...prev]);

        // Side effects: mark vehicle as on_trip if dispatched, driver as on_trip
        if (trip.status === 'dispatched') {
            setVehicles(prev => prev.map(v => v.id === trip.vehicleId ? { ...v, status: 'on_trip' } : v));
            setDrivers(prev => prev.map(d => d.id === trip.driverId ? { ...d, status: 'on_trip' } : d));
        }
    }, []);

    const updateTripStatus = useCallback((tripId, nextStatus) => {
        setTrips(prev => {
            const trip = prev.find(t => t.id === tripId);
            if (!trip) return prev;

            // If dispatching from draft → mark vehicle & driver on_trip
            if (nextStatus === 'dispatched' && trip.status === 'draft') {
                setVehicles(vPrev => vPrev.map(v => v.id === trip.vehicleId ? { ...v, status: 'on_trip' } : v));
                setDrivers(dPrev => dPrev.map(d => d.id === trip.driverId ? { ...d, status: 'on_trip' } : d));
            }

            // If completing or cancelling → free vehicle & driver
            if (nextStatus === 'completed' || nextStatus === 'cancelled') {
                setVehicles(vPrev => vPrev.map(v => v.id === trip.vehicleId ? { ...v, status: 'available' } : v));
                setDrivers(dPrev => dPrev.map(d => d.id === trip.driverId ? { ...d, status: 'on_duty' } : d));
            }

            return prev.map(t => t.id === tripId ? { ...t, status: nextStatus } : t);
        });
    }, []);

    // ═══════════════ EXPENSE ACTIONS ═══════════════
    const addExpense = useCallback((expense) => {
        setExpenses(prev => [expense, ...prev]);
    }, []);

    // ═══════════════ MAINTENANCE ACTIONS ═══════════════
    const addMaintenanceLog = useCallback((log) => {
        setMaintenanceLogs(prev => [log, ...prev]);
        // Mark vehicle as in_shop
        const vehicle = mockVehicles.find(v => v.plate === log.vehicle) ||
            vehicles.find(v => v.plate === log.vehicle);  // eslint-disable-line
        if (vehicle) {
            setVehicles(prev => prev.map(v => v.plate === log.vehicle ? { ...v, status: 'in_shop' } : v));
        }
    }, []);

    const resolveMaintenanceLog = useCallback((id) => {
        setMaintenanceLogs(prev => {
            const log = prev.find(l => l.id === id);
            if (log) {
                // When resolved, mark vehicle available again
                setVehicles(vPrev => vPrev.map(v => v.plate === log.vehicle ? { ...v, status: 'available' } : v));
            }
            return prev.map(l => l.id === id ? { ...l, status: 'resolved' } : l);
        });
    }, []);

    // ═══════════════ DERIVED DATA ═══════════════
    const availableVehicles = useMemo(() => vehicles.filter(v => v.status === 'available'), [vehicles]);
    const onDutyDrivers = useMemo(() => drivers.filter(d => d.status === 'on_duty'), [drivers]);

    const value = useMemo(() => ({
        // State
        vehicles,
        drivers,
        trips,
        expenses,
        maintenanceLogs,

        // Derived
        availableVehicles,
        onDutyDrivers,

        // Vehicle actions
        addVehicle,
        updateVehicle,
        removeVehicle,

        // Driver actions
        addDriver,
        updateDriver,
        updateDriverStatus,

        // Trip actions
        addTrip,
        updateTripStatus,

        // Expense actions
        addExpense,

        // Maintenance actions
        addMaintenanceLog,
        resolveMaintenanceLog,
    }), [vehicles, drivers, trips, expenses, maintenanceLogs, availableVehicles, onDutyDrivers,
        addVehicle, updateVehicle, removeVehicle,
        addDriver, updateDriver, updateDriverStatus,
        addTrip, updateTripStatus,
        addExpense,
        addMaintenanceLog, resolveMaintenanceLog]);

    return (
        <FleetContext.Provider value={value}>
            {children}
        </FleetContext.Provider>
    );
}

export function useFleet() {
    const ctx = useContext(FleetContext);
    if (!ctx) throw new Error('useFleet must be used within FleetProvider');
    return ctx;
}
