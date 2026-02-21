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
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[18px] font-bold text-slate-100">Analytics</div>
          <div className="text-[13px] text-slate-400">Financial and operational insights across your fleet.</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="ff-btn ff-btn-ghost h-10 px-4">
            <Download size={16} /> Export CSV
          </button>
          <button className="ff-btn ff-btn-ghost h-10 px-4">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="ff-card p-4" style={{ borderRadius: 16 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select className="ff-input h-10" value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
          <select className="ff-input h-10" value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
            <option value="All">All Vehicles</option>
            <option value="Truck-11">Truck-11</option>
            <option value="Van-05">Van-05</option>
            <option value="Bike-02">Bike-02</option>
          </select>
          <select className="ff-input h-10" value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="All">All Regions</option>
            <option value="West">West</option>
            <option value="North">North</option>
            <option value="East">East</option>
            <option value="South">South</option>
          </select>
        </div>
        <div className="mt-3 text-[12px] text-slate-500 font-semibold flex items-center gap-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Fuel Efficiency per Vehicle" subtitle="km/L">
          <ResponsiveContainer>
            <BarChart data={efficiency} layout="vertical" margin={{ left: 18 }}>
              <CartesianGrid stroke="rgba(51,65,85,0.6)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="vehicle" tick={{ fill: '#CBD5E1', fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ background: '#263548', border: '1px solid rgba(51,65,85,0.8)', borderRadius: 12 }} />
              <Bar dataKey="kmpl" fill="#0EA5E9" radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fleet Utilization Over Time" subtitle="% on-trip ratio">
          <ResponsiveContainer>
            <AreaChart data={utilization}>
              <CartesianGrid stroke="rgba(51,65,85,0.6)" vertical={false} />
              <XAxis dataKey="t" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#263548', border: '1px solid rgba(51,65,85,0.8)', borderRadius: 12 }} />
              <Area type="monotone" dataKey="u" stroke="#6366F1" fill="#6366F1" fillOpacity={0.18} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Cost Breakdown per Vehicle" subtitle="Fuel vs Maintenance (₹ lakh)">
          <ResponsiveContainer>
            <BarChart data={costBreakdown}>
              <CartesianGrid stroke="rgba(51,65,85,0.6)" vertical={false} />
              <XAxis dataKey="vehicle" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#263548', border: '1px solid rgba(51,65,85,0.8)', borderRadius: 12 }} />
              <Bar dataKey="fuel" stackId="a" fill="#38BDF8" radius={[10, 10, 0, 0]} />
              <Bar dataKey="maintenance" stackId="a" fill="#F59E0B" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Trip Volume Over Time" subtitle="Trips">
          <ResponsiveContainer>
            <LineChart data={tripVolume}>
              <CartesianGrid stroke="rgba(51,65,85,0.6)" vertical={false} />
              <XAxis dataKey="t" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#263548', border: '1px solid rgba(51,65,85,0.8)', borderRadius: 12 }} />
              <Line type="monotone" dataKey="trips" stroke="#22C55E" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="ff-card p-5" style={{ borderRadius: 16 }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[14px] font-bold text-slate-100">{title}</div>
          <div className="text-[12px] text-slate-400">{subtitle}</div>
        </div>
      </div>
      <div className="mt-4" style={{ width: '100%', height: 260 }}>
        {children}
      </div>
    </div>
  );
}
