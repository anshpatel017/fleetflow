// ── Mock Data for FleetFlow Dashboard ──

export const mockVehicles = [
    { id: 1, plate: 'GH-1234-22', model: 'Isuzu NQR', type: 'Truck', capacity: 5000, status: 'available', odometer: 45200 },
    { id: 2, plate: 'GH-5678-21', model: 'Toyota Hilux', type: 'Pickup', capacity: 1200, status: 'on_trip', odometer: 89300 },
    { id: 3, plate: 'GH-9012-23', model: 'Mercedes Sprinter', type: 'Van', capacity: 2000, status: 'in_shop', odometer: 23100 },
    { id: 4, plate: 'GH-3456-20', model: 'MAN TGX', type: 'Truck', capacity: 8000, status: 'available', odometer: 112400 },
    { id: 5, plate: 'GH-7890-22', model: 'Ford Transit', type: 'Van', capacity: 1800, status: 'on_trip', odometer: 67500 },
    { id: 6, plate: 'GH-2345-21', model: 'Volvo FH16', type: 'Truck', capacity: 12000, status: 'out_of_service', odometer: 198700 },
    { id: 7, plate: 'GH-6789-23', model: 'Mitsubishi Canter', type: 'Truck', capacity: 3500, status: 'available', odometer: 31800 },
];

