import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Plus, Fuel, Droplet, DollarSign, BarChart2, MapPin, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
    vehicle: '', trip: '', date: '', liters: '',
    cost_per_liter: '', total_cost: '', odometer_at_fill: '', station_name: '',
};

function FuelModal({ open, onClose, initial, vehicles, trips }) {
    const queryClient = useQueryClient();
    const isEdit = !!initial;
    const [form, setForm] = useState(initial ?? EMPTY_FORM);

    const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

    // Auto-calculate total_cost when liters or cost_per_liter changes
    const handleNumericChange = (field) => (e) => {
        const updated = { ...form, [field]: e.target.value };
        const liters = parseFloat(updated.liters);
        const rate = parseFloat(updated.cost_per_liter);
        if (!isNaN(liters) && !isNaN(rate)) {
            updated.total_cost = (liters * rate).toFixed(2);
        }
        setForm(updated);
    };

    const saveMutation = useMutation({
        mutationFn: (data) =>
            isEdit
                ? api.patch(`/api/operations/fuel/${initial.id}/`, data)
                : api.post('/api/operations/fuel/', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['fuel']);
            toast.success(isEdit ? 'Fuel log updated' : 'Fuel logged');
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
        if (payload.trip === '') payload.trip = null;
        if (payload.odometer_at_fill === '') payload.odometer_at_fill = null;
        if (payload.station_name === '') payload.station_name = null;
        saveMutation.mutate(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold">{isEdit ? 'Edit Fuel Log' : 'Log Fuel'}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Vehicle *</label>
                            <select required className="input-field w-full" value={form.vehicle} onChange={set('vehicle')}>
                                <option value="">Select vehicle...</option>
                                {vehicles?.map(v => (
                                    <option key={v.id} value={v.id}>{v.name_model || v.license_plate} — {v.license_plate}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Linked Trip (optional)</label>
                            <select className="input-field w-full" value={form.trip} onChange={set('trip')}>
                                <option value="">None</option>
                                {trips?.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {String(t.id).substring(0, 8)}… — {t.origin || '?'} → {t.destination || '?'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Date *</label>
                            <input required type="date" className="input-field w-full" value={form.date} onChange={set('date')} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Station Name</label>
                            <input className="input-field w-full" value={form.station_name} onChange={set('station_name')} placeholder="e.g. Shell Station" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Liters *</label>
                            <input required type="number" step="0.01" min="0" className="input-field w-full" value={form.liters} onChange={handleNumericChange('liters')} placeholder="e.g. 50" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Cost per Liter ($) *</label>
                            <input required type="number" step="0.01" min="0" className="input-field w-full" value={form.cost_per_liter} onChange={handleNumericChange('cost_per_liter')} placeholder="e.g. 1.85" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Total Cost ($) *</label>
                            <input required type="number" step="0.01" min="0" className="input-field w-full" value={form.total_cost} onChange={set('total_cost')} placeholder="Auto-calculated" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Odometer at Fill (km)</label>
                            <input type="number" step="0.01" min="0" className="input-field w-full" value={form.odometer_at_fill} onChange={set('odometer_at_fill')} placeholder="e.g. 46200" />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={saveMutation.isPending} className="flex-1 btn-primary justify-center py-2">
                            {saveMutation.isPending ? 'Saving...' : (isEdit ? 'Update' : 'Log Fuel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function FuelPage() {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);

    const { data: logs, isLoading } = useQuery({
        queryKey: ['fuel'],
        queryFn: async () => {
            const res = await api.get('/api/operations/fuel/');
            return res.data;
        }
    });

    const { data: vehicles } = useQuery({
        queryKey: ['vehicles'],
        queryFn: async () => (await api.get('/api/fleet/vehicles/')).data,
    });

    const { data: trips } = useQuery({
        queryKey: ['trips'],
        queryFn: async () => (await api.get('/api/trips/trips/')).data,
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/api/operations/fuel/${id}/`),
        onSuccess: () => {
            queryClient.invalidateQueries(['fuel']);
            toast.success('Fuel log deleted');
        },
    });

    const vehicleMap = Object.fromEntries((vehicles ?? []).map(v => [v.id, v]));

    const openAdd = () => { setEditTarget(null); setModalOpen(true); };
    const openEdit = (log) => {
        setEditTarget({
            id: log.id,
            vehicle: log.vehicle, trip: log.trip ?? '',
            date: log.date, liters: log.liters,
            cost_per_liter: log.cost_per_liter, total_cost: log.total_cost,
            odometer_at_fill: log.odometer_at_fill ?? '',
            station_name: log.station_name ?? '',
        });
        setModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <FuelModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                initial={editTarget}
                vehicles={vehicles}
                trips={trips}
            />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Fuel & Expenses</h1>
                    <p className="text-sm mt-0.5">Monitor per-asset fuel spend and efficiency metrics.</p>
                </div>
                <button className="btn-primary" onClick={openAdd}>
                    <Plus size={18} />
                    Log Fuel
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                    <div className="h-40 bg-slate-100 rounded-2xl animate-pulse"></div>
                ) : logs?.map((log) => {
                    const veh = vehicleMap[log.vehicle];
                    return (
                        <div key={log.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                        <Fuel size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">
                                            {veh ? (veh.name_model || veh.license_plate) : `V-${String(log.vehicle).substring(0, 8)}`}
                                        </h3>
                                        <span className="text-xs text-slate-400 font-medium">{log.date}</span>
                                        {log.station_name && (
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <MapPin size={11} className="text-slate-400" />
                                                <span className="text-xs text-slate-500">{log.station_name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-2xl font-black text-slate-800 tracking-tight">
                                        ${log.total_cost}
                                    </div>
                                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(log)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => deleteMutation.mutate(log.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="text-center">
                                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Quantity</div>
                                    <div className="text-sm font-bold text-slate-700 flex items-center justify-center gap-1">
                                        <Droplet size={14} className="text-blue-400" /> {log.liters}L
                                    </div>
                                </div>
                                <div className="text-center border-x border-slate-200">
                                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Rate</div>
                                    <div className="text-sm font-bold text-slate-700 flex items-center justify-center gap-1">
                                        <DollarSign size={14} className="text-emerald-400" /> {log.cost_per_liter}/L
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Odometer</div>
                                    <div className="text-sm font-bold text-slate-700 flex items-center justify-center gap-1">
                                        <BarChart2 size={14} className="text-slate-400" /> {log.odometer_at_fill ?? '—'}
                                    </div>
                                </div>
                            </div>

                            {log.trip && (
                                <div className="mt-3 text-xs text-slate-400 font-medium">
                                    Linked trip: <span className="font-mono text-slate-600">{String(log.trip).substring(0, 8)}…</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
