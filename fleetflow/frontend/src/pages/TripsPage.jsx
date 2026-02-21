import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Plus, MapPin, Navigation, CheckCircle2, XCircle, X, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const StatusPill = ({ status }) => {
    const configs = {
        draft: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', icon: MapPin },
        dispatched: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: Navigation },
        completed: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: CheckCircle2 },
        cancelled: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', icon: XCircle },
    };
    const config = configs[status] || configs.draft;
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
            <Icon size={12} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const EMPTY_FORM = {
    vehicle: '', driver: '', origin: '', destination: '',
    cargo_weight_kg: '', cargo_description: '', status: 'draft',
    scheduled_at: '', revenue: '', notes: '',
    odometer_start: '', odometer_end: '',
};

function TripModal({ open, onClose, initial, vehicles, drivers }) {
    const queryClient = useQueryClient();
    const isEdit = !!initial;
    const [form, setForm] = useState(initial ?? EMPTY_FORM);

    const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

    const saveMutation = useMutation({
        mutationFn: (data) =>
            isEdit
                ? api.patch(`/api/trips/trips/${initial.id}/`, data)
                : api.post('/api/trips/trips/', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['trips']);
            toast.success(isEdit ? 'Trip updated' : 'Trip dispatched');
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
        ['cargo_weight_kg', 'revenue', 'odometer_start', 'odometer_end'].forEach(f => {
            if (payload[f] === '') payload[f] = null;
        });
        ['scheduled_at'].forEach(f => {
            if (payload[f] === '') payload[f] = null;
        });
        saveMutation.mutate(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold">{isEdit ? 'Edit Trip' : 'Dispatch Trip'}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Vehicle *</label>
                            <select required className="input-field w-full" value={form.vehicle} onChange={set('vehicle')}>
                                <option value="">Select vehicle...</option>
                                {vehicles?.map(v => (
                                    <option key={v.id} value={v.id}>{v.name_model || v.license_plate} — {v.license_plate}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Driver *</label>
                            <select required className="input-field w-full" value={form.driver} onChange={set('driver')}>
                                <option value="">Select driver...</option>
                                {drivers?.map(d => (
                                    <option key={d.id} value={d.id}>{d.full_name} — {d.license_number}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Origin</label>
                            <input className="input-field w-full" value={form.origin} onChange={set('origin')} placeholder="e.g. Warehouse A, City" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Destination</label>
                            <input className="input-field w-full" value={form.destination} onChange={set('destination')} placeholder="e.g. Client Site, City" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Cargo Weight (kg)</label>
                            <input type="number" step="0.01" min="0" className="input-field w-full" value={form.cargo_weight_kg} onChange={set('cargo_weight_kg')} placeholder="e.g. 1200" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                            <select className="input-field w-full" value={form.status} onChange={set('status')}>
                                <option value="draft">Draft</option>
                                <option value="dispatched">Dispatched</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Scheduled At</label>
                            <input type="datetime-local" className="input-field w-full" value={form.scheduled_at} onChange={set('scheduled_at')} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Revenue ($)</label>
                            <input type="number" step="0.01" min="0" className="input-field w-full" value={form.revenue} onChange={set('revenue')} placeholder="e.g. 850.00" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Odometer Start (km)</label>
                            <input type="number" step="0.01" min="0" className="input-field w-full" value={form.odometer_start} onChange={set('odometer_start')} placeholder="e.g. 45000" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Odometer End (km)</label>
                            <input type="number" step="0.01" min="0" className="input-field w-full" value={form.odometer_end} onChange={set('odometer_end')} placeholder="e.g. 45350" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Cargo Description</label>
                            <textarea rows={2} className="input-field w-full resize-none" value={form.cargo_description} onChange={set('cargo_description')} placeholder="Describe the cargo..." />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Notes</label>
                            <textarea rows={2} className="input-field w-full resize-none" value={form.notes} onChange={set('notes')} placeholder="Any additional notes..." />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={saveMutation.isPending} className="flex-1 btn-primary justify-center py-2">
                            {saveMutation.isPending ? 'Saving...' : (isEdit ? 'Update Trip' : 'Dispatch Trip')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function TripsPage() {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);

    const { data: trips, isLoading } = useQuery({
        queryKey: ['trips'],
        queryFn: async () => {
            const res = await api.get('/api/trips/trips/');
            return res.data;
        }
    });

    const { data: vehicles } = useQuery({
        queryKey: ['vehicles'],
        queryFn: async () => (await api.get('/api/fleet/vehicles/')).data,
    });

    const { data: drivers } = useQuery({
        queryKey: ['drivers'],
        queryFn: async () => (await api.get('/api/drivers/drivers/')).data,
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/api/trips/trips/${id}/`),
        onSuccess: () => {
            queryClient.invalidateQueries(['trips']);
            toast.success('Trip deleted');
        },
    });

    const vehicleMap = Object.fromEntries((vehicles ?? []).map(v => [v.id, v]));
    const driverMap = Object.fromEntries((drivers ?? []).map(d => [d.id, d]));

    const openAdd = () => { setEditTarget(null); setModalOpen(true); };
    const openEdit = (t) => {
        setEditTarget({
            id: t.id,
            vehicle: t.vehicle, driver: t.driver,
            origin: t.origin ?? '', destination: t.destination ?? '',
            cargo_weight_kg: t.cargo_weight_kg ?? '', cargo_description: t.cargo_description ?? '',
            status: t.status,
            scheduled_at: t.scheduled_at ? t.scheduled_at.slice(0, 16) : '',
            revenue: t.revenue ?? '', notes: t.notes ?? '',
            odometer_start: t.odometer_start ?? '', odometer_end: t.odometer_end ?? '',
        });
        setModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <TripModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                initial={editTarget}
                vehicles={vehicles}
                drivers={drivers}
            />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Trip Dispatcher</h1>
                    <p className="text-sm mt-0.5">Manage delivery lifecycles and cargo weight compliance.</p>
                </div>
                <button className="btn-primary" onClick={openAdd}>
                    <Plus size={18} />
                    Dispatch Trip
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle & Driver</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Route</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cargo Weight</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                [1, 2, 3].map(i => <tr key={i} className="animate-pulse"><td colSpan="8" className="px-6 py-8"><div className="h-4 bg-slate-100 rounded w-full"></div></td></tr>)
                            ) : trips?.map((trip) => {
                                const veh = vehicleMap[trip.vehicle];
                                const drv = driverMap[trip.driver];
                                return (
                                    <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-[10px] font-mono text-stone-400 uppercase tracking-tighter">
                                            {String(trip.id).substring(0, 8)}…
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-slate-700">
                                                    {veh ? (veh.name_model || veh.license_plate) : `V-${String(trip.vehicle).substring(0, 6)}…`}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {drv ? drv.full_name : `D-${String(trip.driver).substring(0, 6)}…`}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-700 font-medium">{trip.origin || '—'}</span>
                                                <span className="text-xs text-slate-400">→ {trip.destination || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600">{trip.cargo_weight_kg ?? '—'} {trip.cargo_weight_kg ? 'kg' : ''}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-slate-500">{trip.scheduled_at ? new Date(trip.scheduled_at).toLocaleString() : '—'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusPill status={trip.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-700">{trip.revenue ? `$${trip.revenue}` : '—'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(trip)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => deleteMutation.mutate(trip.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
