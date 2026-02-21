import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import KPICard from '../components/KPICard';
import StatusPill from '../components/StatusPill';
import { mockTrips, mockAlerts, fuelCostData } from '../data/mockData';

const kpis = [
    {
        label: 'Total Vehicles',
        value: '24',
        icon: '🚛',
        change: '+2 this month',
        color: '#1A6EA8',
    },
    {
        label: 'Active Trips',
        value: '7',
        icon: '🗺️',
        change: '3 dispatched',
        color: '#D4500A',
    },
    {
        label: 'Drivers On Duty',
        value: '12',
        icon: '👤',
        change: '6 on route',
        color: '#3B9FD4',
    },
    {
        label: 'Monthly Fuel Cost',
        value: '$14,200',
        icon: '⛽',
        change: '+4.4% vs last month',
        color: '#B03A06',
    },
];

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="px-4 py-3 rounded-xl shadow-lg text-sm"
            style={{ background: '#2C2C2E', border: '1px solid rgba(244,242,238,0.1)' }}>
            <p className="font-semibold text-white">{label}</p>
            <p style={{ color: '#D4500A' }}>${payload[0].value.toLocaleString()}</p>
        </div>
    );
}

export default function DashboardPage() {
    const recentTrips = mockTrips.slice(0, 5);

    return (
        <div className="flex flex-col gap-6 fade-up">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                    <KPICard key={i} title={kpi.label} value={kpi.value} icon={kpi.icon} color={kpi.color} change={kpi.change} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Alerts */}
                <div className="xl:col-span-1 rounded-2xl p-5"
                    style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>
                    <h3 className="text-sm font-bold mb-4" style={{ color: '#1C1C1E' }}>
                        Active Alerts
                    </h3>
                    <div className="flex flex-col gap-3">
                        {mockAlerts.map(alert => (
                            <div key={alert.id} className="flex gap-3 p-3 rounded-xl"
                                style={{
                                    background: alert.type === 'danger' ? 'rgba(176,58,6,0.06)' :
                                        alert.type === 'warning' ? 'rgba(212,80,10,0.06)' : 'rgba(59,159,212,0.06)',
                                    border: `1px solid ${alert.type === 'danger' ? 'rgba(176,58,6,0.12)' :
                                        alert.type === 'warning' ? 'rgba(212,80,10,0.12)' : 'rgba(59,159,212,0.12)'}`,
                                }}>
                                <span className="text-base mt-0.5">{alert.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold leading-relaxed" style={{ color: '#1C1C1E' }}>
                                        {alert.message}
                                    </p>
                                    <p className="text-[10px] mt-1" style={{ color: 'rgba(28,28,30,0.4)' }}>{alert.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fuel Cost Chart */}
                <div className="xl:col-span-2 rounded-2xl p-5"
                    style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold" style={{ color: '#1C1C1E' }}>Fuel Cost Over Last 6 Months</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(212,80,10,0.1)', color: '#D4500A' }}>
                            Trending ↑
                        </span>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={fuelCostData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,28,30,0.06)" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(28,28,30,0.4)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: 'rgba(28,28,30,0.4)' }} axisLine={false} tickLine={false}
                                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="cost" stroke="#D4500A" strokeWidth={2.5}
                                dot={{ r: 4, fill: '#D4500A', strokeWidth: 2, stroke: '#FFFFFF' }}
                                activeDot={{ r: 6, stroke: '#D4500A', strokeWidth: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Trips Table */}
            <div className="rounded-2xl p-5"
                style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>
                <h3 className="text-sm font-bold mb-4" style={{ color: '#1C1C1E' }}>Recent Trips</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead>
                            <tr>
                                {['Trip ID', 'Driver', 'Vehicle', 'Route', 'Status', 'Date'].map(h => (
                                    <th key={h} className="text-[10px] font-bold uppercase tracking-wider px-4 py-3"
                                        style={{ color: 'rgba(28,28,30,0.35)', borderBottom: '1px solid rgba(28,28,30,0.06)' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recentTrips.map(trip => (
                                <tr key={trip.id} className="transition-colors"
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,159,212,0.03)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td className="px-4 py-3 text-xs font-bold" style={{ color: '#1A6EA8' }}>{trip.id}</td>
                                    <td className="px-4 py-3 text-xs font-medium" style={{ color: '#1C1C1E' }}>{trip.driver}</td>
                                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'rgba(28,28,30,0.6)' }}>{trip.vehicle}</td>
                                    <td className="px-4 py-3 text-xs" style={{ color: 'rgba(28,28,30,0.6)' }}>
                                        {trip.origin} → {trip.destination}
                                    </td>
                                    <td className="px-4 py-3"><StatusPill status={trip.status} /></td>
                                    <td className="px-4 py-3 text-xs" style={{ color: 'rgba(28,28,30,0.4)' }}>{trip.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3">
                <Link to="/trips"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white no-underline transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                    <span className="text-base">+</span> New Trip
                </Link>
                <Link to="/vehicles"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white no-underline transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                    <span className="text-base">+</span> Add Vehicle
                </Link>
            </div>
        </div>
    );
}
