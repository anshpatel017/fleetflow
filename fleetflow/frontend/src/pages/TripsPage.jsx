import { useState, useRef, useEffect } from 'react';
import StatusPill from '../components/StatusPill';
import Modal from '../components/Modal';
import SlideDrawer from '../components/SlideDrawer';
import Toast from '../components/Toast';
import { mockTrips, mockVehicles, mockExpenses } from '../data/mockData';
import { getOnDutyDrivers } from '../api/drivers';

const TABS = ['all', 'draft', 'dispatched', 'on_way', 'completed', 'cancelled'];
const TAB_LABELS = { all: 'All', draft: 'Draft', dispatched: 'Dispatched', on_way: 'On Way', completed: 'Completed', cancelled: 'Cancelled' };

// Status transition map
const STATUS_ACTIONS = {
    draft: [
        { label: 'Dispatch', next: 'dispatched' },
        { label: 'Cancel', next: 'cancelled' },
    ],
    dispatched: [
        { label: 'Mark On Way', next: 'on_way' },
        { label: 'Cancel', next: 'cancelled' },
    ],
    on_way: [
        { label: 'Mark Completed', next: 'completed' },
        { label: 'Cancel', next: 'cancelled' },
    ],
};

function isExpiringSoon(dateStr) {
    if (!dateStr) return false;
    const expiry = new Date(dateStr);
    const now = new Date();
    const diff = (expiry - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
}

export default function TripsPage() {
    const [trips, setTrips] = useState(mockTrips);
    const [tab, setTab] = useState('all');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ vehicleId: '', driverId: '', cargo: '', origin: '', destination: '', notes: '' });
    const [cargoError, setCargoError] = useState('');

    // Status dropdown
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRef = useRef(null);

    // Slide drawer for trip detail
    const [detailTrip, setDetailTrip] = useState(null);

    // Toast
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
    const showToast = (message, type = 'success') => setToast({ visible: true, message, type });

    // Dynamic driver state
    const [onDutyDrivers, setOnDutyDrivers] = useState([]);
    const [driversLoading, setDriversLoading] = useState(false);

    const availableVehicles = mockVehicles.filter(v => v.status === 'available');

    // Fetch on-duty drivers from API when modal opens
    useEffect(() => {
        if (!showModal) return;
        let cancelled = false;
        setDriversLoading(true);
        getOnDutyDrivers()
            .then(data => {
                if (!cancelled) setOnDutyDrivers(data);
            })
            .catch(() => {
                if (!cancelled) showToast('Failed to load drivers', 'error');
            })
            .finally(() => {
                if (!cancelled) setDriversLoading(false);
            });
        return () => { cancelled = true; };
    }, [showModal]);

    const counts = {};
    TABS.forEach(t => { counts[t] = t === 'all' ? trips.length : trips.filter(tr => tr.status === t).length; });

    const filtered = tab === 'all' ? trips : trips.filter(t => t.status === tab);

    const selectedVehicle = availableVehicles.find(v => v.id === Number(form.vehicleId));
    const fuelEstimate = form.cargo ? (Number(form.cargo) * 0.05).toFixed(2) : '0.00';

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── Cargo validation ──
    const handleCargoChange = (val) => {
        setForm(f => ({ ...f, cargo: val }));
        if (selectedVehicle && Number(val) > selectedVehicle.capacity) {
            setCargoError(`⚠️ Load too heavy! Max capacity for this vehicle is ${selectedVehicle.capacity.toLocaleString()} kg`);
        } else {
            setCargoError('');
        }
    };

    // Also re-validate when vehicle changes
    const handleVehicleChange = (val) => {
        setForm(f => ({ ...f, vehicleId: val }));
        const v = availableVehicles.find(veh => veh.id === Number(val));
        if (v && form.cargo && Number(form.cargo) > v.capacity) {
            setCargoError(`⚠️ Load too heavy! Max capacity for this vehicle is ${v.capacity.toLocaleString()} kg`);
        } else {
            setCargoError('');
        }
    };

    // ── Submit trip ──
    const handleSubmit = (asDraft) => {
        const vehicle = availableVehicles.find(v => v.id === Number(form.vehicleId));
        const driver = onDutyDrivers.find(d => d.id === Number(form.driverId));
        if (!vehicle || !driver || !form.origin || !form.destination || !form.cargo) return;

        const trip = {
            id: `TRP-${String(trips.length + 1).padStart(3, '0')}`,
            vehicleId: vehicle.id,
            vehicle: vehicle.plate,
            driverId: driver.id,
            driver: driver.user_full_name,
            cargo: Number(form.cargo),
            origin: form.origin,
            destination: form.destination,
            status: asDraft ? 'draft' : 'dispatched',
            fuelEst: Number(fuelEstimate),
            date: new Date().toISOString().split('T')[0],
            notes: form.notes,
        };
        setTrips(prev => [trip, ...prev]);
        resetForm();
        showToast(asDraft ? 'Trip saved as draft' : 'Trip dispatched successfully');
    };

    const resetForm = () => {
        setForm({ vehicleId: '', driverId: '', cargo: '', origin: '', destination: '', notes: '' });
        setCargoError('');
        setShowModal(false);
    };

    // ── Status update ──
    const updateStatus = (tripId, nextStatus) => {
        setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: nextStatus } : t));
        setOpenDropdownId(null);
        showToast(`Trip ${tripId} → ${nextStatus.replace('_', ' ').toUpperCase()}`);
    };

    const isFormValid = form.vehicleId && form.driverId && form.cargo && form.origin && form.destination && !cargoError && Number(form.cargo) > 0;

    // Trip linked expenses for detail panel
    const getLinkedExpenses = (tripId) => mockExpenses.filter(e => e.tripId === tripId);

    return (
        <div className="flex flex-col gap-5 fade-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-xl font-bold tracking-tight" style={{ color: '#1C1C1E' }}>Trip Dispatcher</h2>
                <button onClick={() => setShowModal(true)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer transition-all hover:scale-105 border-none whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                    + Create Trip
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2">
                {TABS.map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className="px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all border-none"
                        style={{
                            background: tab === t ? '#D4500A' : '#F4F2EE',
                            color: tab === t ? '#FFFFFF' : '#1C1C1E',
                        }}>
                        {TAB_LABELS[t]} ({counts[t]})
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-2xl shadow-sm overflow-hidden"
                style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead>
                            <tr>
                                {['Trip ID', 'Vehicle', 'Driver', 'Cargo (kg)', 'Route', 'Est. Fuel', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-[10px] font-bold uppercase tracking-wider px-4 py-3.5"
                                        style={{ color: 'rgba(28,28,30,0.35)', borderBottom: '1px solid rgba(28,28,30,0.06)' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(trip => {
                                const actions = STATUS_ACTIONS[trip.status];
                                return (
                                    <tr key={trip.id} className="transition-colors"
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,159,212,0.03)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td className="px-4 py-3.5 text-xs font-bold" style={{ color: '#1A6EA8' }}>{trip.id}</td>
                                        <td className="px-4 py-3.5 text-xs font-mono" style={{ color: 'rgba(28,28,30,0.6)' }}>{trip.vehicle}</td>
                                        <td className="px-4 py-3.5 text-xs font-medium" style={{ color: '#1C1C1E' }}>{trip.driver}</td>
                                        <td className="px-4 py-3.5 text-xs font-mono" style={{ color: 'rgba(28,28,30,0.6)' }}>{trip.cargo.toLocaleString()}</td>
                                        <td className="px-4 py-3.5 text-xs" style={{ color: 'rgba(28,28,30,0.6)' }}>
                                            {trip.origin} → {trip.destination}
                                        </td>
                                        <td className="px-4 py-3.5 text-xs font-semibold" style={{ color: '#D4500A' }}>
                                            ${trip.fuelEst.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3.5"><StatusPill status={trip.status} /></td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2 relative" ref={openDropdownId === trip.id ? dropdownRef : null}>
                                                {/* Update Status dropdown */}
                                                {actions ? (
                                                    <div className="relative">
                                                        <button onClick={() => setOpenDropdownId(openDropdownId === trip.id ? null : trip.id)}
                                                            className="text-[10px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer bg-transparent border-none flex items-center gap-1"
                                                            style={{ color: '#1A6EA8', background: 'rgba(26,110,168,0.08)' }}>
                                                            ↻ Status ▾
                                                        </button>
                                                        {openDropdownId === trip.id && (
                                                            <div className="absolute right-0 top-full mt-1 z-20 rounded-xl shadow-lg overflow-hidden min-w-[140px]"
                                                                style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.1)' }}>
                                                                {actions.map(a => (
                                                                    <button key={a.next}
                                                                        onClick={() => updateStatus(trip.id, a.next)}
                                                                        className="w-full text-left px-4 py-2.5 text-xs font-medium cursor-pointer border-none bg-transparent transition-colors"
                                                                        style={{ color: a.next === 'cancelled' ? '#B03A06' : '#1C1C1E' }}
                                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(28,28,30,0.04)'}
                                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                                        {a.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] px-3 py-1.5" style={{ color: 'rgba(28,28,30,0.25)' }}>—</span>
                                                )}
                                                {/* View Details */}
                                                <button onClick={() => setDetailTrip(trip)}
                                                    className="text-[10px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer bg-transparent border-none"
                                                    style={{ color: '#3B9FD4', background: 'rgba(59,159,212,0.08)' }}>
                                                    👁 Details
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
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

            {/* ── Create Trip Modal ── */}
            <Modal isOpen={showModal} onClose={resetForm} title="Create New Trip" width="max-w-xl">
                <form onSubmit={e => { e.preventDefault(); handleSubmit(false); }} className="flex flex-col gap-4">
                    {/* Vehicle */}
                    <div>
                        <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                            style={{ color: 'rgba(244,242,238,0.5)' }}>Vehicle (Available only)</label>
                        <select value={form.vehicleId} required
                            onChange={e => handleVehicleChange(e.target.value)}
                            className="fleet-input cursor-pointer">
                            <option value="" style={{ background: '#1C1C1E', color: '#F4F2EE' }}>Select a vehicle…</option>
                            {availableVehicles.map(v => (
                                <option key={v.id} value={v.id} style={{ background: '#1C1C1E', color: '#F4F2EE' }}>
                                    {v.plate} — {v.model} ({v.capacity.toLocaleString()} kg)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Driver */}
                    <div>
                        <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                            style={{ color: 'rgba(244,242,238,0.5)' }}>Driver (On Duty only)</label>
                        <select value={form.driverId} required
                            onChange={e => setForm(f => ({ ...f, driverId: e.target.value }))}
                            className="fleet-input cursor-pointer"
                            disabled={driversLoading}>
                            <option value="" style={{ background: '#1C1C1E', color: '#F4F2EE' }}>
                                {driversLoading ? 'Loading drivers…' : 'Select a driver…'}
                            </option>
                            {onDutyDrivers.map(d => {
                                const expiring = isExpiringSoon(d.license_expiry);
                                return (
                                    <option key={d.id} value={d.id} style={{ background: '#1C1C1E', color: expiring ? '#D4500A' : '#F4F2EE' }}>
                                        {d.user_full_name} — Lic: {d.license_number} (exp {d.license_expiry}){expiring ? ' ⚠ EXPIRING' : ''}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Cargo Weight */}
                    <div>
                        <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                            style={{ color: 'rgba(244,242,238,0.5)' }}>Cargo Weight (kg)</label>
                        <input type="number" placeholder="e.g. 3200" required min="1"
                            value={form.cargo}
                            onChange={e => handleCargoChange(e.target.value)}
                            className="fleet-input"
                            style={cargoError ? { borderColor: '#B03A06' } : {}} />
                        {cargoError && (
                            <p className="text-xs mt-1.5 font-semibold" style={{ color: '#B03A06' }}>{cargoError}</p>
                        )}
                    </div>

                    {/* Origin + Destination */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>Origin</label>
                            <input type="text" placeholder="Accra Warehouse" required
                                value={form.origin}
                                onChange={e => setForm(f => ({ ...f, origin: e.target.value }))}
                                className="fleet-input" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>Destination</label>
                            <input type="text" placeholder="Kumasi Depot" required
                                value={form.destination}
                                onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
                                className="fleet-input" />
                        </div>
                    </div>

                    {/* Fuel Est (read-only) */}
                    <div className="flex items-center justify-between p-4 rounded-xl"
                        style={{ background: 'rgba(212,80,10,0.08)', border: '1px solid rgba(212,80,10,0.15)' }}>
                        <span className="text-xs font-semibold" style={{ color: 'rgba(244,242,238,0.5)' }}>Estimated Fuel Cost</span>
                        <span className="text-lg font-black" style={{ color: '#D4500A' }}>${fuelEstimate}</span>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                            style={{ color: 'rgba(244,242,238,0.5)' }}>Notes (optional)</label>
                        <textarea placeholder="Any additional notes…" rows={2}
                            value={form.notes}
                            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                            className="fleet-input" style={{ resize: 'vertical', minHeight: 56, fontFamily: 'inherit' }} />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-2">
                        <button type="button" onClick={resetForm}
                            className="py-3 px-4 rounded-xl text-sm font-semibold cursor-pointer border-none"
                            style={{ background: 'rgba(244,242,238,0.08)', color: 'rgba(244,242,238,0.5)' }}>
                            Cancel
                        </button>
                        <button type="button" disabled={!isFormValid}
                            onClick={() => handleSubmit(true)}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ background: 'transparent', border: '1.5px solid rgba(212,80,10,0.5)', color: '#D4500A' }}>
                            Save as Draft
                        </button>
                        <button type="submit" disabled={!isFormValid}
                            className="flex-1 py-3 rounded-xl text-sm font-bold text-white cursor-pointer border-none transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                            🚀 Dispatch Trip
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── Trip Detail Slide Drawer ── */}
            <SlideDrawer isOpen={!!detailTrip} onClose={() => setDetailTrip(null)}
                title={detailTrip ? `Trip ${detailTrip.id}` : ''}>
                {detailTrip && (
                    <div className="flex flex-col gap-5">
                        {/* Status */}
                        <div className="flex items-center gap-3">
                            <StatusPill status={detailTrip.status} />
                            <span className="text-xs" style={{ color: 'rgba(28,28,30,0.4)' }}>{detailTrip.date}</span>
                        </div>

                        {/* Detail fields */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Vehicle', value: detailTrip.vehicle },
                                { label: 'Driver', value: detailTrip.driver },
                                { label: 'Cargo', value: `${detailTrip.cargo.toLocaleString()} kg` },
                                { label: 'Est. Fuel', value: `$${detailTrip.fuelEst.toLocaleString()}` },
                            ].map(f => (
                                <div key={f.label}>
                                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(28,28,30,0.35)' }}>{f.label}</p>
                                    <p className="text-sm font-semibold" style={{ color: '#1C1C1E' }}>{f.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Route */}
                        <div className="p-4 rounded-xl" style={{ background: 'rgba(59,159,212,0.05)', border: '1px solid rgba(59,159,212,0.1)' }}>
                            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(28,28,30,0.35)' }}>Route</p>
                            <p className="text-sm font-semibold" style={{ color: '#1C1C1E' }}>{detailTrip.origin} → {detailTrip.destination}</p>
                        </div>

                        {/* Notes */}
                        {detailTrip.notes && (
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(28,28,30,0.35)' }}>Notes</p>
                                <p className="text-xs leading-relaxed" style={{ color: 'rgba(28,28,30,0.6)' }}>{detailTrip.notes}</p>
                            </div>
                        )}

                        {/* Linked Expenses */}
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(28,28,30,0.35)' }}>Linked Expenses</p>
                            {(() => {
                                const linked = getLinkedExpenses(detailTrip.id);
                                if (linked.length === 0) return (
                                    <p className="text-xs py-4 text-center" style={{ color: 'rgba(28,28,30,0.25)' }}>No expenses logged</p>
                                );
                                return (
                                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(28,28,30,0.08)' }}>
                                        <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                                            <thead>
                                                <tr>
                                                    {['Date', 'Fuel (L)', 'Fuel $', 'Misc $', 'Total'].map(h => (
                                                        <th key={h} className="text-[9px] font-bold uppercase tracking-wider px-3 py-2"
                                                            style={{ color: 'rgba(28,28,30,0.3)', borderBottom: '1px solid rgba(28,28,30,0.06)' }}>{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {linked.map(ex => (
                                                    <tr key={ex.id}>
                                                        <td className="px-3 py-2 text-[11px]" style={{ color: 'rgba(28,28,30,0.5)' }}>{ex.date}</td>
                                                        <td className="px-3 py-2 text-[11px] font-mono" style={{ color: 'rgba(28,28,30,0.6)' }}>{ex.fuelL}</td>
                                                        <td className="px-3 py-2 text-[11px] font-mono" style={{ color: '#D4500A' }}>${ex.fuelCost}</td>
                                                        <td className="px-3 py-2 text-[11px] font-mono" style={{ color: 'rgba(28,28,30,0.6)' }}>${ex.misc}</td>
                                                        <td className="px-3 py-2 text-[11px] font-bold" style={{ color: '#1C1C1E' }}>${(ex.fuelCost + ex.misc).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </SlideDrawer>

            {/* Toast */}
            <Toast message={toast.message} type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))} />
        </div>
    );
}
