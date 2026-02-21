import { useState } from 'react';
import StatusPill from '../components/StatusPill';
import SlideDrawer from '../components/SlideDrawer';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { useFleet } from '../context/FleetContext';

const FILTERS = ['all', 'available', 'on_trip', 'in_shop', 'out_of_service'];
const FILTER_LABELS = { all: 'All', available: 'Available', on_trip: 'On Trip', in_shop: 'In Shop', out_of_service: 'Out of Service' };
const TYPES = ['Truck', 'Van', 'Pickup', 'Trailer'];

const emptyForm = { plate: '', model: '', type: 'Truck', capacity: '', odometer: '', status: 'available' };

export default function VehiclesPage() {
    const { vehicles, addVehicle, updateVehicle, removeVehicle } = useFleet();
    const [filter, setFilter] = useState('all');

    // Drawer state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formErrors, setFormErrors] = useState({});

    // Retire confirmation modal
    const [retireTarget, setRetireTarget] = useState(null);

    // Toast
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
    const showToast = (message, type = 'success') => setToast({ visible: true, message, type });

    // Counts
    const counts = {
        all: vehicles.length,
        available: vehicles.filter(v => v.status === 'available').length,
        on_trip: vehicles.filter(v => v.status === 'on_trip').length,
        in_shop: vehicles.filter(v => v.status === 'in_shop').length,
        out_of_service: vehicles.filter(v => v.status === 'out_of_service').length,
    };

    const filtered = vehicles.filter(v => filter === 'all' || v.status === filter);

    // ── Drawer helpers ──
    const openAdd = () => {
        setEditingId(null);
        setForm(emptyForm);
        setFormErrors({});
        setDrawerOpen(true);
    };

    const openEdit = (v) => {
        setEditingId(v.id);
        setForm({ plate: v.plate, model: v.model, type: v.type, capacity: String(v.capacity), odometer: String(v.odometer), status: v.status });
        setFormErrors({});
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditingId(null);
        setForm(emptyForm);
        setFormErrors({});
    };

    const validate = () => {
        const errs = {};
        if (!form.plate.trim()) errs.plate = 'License plate is required';
        else if (!editingId && vehicles.some(v => v.plate.toUpperCase() === form.plate.trim().toUpperCase())) {
            errs.plate = 'Duplicate license plate';
        }
        if (!form.model.trim()) errs.model = 'Model is required';
        if (!form.capacity || Number(form.capacity) <= 0) errs.capacity = 'Must be a positive number';
        if (form.odometer && Number(form.odometer) < 0) errs.odometer = 'Must be zero or positive';
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!validate()) return;

        if (editingId) {
            updateVehicle(editingId, {
                plate: form.plate.trim().toUpperCase(),
                model: form.model.trim(),
                type: form.type,
                capacity: Number(form.capacity),
                odometer: Number(form.odometer) || 0,
                status: form.status,
            });
            showToast('Vehicle updated successfully');
        } else {
            const newV = {
                id: Math.max(0, ...vehicles.map(v => v.id)) + 1,
                plate: form.plate.trim().toUpperCase(),
                model: form.model.trim(),
                type: form.type,
                capacity: Number(form.capacity),
                status: 'available',
                odometer: Number(form.odometer) || 0,
            };
            addVehicle(newV);
            showToast('Vehicle added successfully');
        }
        closeDrawer();
    };

    // ── Retire ──
    const confirmRetire = () => {
        if (!retireTarget) return;
        removeVehicle(retireTarget.id);
        setRetireTarget(null);
        showToast('Vehicle retired successfully');
    };

    // ── Input helper ──
    const inputStyle = (hasError) => ({
        background: '#FFFFFF',
        border: hasError ? '1.5px solid #B03A06' : '1px solid rgba(28,28,30,0.12)',
        color: '#1C1C1E',
    });

    return (
        <div className="flex flex-col gap-5 fade-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-xl font-bold tracking-tight" style={{ color: '#1C1C1E' }}>Vehicle Registry</h2>
                <button onClick={openAdd}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer transition-all hover:scale-105 border-none whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                    + Add Vehicle
                </button>
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap gap-2">
                {FILTERS.map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className="px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all border-none"
                        style={{
                            background: filter === f ? '#D4500A' : '#F4F2EE',
                            color: filter === f ? '#FFFFFF' : '#1C1C1E',
                        }}>
                        {FILTER_LABELS[f]} ({counts[f]})
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
                                {['License Plate', 'Model', 'Type', 'Max Capacity (kg)', 'Status', 'Odometer', 'Actions'].map(h => (
                                    <th key={h} className="text-[10px] font-bold uppercase tracking-wider px-5 py-3.5"
                                        style={{ color: 'rgba(28,28,30,0.35)', borderBottom: '1px solid rgba(28,28,30,0.06)' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(v => (
                                <tr key={v.id} className="transition-colors"
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,159,212,0.03)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td className="px-5 py-3.5 text-xs font-bold" style={{ color: '#1A6EA8' }}>{v.plate}</td>
                                    <td className="px-5 py-3.5 text-xs font-medium" style={{ color: '#1C1C1E' }}>{v.model}</td>
                                    <td className="px-5 py-3.5 text-xs" style={{ color: 'rgba(28,28,30,0.6)' }}>{v.type}</td>
                                    <td className="px-5 py-3.5 text-xs font-mono" style={{ color: 'rgba(28,28,30,0.6)' }}>{v.capacity.toLocaleString()} kg</td>
                                    <td className="px-5 py-3.5"><StatusPill status={v.status} /></td>
                                    <td className="px-5 py-3.5 text-xs font-mono" style={{ color: 'rgba(28,28,30,0.5)' }}>{v.odometer.toLocaleString()} km</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(v)}
                                                className="text-[10px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer bg-transparent border-none flex items-center gap-1"
                                                style={{ color: '#1A6EA8', background: 'rgba(26,110,168,0.08)' }}>
                                                ✏️ Edit
                                            </button>
                                            <button onClick={() => setRetireTarget(v)}
                                                className="text-[10px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer bg-transparent border-none flex items-center gap-1"
                                                style={{ color: '#B03A06', background: 'rgba(176,58,6,0.08)' }}>
                                                🗑️ Retire
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-sm" style={{ color: 'rgba(28,28,30,0.3)' }}>
                                        No vehicles found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Slide-in Drawer ── */}
            <SlideDrawer isOpen={drawerOpen} onClose={closeDrawer}
                title={editingId ? 'Edit Vehicle' : 'Add New Vehicle'}>
                <form onSubmit={handleSave} className="flex flex-col gap-5">
                    {/* License Plate */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(28,28,30,0.5)' }}>
                            License Plate *
                        </label>
                        <input type="text" placeholder="GH-XXXX-XX" required
                            value={form.plate}
                            onChange={e => setForm({ ...form, plate: e.target.value.toUpperCase() })}
                            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                            style={inputStyle(formErrors.plate)} />
                        {formErrors.plate && <p className="text-[11px] mt-1 font-medium" style={{ color: '#B03A06' }}>{formErrors.plate}</p>}
                    </div>

                    {/* Model */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(28,28,30,0.5)' }}>
                            Model *
                        </label>
                        <input type="text" placeholder="e.g. Isuzu NQR" required
                            value={form.model}
                            onChange={e => setForm({ ...form, model: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                            style={inputStyle(formErrors.model)} />
                        {formErrors.model && <p className="text-[11px] mt-1 font-medium" style={{ color: '#B03A06' }}>{formErrors.model}</p>}
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(28,28,30,0.5)' }}>
                            Type
                        </label>
                        <select value={form.type}
                            onChange={e => setForm({ ...form, type: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer appearance-none"
                            style={{ ...inputStyle(false), backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%231C1C1E' stroke-width='1.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}>
                            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    {/* Capacity + Odometer */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(28,28,30,0.5)' }}>
                                Max Payload (kg) *
                            </label>
                            <input type="number" placeholder="5000" required min="1"
                                value={form.capacity}
                                onChange={e => setForm({ ...form, capacity: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                                style={inputStyle(formErrors.capacity)} />
                            {formErrors.capacity && <p className="text-[11px] mt-1 font-medium" style={{ color: '#B03A06' }}>{formErrors.capacity}</p>}
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(28,28,30,0.5)' }}>
                                Odometer (km)
                            </label>
                            <input type="number" placeholder="0" min="0"
                                value={form.odometer}
                                onChange={e => setForm({ ...form, odometer: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                                style={inputStyle(formErrors.odometer)} />
                            {formErrors.odometer && <p className="text-[11px] mt-1 font-medium" style={{ color: '#B03A06' }}>{formErrors.odometer}</p>}
                        </div>
                    </div>

                    {/* Status (edit only) */}
                    {editingId && (
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(28,28,30,0.5)' }}>
                                Status
                            </label>
                            <select value={form.status}
                                onChange={e => setForm({ ...form, status: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer appearance-none"
                                style={{ ...inputStyle(false), backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%231C1C1E' stroke-width='1.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}>
                                {FILTERS.filter(f => f !== 'all').map(f => (
                                    <option key={f} value={f}>{FILTER_LABELS[f]}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-col gap-3 mt-2">
                        <button type="submit"
                            className="w-full py-3 rounded-xl text-sm font-bold text-white cursor-pointer border-none transition-all hover:scale-[1.02]"
                            style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                            {editingId ? 'Update Vehicle' : 'Save Vehicle'}
                        </button>
                        <button type="button" onClick={closeDrawer}
                            className="w-full py-3 rounded-xl text-sm font-semibold cursor-pointer border-none transition-all"
                            style={{ background: 'transparent', color: 'rgba(28,28,30,0.5)', border: '1px solid rgba(28,28,30,0.12)' }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </SlideDrawer>

            {/* ── Retire Confirmation Modal ── */}
            <Modal isOpen={!!retireTarget} onClose={() => setRetireTarget(null)} title="Retire Vehicle">
                <div className="flex flex-col gap-4">
                    <p className="text-sm" style={{ color: 'rgba(244,242,238,0.7)' }}>
                        Are you sure you want to retire vehicle <strong className="text-white">{retireTarget?.plate}</strong>?
                        This action will remove it from the fleet registry.
                    </p>
                    <div className="flex gap-3 mt-2">
                        <button onClick={() => setRetireTarget(null)}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer border-none"
                            style={{ background: 'rgba(244,242,238,0.08)', color: 'rgba(244,242,238,0.5)' }}>
                            Cancel
                        </button>
                        <button onClick={confirmRetire}
                            className="flex-1 py-3 rounded-xl text-sm font-bold text-white cursor-pointer border-none transition-all hover:scale-[1.02]"
                            style={{ background: 'linear-gradient(135deg, #B03A06, #8B2E05)' }}>
                            🗑️ Retire Vehicle
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Toast */}
            <Toast message={toast.message} type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))} />
        </div>
    );
}
