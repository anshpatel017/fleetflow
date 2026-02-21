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
    { id: 'TRP-001', vehicleId: 1, vehicle: 'GH-1234-22', driverId: 5, driver: 'Kwame Asante', cargo: 3200, origin: 'Accra', destination: 'Kumasi', status: 'on_way', fuelEst: 160, date: '2026-02-21', notes: 'Priority delivery — perishable goods' },
    { id: 'TRP-002', vehicleId: 2, vehicle: 'GH-5678-21', driverId: 1, driver: 'James Okonkwo', cargo: 950, origin: 'Tema Port', destination: 'Tamale Hub', status: 'dispatched', fuelEst: 47.5, date: '2026-02-20', notes: '' },
    { id: 'TRP-003', vehicleId: 4, vehicle: 'GH-3456-20', driverId: 2, driver: 'Amina Traore', cargo: 6800, origin: 'Accra Central', destination: 'Cape Coast', status: 'on_way', fuelEst: 340, date: '2026-02-20', notes: 'Construction materials' },
    { id: 'TRP-004', vehicleId: 7, vehicle: 'GH-6789-23', driverId: 6, driver: 'Grace Adebayo', cargo: 2400, origin: 'Kumasi Depot', destination: 'Sunyani Market', status: 'completed', fuelEst: 120, date: '2026-02-19', notes: '' },
    { id: 'TRP-005', vehicleId: 1, vehicle: 'GH-1234-22', driverId: 8, driver: 'Leila Bah', cargo: 4100, origin: 'Accra Warehouse', destination: 'Tema Port', status: 'completed', fuelEst: 205, date: '2026-02-18', notes: '' },
    { id: 'TRP-006', vehicleId: 4, vehicle: 'GH-3456-20', driverId: 3, driver: 'John Mensah', cargo: 3500, origin: 'Takoradi', destination: 'Accra Central', status: 'cancelled', fuelEst: 175, date: '2026-02-17', notes: 'Cancelled due to road closure' },
    { id: 'TRP-007', vehicleId: 7, vehicle: 'GH-6789-23', driverId: 5, driver: 'Kwame Asante', cargo: 2900, origin: 'Tema Port', destination: 'Ho', status: 'draft', fuelEst: 145, date: '2026-02-21', notes: 'Pending approval' },
];

export const mockExpenses = [
    { id: 1, tripId: 'TRP-001', driver: 'Kwame Asante', vehicle: 'GH-1234-22', fuelL: 80, fuelCost: 160, misc: 25, date: '2026-02-21', status: 'completed' },
    { id: 2, tripId: 'TRP-004', driver: 'Grace Adebayo', vehicle: 'GH-6789-23', fuelL: 55, fuelCost: 120, misc: 0, date: '2026-02-19', status: 'completed' },
    { id: 3, tripId: 'TRP-005', driver: 'Leila Bah', vehicle: 'GH-1234-22', fuelL: 95, fuelCost: 205, misc: 40, date: '2026-02-18', status: 'completed' },
    { id: 4, tripId: 'TRP-003', driver: 'Amina Traore', vehicle: 'GH-3456-20', fuelL: 150, fuelCost: 340, misc: 60, date: '2026-02-20', status: 'on_way' },
    { id: 5, tripId: 'TRP-002', driver: 'James Okonkwo', vehicle: 'GH-5678-21', fuelL: 22, fuelCost: 47.5, misc: 15, date: '2026-02-20', status: 'dispatched' },
    { id: 6, tripId: 'TRP-006', driver: 'John Mensah', vehicle: 'GH-3456-20', fuelL: 0, fuelCost: 0, misc: 30, date: '2026-02-17', status: 'cancelled' },
];

export const mockAlerts = [
    { id: 1, type: 'danger', icon: '🔴', message: 'Vehicle TRK-009 license expires in 3 days', time: '2 hours ago' },
    { id: 2, type: 'warning', icon: '🟡', message: 'Driver John Mensah safety score below threshold (54/100)', time: '5 hours ago' },
    { id: 3, type: 'info', icon: '🔵', message: '3 maintenance logs pending resolution', time: '1 day ago' },
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

export const mockMaintenanceLogs = [
    { id: 1, vehicle: 'GH-9012-23', issue: 'Engine overhaul', date: '2025-01-15', cost: 3200, status: 'in_shop' },
    { id: 2, vehicle: 'GH-1234-22', issue: 'Tyre replacement', date: '2025-01-10', cost: 480, status: 'resolved' },
    { id: 3, vehicle: 'GH-5678-21', issue: 'Brake pad replacement', date: '2025-02-01', cost: 620, status: 'open' },
    { id: 4, vehicle: 'GH-3456-20', issue: 'Oil change & filter', date: '2025-02-05', cost: 150, status: 'resolved' },
    { id: 5, vehicle: 'GH-7890-22', issue: 'Transmission repair', date: '2025-02-12', cost: 2800, status: 'in_shop' },
    { id: 6, vehicle: 'GH-2345-21', issue: 'Electrical system diagnostics', date: '2025-02-18', cost: 950, status: 'open' },
];
