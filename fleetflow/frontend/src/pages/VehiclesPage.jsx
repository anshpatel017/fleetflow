import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Plus, Search, Filter, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const StatusPill = ({ status }) => {
    const configs = {
        available: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', label: 'Available' },
        on_trip: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', label: 'On Trip' },
        in_shop: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', label: 'In Shop' },
        retired: { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-100', label: 'Retired' },
    };
    const config = configs[status] || configs.available;
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
            {config.label}
        </span>
    );
};

const EMPTY_FORM = {
    license_plate: '', name_model: '', vehicle_type: 'truck',
    max_capacity_kg: '', odometer_km: '', status: 'available',
    region: '', acquisition_cost: '', is_retired: false,
};

function VehicleModal({ open, onClose, initial }) {
    const queryClient = useQueryClient();
    const isEdit = !!initial;
    const [form, setForm] = useState(initial ?? EMPTY_FORM);

    const set = (field) => (e) => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm(prev => ({ ...prev, [field]: val }));
    };

    const saveMutation = useMutation({
        mutationFn: (data) =>
            isEdit
                ? api.patch(`/api/fleet/vehicles/${initial.id}/`, data)
                : api.post('/api/fleet/vehicles/', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['vehicles']);
            toast.success(isEdit ? 'Vehicle updated' : 'Vehicle added');
            onClose();
        },
        onError: (err) => {
            const msg = err.response?.data
                ? Object.values(err.response.data).flat().join(' ')
                : 'Something went wrong';
            toast.error(msg);
        },
    });

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form };
        if (payload.max_capacity_kg === '') payload.max_capacity_kg = null;
        if (payload.acquisition_cost === '') payload.acquisition_cost = null;
        saveMutation.mutate(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold">{isEdit ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">License Plate *</label>
                            <input required className="input-field w-full" value={form.license_plate} onChange={set('license_plate')} placeholder="e.g. ABC-1234" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Model Name</label>
                            <input className="input-field w-full" value={form.name_model} onChange={set('name_model')} placeholder="e.g. Toyota Hilux" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Vehicle Type</label>
                            <select className="input-field w-full" value={form.vehicle_type} onChange={set('vehicle_type')}>
                                <option value="truck">Truck</option>
                                <option value="van">Van</option>
                                <option value="bike">Bike</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                            <select className="input-field w-full" value={form.status} onChange={set('status')}>
                                <option value="available">Available</option>
                                <option value="on_trip">On Trip</option>
                                <option value="in_shop">In Shop</option>
                                <option value="retired">Retired</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Max Capacity (kg)</label>
                            <input type="number" step="0.01" min="0" className="input-field w-full" value={form.max_capacity_kg} onChange={set('max_capacity_kg')} placeholder="e.g. 5000" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Odometer (km)</label>
                            <input type="number" step="0.01" min="0" className="input-field w-full" value={form.odometer_km} onChange={set('odometer_km')} placeholder="e.g. 12000" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Region</label>
                            <input className="input-field w-full" value={form.region} onChange={set('region')} placeholder="e.g. North Zone" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Acquisition Cost ($)</label>
                            <input type="number" step="0.01" min="0" className="input-field w-full" value={form.acquisition_cost} onChange={set('acquisition_cost')} placeholder="e.g. 45000" />
                        </div>
                        <div className="col-span-2 flex items-center gap-3 pt-1">
                            <input type="checkbox" id="is_retired" checked={form.is_retired} onChange={set('is_retired')} className="w-4 h-4 rounded" />
                            <label htmlFor="is_retired" className="text-sm font-medium text-slate-600">Mark as Retired</label>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={saveMutation.isPending} className="flex-1 btn-primary justify-center py-2">
                            {saveMutation.isPending ? 'Saving...' : (isEdit ? 'Update' : 'Add Vehicle')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function VehiclesPage() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);

    const { data: vehicles, isLoading } = useQuery({
        queryKey: ['vehicles'],
        queryFn: async () => {
            const res = await api.get('/api/fleet/vehicles/');
            return res.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/api/fleet/vehicles/${id}/`),
        onSuccess: () => {
            queryClient.invalidateQueries(['vehicles']);
            toast.success('Vehicle deleted');
        }
    });

    const filteredVehicles = vehicles?.filter(v =>
        v.name_model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.license_plate.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openAdd = () => { setEditTarget(null); setModalOpen(true); };
    const openEdit = (v) => {
        setEditTarget({
            id: v.id,
            license_plate: v.license_plate, name_model: v.name_model,
            vehicle_type: v.vehicle_type, max_capacity_kg: v.max_capacity_kg ?? '',
            odometer_km: v.odometer_km ?? '', status: v.status,
            region: v.region ?? '', acquisition_cost: v.acquisition_cost ?? '',
            is_retired: v.is_retired,
        });
        setModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <VehicleModal open={modalOpen} onClose={() => setModalOpen(false)} initial={editTarget} />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Vehicle Registry</h1>
                    <p className="text-sm mt-0.5">Manage physical fleet assets and health.</p>
                </div>
                <button className="btn-primary" onClick={openAdd}>
                    <Plus size={18} />
                    Add Vehicle
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-3 border-b border-stone-100 flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search fleet..."
                            className="input-field pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-secondary flex items-center gap-2">
                        <Filter size={16} />
                        Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Odometer</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Region</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Acq. Cost</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                [1, 2, 3].map(i => <tr key={i} className="animate-pulse"><td colSpan="8" className="px-6 py-8"><div className="h-4 bg-slate-100 rounded w-full"></div></td></tr>)
                            ) : filteredVehicles?.map((vehicle) => (
                                <tr key={vehicle.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold">{vehicle.name_model || '—'}</div>
                                        <div className="text-[11px] text-stone-400 font-mono tracking-tighter">{vehicle.license_plate}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm capitalize">{vehicle.vehicle_type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusPill status={vehicle.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium">{vehicle.max_capacity_kg ?? '—'} <span className="text-stone-400 font-normal">kg</span></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium">{vehicle.odometer_km} <span className="text-stone-400 font-normal">km</span></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-600">{vehicle.region || '—'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium">{vehicle.acquisition_cost ? `$${vehicle.acquisition_cost}` : '—'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(vehicle)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteMutation.mutate(vehicle.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
