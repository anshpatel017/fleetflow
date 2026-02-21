import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Plus, Search, Filter, Phone, Calendar, ShieldCheck, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const StatusPill = ({ status }) => {
    const configs = {
        on_duty: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', label: 'On Duty' },
        off_duty: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-100', label: 'Off Duty' },
        on_trip: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', label: 'On Trip' },
        suspended: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', label: 'Suspended' },
    };
    const config = configs[status] || configs.on_duty;
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
            {config.label}
        </span>
    );
};

const EMPTY_FORM = {
    full_name: '', license_number: '', license_category: 'truck',
    license_expiry: '', status: 'on_duty', phone: '', safety_score: '',
};

function DriverModal({ open, onClose, initial }) {
    const queryClient = useQueryClient();
    const isEdit = !!initial;
    const [form, setForm] = useState(initial ?? EMPTY_FORM);

    const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

    const saveMutation = useMutation({
        mutationFn: (data) =>
            isEdit
                ? api.patch(`/api/drivers/drivers/${initial.id}/`, data)
                : api.post('/api/drivers/drivers/', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['drivers']);
            toast.success(isEdit ? 'Driver updated' : 'Driver added');
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
        if (payload.license_expiry === '') payload.license_expiry = null;
        if (payload.safety_score === '') payload.safety_score = null;
        saveMutation.mutate(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold">{isEdit ? 'Edit Driver' : 'Add Driver'}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name *</label>
                            <input required className="input-field w-full" value={form.full_name} onChange={set('full_name')} placeholder="e.g. John Doe" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">License Number *</label>
                            <input required className="input-field w-full" value={form.license_number} onChange={set('license_number')} placeholder="e.g. DL-123456" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">License Category *</label>
                            <select required className="input-field w-full" value={form.license_category} onChange={set('license_category')}>
                                <option value="truck">Truck</option>
                                <option value="van">Van</option>
                                <option value="bike">Bike</option>
                                <option value="all">All</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">License Expiry</label>
                            <input type="date" className="input-field w-full" value={form.license_expiry} onChange={set('license_expiry')} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                            <select className="input-field w-full" value={form.status} onChange={set('status')}>
                                <option value="on_duty">On Duty</option>
                                <option value="off_duty">Off Duty</option>
                                <option value="on_trip">On Trip</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Phone</label>
                            <input className="input-field w-full" value={form.phone} onChange={set('phone')} placeholder="e.g. +1 555 0100" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Safety Score (0–100)</label>
                            <input type="number" step="0.01" min="0" max="100" className="input-field w-full" value={form.safety_score} onChange={set('safety_score')} placeholder="e.g. 92.5" />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={saveMutation.isPending} className="flex-1 btn-primary justify-center py-2">
                            {saveMutation.isPending ? 'Saving...' : (isEdit ? 'Update' : 'Add Driver')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function DriversPage() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);

    const { data: drivers, isLoading } = useQuery({
        queryKey: ['drivers'],
        queryFn: async () => {
            const res = await api.get('/api/drivers/drivers/');
            return res.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/api/drivers/drivers/${id}/`),
        onSuccess: () => {
            queryClient.invalidateQueries(['drivers']);
            toast.success('Driver deleted');
        },
    });

    const filteredDrivers = drivers?.filter(d =>
        d.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.license_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openAdd = () => { setEditTarget(null); setModalOpen(true); };
    const openEdit = (d) => {
        setEditTarget({
            id: d.id,
            full_name: d.full_name, license_number: d.license_number,
            license_category: d.license_category, license_expiry: d.license_expiry ?? '',
            status: d.status, phone: d.phone ?? '',
            safety_score: d.safety_score ?? '',
        });
        setModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <DriverModal open={modalOpen} onClose={() => setModalOpen(false)} initial={editTarget} />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Driver Profiles</h1>
                    <p className="text-sm mt-0.5">Monitor compliance, safety scores, and duty status.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search drivers..."
                            className="input-field pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-primary" onClick={openAdd}>
                        <Plus size={18} />
                        Add Driver
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>)
                ) : filteredDrivers?.map((driver) => (
                    <div key={driver.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                        {/* Safety Score Badge */}
                        <div className="absolute top-4 right-4 flex flex-col items-end">
                            <div className={`p-2 rounded-lg ${driver.safety_score >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                <ShieldCheck size={20} />
                            </div>
                            <span className="text-xs font-bold mt-1 text-slate-400">Score: {driver.safety_score ?? '—'}</span>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-xl font-bold text-slate-400">
                                {driver.full_name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{driver.full_name}</h3>
                                <StatusPill status={driver.status} />
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Phone size={16} className="text-slate-400" />
                                <span>{driver.phone || '—'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar size={16} className="text-stone-400" />
                                <span className={driver.license_expiry && new Date(driver.license_expiry) < new Date() ? 'text-rose-600 font-semibold' : ''}>
                                    Exp: {driver.license_expiry || '—'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <div className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                    ID
                                </div>
                                <span className="font-mono">{driver.license_number}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-50">
                            <div className="text-center">
                                <div className="text-[10px] text-slate-400 font-medium uppercase mb-1">Done</div>
                                <div className="text-lg font-bold text-slate-700">{driver.trips_completed}</div>
                            </div>
                            <div className="text-center border-x border-slate-50">
                                <div className="text-[10px] text-slate-400 font-medium uppercase mb-1">Cancelled</div>
                                <div className="text-lg font-bold text-rose-500">{driver.trips_cancelled}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] text-slate-400 font-medium uppercase mb-1">Category</div>
                                <div className="text-sm font-bold text-blue-600 capitalize">{driver.license_category}</div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => openEdit(driver)}
                                className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-1.5"
                            >
                                <Edit2 size={14} /> Edit
                            </button>
                            <button
                                onClick={() => deleteMutation.mutate(driver.id)}
                                className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-center gap-1.5"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
