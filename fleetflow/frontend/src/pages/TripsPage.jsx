import { useState } from 'react';
import StatusPill from '../components/StatusPill';
import Modal from '../components/Modal';
import { mockTrips, mockVehicles, mockDrivers } from '../data/mockData';

const TABS = ['all', 'dispatched', 'on_way', 'completed', 'cancelled'];
const TAB_LABELS = { all: 'All Trips', dispatched: 'Dispatched', on_way: 'On Way', completed: 'Completed', cancelled: 'Cancelled' };

export default function TripsPage() {
    const [trips, setTrips] = useState(mockTrips);
    const [tab, setTab] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [newTrip, setNewTrip] = useState({ vehicleId: '', driverId: '', cargo: '', origin: '', destination: '' });
    const [cargoWarning, setCargoWarning] = useState('');

    const availableVehicles = mockVehicles.filter(v => v.status === 'available');
    const onDutyDrivers = mockDrivers.filter(d => d.status === 'on_duty');

    const filtered = tab === 'all' ? trips : trips.filter(t => t.status === tab);

    const selectedVehicle = availableVehicles.find(v => v.id === Number(newTrip.vehicleId));
    const fuelEstimate = newTrip.cargo ? (Number(newTrip.cargo) * 0.05).toFixed(2) : '0.00';

    const handleCargoChange = (val) => {
        setNewTrip({ ...newTrip, cargo: val });
        if (selectedVehicle && Number(val) > selectedVehicle.capacity) {
            setCargoWarning(`⚠️ Exceeds vehicle capacity of ${selectedVehicle.capacity.toLocaleString()} kg`);
        } else {
            setCargoWarning('');
        }
    };

    const handleDispatch = (e) => {
        e.preventDefault();
        const vehicle = availableVehicles.find(v => v.id === Number(newTrip.vehicleId));
        const driver = onDutyDrivers.find(d => d.id === Number(newTrip.driverId));
        if (!vehicle || !driver) return;

        const trip = {
            id: `TRP-${String(trips.length + 1).padStart(3, '0')}`,
            vehicleId: vehicle.id,
            vehicle: vehicle.licensePlate,
            driverId: driver.id,
            driver: driver.name,
            cargo: Number(newTrip.cargo),
            origin: newTrip.origin,
            destination: newTrip.destination,
            status: 'dispatched',
            fuelEst: Number(fuelEstimate),
            date: new Date().toISOString().split('T')[0],
        };
        setTrips([trip, ...trips]);
        setNewTrip({ vehicleId: '', driverId: '', cargo: '', origin: '', destination: '' });
        setCargoWarning('');
        setShowModal(false);
    };

    return (
        <div className="flex flex-col gap-5 fade-up">
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                <div className="flex flex-wrap gap-2">
                    {TABS.map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className="px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all border-none"
                            style={{
                                background: tab === t ? '#1A6EA8' : '#FFFFFF',
                                color: tab === t ? '#FFFFFF' : 'rgba(28,28,30,0.6)',
                                border: tab === t ? 'none' : '1px solid rgba(28,28,30,0.1)',
                            }}>
                            {TAB_LABELS[t]}
                        </button>
                    ))}
                </div>
                <button onClick={() => setShowModal(true)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer transition-all hover:scale-105 border-none whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                    + Create Trip
                </button>
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden"
                style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead>
                            <tr>
                                {['Trip ID', 'Vehicle', 'Driver', 'Cargo', 'Origin', 'Destination', 'Status', 'Fuel Est.'].map(h => (
                                    <th key={h} className="text-[10px] font-bold uppercase tracking-wider px-4 py-3.5"
                                        style={{ color: 'rgba(28,28,30,0.35)', borderBottom: '1px solid rgba(28,28,30,0.06)' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(trip => (
                                <tr key={trip.id} className="transition-colors"
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,159,212,0.03)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td className="px-4 py-3.5 text-xs font-bold" style={{ color: '#1A6EA8' }}>{trip.id}</td>
                                    <td className="px-4 py-3.5 text-xs font-mono" style={{ color: 'rgba(28,28,30,0.6)' }}>{trip.vehicle}</td>
                                    <td className="px-4 py-3.5 text-xs font-medium" style={{ color: '#1C1C1E' }}>{trip.driver}</td>
                                    <td className="px-4 py-3.5 text-xs font-mono" style={{ color: 'rgba(28,28,30,0.6)' }}>{trip.cargo.toLocaleString()} kg</td>
                                    <td className="px-4 py-3.5 text-xs" style={{ color: 'rgba(28,28,30,0.6)' }}>{trip.origin}</td>
                                    <td className="px-4 py-3.5 text-xs" style={{ color: 'rgba(28,28,30,0.6)' }}>{trip.destination}</td>
                                    <td className="px-4 py-3.5"><StatusPill status={trip.status} /></td>
                                    <td className="px-4 py-3.5 text-xs font-semibold" style={{ color: '#D4500A' }}>${trip.fuelEst.toLocaleString()}</td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center py-12 text-sm" style={{ color: 'rgba(28,28,30,0.3)' }}>
                                        No trips found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Trip Modal */}
            <Modal isOpen={showModal} onClose={() => { setShowModal(false); setCargoWarning(''); }} title="Dispatch New Trip">
                <form onSubmit={handleDispatch} className="flex flex-col gap-4">
                    {/* Vehicle */}
                    <div>
                        <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                            style={{ color: 'rgba(244,242,238,0.5)' }}>Vehicle (Available only)</label>
                        <select value={newTrip.vehicleId} required
                            onChange={e => { setNewTrip({ ...newTrip, vehicleId: e.target.value }); setCargoWarning(''); }}
                            className="fleet-input cursor-pointer">
                            <option value="" style={{ background: '#1C1C1E', color: '#F4F2EE' }}>Select a vehicle...</option>
                            {availableVehicles.map(v => (
                                <option key={v.id} value={v.id} style={{ background: '#1C1C1E', color: '#F4F2EE' }}>
                                    {v.licensePlate} — {v.model} ({v.capacity.toLocaleString()} kg)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Driver */}
                    <div>
                        <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                            style={{ color: 'rgba(244,242,238,0.5)' }}>Driver (On Duty only)</label>
                        <select value={newTrip.driverId} required
                            onChange={e => setNewTrip({ ...newTrip, driverId: e.target.value })}
                            className="fleet-input cursor-pointer">
                            <option value="" style={{ background: '#1C1C1E', color: '#F4F2EE' }}>Select a driver...</option>
                            {onDutyDrivers.map(d => (
                                <option key={d.id} value={d.id} style={{ background: '#1C1C1E', color: '#F4F2EE' }}>
                                    {d.name} — Score: {d.safetyScore}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Cargo Weight */}
                    <div>
                        <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                            style={{ color: 'rgba(244,242,238,0.5)' }}>Cargo Weight (kg)</label>
                        <input type="number" placeholder="e.g. 18000" required
                            value={newTrip.cargo}
                            onChange={e => handleCargoChange(e.target.value)}
                            className="fleet-input"
                            style={cargoWarning ? { borderColor: '#D4500A' } : {}} />
                        {cargoWarning && (
                            <p className="text-xs mt-1.5 font-medium" style={{ color: '#D4500A' }}>{cargoWarning}</p>
                        )}
                    </div>

                    {/* Origin + Destination */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>Origin</label>
                            <input type="text" placeholder="Accra Warehouse" required
                                value={newTrip.origin}
                                onChange={e => setNewTrip({ ...newTrip, origin: e.target.value })}
                                className="fleet-input" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>Destination</label>
                            <input type="text" placeholder="Kumasi Depot" required
                                value={newTrip.destination}
                                onChange={e => setNewTrip({ ...newTrip, destination: e.target.value })}
                                className="fleet-input" />
                        </div>
                    </div>

                    {/* Fuel Estimate */}
                    <div className="flex items-center justify-between p-4 rounded-xl"
                        style={{ background: 'rgba(212,80,10,0.08)', border: '1px solid rgba(212,80,10,0.15)' }}>
                        <span className="text-xs font-semibold" style={{ color: 'rgba(244,242,238,0.5)' }}>Estimated Fuel Cost</span>
                        <span className="text-lg font-black" style={{ color: '#D4500A' }}>${fuelEstimate}</span>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 mt-2">
                        <button type="button" onClick={() => { setShowModal(false); setCargoWarning(''); }}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer border-none"
                            style={{ background: 'rgba(244,242,238,0.08)', color: 'rgba(244,242,238,0.5)' }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={!!cargoWarning}
                            className="flex-1 py-3 rounded-xl text-sm font-bold text-white cursor-pointer border-none transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                            🚀 Dispatch Trip
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
