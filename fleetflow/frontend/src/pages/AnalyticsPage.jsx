import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    PieChart, Pie, Cell,
} from 'recharts';
import { maintenanceVsFuelData, expenseBreakdown, topExpensiveTrips } from '../data/mockData';

const PERIODS = ['30 Days', '90 Days', '365 Days'];

const metrics = [
    { label: 'Total Fuel Cost', value: '$80,300', icon: '⛽', color: '#D4500A' },
    { label: 'Maintenance Spend', value: '$31,900', icon: '🔧', color: '#3B9FD4' },
    { label: 'Avg Cost Per Trip', value: '$1,420', icon: '🗺️', color: '#1A6EA8' },
    { label: 'ROI Estimate', value: '+12.4%', icon: '📈', color: '#34C759' },
];

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="px-4 py-3 rounded-xl shadow-lg text-sm"
            style={{ background: '#2C2C2E', border: '1px solid rgba(244,242,238,0.1)' }}>
            <p className="font-semibold text-white mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.fill || p.stroke || p.color }}>
                    {p.name}: ${p.value.toLocaleString()}
                </p>
            ))}
        </div>
    );
}

function PieTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="px-4 py-3 rounded-xl shadow-lg text-sm"
            style={{ background: '#2C2C2E', border: '1px solid rgba(244,242,238,0.1)' }}>
            <p className="font-semibold" style={{ color: payload[0].payload.color }}>
                {payload[0].name}: ${payload[0].value.toLocaleString()}
            </p>
        </div>
    );
}

export default function AnalyticsPage() {
    const [period, setPeriod] = useState('90 Days');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isRestricted = user?.role === 'dispatcher';

    return (
        <div className="flex flex-col gap-6 fade-up relative">
            {/* Restricted overlay for dispatchers */}
            {isRestricted && (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl"
                    style={{ background: 'rgba(244,242,238,0.85)', backdropFilter: 'blur(8px)' }}>
                    <div className="text-center">
                        <span className="text-5xl mb-4 block">🔒</span>
                        <h3 className="text-lg font-bold" style={{ color: '#1C1C1E' }}>Restricted Access</h3>
                        <p className="text-sm mt-2" style={{ color: 'rgba(28,28,30,0.5)' }}>
                            Analytics is only available for Managers and Analysts.
                        </p>
                    </div>
                </div>
            )}

            {/* Header + date range */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight" style={{ color: '#1C1C1E' }}>Financial Overview</h2>
                    <p className="text-xs mt-1" style={{ color: 'rgba(28,28,30,0.4)' }}>Costs, revenue, and fleet ROI analytics</p>
                </div>
                <div className="flex gap-2">
                    {PERIODS.map(p => (
                        <button key={p} onClick={() => setPeriod(p)}
                            className="px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all border-none"
                            style={{
                                background: period === p ? '#1A6EA8' : '#FFFFFF',
                                color: period === p ? '#FFFFFF' : 'rgba(28,28,30,0.6)',
                                border: period === p ? 'none' : '1px solid rgba(28,28,30,0.1)',
                            }}>
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {metrics.map((m, i) => (
                    <div key={i} className="rounded-2xl p-5 transition-all duration-200 hover:shadow-md"
                        style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-xl">{m.icon}</span>
                            <span className="text-xs font-medium" style={{ color: 'rgba(28,28,30,0.45)' }}>{m.label}</span>
                        </div>
                        <p className="text-2xl font-black tracking-tight" style={{ color: m.color }}>{m.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Bar chart */}
                <div className="xl:col-span-2 rounded-2xl p-5"
                    style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>
                    <h3 className="text-sm font-bold mb-4" style={{ color: '#1C1C1E' }}>Monthly Maintenance vs Fuel Cost</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={maintenanceVsFuelData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,28,30,0.06)" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(28,28,30,0.4)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: 'rgba(28,28,30,0.4)' }} axisLine={false} tickLine={false}
                                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                            <Tooltip content={<ChartTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Bar dataKey="fuel" name="Fuel" fill="#D4500A" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="maintenance" name="Maintenance" fill="#3B9FD4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie chart */}
                <div className="rounded-2xl p-5"
                    style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>
                    <h3 className="text-sm font-bold mb-4" style={{ color: '#1C1C1E' }}>Expense Breakdown</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                                paddingAngle={3} dataKey="value" stroke="none">
                                {expenseBreakdown.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<PieTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Legend */}
                    <div className="flex flex-col gap-2 mt-2">
                        {expenseBreakdown.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                                <span className="text-[11px] flex-1" style={{ color: 'rgba(28,28,30,0.6)' }}>{item.name}</span>
                                <span className="text-[11px] font-semibold" style={{ color: '#1C1C1E' }}>${item.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Expensive Trips */}
            <div className="rounded-2xl p-5"
                style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>
                <h3 className="text-sm font-bold mb-4" style={{ color: '#1C1C1E' }}>Top 5 Most Expensive Trips</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead>
                            <tr>
                                {['Trip ID', 'Vehicle', 'Driver', 'Route', 'Total Cost', 'Fuel Cost', 'Distance'].map(h => (
                                    <th key={h} className="text-[10px] font-bold uppercase tracking-wider px-4 py-3"
                                        style={{ color: 'rgba(28,28,30,0.35)', borderBottom: '1px solid rgba(28,28,30,0.06)' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {topExpensiveTrips.map(trip => (
                                <tr key={trip.id} className="transition-colors"
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,159,212,0.03)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td className="px-4 py-3 text-xs font-bold" style={{ color: '#1A6EA8' }}>{trip.id}</td>
                                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'rgba(28,28,30,0.6)' }}>{trip.vehicle}</td>
                                    <td className="px-4 py-3 text-xs font-medium" style={{ color: '#1C1C1E' }}>{trip.driver}</td>
                                    <td className="px-4 py-3 text-xs" style={{ color: 'rgba(28,28,30,0.6)' }}>{trip.route}</td>
                                    <td className="px-4 py-3 text-xs font-bold" style={{ color: '#D4500A' }}>${trip.totalCost.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-xs" style={{ color: 'rgba(28,28,30,0.6)' }}>${trip.fuelCost.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'rgba(28,28,30,0.5)' }}>{trip.distance} km</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
