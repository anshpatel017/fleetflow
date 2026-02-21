import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Plus, Search, Filter, Phone, Calendar, ShieldCheck } from 'lucide-react';

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

export default function DriversPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: drivers, isLoading } = useQuery({
        queryKey: ['drivers'],
        queryFn: async () => {
            const res = await api.get('/api/drivers/drivers/');
            return res.data;
        }
    });

    const filteredDrivers = drivers?.filter(d =>
        d.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.license_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Driver Profiles</h1>
                    <p className="text-sm mt-0.5">Monitor compliance, safety scores, and duty status.</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} />
                    Add Driver
                </button>
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
                            <span className="text-xs font-bold mt-1 text-slate-400">Score: {driver.safety_score}</span>
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
                                <span>{driver.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar size={16} className="text-stone-400" />
                                <span className={new Date(driver.license_expiry) < new Date() ? 'text-rose-600 font-semibold' : ''}>
                                    Exp: {driver.license_expiry}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <div className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                    ID
                                </div>
                                <span className="font-mono">{driver.license_number}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                            <div className="text-center">
                                <div className="text-xs text-slate-400 font-medium uppercase mb-1">Completed</div>
                                <div className="text-lg font-bold text-slate-700">{driver.trips_completed}</div>
                            </div>
                            <div className="text-center border-l border-slate-50">
                                <div className="text-xs text-slate-400 font-medium uppercase mb-1">Category</div>
                                <div className="text-sm font-bold text-blue-600">{driver.license_category}</div>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100">
                            View Full Profile
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
