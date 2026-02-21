import React, { useState } from 'react';
import { Download, Calendar, Filter } from 'lucide-react';
import DataTable from '../components/DataTable';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadialBarChart,
  RadialBar,
} from 'recharts';

export default function AnalyticsPage() {
  const [range, setRange] = useState('30d');
  const [vehicle, setVehicle] = useState('All');
  const [region, setRegion] = useState('All');

  const roiRows = [
    { id: 1, vehicle: 'Truck-11', acquisition: 4200000, revenue: 6120000, fuel: 1180000, maintenance: 320000, net: 620000, roi: 14.8 },
    { id: 2, vehicle: 'Van-05', acquisition: 980000, revenue: 720000, fuel: 310000, maintenance: 84000, net: 326000, roi: 33.3 },
    { id: 3, vehicle: 'Bike-02', acquisition: 85000, revenue: 128000, fuel: 26000, maintenance: 9000, net: 93000, roi: 109.4 },
    { id: 4, vehicle: 'Truck-07', acquisition: 3900000, revenue: 2400000, fuel: 1320000, maintenance: 610000, net: -530000, roi: -13.6 },
  ];

  const efficiency = [
    { vehicle: 'Truck-11', kmpl: 4.3 },
    { vehicle: 'Truck-07', kmpl: 3.7 },
    { vehicle: 'Van-05', kmpl: 13.6 },
    { vehicle: 'Bike-02', kmpl: 43.8 },
  ];

  const utilization = [
    { t: 'W1', u: 58 },
    { t: 'W2', u: 63 },
    { t: 'W3', u: 61 },
    { t: 'W4', u: 67 },
    { t: 'W5', u: 72 },
    { t: 'W6', u: 69 },
  ];

  const costBreakdown = [
    { vehicle: 'Truck-11', fuel: 118, maintenance: 32 },
    { vehicle: 'Van-05', fuel: 31, maintenance: 8.4 },
    { vehicle: 'Bike-02', fuel: 2.6, maintenance: 0.9 },
    { vehicle: 'Truck-07', fuel: 132, maintenance: 61 },
  ];

  const tripVolume = [
    { t: 'W1', trips: 18 },
    { t: 'W2', trips: 22 },
    { t: 'W3', trips: 20 },
    { t: 'W4', trips: 25 },
    { t: 'W5', trips: 27 },
    { t: 'W6', trips: 24 },
  ];

  const columns = [
    { id: 'veh', header: 'Vehicle', accessor: 'vehicle', cell: (v) => <span className="text-[13px] font-bold text-slate-100">{v}</span> },
    { id: 'acq', header: 'Acquisition Cost', accessor: 'acquisition', cell: (v) => <span className="ff-mono">₹{Number(v).toLocaleString()}</span> },
    { id: 'rev', header: 'Total Revenue', accessor: 'revenue', cell: (v) => <span className="ff-mono">₹{Number(v).toLocaleString()}</span> },
    { id: 'fuel', header: 'Fuel Cost', accessor: 'fuel', cell: (v) => <span className="ff-mono">₹{Number(v).toLocaleString()}</span> },
    { id: 'maint', header: 'Maintenance Cost', accessor: 'maintenance', cell: (v) => <span className="ff-mono">₹{Number(v).toLocaleString()}</span> },
    {
      id: 'net',
      header: 'Net Profit',
      accessor: 'net',
      cell: (v) => (
        <span className={`ff-mono font-bold ${Number(v) >= 0 ? 'text-emerald-300' : 'text-red-400'}`}>₹{Number(v).toLocaleString()}</span>
      )
    },
    {
      id: 'roi',
      header: 'ROI %',
      accessor: 'roi',
      cell: (v) => (
        <span className={`ff-mono font-bold ${Number(v) >= 0 ? 'text-emerald-300' : 'text-red-400'}`}>{Number(v).toFixed(1)}%</span>
      )
    },
  ];

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 22, color: '#F1F5F9', letterSpacing: '-0.02em' }}>Analytics</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#94A3B8', marginTop: 4 }}>Financial and operational insights across your fleet.</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="ff-btn ff-btn-ghost h-10 px-4">
            <Download size={16} /> Export CSV
          </button>
          <button className="ff-btn ff-btn-ghost h-10 px-4">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="ff-card p-5" style={{ borderRadius: 16 }}>
        <div className="ff-label" style={{ marginBottom: 10 }}>Filters</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select className="ff-input h-11" value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
          <select className="ff-input h-11" value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
            <option value="All">All Vehicles</option>
            <option value="Truck-11">Truck-11</option>
            <option value="Van-05">Van-05</option>
            <option value="Bike-02">Bike-02</option>
          </select>
          <select className="ff-input h-11" value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="All">All Regions</option>
            <option value="West">West</option>
            <option value="North">North</option>
            <option value="East">East</option>
            <option value="South">South</option>
          </select>
        </div>
        <div style={{ marginTop: 10 }} className="text-[12px] text-slate-400 font-semibold flex items-center gap-2">
          <Calendar size={14} /> {range} · <Filter size={14} /> {vehicle}/{region}
        </div>
      </div>

      <DataTable
        title="Vehicle ROI"
        columns={columns}
        rows={roiRows}
        rowKey={(r) => r.id}
        emptyTitle="No ROI data"
        emptyMessage="Adjust filters to view ROI."
        className="overflow-hidden"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Chart 1: Fuel Efficiency (horizontal bar with gradient) ── */}
        <ChartCard title="Fuel Efficiency" subtitle="km / litre per vehicle">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={efficiency} layout="vertical" margin={{ top: 8, right: 24, bottom: 4, left: 4 }}>
              <defs>
                <linearGradient id="fuelGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0.95} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(51,65,85,0.35)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="vehicle" tick={{ fill: '#CBD5E1', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{ background: '#1E293B', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                labelStyle={{ color: '#F1F5F9', fontWeight: 600, marginBottom: 4 }}
                itemStyle={{ color: '#94A3B8' }}
                cursor={{ fill: 'rgba(99,102,241,0.06)' }}
              />
              <Bar dataKey="kmpl" fill="url(#fuelGrad)" radius={[0, 8, 8, 0]} barSize={22} animationDuration={900} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── Chart 2: Fleet Utilization (gradient area) ── */}
        <ChartCard title="Fleet Utilization" subtitle="Weekly on-trip ratio %">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={utilization} margin={{ top: 8, right: 24, bottom: 4, left: 4 }}>
              <defs>
                <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(51,65,85,0.35)" vertical={false} />
              <XAxis dataKey="t" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} domain={[50, 80]} />
              <Tooltip
                contentStyle={{ background: '#1E293B', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                labelStyle={{ color: '#F1F5F9', fontWeight: 600, marginBottom: 4 }}
                itemStyle={{ color: '#94A3B8' }}
              />
              <Area
                type="monotone"
                dataKey="u"
                stroke="#8B5CF6"
                fill="url(#utilGrad)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#8B5CF6', stroke: '#1E293B', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#A78BFA', stroke: '#1E293B', strokeWidth: 2 }}
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── Chart 3: Cost Breakdown (stacked bar, dual color) ── */}
        <ChartCard title="Cost Breakdown" subtitle="Fuel vs Maintenance (₹ lakh)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costBreakdown} margin={{ top: 8, right: 24, bottom: 4, left: 4 }}>
              <defs>
                <linearGradient id="fuelCostGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="maintCostGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(51,65,85,0.35)" vertical={false} />
              <XAxis dataKey="vehicle" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1E293B', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                labelStyle={{ color: '#F1F5F9', fontWeight: 600, marginBottom: 4 }}
                itemStyle={{ color: '#94A3B8' }}
                cursor={{ fill: 'rgba(56,189,248,0.06)' }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingBottom: 8, fontSize: 11, color: '#94A3B8' }}
              />
              <Bar dataKey="fuel" name="Fuel" stackId="costs" fill="url(#fuelCostGrad)" radius={[0, 0, 0, 0]} barSize={28} animationDuration={900} />
              <Bar dataKey="maintenance" name="Maintenance" stackId="costs" fill="url(#maintCostGrad)" radius={[6, 6, 0, 0]} barSize={28} animationDuration={900} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ── Chart 4: Trip Volume (line + fill) ── */}
        <ChartCard title="Trip Volume" subtitle="Weekly trip count">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tripVolume} margin={{ top: 8, right: 24, bottom: 4, left: 4 }}>
              <defs>
                <linearGradient id="tripGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(51,65,85,0.35)" vertical={false} />
              <XAxis dataKey="t" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} domain={[10, 35]} />
              <Tooltip
                contentStyle={{ background: '#1E293B', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                labelStyle={{ color: '#F1F5F9', fontWeight: 600, marginBottom: 4 }}
                itemStyle={{ color: '#94A3B8' }}
              />
              <Area
                type="monotone"
                dataKey="trips"
                stroke="#22C55E"
                fill="url(#tripGrad)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#22C55E', stroke: '#1E293B', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#4ADE80', stroke: '#1E293B', strokeWidth: 2 }}
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="ff-card" style={{ borderRadius: 16, padding: '20px 24px 24px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 15, color: '#F1F5F9', letterSpacing: '-0.01em' }}>{title}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#64748B', marginTop: 3 }}>{subtitle}</div>
      </div>
      <div style={{ flex: 1, width: '100%', minHeight: 260 }}>
        {children}
      </div>
    </div>
  );
}
