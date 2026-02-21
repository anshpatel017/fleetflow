// ── Mock Data for FleetFlow Dashboard ──

export const mockVehicles = [
    { id: 1, licensePlate: 'TRK-001', model: 'Volvo FH16', type: 'Truck', capacity: 25000, status: 'available', odometer: 145200, acquisitionCost: 85000 },
    { id: 2, licensePlate: 'TRK-002', model: 'Scania R450', type: 'Truck', capacity: 22000, status: 'on_trip', odometer: 98700, acquisitionCost: 78000 },
    { id: 3, licensePlate: 'VAN-003', model: 'Mercedes Sprinter', type: 'Van', capacity: 3500, status: 'available', odometer: 67300, acquisitionCost: 42000 },
    { id: 4, licensePlate: 'TRK-004', model: 'MAN TGX', type: 'Truck', capacity: 28000, status: 'in_shop', odometer: 210400, acquisitionCost: 92000 },
    { id: 5, licensePlate: 'PKP-005', model: 'Ford F-150', type: 'Pickup', capacity: 1200, status: 'available', odometer: 34500, acquisitionCost: 35000 },
    { id: 6, licensePlate: 'TRK-006', model: 'DAF XF', type: 'Truck', capacity: 24000, status: 'on_trip', odometer: 178900, acquisitionCost: 88000 },
    { id: 7, licensePlate: 'VAN-007', model: 'Iveco Daily', type: 'Van', capacity: 4000, status: 'available', odometer: 52100, acquisitionCost: 38000 },
    { id: 8, licensePlate: 'TRK-008', model: 'Kenworth T680', type: 'Truck', capacity: 30000, status: 'available', odometer: 125600, acquisitionCost: 95000 },
    { id: 9, licensePlate: 'TRK-009', model: 'Peterbilt 579', type: 'Truck', capacity: 27000, status: 'out_of_service', odometer: 285000, acquisitionCost: 82000 },
    { id: 10, licensePlate: 'VAN-010', model: 'Renault Master', type: 'Van', capacity: 3800, status: 'on_trip', odometer: 71400, acquisitionCost: 40000 },
];

export const mockDrivers = [
    { id: 1, name: 'James Okonkwo', initials: 'JO', licenseNo: 'DL-2024-001', role: 'Long Haul', safetyScore: 92, licenseExpiry: '2026-08-15', status: 'on_duty', phone: '+233-555-0101' },
    { id: 2, name: 'Amina Traore', initials: 'AT', licenseNo: 'DL-2024-002', role: 'City Routes', safetyScore: 87, licenseExpiry: '2026-03-10', status: 'on_duty', phone: '+233-555-0102' },
    { id: 3, name: 'John Mensah', initials: 'JM', licenseNo: 'DL-2024-003', role: 'Long Haul', safetyScore: 54, licenseExpiry: '2026-05-20', status: 'on_duty', phone: '+233-555-0103' },
    { id: 4, name: 'Fatima Diallo', initials: 'FD', licenseNo: 'DL-2024-004', role: 'Delivery', safetyScore: 76, licenseExpiry: '2026-12-01', status: 'off_duty', phone: '+233-555-0104' },
    { id: 5, name: 'Kwame Asante', initials: 'KA', licenseNo: 'DL-2024-005', role: 'Long Haul', safetyScore: 95, licenseExpiry: '2027-01-30', status: 'on_duty', phone: '+233-555-0105' },
    { id: 6, name: 'Grace Adebayo', initials: 'GA', licenseNo: 'DL-2024-006', role: 'City Routes', safetyScore: 82, licenseExpiry: '2026-11-14', status: 'on_duty', phone: '+233-555-0106' },
    { id: 7, name: 'Samuel Nkrumah', initials: 'SN', licenseNo: 'DL-2024-007', role: 'Delivery', safetyScore: 45, licenseExpiry: '2026-04-05', status: 'suspended', phone: '+233-555-0107' },
    { id: 8, name: 'Leila Bah', initials: 'LB', licenseNo: 'DL-2024-008', role: 'Long Haul', safetyScore: 89, licenseExpiry: '2027-06-22', status: 'on_duty', phone: '+233-555-0108' },
    { id: 9, name: 'David Owusu', initials: 'DO', licenseNo: 'DL-2024-009', role: 'City Routes', safetyScore: 71, licenseExpiry: '2026-07-18', status: 'off_duty', phone: '+233-555-0109' },
];