export const mockDrivers = [
    { id: 1, name: 'Kwame Asante', initials: 'KA', licenseNo: 'DL-GH-00123', role: 'Long Haul', safetyScore: 88, completion: 94, complaints: 1, licenseExpiry: '2026-06-01', status: 'on_duty', phone: '+233-555-0101',
        tripHistory: [
            { id: 'TRP-001', route: 'Accra → Kumasi', date: '2026-02-21', status: 'on_way' },
            { id: 'TRP-007', route: 'Tema Port → Ho', date: '2026-02-21', status: 'draft' },
            { id: 'TRP-010', route: 'Accra → Cape Coast', date: '2026-01-28', status: 'completed' },
            { id: 'TRP-015', route: 'Tema → Takoradi', date: '2026-01-15', status: 'completed' },
            { id: 'TRP-020', route: 'Kumasi → Tamale', date: '2025-12-30', status: 'completed' },
        ],
        complaintsLog: ['Late delivery reported on TRP-020 — client notified'],
        safetyHistory: [82, 85, 84, 86, 88, 87, 89, 88],
    },
    { id: 2, name: 'Abena Mensah', initials: 'AM', licenseNo: 'DL-GH-00456', role: 'City Routes', safetyScore: 62, completion: 78, complaints: 4, licenseExpiry: '2025-02-15', status: 'off_duty', phone: '+233-555-0102',
        tripHistory: [
            { id: 'TRP-003', route: 'Accra Central → Cape Coast', date: '2026-02-20', status: 'on_way' },
            { id: 'TRP-012', route: 'Tema → Accra', date: '2026-01-22', status: 'completed' },
            { id: 'TRP-018', route: 'Ho → Kumasi', date: '2026-01-05', status: 'completed' },
            { id: 'TRP-022', route: 'Accra → Tamale', date: '2025-12-10', status: 'cancelled' },
            { id: 'TRP-025', route: 'Kumasi → Cape Coast', date: '2025-11-28', status: 'completed' },
        ],
        complaintsLog: ['Cargo damage on TRP-022', 'Excessive idling — fuel waste', 'Missed checkpoint on TRP-018', 'Speeding violation 120km/h zone'],
        safetyHistory: [70, 68, 65, 63, 64, 62, 60, 62],
    },
    { id: 3, name: 'Kofi Boateng', initials: 'KB', licenseNo: 'DL-GH-00789', role: 'Long Haul', safetyScore: 45, completion: 65, complaints: 7, licenseExpiry: '2024-12-01', status: 'suspended', phone: '+233-555-0103',
        tripHistory: [
            { id: 'TRP-009', route: 'Takoradi → Accra', date: '2026-01-18', status: 'cancelled' },
            { id: 'TRP-014', route: 'Kumasi → Tema', date: '2025-12-20', status: 'completed' },
            { id: 'TRP-019', route: 'Accra → Bolgatanga', date: '2025-12-01', status: 'completed' },
            { id: 'TRP-023', route: 'Tamale → Accra', date: '2025-11-15', status: 'cancelled' },
            { id: 'TRP-026', route: 'Tema → Kumasi', date: '2025-10-30', status: 'completed' },
        ],
        complaintsLog: ['Accident — minor collision TRP-009', 'Unauthorized route deviation', 'Harsh braking events ×12', 'Late arrival ×3', 'Failed vehicle inspection', 'Incomplete trip log TRP-023', 'Cargo mishandling report'],
        safetyHistory: [58, 55, 52, 50, 48, 46, 45, 45],
    },
    { id: 4, name: 'Fatima Diallo', initials: 'FD', licenseNo: 'DL-GH-01012', role: 'Delivery', safetyScore: 76, completion: 82, complaints: 2, licenseExpiry: '2026-12-01', status: 'off_duty', phone: '+233-555-0104',
        tripHistory: [
            { id: 'TRP-011', route: 'Accra → Sunyani', date: '2026-02-10', status: 'completed' },
            { id: 'TRP-016', route: 'Tema → Ho', date: '2026-01-20', status: 'completed' },
            { id: 'TRP-021', route: 'Kumasi → Accra', date: '2026-01-05', status: 'completed' },
            { id: 'TRP-024', route: 'Cape Coast → Tema', date: '2025-12-18', status: 'completed' },
            { id: 'TRP-027', route: 'Takoradi → Kumasi', date: '2025-11-25', status: 'cancelled' },
        ],
        complaintsLog: ['Minor delay on TRP-027', 'Fuel receipt discrepancy'],
        safetyHistory: [72, 73, 74, 75, 76, 76, 77, 76],
    },
    { id: 5, name: 'James Okonkwo', initials: 'JO', licenseNo: 'DL-GH-01345', role: 'Long Haul', safetyScore: 92, completion: 96, complaints: 0, licenseExpiry: '2027-01-30', status: 'on_trip', phone: '+233-555-0105',
        tripHistory: [
            { id: 'TRP-002', route: 'Tema Port → Tamale Hub', date: '2026-02-20', status: 'dispatched' },
            { id: 'TRP-013', route: 'Accra → Bolgatanga', date: '2026-02-05', status: 'completed' },
            { id: 'TRP-017', route: 'Kumasi → Tamale', date: '2026-01-18', status: 'completed' },
            { id: 'TRP-028', route: 'Tema → Cape Coast', date: '2025-12-28', status: 'completed' },
            { id: 'TRP-030', route: 'Accra → Kumasi', date: '2025-12-10', status: 'completed' },
        ],
        complaintsLog: [],
        safetyHistory: [90, 91, 90, 92, 91, 93, 92, 92],
    },
    { id: 6, name: 'Grace Adebayo', initials: 'GA', licenseNo: 'DL-GH-01678', role: 'City Routes', safetyScore: 82, completion: 88, complaints: 1, licenseExpiry: '2026-11-14', status: 'on_duty', phone: '+233-555-0106',
        tripHistory: [
            { id: 'TRP-004', route: 'Kumasi Depot → Sunyani', date: '2026-02-19', status: 'completed' },
            { id: 'TRP-008', route: 'Accra → Tema', date: '2026-02-12', status: 'completed' },
            { id: 'TRP-029', route: 'Kumasi → Accra', date: '2025-12-22', status: 'completed' },
            { id: 'TRP-031', route: 'Tema → Sunyani', date: '2025-12-05', status: 'completed' },
            { id: 'TRP-032', route: 'Accra → Takoradi', date: '2025-11-20', status: 'completed' },
        ],
        complaintsLog: ['Brief route deviation on TRP-031 — traffic avoidance'],
        safetyHistory: [78, 79, 80, 81, 82, 82, 83, 82],
    },
    { id: 7, name: 'Leila Bah', initials: 'LB', licenseNo: 'DL-GH-01901', role: 'Long Haul', safetyScore: 89, completion: 91, complaints: 1, licenseExpiry: '2026-03-15', status: 'on_duty', phone: '+233-555-0107',
        tripHistory: [
            { id: 'TRP-005', route: 'Accra Warehouse → Tema Port', date: '2026-02-18', status: 'completed' },
            { id: 'TRP-033', route: 'Tema → Kumasi', date: '2026-01-30', status: 'completed' },
            { id: 'TRP-034', route: 'Accra → Tamale', date: '2026-01-12', status: 'completed' },
            { id: 'TRP-035', route: 'Kumasi → Ho', date: '2025-12-28', status: 'completed' },
            { id: 'TRP-036', route: 'Tema → Bolgatanga', date: '2025-12-08', status: 'completed' },
        ],
        complaintsLog: ['Slight delay on TRP-036 — weather conditions'],
        safetyHistory: [85, 86, 87, 88, 88, 89, 89, 89],
    },
];

