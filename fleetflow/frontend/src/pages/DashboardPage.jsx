import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import {
    TrendingUp, Wrench, Package, Truck, Users,
    ArrowUpRight, ArrowDownRight, MapPin, Fuel,
    CheckCircle2, Clock, XCircle, Navigation,
    Activity, Plus, ChevronRight,
} from 'lucide-react';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

/* ─── Helpers ─── */
function LiveClock() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(id);
    }, []);
    return (
        <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    );
}

/* ─── KPI Card ─── */
const KPICard = ({ title, value, icon: Icon, gradient, sub, trend, to }) => {
    const inner = (
        <div className={`relative overflow-hidden rounded-2xl p-5 text-white ${gradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer`}>
            {/* bg circle decoration */}
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full bg-white/5" />

            <div className="relative">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Icon size={20} />
                    </div>
                    {trend !== undefined && (
                        <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-white/20' : 'bg-black/20'}`}>
                            {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {Math.abs(trend)}%
                        </span>
                    )}
                </div>
                <div className="text-3xl font-black tracking-tight mb-1">
                    {value ?? '—'}
                </div>
                <div className="text-sm font-semibold opacity-90">{title}</div>
                {sub && <div className="text-xs opacity-70 mt-0.5">{sub}</div>}
            </div>
        </div>
    );
    return to ? <Link to={to}>{inner}</Link> : inner;
};

/* ─── Status Pill ─── */
const SPill = ({ status }) => {
    const map = {
        draft:      { cls: 'bg-slate-100 text-slate-600',   icon: Clock,        label: 'Draft' },
        dispatched: { cls: 'bg-blue-50 text-blue-700',      icon: Navigation,   label: 'Dispatched' },
        completed:  { cls: 'bg-emerald-50 text-emerald-700',icon: CheckCircle2, label: 'Completed' },
        cancelled:  { cls: 'bg-rose-50 text-rose-700',      icon: XCircle,      label: 'Cancelled' },
    };
    const c = map[status] ?? map.draft;
    const Icon = c.icon;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${c.cls}`}>
            <Icon size={10} />
            {c.label}
        </span>
    );
};

/* ─── Custom Tooltip for Charts ─── */
const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-slate-100 shadow-xl rounded-xl px-3 py-2 text-sm">
            {label && <p className="font-semibold text-slate-700 mb-1">{label}</p>}
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }} className="font-medium">
                    {p.name}: <span className="font-bold">{p.value}</span>
                </p>
            ))}
        </div>
    );
};

/* ─── Main Dashboard ─── */
export default function DashboardPage() {
    const { user } = useAuthStore();

    const { data: kpis, isLoading: kpisLoading } = useQuery({
        queryKey: ['dashboard-kpis'],
        queryFn: async () => (await api.get('/api/analytics/dashboard/')).data,
        refetchInterval: 30000,
    });

    const { data: vehicles } = useQuery({
        queryKey: ['vehicles'],
        queryFn: async () => (await api.get('/api/fleet/vehicles/')).data,
    });

    const { data: trips } = useQuery({
        queryKey: ['trips'],
        queryFn: async () => (await api.get('/api/trips/trips/')).data,
    });

    const { data: drivers } = useQuery({
        queryKey: ['drivers'],
        queryFn: async () => (await api.get('/api/drivers/drivers/')).data,
    });

    /* ── Derived data ── */
    const vehicleStatusData = vehicles
        ? [
            { name: 'Available',  value: vehicles.filter(v => v.status === 'available').length,  color: '#10b981' },
            { name: 'On Trip',    value: vehicles.filter(v => v.status === 'on_trip').length,    color: '#3b82f6' },
            { name: 'In Shop',    value: vehicles.filter(v => v.status === 'in_shop').length,    color: '#f59e0b' },
            { name: 'Retired',    value: vehicles.filter(v => v.status === 'retired').length,    color: '#94a3b8' },
        ].filter(d => d.value > 0)
        : [];

    const tripStatusData = trips
        ? [
            { name: 'Draft',      value: trips.filter(t => t.status === 'draft').length      },
            { name: 'Dispatched', value: trips.filter(t => t.status === 'dispatched').length },
            { name: 'Completed',  value: trips.filter(t => t.status === 'completed').length  },
            { name: 'Cancelled',  value: trips.filter(t => t.status === 'cancelled').length  },
        ]
        : [];

    const recentTrips = trips
        ? [...trips].slice(0, 5)
        : [];

    const vehicleMap = Object.fromEntries((vehicles ?? []).map(v => [v.id, v]));
    const driverMap  = Object.fromEntries((drivers  ?? []).map(d => [d.id, d]));

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const totalVehicles = vehicles?.length ?? 0;
    const totalDrivers  = drivers?.length ?? 0;
    const activeDrivers = drivers?.filter(d => d.status === 'on_duty' || d.status === 'on_trip').length ?? 0;
    const utilization   = kpis?.utilization_rate ?? 0;

    return (
        <div className="space-y-6">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-slate-500 font-medium mb-0.5">
                        <LiveClock /> · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {greeting()}, {user?.full_name?.split(' ')[0] || 'there'} 👋
                    </h1>
                    <p className="text-slate-500 text-sm mt-0.5">Here's what's happening with your fleet today.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <Link to="/trips" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                        <Plus size={16} /> Dispatch Trip
                    </Link>
                    <Link to="/vehicles" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
                        <Truck size={16} /> Fleet
                    </Link>
                </div>
            </div>

            {/* ── KPI Cards ── */}
            {kpisLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => <div key={i} className="h-36 bg-slate-200 rounded-2xl animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KPICard
                        title="Active Fleet"
                        value={kpis?.active_fleet ?? 0}
                        sub={`of ${totalVehicles} vehicles`}
                        icon={Truck}
                        gradient="bg-gradient-to-br from-blue-500 to-blue-700"
                        trend={12}
                        to="/vehicles"
                    />
                    <KPICard
                        title="Fleet Utilization"
                        value={`${utilization.toFixed(1)}%`}
                        sub="on-trip ratio"
                        icon={TrendingUp}
                        gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
                        trend={2.4}
                    />
                    <KPICard
                        title="Maintenance Alerts"
                        value={kpis?.in_shop ?? 0}
                        sub="vehicles in shop"
                        icon={Wrench}
                        gradient="bg-gradient-to-br from-amber-400 to-orange-500"
                        trend={-5}
                        to="/maintenance"
                    />
                    <KPICard
                        title="Active Drivers"
                        value={activeDrivers}
                        sub={`of ${totalDrivers} total`}
                        icon={Users}
                        gradient="bg-gradient-to-br from-emerald-400 to-teal-600"
                        to="/drivers"
                    />
                </div>
            )}

            {/* ── Charts row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Trip Status Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-bold text-slate-800">Trip Activity</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Breakdown by status</p>
                        </div>
                        <Link to="/trips" className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline">
                            View all <ChevronRight size={12} />
                        </Link>
                    </div>
                    {trips ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={tripStatusData} barCategoryGap="35%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc', radius: 8 }} />
                                <Bar dataKey="value" name="Trips" radius={[8, 8, 0, 0]}>
                                    {tripStatusData.map((entry, i) => {
                                        const colors = ['#94a3b8','#3b82f6','#10b981','#f43f5e'];
                                        return <Cell key={i} fill={colors[i % colors.length]} />;
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[220px] flex items-center justify-center text-slate-300 text-sm">Loading…</div>
                    )}
                </div>

                {/* Vehicle Status Donut */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-bold text-slate-800">Vehicle Status</h2>
                            <p className="text-xs text-slate-400 mt-0.5">{totalVehicles} total assets</p>
                        </div>
                        <Link to="/vehicles" className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline">
                            Manage <ChevronRight size={12} />
                        </Link>
                    </div>
                    {vehicleStatusData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie
                                        data={vehicleStatusData}
                                        cx="50%" cy="50%"
                                        innerRadius={48} outerRadius={72}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {vehicleStatusData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<ChartTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="grid grid-cols-2 gap-y-2 mt-2">
                                {vehicleStatusData.map((d, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                                        <span className="text-xs text-slate-600 font-medium truncate">{d.name}</span>
                                        <span className="text-xs font-bold text-slate-800 ml-auto">{d.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-[160px] flex items-center justify-center text-slate-300 text-sm">No vehicle data</div>
                    )}
                </div>
            </div>

            {/* ── Recent Trips + Quick Actions ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Trips */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Activity size={16} /></div>
                            <h2 className="font-bold text-slate-800">Recent Trips</h2>
                        </div>
                        <Link to="/trips" className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline">
                            View all <ChevronRight size={12} />
                        </Link>
                    </div>
                    {recentTrips.length === 0 && !trips ? (
                        <div className="p-8 text-center text-slate-400 text-sm">Loading trips…</div>
                    ) : recentTrips.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">No trips yet. <Link to="/trips" className="text-blue-500 font-semibold">Dispatch one →</Link></div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {recentTrips.map(trip => {
                                const veh = vehicleMap[trip.vehicle];
                                const drv = driverMap[trip.driver];
                                return (
                                    <div key={trip.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                                        <div className="p-2 rounded-xl bg-slate-50 text-slate-400 shrink-0">
                                            <MapPin size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-semibold text-slate-800 truncate">
                                                    {trip.origin || 'Unknown'} → {trip.destination || 'Unknown'}
                                                </span>
                                                <SPill status={trip.status} />
                                            </div>
                                            <div className="text-xs text-slate-400 mt-0.5 truncate">
                                                {veh ? (veh.name_model || veh.license_plate) : 'Unknown vehicle'} · {drv ? drv.full_name : 'Unknown driver'}
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-slate-700 shrink-0">
                                            {trip.revenue ? `$${trip.revenue}` : '—'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h2 className="font-bold text-slate-800 mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                        {[
                            { to: '/trips',       icon: Navigation, label: 'Dispatch a Trip',    sub: 'Assign vehicle & driver', iconCls: 'bg-blue-50 text-blue-600'    },
                            { to: '/vehicles',    icon: Truck,      label: 'Add Vehicle',         sub: 'Register new asset',      iconCls: 'bg-indigo-50 text-indigo-600' },
                            { to: '/drivers',     icon: Users,      label: 'Add Driver',          sub: 'Create driver profile',   iconCls: 'bg-purple-50 text-purple-600' },
                            { to: '/maintenance', icon: Wrench,     label: 'Log Service',         sub: 'Record maintenance work', iconCls: 'bg-amber-50 text-amber-600'  },
                            { to: '/fuel',        icon: Fuel,       label: 'Log Fuel Fill-up',    sub: 'Track fuel expenses',     iconCls: 'bg-emerald-50 text-emerald-600' },
                        ].map(({ to, icon: Icon, label, sub, iconCls }) => (
                            <Link key={to} to={to}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                            >
                                <div className={`p-2 rounded-xl ${iconCls} shrink-0`}>
                                    <Icon size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 leading-tight">{label}</div>
                                    <div className="text-xs text-slate-400">{sub}</div>
                                </div>
                                <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 shrink-0" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Driver Status Summary ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><Users size={16} /></div>
                        <h2 className="font-bold text-slate-800">Driver Status Overview</h2>
                    </div>
                    <Link to="/drivers" className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline">
                        View all <ChevronRight size={12} />
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { status: 'on_duty',   label: 'On Duty',    color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700' },
                        { status: 'on_trip',   label: 'On Trip',    color: 'blue',    bg: 'bg-blue-50',    text: 'text-blue-700'    },
                        { status: 'off_duty',  label: 'Off Duty',   color: 'slate',   bg: 'bg-slate-50',   text: 'text-slate-600'   },
                        { status: 'suspended', label: 'Suspended',  color: 'rose',    bg: 'bg-rose-50',    text: 'text-rose-700'    },
                    ].map(({ status, label, bg, text }) => {
                        const count = drivers?.filter(d => d.status === status).length ?? 0;
                        return (
                            <div key={status} className={`${bg} rounded-xl p-4 text-center`}>
                                <div className={`text-2xl font-black ${text}`}>{count}</div>
                                <div className={`text-xs font-semibold ${text} mt-1`}>{label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
