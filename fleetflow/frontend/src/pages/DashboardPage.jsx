import React, { useState, useEffect } from 'react';
import {
    Truck,
    Wrench,
    Package,
    TrendingUp,
    AlertTriangle,
    ArrowRight,
    Clock,
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    BarChart,
    Bar,
    Legend,
} from 'recharts';
import KPICard from '../components/KPICard';
import DataTable from '../components/DataTable';
import StatusPill from '../components/StatusPill';
import EmptyState from '../components/EmptyState';

const vehiclesMock = [
  { id: 1, name: 'Truck-11', plate: 'GJ-01-TR-011', type: 'Truck', capacityKg: 18000, odometerKm: 182340, status: 'available', region: 'West' },
  { id: 2, name: 'Van-05', plate: 'MH-12-VN-005', type: 'Van', capacityKg: 500, odometerKm: 48210, status: 'on_trip', region: 'North' },
  { id: 3, name: 'Bike-02', plate: 'DL-09-BK-002', type: 'Bike', capacityKg: 25, odometerKm: 9310, status: 'available', region: 'East' },
  { id: 4, name: 'Truck-07', plate: 'KA-03-TR-007', type: 'Truck', capacityKg: 14000, odometerKm: 210901, status: 'in_shop', region: 'South' },
  { id: 5, name: 'Van-01', plate: 'GJ-05-VN-001', type: 'Van', capacityKg: 650, odometerKm: 75220, status: 'retired', region: 'West' },
];

const tripsMock = [
  { id: 'TRP-10492', origin: 'Ahmedabad', destination: 'Surat', vehicle: 'Van-05', driver: 'R. Patel', weightKg: 450, status: 'dispatched', date: '2026-02-21' },
  { id: 'TRP-10487', origin: 'Mumbai', destination: 'Pune', vehicle: 'Truck-11', driver: 'S. Sharma', weightKg: 8600, status: 'completed', date: '2026-02-20' },
  { id: 'TRP-10481', origin: 'Delhi', destination: 'Noida', vehicle: 'Bike-02', driver: 'A. Khan', weightKg: 12, status: 'draft', date: '2026-02-20' },
  { id: 'TRP-10479', origin: 'Bengaluru', destination: 'Mysuru', vehicle: 'Truck-07', driver: 'P. Nair', weightKg: 11200, status: 'cancelled', date: '2026-02-19' },
  { id: 'TRP-10476', origin: 'Jaipur', destination: 'Ajmer', vehicle: 'Truck-11', driver: 'S. Sharma', weightKg: 9400, status: 'dispatched', date: '2026-02-19' },
];

const complianceMock = [
  { id: 1, name: 'R. Patel', license: 'LIC-IND-00941', days: 12, severity: 'warning' },
  { id: 2, name: 'P. Nair', license: 'LIC-IND-00312', days: 5, severity: 'danger' },
  { id: 3, name: 'A. Khan', license: 'LIC-IND-01104', days: 27, severity: 'warning' },
];

const typeOptions = ['All', 'Truck', 'Van', 'Bike'];

const weeklyTrips = [
  { week: 'W1', trips: 14, delivered: 12 },
  { week: 'W2', trips: 19, delivered: 17 },
  { week: 'W3', trips: 16, delivered: 14 },
  { week: 'W4', trips: 22, delivered: 19 },
  { week: 'W5', trips: 25, delivered: 23 },
  { week: 'W6', trips: 21, delivered: 20 },
];

const vehicleUsage = [
  { name: 'Truck-11', km: 1840 },
  { name: 'Van-05', km: 1120 },
  { name: 'Bike-02', km: 680 },
  { name: 'Truck-07', km: 420 },
  { name: 'Van-01', km: 0 },
];

function kpiFromMock(vehicles, trips) {
  const activeFleet = vehicles.filter(v => v.status !== 'retired').length;
  const inShop = vehicles.filter(v => v.status === 'in_shop').length;
  const onTrip = vehicles.filter(v => v.status === 'on_trip').length;
  const utilization = vehicles.length ? Math.round((onTrip / vehicles.length) * 100) : 0;
  const pendingCargo = trips.filter(t => t.status === 'draft' || t.status === 'dispatched').length;
  return { activeFleet, inShop, utilization, pendingCargo };
}

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="ff-card px-3 py-2" style={{ background: 'var(--ff-surface-elev)', borderRadius: 12 }}>
      <div className="text-[13px] font-bold text-slate-100">{p.name}</div>
      <div className="text-[12px] text-slate-300">{p.value} vehicles</div>
    </div>
  );
};

