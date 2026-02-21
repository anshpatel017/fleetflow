import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import {
    TrendingUp,
    Wrench,
    Package,
    Truck,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, color, subValue, subLabel, trend }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
                <Icon size={24} />
            </div>
            {trend && (
                <span className={`flex items-center text-xs font-semibold ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(trend)}%
                </span>
            )}
        </div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">{value}</span>
            {subValue && (
                <span className="text-xs text-slate-400 font-medium">{subValue} {subLabel}</span>
            )}
        </div>
    </div>
);

export default function DashboardPage() {
    const { data: kpis, isLoading } = useQuery({
        queryKey: ['dashboard-kpis'],
        queryFn: async () => {
            const res = await api.get('/api/analytics/dashboard/');
            return res.data;
        },
        refetchInterval: 5000 // Auto-refresh every 5s per SRS FR-2.6
    });

    if (isLoading) return <div className="animate-pulse space-y-8">
        <div className="h-8 w-48 bg-slate-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>)}
        </div>
    </div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Command Center</h1>
                <p className="text-slate-500 mt-1">Real-time overview of your fleet operations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Active Fleet"
                    value={kpis?.active_fleet}
                    icon={Truck}
                    color="blue"
                    subValue={kpis?.total_active_vehicles}
                    subLabel="Total Assets"
                    trend={+12}
                />
                <KPICard
                    title="Maintenance Alerts"
                    value={kpis?.in_shop}
                    icon={Wrench}
                    color="amber"
                    subValue="Urgent"
                    trend={-5}
                />
                <KPICard
                    title="Fleet Utilization"
                    value={`${(kpis?.utilization_rate ?? 0).toFixed(1)}%`}
                    icon={TrendingUp}
                    color="indigo"
                    trend={+2.4}
                />
                <KPICard
                    title="Pending Cargo"
                    value={kpis?.pending_cargo}
                    icon={Package}
                    color="emerald"
                    subValue="Draft Trips"
                />
            </div>

            {/* Placeholder for charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-80 flex items-center justify-center text-slate-400 font-medium border-dashed">
                    Fleet Activity Trend (Chart Placeholder)
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-80 flex items-center justify-center text-slate-400 font-medium border-dashed">
                    Region Breakdown (Chart Placeholder)
                </div>
            </div>
        </div>
    );
}
