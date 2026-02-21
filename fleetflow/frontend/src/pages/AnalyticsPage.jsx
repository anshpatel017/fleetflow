import { useState } from 'react';
import {
    LineChart, Line,
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import KPICard from '../components/KPICard';
import Toast from '../components/Toast';
import {
    fuelCostData, maintenanceVsFuelData, expenseBreakdown,
    monthlyFinancials,
} from '../data/mockData';

const PERIODS = [
    { label: 'Last 30 Days', key: '30' },
    { label: 'Last 90 Days', key: '90' },
    { label: 'Last 365 Days', key: '365' },
    { label: 'Custom Range', key: 'custom' },
];

const kpis = [
    { title: 'Total Fuel Cost', value: '$42,800', icon: '⛽', color: '#D4500A', change: '+6.2%' },
    { title: 'Total Maintenance Cost', value: '$18,400', icon: '🔧', color: '#3B9FD4', change: '-3.1%' },
    { title: 'Fleet Utilization Rate', value: '72%', icon: '🚛', color: '#1A6EA8', change: '+2.4%' },
    { title: 'Estimated Fleet ROI', value: '34%', icon: '📈', color: '#34C759', change: '+5.7%' },
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
    const [period, setPeriod] = useState('90');
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
    const [exportingPdf, setExportingPdf] = useState(false);
    const [exportingCsv, setExportingCsv] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isRestricted = user?.role === 'dispatcher' || user?.role === 'safety_officer';

    const showToast = (message, type = 'success') => setToast({ visible: true, message, type });

    const handleExport = (type) => {
        if (type === 'pdf') setExportingPdf(true);
        else setExportingCsv(true);

        setTimeout(() => {
            if (type === 'pdf') setExportingPdf(false);
            else setExportingCsv(false);
            showToast('Report exported successfully');
        }, 1500);
    };

    return (
        <div className="flex flex-col gap-6 fade-up relative">
            {/* ── Restricted overlay ── */}
            {isRestricted && (
                <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl"
                    style={{ background: 'rgba(244,242,238,0.85)', backdropFilter: 'blur(10px)' }}>
                    <div className="text-center px-6">
                        <span className="text-5xl mb-4 block">🔒</span>
                        <h3 className="text-lg font-bold" style={{ color: '#1C1C1E' }}>Access Restricted</h3>
                        <p className="text-sm mt-2 max-w-sm mx-auto" style={{ color: 'rgba(28,28,30,0.5)' }}>
                            Analytics is available for Managers and Analysts only
                        </p>
                    </div>
                </div>
            )}

            {/* ── Header + date filter + export ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight" style={{ color: '#1C1C1E' }}>Operational Analytics & Financial Reports</h2>
                    <p className="text-xs mt-1" style={{ color: 'rgba(28,28,30,0.4)' }}>Costs, revenue, and fleet ROI analytics</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {PERIODS.map(p => (
                        <button key={p.key} onClick={() => setPeriod(p.key)}
                            className="px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all border-none"
                            style={{
                                background: period === p.key ? '#1A6EA8' : '#FFFFFF',
                                color: period === p.key ? '#FFFFFF' : 'rgba(28,28,30,0.6)',
                                border: period === p.key ? 'none' : '1px solid rgba(28,28,30,0.1)',
                            }}>
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {kpis.map((k, i) => (
                    <KPICard key={i} title={k.title} value={k.value} icon={k.icon} color={k.color} change={k.change} />
                ))}
            </div>

            {/* ── Charts row 1: Line + Pie ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Line chart - Monthly Fuel Cost Trend */}
                <div className="xl:col-span-2 rounded-2xl p-5"
                    style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>
                    <h3 className="text-sm font-bold mb-4" style={{ color: '#1C1C1E' }}>Monthly Fuel Cost Trend</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={fuelCostData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,28,30,0.06)" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(28,28,30,0.4)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: 'rgba(28,28,30,0.4)' }} axisLine={false} tickLine={false}
                                tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} />
                            <Tooltip content={<ChartTooltip />} />
                            <Line type="monotone" dataKey="cost" name="Fuel Cost" stroke="#D4500A" strokeWidth={2.5}
                                dot={{ r: 4, fill: '#D4500A', stroke: '#FFFFFF', strokeWidth: 2 }}
                                activeDot={{ r: 6, fill: '#D4500A' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie chart - Expense Breakdown */}
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

            {/* ── Charts row 2: Grouped Bar ── */}
            <div className="rounded-2xl p-5"
                style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>
                <h3 className="text-sm font-bold mb-4" style={{ color: '#1C1C1E' }}>Fuel Cost vs Maintenance Cost by Month</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={maintenanceVsFuelData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,28,30,0.06)" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(28,28,30,0.4)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: 'rgba(28,28,30,0.4)' }} axisLine={false} tickLine={false}
                            tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} />
                        <Tooltip content={<ChartTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="fuel" name="Fuel" fill="#D4500A" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="maintenance" name="Maintenance" fill="#3B9FD4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* ── Monthly Financial Summary Table ── */}
            <div className="rounded-2xl p-5"
                style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>
                <h3 className="text-sm font-bold mb-4" style={{ color: '#1C1C1E' }}>Monthly Financial Summary</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead>
                            <tr>
                                {['Month', 'Revenue ($)', 'Fuel Cost ($)', 'Maintenance ($)', 'Net Profit ($)'].map(h => (
                                    <th key={h} className="text-[10px] font-bold uppercase tracking-wider px-4 py-3"
                                        style={{ color: 'rgba(28,28,30,0.35)', borderBottom: '1px solid rgba(28,28,30,0.06)' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyFinancials.map(row => (
                                <tr key={row.month} className="transition-colors"
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,159,212,0.03)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: '#1C1C1E' }}>{row.month}</td>
                                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'rgba(28,28,30,0.6)' }}>${row.revenue.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-xs font-mono" style={{ color: '#D4500A' }}>${row.fuel.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-xs font-mono" style={{ color: '#3B9FD4' }}>${row.maintenance.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-xs font-bold"
                                        style={{ color: row.profit >= 0 ? '#34C759' : '#B03A06' }}>
                                        {row.profit >= 0 ? '+' : ''}${row.profit.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Export Buttons ── */}
            <div className="flex flex-wrap gap-3">
                <button onClick={() => handleExport('pdf')} disabled={exportingPdf}
                    className="px-6 py-3 rounded-xl text-sm font-bold text-white cursor-pointer border-none transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                    {exportingPdf ? (
                        <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Exporting…</>
                    ) : (
                        '📄 Download PDF Report'
                    )}
                </button>
                <button onClick={() => handleExport('csv')} disabled={exportingCsv}
                    className="px-6 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
                    style={{ background: 'transparent', border: '1.5px solid rgba(26,110,168,0.4)', color: '#1A6EA8' }}>
                    {exportingCsv ? (
                        <><span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Exporting…</>
                    ) : (
                        '📊 Download CSV'
                    )}
                </button>
            </div>

            {/* Toast */}
            <Toast message={toast.message} type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))} />
        </div>
    );
}