export default function DashboardPage() {
    const [vehicleType, setVehicleType] = useState('All');
    const [vehicleStatus, setVehicleStatus] = useState('All');

    const filteredVehicles = vehiclesMock.filter(v => {
      const okType = vehicleType === 'All' ? true : v.type === vehicleType;
      const okStatus = vehicleStatus === 'All' ? true : v.status === vehicleStatus;
      return okType && okStatus;
    });

    const kpi = kpiFromMock(filteredVehicles, tripsMock);

    const fleetStatus = [
      { name: 'Available', value: filteredVehicles.filter(v => v.status === 'available').length, color: '#22C55E' },
      { name: 'On Trip', value: filteredVehicles.filter(v => v.status === 'on_trip').length, color: '#38BDF8' },
      { name: 'In Shop', value: filteredVehicles.filter(v => v.status === 'in_shop').length, color: '#F59E0B' },
      { name: 'Retired', value: filteredVehicles.filter(v => v.status === 'retired').length, color: '#64748B' },
    ].filter(x => x.value > 0);

    const tripColumns = [
      {
        id: 'id',
        header: 'Trip ID',
        accessor: 'id',
        cell: (v) => <span className="ff-mono text-[13px] text-slate-200">{v}</span>,
      },
      {
        id: 'route',
        header: 'Route',
        accessor: (r) => `${r.origin} → ${r.destination}`,
        cell: (_v, r) => (
          <div className="text-[13px] font-semibold text-slate-100">
            {r.origin} <ArrowRight size={14} className="inline-block mx-1 text-slate-500" /> {r.destination}
          </div>
        ),
        sortable: false,
      },
      { id: 'vehicle', header: 'Vehicle', accessor: 'vehicle', cell: (v) => <span className="text-[13px] text-slate-200">{v}</span> },
      { id: 'driver', header: 'Driver', accessor: 'driver', cell: (v) => <span className="text-[13px] text-slate-200">{v}</span> },
      { id: 'weightKg', header: 'Cargo (kg)', accessor: 'weightKg', cell: (v) => <span className="ff-mono">{v}</span> },
      { id: 'status', header: 'Status', accessor: 'status', sortable: false, cell: (v) => <StatusPill status={v} /> },
    ];

    return (
        <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <KPICard label="Active Fleet" value={kpi.activeFleet} color="#38BDF8" icon={Truck} leftBorderColor="#38BDF8" />
            <KPICard label="Maintenance Alerts" value={kpi.inShop} color="#F59E0B" icon={Wrench} leftBorderColor="#F59E0B" sub="vehicles in shop" />
            <KPICard label="Utilization Rate" value={`${kpi.utilization}%`} color="#6366F1" icon={TrendingUp} leftBorderColor="#6366F1" sub="on-trip ratio" />
            <KPICard label="Pending Cargo" value={kpi.pendingCargo} color="#94A3B8" icon={Package} leftBorderColor="#94A3B8" />
          </div>

          <div className="ff-card p-5" style={{ borderRadius: 16 }}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div style={{ fontSize: 14, fontWeight: 600, color: '#CBD5E1' }}>Filters</div>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex rounded-full p-1" style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(51,65,85,0.8)', gap: 4 }}>
                  {typeOptions.map(t => (
                    <button
                      key={t}
                      onClick={() => setVehicleType(t)}
                      className="px-4 py-2 rounded-full text-[12.5px] font-semibold transition-colors"
                      style={{
                        color: vehicleType === t ? '#FFFFFF' : '#94A3B8',
                        background: vehicleType === t ? 'rgba(99,102,241,0.22)' : 'transparent',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="inline-flex rounded-full p-1" style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(51,65,85,0.8)', gap: 4 }}>
                  {['All', 'available', 'on_trip', 'in_shop', 'retired'].map(s => (
                    <button
                      key={s}
                      onClick={() => setVehicleStatus(s)}
                      className="px-4 py-2 rounded-full text-[12.5px] font-semibold transition-colors"
                      style={{
                        color: vehicleStatus === s ? '#FFFFFF' : '#94A3B8',
                        background: vehicleStatus === s ? 'rgba(99,102,241,0.22)' : 'transparent',
                        textTransform: 'capitalize',
                      }}
                    >
                      {s === 'on_trip' ? 'On Trip' : s === 'in_shop' ? 'In Shop' : s}
                    </button>
                  ))}

                </div>
              </div>
            </div>
          </div>

          {/* ── Recent Trips + Fleet Status ── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <DataTable
              title="Recent Trips"
              columns={tripColumns}
              rows={tripsMock.slice(0, 5)}
              rowKey={(r) => r.id}
              emptyTitle="No trips yet"
              emptyMessage="Create your first trip dispatch to see it here."
              className="overflow-hidden"
            />

            <div className="ff-card" style={{ borderRadius: 18, padding: '24px 28px', border: '1.5px solid rgba(51,65,85,0.7)' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700, color: '#F1F5F9' }}>Fleet Status</div>
                <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Current distribution</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div style={{ width: '100%', height: 220, position: 'relative' }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <defs>
                        <filter id="donutShadow">
                          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
                        </filter>
                      </defs>
                      <Pie
                        data={fleetStatus}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={85}
                        paddingAngle={4}
                        strokeWidth={0}
                        animationDuration={800}
                      >
                        {fleetStatus.map((e) => (
                          <Cell key={e.name} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center label */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 800, color: '#F1F5F9' }}>{filteredVehicles.length}</div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginTop: 2 }}>Total</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {fleetStatus.map((s) => (
                    <div key={s.name} className="flex items-center justify-between" style={{ borderRadius: 12, padding: '10px 14px', background: 'rgba(30,41,59,0.55)', border: '1px solid rgba(51,65,85,0.6)' }}>
                      <div className="flex items-center gap-3">
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, boxShadow: `0 0 6px ${s.color}55` }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1' }}>{s.name}</span>
                      </div>
                      <span className="ff-mono" style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0' }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Trip Trend + Vehicle Usage Charts ── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="ff-card" style={{ borderRadius: 18, padding: '24px 28px', border: '1.5px solid rgba(51,65,85,0.7)' }}>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700, color: '#F1F5F9' }}>Trip Trends</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>Weekly trips vs delivered</div>
              </div>
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyTrips} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
                    <defs>
                      <linearGradient id="tripAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="deliveredAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#22C55E" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(51,65,85,0.35)" vertical={false} />
                    <XAxis dataKey="week" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }} labelStyle={{ color: '#F1F5F9', fontWeight: 600, marginBottom: 4 }} itemStyle={{ color: '#94A3B8' }} />
                    <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} wrapperStyle={{ paddingBottom: 8, fontSize: 11, color: '#94A3B8' }} />
                    <Area type="monotone" dataKey="trips" name="Total" stroke="#6366F1" fill="url(#tripAreaGrad)" strokeWidth={2.5} dot={{ r: 3, fill: '#6366F1', stroke: '#1E293B', strokeWidth: 2 }} activeDot={{ r: 5 }} animationDuration={800} />
                    <Area type="monotone" dataKey="delivered" name="Delivered" stroke="#22C55E" fill="url(#deliveredAreaGrad)" strokeWidth={2} dot={{ r: 3, fill: '#22C55E', stroke: '#1E293B', strokeWidth: 2 }} activeDot={{ r: 5 }} animationDuration={800} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="ff-card" style={{ borderRadius: 18, padding: '24px 28px', border: '1.5px solid rgba(51,65,85,0.7)' }}>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700, color: '#F1F5F9' }}>Vehicle Mileage</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>Distance covered this month (km)</div>
              </div>
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vehicleUsage} layout="vertical" margin={{ top: 8, right: 24, bottom: 4, left: 4 }}>
                    <defs>
                      <linearGradient id="mileageGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.85} />
                        <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.95} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(51,65,85,0.35)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#CBD5E1', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} width={75} />
                    <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }} labelStyle={{ color: '#F1F5F9', fontWeight: 600, marginBottom: 4 }} itemStyle={{ color: '#94A3B8' }} cursor={{ fill: 'rgba(14,165,233,0.06)' }} />
                    <Bar dataKey="km" name="Distance (km)" fill="url(#mileageGrad)" radius={[0, 8, 8, 0]} barSize={20} animationDuration={800} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── Compliance Alerts ── */}
          <div className="ff-card" style={{ borderRadius: 18, padding: '24px 28px', border: '1.5px solid rgba(51,65,85,0.7)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700, color: '#F1F5F9' }}>Driver Compliance Alerts</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Licenses expiring within 30 days</div>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Next 30 days</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {complianceMock.map((d) => (
                <div key={d.id} className="flex items-start gap-4"
                  style={{
                    borderRadius: 14,
                    padding: '18px 20px',
                    background: d.severity === 'danger' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                    border: `1.5px solid ${d.severity === 'danger' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', background: 'rgba(15,17,23,0.5)', border: '1px solid rgba(51,65,85,0.7)', flexShrink: 0 }}>
                    <AlertTriangle size={17} className={d.severity === 'danger' ? 'text-red-400' : 'text-amber-300'} />
                  </div>
                  <div className="min-w-0">
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9' }} className="truncate">{d.name}</div>
                    <div className="ff-mono truncate" style={{ fontSize: 12, color: '#94A3B8', marginTop: 5 }}>{d.license}</div>
                    <div className={`text-[12px] font-bold ${d.severity === 'danger' ? 'text-red-400' : 'text-amber-300'}`} style={{ marginTop: 5 }}>
                      Expires in {d.days} days
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
    );
}