export const mockTrips = [
    { id: 'TRP-001', vehicleId: 1, vehicle: 'GH-1234-22', driverId: 1, driver: 'Kwame Asante', cargo: 3200, origin: 'Accra', destination: 'Kumasi', status: 'on_way', fuelEst: 160, date: '2026-02-21', notes: 'Priority delivery — perishable goods' },
    { id: 'TRP-002', vehicleId: 2, vehicle: 'GH-5678-21', driverId: 5, driver: 'James Okonkwo', cargo: 950, origin: 'Tema Port', destination: 'Tamale Hub', status: 'dispatched', fuelEst: 47.5, date: '2026-02-20', notes: '' },
    { id: 'TRP-003', vehicleId: 4, vehicle: 'GH-3456-20', driverId: 2, driver: 'Abena Mensah', cargo: 6800, origin: 'Accra Central', destination: 'Cape Coast', status: 'on_way', fuelEst: 340, date: '2026-02-20', notes: 'Construction materials' },
    { id: 'TRP-004', vehicleId: 7, vehicle: 'GH-6789-23', driverId: 6, driver: 'Grace Adebayo', cargo: 2400, origin: 'Kumasi Depot', destination: 'Sunyani Market', status: 'completed', fuelEst: 120, date: '2026-02-19', notes: '' },
    { id: 'TRP-005', vehicleId: 1, vehicle: 'GH-1234-22', driverId: 7, driver: 'Leila Bah', cargo: 4100, origin: 'Accra Warehouse', destination: 'Tema Port', status: 'completed', fuelEst: 205, date: '2026-02-18', notes: '' },
    { id: 'TRP-006', vehicleId: 4, vehicle: 'GH-3456-20', driverId: 3, driver: 'Kofi Boateng', cargo: 3500, origin: 'Takoradi', destination: 'Accra Central', status: 'cancelled', fuelEst: 175, date: '2026-02-17', notes: 'Cancelled due to road closure' },
    { id: 'TRP-007', vehicleId: 7, vehicle: 'GH-6789-23', driverId: 1, driver: 'Kwame Asante', cargo: 2900, origin: 'Tema Port', destination: 'Ho', status: 'draft', fuelEst: 145, date: '2026-02-21', notes: 'Pending approval' },
];

export const mockExpenses = [
    { id: 1, tripId: 'TRP-001', driver: 'Kwame Asante', vehicle: 'GH-1234-22', fuelL: 80, fuelCost: 160, misc: 25, date: '2026-02-21', status: 'completed' },
    { id: 2, tripId: 'TRP-004', driver: 'Grace Adebayo', vehicle: 'GH-6789-23', fuelL: 55, fuelCost: 120, misc: 0, date: '2026-02-19', status: 'completed' },
    { id: 3, tripId: 'TRP-005', driver: 'Leila Bah', vehicle: 'GH-1234-22', fuelL: 95, fuelCost: 205, misc: 40, date: '2026-02-18', status: 'completed' },
    { id: 4, tripId: 'TRP-003', driver: 'Abena Mensah', vehicle: 'GH-3456-20', fuelL: 150, fuelCost: 340, misc: 60, date: '2026-02-20', status: 'on_way' },
    { id: 5, tripId: 'TRP-002', driver: 'James Okonkwo', vehicle: 'GH-5678-21', fuelL: 22, fuelCost: 47.5, misc: 15, date: '2026-02-20', status: 'dispatched' },
    { id: 6, tripId: 'TRP-006', driver: 'Kofi Boateng', vehicle: 'GH-3456-20', fuelL: 0, fuelCost: 0, misc: 30, date: '2026-02-17', status: 'cancelled' },
];

export const mockAlerts = [
    { id: 1, type: 'danger', icon: '🔴', message: 'Vehicle TRK-009 license expires in 3 days', time: '2 hours ago' },
    { id: 2, type: 'warning', icon: '🟡', message: 'Driver John Mensah safety score below threshold (54/100)', time: '5 hours ago' },
    { id: 3, type: 'info', icon: '🔵', message: '3 maintenance logs pending resolution', time: '1 day ago' },
];

export const fuelCostData = [
    { month: 'Jan', cost: 3200 },
    { month: 'Feb', cost: 3800 },
    { month: 'Mar', cost: 3600 },
    { month: 'Apr', cost: 4100 },
    { month: 'May', cost: 3900 },
    { month: 'Jun', cost: 3500 },
    { month: 'Jul', cost: 3700 },
    { month: 'Aug', cost: 4200 },
    { month: 'Sep', cost: 3400 },
    { month: 'Oct', cost: 3100 },
    { month: 'Nov', cost: 3500 },
    { month: 'Dec', cost: 2800 },
];

