import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Plus, Fuel, Droplet, DollarSign, BarChart2 } from 'lucide-react';

export default function FuelPage() {
    const { data: logs, isLoading } = useQuery({
        queryKey: ['fuel'],
        queryFn: async () => {
            const res = await api.get('/api/operations/fuel/');
            return res.data;
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Fuel & Expenses</h1>
                    <p className="text-sm mt-0.5">Monitor per-asset fuel spend and efficiency metrics.</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} />
                    Log Fuel
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                    <div className="h-40 bg-slate-100 rounded-2xl animate-pulse"></div>
                ) : logs?.map((log) => (
                    <div key={log.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <Fuel size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Fill-up: V-{log.vehicle}</h3>
                                    <span className="text-xs text-slate-400 font-medium">{log.date}</span>
                                </div>
                            </div>
                            <div className="text-2xl font-black text-slate-800 tracking-tight">
                                ${log.total_cost}
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
                                    <BarChart2 size={14} className="text-slate-400" /> {log.odometer_at_fill}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
