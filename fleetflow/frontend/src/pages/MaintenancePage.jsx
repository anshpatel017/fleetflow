import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Plus, Wrench, Calendar, PenTool } from 'lucide-react';

export default function MaintenancePage() {
    const { data: logs, isLoading } = useQuery({
        queryKey: ['maintenance'],
        queryFn: async () => {
            const res = await api.get('/api/operations/maintenance/');
            return res.data;
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Maintenance & Service</h1>
                    <p className="text-sm mt-0.5">Track asset health and preventative service logs.</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} />
                    Log Service
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    <div className="h-20 bg-slate-100 rounded-xl animate-pulse"></div>
                ) : logs?.map((log) => (
                    <div key={log.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center group hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                <PenTool size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{log.service_type}</h3>
                                <div className="flex gap-4 mt-1">
                                    <span className="text-sm text-stone-500 flex items-center gap-1.5 font-medium">
                                        <Calendar size={14} /> {log.service_date}
                                    </span>
                                    <span className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                                        <Wrench size={14} /> V-{log.vehicle}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-slate-800">${log.cost}</div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${log.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {log.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