export const mockTrips = [
    { id: 'TRP-001', vehicleId: 2, vehicle: 'TRK-002', driverId: 1, driver: 'James Okonkwo', cargo: 18500, origin: 'Accra Warehouse', destination: 'Kumasi Depot', status: 'dispatched', fuelEst: 925, date: '2026-02-21' },
    { id: 'TRP-002', vehicleId: 6, vehicle: 'TRK-006', driverId: 5, driver: 'Kwame Asante', cargo: 21000, origin: 'Tema Port', destination: 'Tamale Hub', status: 'on_way', fuelEst: 1050, date: '2026-02-20' },
    { id: 'TRP-003', vehicleId: 10, vehicle: 'VAN-010', driverId: 2, driver: 'Amina Traore', cargo: 2800, origin: 'Accra Central', destination: 'Cape Coast', status: 'on_way', fuelEst: 140, date: '2026-02-20' },
    { id: 'TRP-004', vehicleId: 1, vehicle: 'TRK-001', driverId: 6, driver: 'Grace Adebayo', cargo: 15000, origin: 'Kumasi Depot', destination: 'Sunyani Market', status: 'completed', fuelEst: 750, date: '2026-02-19' },
    { id: 'TRP-005', vehicleId: 3, vehicle: 'VAN-003', driverId: 8, driver: 'Leila Bah', cargo: 3200, origin: 'Accra Warehouse', destination: 'Tema Port', status: 'completed', fuelEst: 160, date: '2026-02-18' },
    { id: 'TRP-006', vehicleId: 7, vehicle: 'VAN-007', driverId: 4, driver: 'Fatima Diallo', cargo: 3500, origin: 'Takoradi', destination: 'Accra Central', status: 'cancelled', fuelEst: 175, date: '2026-02-17' },
    { id: 'TRP-007', vehicleId: 8, vehicle: 'TRK-008', driverId: 9, driver: 'David Owusu', cargo: 26000, origin: 'Tema Port', destination: 'Ouagadougou', status: 'completed', fuelEst: 1300, date: '2026-02-16' },
];

export const mockAlerts = [
    { id: 1, type: 'danger', icon: '🔴', message: 'Vehicle TRK-009 license expires in 3 days', time: '2 hours ago' },
    { id: 2, type: 'warning', icon: '🟡', message: 'Driver John Mensah safety score below threshold (54/100)', time: '5 hours ago' },
    { id: 3, type: 'info', icon: '🔵', message: 'Scheduled maintenance for TRK-004 starts tomorrow', time: '1 day ago' },
];

export const fuelCostData = [
    { month: 'Sep', cost: 11200 },
    { month: 'Oct', cost: 13800 },
    { month: 'Nov', cost: 12400 },
    { month: 'Dec', cost: 15100 },
    { month: 'Jan', cost: 13600 },
    { month: 'Feb', cost: 14200 },
];

export const maintenanceVsFuelData = [
    { month: 'Sep', fuel: 11200, maintenance: 4500 },
    { month: 'Oct', fuel: 13800, maintenance: 6200 },
    { month: 'Nov', fuel: 12400, maintenance: 3800 },
    { month: 'Dec', fuel: 15100, maintenance: 7100 },
    { month: 'Jan', fuel: 13600, maintenance: 5400 },
    { month: 'Feb', fuel: 14200, maintenance: 4900 },
];

export const expenseBreakdown = [
    { name: 'Fuel', value: 80300, color: '#D4500A' },
    { name: 'Maintenance', value: 31900, color: '#3B9FD4' },
    { name: 'Insurance', value: 18500, color: '#1A6EA8' },
    { name: 'Tolls & Fees', value: 7200, color: '#5C3A20' },
    { name: 'Other', value: 4100, color: '#B03A06' },
];

export const topExpensiveTrips = [
    { id: 'TRP-007', vehicle: 'TRK-008', driver: 'David Owusu', route: 'Tema Port → Ouagadougou', totalCost: 2850, fuelCost: 1300, distance: 1120 },
    { id: 'TRP-002', vehicle: 'TRK-006', driver: 'Kwame Asante', route: 'Tema Port → Tamale Hub', totalCost: 2200, fuelCost: 1050, distance: 620 },
    { id: 'TRP-001', vehicle: 'TRK-002', driver: 'James Okonkwo', route: 'Accra → Kumasi Depot', totalCost: 1800, fuelCost: 925, distance: 270 },
    { id: 'TRP-004', vehicle: 'TRK-001', driver: 'Grace Adebayo', route: 'Kumasi → Sunyani Market', totalCost: 1500, fuelCost: 750, distance: 130 },
    { id: 'TRP-006', vehicle: 'VAN-007', driver: 'Fatima Diallo', route: 'Takoradi → Accra Central', totalCost: 980, fuelCost: 175, distance: 230 },
];
