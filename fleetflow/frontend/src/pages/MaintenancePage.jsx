import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Plus, Wrench, Calendar, PenTool, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
    vehicle: '', service_type: 'oil_change', description: '',
    service_date: '', cost: '', odometer_at_service: '',
    status: 'in_progress', completed_date: '', next_service_km: '',
};

function MaintenanceModal({ open, onClose, initial, vehicles }) {
    const queryClient = useQueryClient();
    const isEdit = !!initial;
    const [form, setForm] = useState(initial ?? EMPTY_FORM);

    const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

    const saveMutation = useMutation({
        mutationFn: (data) =>
            isEdit
                ? api.patch(`/api/operations/maintenance/${initial.id}/`, data)
                : api.post('/api/operations/maintenance/', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['maintenance']);
            toast.success(isEdit ? 'Log updated' : 'Service logged');
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
        ['cost', 'odometer_at_service', 'next_service_km'].forEach(f => {
            if (payload[f] === '') payload[f] = null;
        });
        ['service_date', 'completed_date'].forEach(f => {
            if (payload[f] === '') payload[f] = null;
        });
        saveMutation.mutate(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold">{isEdit ? 'Edit Service Log' : 'Log Service'}</h2>
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
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Service Type *</label>
                            <select required className="input-field w-full" value={form.service_type} onChange={set('service_type')}>
                                <option value="oil_change">Oil Change</option>
                                <option value="tire_change">Tire Change</option>
                                <option value="brake_service">Brake Service</option>
                                <option value="engine_repair">Engine Repair</option>
                                <option value="inspection">Inspection</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                            <select className="input-field w-full" value={form.status} onChange={set('status')}>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Service Date</label>
                            <input type="date" className="input-field w-full" value={form.service_date} onChange={set('service_date')} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Completed Date</label>
                            <input type="date" className="input-field w-full" value={form.completed_date} onChange={set('completed_date')} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Cost ($)</label>
                            <input type="number" step="0.01" min="0" className="input-field w-full" value={form.cost} onChange={set('cost')} placeholder="e.g. 250.00" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Odometer at Service (km)</label>
                            <input type="number" step="0.01" min="0" className="input-field w-full" value={form.odometer_at_service} onChange={set('odometer_at_service')} placeholder="e.g. 45000" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Next Service at (km)</label>
                            <input type="number" step="0.01" min="0" className="input-field w-full" value={form.next_service_km} onChange={set('next_service_km')} placeholder="e.g. 50000" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                            <textarea rows={3} className="input-field w-full resize-none" value={form.description} onChange={set('description')} placeholder="Describe the work done..." />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={saveMutation.isPending} className="flex-1 btn-primary justify-center py-2">
                            {saveMutation.isPending ? 'Saving...' : (isEdit ? 'Update' : 'Log Service')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function MaintenancePage() {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);

    const { data: logs, isLoading } = useQuery({
        queryKey: ['maintenance'],
        queryFn: async () => {
            const res = await api.get('/api/operations/maintenance/');
            return res.data;
        }
    });

    const { data: vehicles } = useQuery({
        queryKey: ['vehicles'],
        queryFn: async () => (await api.get('/api/fleet/vehicles/')).data,
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/api/operations/maintenance/${id}/`),
        onSuccess: () => {
            queryClient.invalidateQueries(['maintenance']);
            toast.success('Log deleted');
        },
    });

    const vehicleMap = Object.fromEntries((vehicles ?? []).map(v => [v.id, v]));

    const openAdd = () => { setEditTarget(null); setModalOpen(true); };
    const openEdit = (log) => {
        setEditTarget({
            id: log.id,
            vehicle: log.vehicle, service_type: log.service_type,
            description: log.description ?? '', service_date: log.service_date ?? '',
            cost: log.cost ?? '', odometer_at_service: log.odometer_at_service ?? '',
            status: log.status, completed_date: log.completed_date ?? '',
            next_service_km: log.next_service_km ?? '',
        });
        setModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <MaintenanceModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                initial={editTarget}
                vehicles={vehicles}
            />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Maintenance & Service</h1>
                    <p className="text-sm mt-0.5">Track asset health and preventative service logs.</p>
                </div>
                <button className="btn-primary" onClick={openAdd}>
                    <Plus size={18} />
                    Log Service
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    <div className="h-20 bg-slate-100 rounded-xl animate-pulse"></div>
                ) : logs?.map((log) => {
                    const veh = vehicleMap[log.vehicle];
                    return (
                        <div key={log.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group hover:border-blue-200 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors shrink-0">
                                        <PenTool size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-800 capitalize">{log.service_type.replace('_', ' ')}</h3>
                                        <div className="flex flex-wrap gap-4 mt-1">
                                            <span className="text-sm text-stone-500 flex items-center gap-1.5 font-medium">
                                                <Calendar size={14} /> {log.service_date || '—'}
                                            </span>
                                            <span className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                                                <Wrench size={14} /> {veh ? (veh.name_model || veh.license_plate) : `V-${String(log.vehicle).substring(0, 8)}`}
                                            </span>
                                            {log.odometer_at_service && (
                                                <span className="text-sm text-slate-400">{log.odometer_at_service} km</span>
                                            )}
                                            {log.next_service_km && (
                                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                                                    Next: {log.next_service_km} km
                                                </span>
                                            )}
                                        </div>
                                        {log.description && (
                                            <p className="text-sm text-slate-500 mt-1 truncate">{log.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right ml-6 shrink-0">
                                    <div className="text-lg font-bold text-slate-800">{log.cost ? `$${log.cost}` : '—'}</div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${log.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {log.status.replace('_', ' ')}
                                    </span>
                                    <div className="flex justify-end gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(log)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => deleteMutation.mutate(log.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