export const maintenanceVsFuelData = [
    { month: 'Jan', fuel: 3200, maintenance: 1200 },
    { month: 'Feb', fuel: 3800, maintenance: 1800 },
    { month: 'Mar', fuel: 3600, maintenance: 1400 },
    { month: 'Apr', fuel: 4100, maintenance: 2200 },
    { month: 'May', fuel: 3900, maintenance: 1600 },
    { month: 'Jun', fuel: 3500, maintenance: 1900 },
    { month: 'Jul', fuel: 3700, maintenance: 1100 },
    { month: 'Aug', fuel: 4200, maintenance: 2400 },
    { month: 'Sep', fuel: 3400, maintenance: 1500 },
    { month: 'Oct', fuel: 3100, maintenance: 1300 },
    { month: 'Nov', fuel: 3500, maintenance: 1700 },
    { month: 'Dec', fuel: 2800, maintenance: 1300 },
];

export const expenseBreakdown = [
    { name: 'Fuel', value: 42800, color: '#D4500A' },
    { name: 'Maintenance', value: 18400, color: '#3B9FD4' },
    { name: 'Misc', value: 6200, color: '#1A6EA8' },
    { name: 'Driver Allowances', value: 9600, color: '#5C3A20' },
];

export const topExpensiveTrips = [
    { id: 'TRP-007', vehicle: 'GH-6789-23', driver: 'Kwame Asante', route: 'Tema Port → Ho', totalCost: 2850, fuelCost: 1300, distance: 1120 },
    { id: 'TRP-002', vehicle: 'GH-5678-21', driver: 'James Okonkwo', route: 'Tema Port → Tamale Hub', totalCost: 2200, fuelCost: 1050, distance: 620 },
    { id: 'TRP-001', vehicle: 'GH-1234-22', driver: 'Kwame Asante', route: 'Accra → Kumasi', totalCost: 1800, fuelCost: 925, distance: 270 },
    { id: 'TRP-004', vehicle: 'GH-6789-23', driver: 'Grace Adebayo', route: 'Kumasi → Sunyani Market', totalCost: 1500, fuelCost: 750, distance: 130 },
    { id: 'TRP-006', vehicle: 'GH-3456-20', driver: 'Fatima Diallo', route: 'Takoradi → Accra Central', totalCost: 980, fuelCost: 175, distance: 230 },
];

export const monthlyFinancials = [
    { month: 'Jan', revenue: 12400, fuel: 3200, maintenance: 1200, profit: 8000 },
    { month: 'Feb', revenue: 14200, fuel: 3800, maintenance: 1800, profit: 8600 },
    { month: 'Mar', revenue: 11800, fuel: 3600, maintenance: 1400, profit: 6800 },
    { month: 'Apr', revenue: 13000, fuel: 4100, maintenance: 2200, profit: 6700 },
    { month: 'May', revenue: 15600, fuel: 3900, maintenance: 1600, profit: 10100 },
    { month: 'Jun', revenue: 10200, fuel: 3500, maintenance: 1900, profit: 4800 },
    { month: 'Jul', revenue: 14800, fuel: 3700, maintenance: 1100, profit: 10000 },
    { month: 'Aug', revenue: 9800, fuel: 4200, maintenance: 2400, profit: 3200 },
    { month: 'Sep', revenue: 13500, fuel: 3400, maintenance: 1500, profit: 8600 },
    { month: 'Oct', revenue: 11000, fuel: 3100, maintenance: 1300, profit: 6600 },
    { month: 'Nov', revenue: 12200, fuel: 3500, maintenance: 1700, profit: 7000 },
    { month: 'Dec', revenue: 8600, fuel: 2800, maintenance: 1300, profit: 4500 },
];

export const mockMaintenanceLogs = [
    { id: 1, vehicle: 'GH-9012-23', issue: 'Engine overhaul', date: '2025-01-15', cost: 3200, status: 'in_shop' },
    { id: 2, vehicle: 'GH-1234-22', issue: 'Tyre replacement', date: '2025-01-10', cost: 480, status: 'resolved' },
    { id: 3, vehicle: 'GH-5678-21', issue: 'Brake pad replacement', date: '2025-02-01', cost: 620, status: 'open' },
    { id: 4, vehicle: 'GH-3456-20', issue: 'Oil change & filter', date: '2025-02-05', cost: 150, status: 'resolved' },
    { id: 5, vehicle: 'GH-7890-22', issue: 'Transmission repair', date: '2025-02-12', cost: 2800, status: 'in_shop' },
    { id: 6, vehicle: 'GH-2345-21', issue: 'Electrical system diagnostics', date: '2025-02-18', cost: 950, status: 'open' },
];
