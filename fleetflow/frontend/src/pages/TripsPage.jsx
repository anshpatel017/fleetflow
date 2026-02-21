import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Plus, MapPin, Navigation, CheckCircle2, XCircle } from 'lucide-react';

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

export default function TripsPage() {
    const { data: trips, isLoading } = useQuery({
        queryKey: ['trips'],
        queryFn: async () => {
            const res = await api.get('/api/trips/trips/');
            return res.data;
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Trip Dispatcher</h1>
                    <p className="text-sm mt-0.5">Manage delivery lifecycles and cargo weight compliance.</p>
                </div>
                <button className="btn-primary">
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
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cargo Weight</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Revenue</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                [1, 2, 3].map(i => <tr key={i} className="animate-pulse"><td colSpan="6" className="px-6 py-8"><div className="h-4 bg-slate-100 rounded w-full"></div></td></tr>)
                            ) : trips?.map((trip) => (
                                <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-[10px] font-mono text-stone-400 uppercase tracking-tighter">
                                        {trip.id.toString().substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-700">V-{trip.vehicle}</span>
                                            <span className="text-xs text-slate-500">D-{trip.driver}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-600">{trip.cargo_weight_kg} kg</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusPill status={trip.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-700">${trip.revenue}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Manage</button>
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
