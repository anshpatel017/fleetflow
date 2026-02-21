import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Cell
} from 'recharts';
import { Download, Filter, TrendingUp, Info } from 'lucide-react';

const MetricCard = ({ label, value, color }) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</div>
        <div className={`text-2xl font-black text-${color}-600 tracking-tight`}>{value}</div>
    </div>
);

export default function AnalyticsPage() {
    const { data: metrics, isLoading } = useQuery({
        queryKey: ['vehicle-analytics'],
        queryFn: async () => {
            const res = await api.get('/api/analytics/vehicles/');
            return res.data;
        }
    });

    if (isLoading) return <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-slate-100 rounded-lg"></div>
        <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl"></div>)}
        </div>
        <div className="h-96 bg-slate-100 rounded-2xl"></div>
    </div>;

    const fleetAvgEfficiency = metrics?.reduce((acc, curr) => acc + curr.fuel_efficiency, 0) / (metrics?.length || 1) || 0;
    const totalRevenue = metrics?.reduce((acc, curr) => acc + curr.total_revenue, 0) || 0;
    const totalOpsCost = metrics?.reduce((acc, curr) => acc + curr.total_ops_cost, 0) || 0;
    const netProfit = totalRevenue - totalOpsCost;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Operational Analytics</h1>
                    <p className="text-sm mt-0.5">Data-driven insights per asset performance.</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-secondary flex items-center gap-2">
                        <Download size={18} /> Export
                    </button>
                    <button className="btn-primary">
                        <Filter size={18} /> Filter
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard label="Avg Efficiency" value={`${fleetAvgEfficiency.toFixed(2)} km/L`} color="blue" />
                <MetricCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} color="emerald" />
                <MetricCard label="Operating Cost" value={`$${totalOpsCost.toLocaleString()}`} color="rose" />
                <MetricCard label="Net Profit" value={`$${netProfit.toLocaleString()}`} color="indigo" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="font-bold text-slate-800">Asset ROI Performance</h3>
                            <p className="text-xs text-slate-400">Net revenue vs Acquisition cost percentage</p>
                        </div>
                        <TrendingUp size={20} className="text-slate-300" />
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 11 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="roi" radius={[6, 6, 0, 0]}>
                                    {metrics?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.roi > 0 ? '#10b981' : '#f43f5e'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="font-bold text-slate-800">Fuel Efficiency (km/L)</h3>
                            <p className="text-xs text-slate-400">Performance benchmarking per vehicle</p>
                        </div>
                        <Info size={20} className="text-slate-300" />
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metrics}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="fuel_efficiency" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
