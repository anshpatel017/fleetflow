import { useState } from 'react';
import StatusPill from '../components/StatusPill';
import Modal from '../components/Modal';
import { mockVehicles } from '../data/mockData';

const FILTERS = ['all', 'available', 'on_trip', 'in_shop', 'out_of_service'];
const FILTER_LABELS = { all: 'All', available: 'Available', on_trip: 'On Trip', in_shop: 'In Shop', out_of_service: 'Out of Service' };
const TYPES = ['Truck', 'Van', 'Pickup'];

const emptyVehicle = { licensePlate: '', model: '', type: 'Truck', capacity: '', odometer: '' };

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState(mockVehicles);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newVehicle, setNewVehicle] = useState(emptyVehicle);

    const filtered = vehicles.filter(v => {
        if (filter !== 'all' && v.status !== filter) return false;
        if (search && !v.licensePlate.toLowerCase().includes(search.toLowerCase()) &&
            !v.model.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const counts = {
        all: vehicles.length,
        available: vehicles.filter(v => v.status === 'available').length,
        on_trip: vehicles.filter(v => v.status === 'on_trip').length,
        in_shop: vehicles.filter(v => v.status === 'in_shop').length,
        out_of_service: vehicles.filter(v => v.status === 'out_of_service').length,
    };

    const handleAdd = (e) => {
        e.preventDefault();
        const v = {
            id: vehicles.length + 1,
            licensePlate: newVehicle.licensePlate,
            model: newVehicle.model,
            type: newVehicle.type,
            capacity: Number(newVehicle.capacity),
            status: 'available',
            odometer: Number(newVehicle.odometer) || 0,
            acquisitionCost: 50000,
        };
        setVehicles([v, ...vehicles]);
        setNewVehicle(emptyVehicle);
        setShowModal(false);
    };

    return (
        <div className="flex flex-col gap-5 fade-up">
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                <input type="text" placeholder="Search vehicles..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full sm:w-72 px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.1)', color: '#1C1C1E' }}
                    onFocus={e => e.target.style.borderColor = '#3B9FD4'}
                    onBlur={e => e.target.style.borderColor = 'rgba(28,28,30,0.1)'} />
                <button onClick={() => setShowModal(true)}
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
                            background: filter === f ? '#1A6EA8' : '#FFFFFF',
                            color: filter === f ? '#FFFFFF' : 'rgba(28,28,30,0.6)',
                            border: filter === f ? 'none' : '1px solid rgba(28,28,30,0.1)',
                        }}>
                        {FILTER_LABELS[f]} ({counts[f]})
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden"
                style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead>
                            <tr>
                                {['License Plate', 'Model', 'Type', 'Capacity', 'Status', 'Odometer', 'Actions'].map(h => (
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
                                    <td className="px-5 py-3.5 text-xs font-bold" style={{ color: '#1A6EA8' }}>{v.licensePlate}</td>
                                    <td className="px-5 py-3.5 text-xs font-medium" style={{ color: '#1C1C1E' }}>{v.model}</td>
                                    <td className="px-5 py-3.5 text-xs" style={{ color: 'rgba(28,28,30,0.6)' }}>{v.type}</td>
                                    <td className="px-5 py-3.5 text-xs font-mono" style={{ color: 'rgba(28,28,30,0.6)' }}>{v.capacity.toLocaleString()} kg</td>
                                    <td className="px-5 py-3.5"><StatusPill status={v.status} /></td>
                                    <td className="px-5 py-3.5 text-xs font-mono" style={{ color: 'rgba(28,28,30,0.5)' }}>{v.odometer.toLocaleString()} km</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex gap-2">
                                            <button className="text-[10px] font-semibold px-3 py-1 rounded-lg cursor-pointer bg-transparent border-none"
                                                style={{ color: '#3B9FD4', background: 'rgba(59,159,212,0.08)' }}>View</button>
                                            <button className="text-[10px] font-semibold px-3 py-1 rounded-lg cursor-pointer bg-transparent border-none"
                                                style={{ color: 'rgba(28,28,30,0.5)', background: 'rgba(28,28,30,0.04)' }}>Edit</button>
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

            {/* Add Vehicle Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Vehicle">
                <form onSubmit={handleAdd} className="flex flex-col gap-4">
                    {[
                        { name: 'licensePlate', label: 'License Plate', placeholder: 'TRK-XXX', type: 'text' },
                        { name: 'model', label: 'Model', placeholder: 'e.g. Volvo FH16', type: 'text' },
                    ].map(f => (
                        <div key={f.name}>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>{f.label}</label>
                            <input type={f.type} placeholder={f.placeholder} required
                                value={newVehicle[f.name]}
                                onChange={e => setNewVehicle({ ...newVehicle, [f.name]: e.target.value })}
                                className="fleet-input" />
                        </div>
                    ))}
                    <div>
                        <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                            style={{ color: 'rgba(244,242,238,0.5)' }}>Type</label>
                        <select value={newVehicle.type}
                            onChange={e => setNewVehicle({ ...newVehicle, type: e.target.value })}
                            className="fleet-input cursor-pointer">
                            {TYPES.map(t => <option key={t} value={t} style={{ background: '#1C1C1E', color: '#F4F2EE' }}>{t}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>Max Capacity (kg)</label>
                            <input type="number" placeholder="25000" required
                                value={newVehicle.capacity}
                                onChange={e => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                                className="fleet-input" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>Odometer (km)</label>
                            <input type="number" placeholder="0"
                                value={newVehicle.odometer}
                                onChange={e => setNewVehicle({ ...newVehicle, odometer: e.target.value })}
                                className="fleet-input" />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-2">
                        <button type="button" onClick={() => setShowModal(false)}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer border-none"
                            style={{ background: 'rgba(244,242,238,0.08)', color: 'rgba(244,242,238,0.5)' }}>
                            Cancel
                        </button>
                        <button type="submit"
                            className="flex-1 py-3 rounded-xl text-sm font-bold text-white cursor-pointer border-none transition-all hover:scale-[1.02]"
                            style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                            Save Vehicle
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
