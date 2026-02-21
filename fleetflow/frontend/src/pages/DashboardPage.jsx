import React, { useState, useEffect } from 'react';
import {
    Truck,
    Wrench,
    Package,
    TrendingUp,
    AlertTriangle,
    ArrowRight,
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import KPICard from '../components/KPICard';
import DataTable from '../components/DataTable';
import StatusPill from '../components/StatusPill';

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
        <div className="space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KPICard label="Active Fleet" value={kpi.activeFleet} color="#38BDF8" icon={Truck} leftBorderColor="#38BDF8" />
            <KPICard label="Maintenance Alerts" value={kpi.inShop} color="#F59E0B" icon={Wrench} leftBorderColor="#F59E0B" sub="vehicles in shop" />
            <KPICard label="Utilization Rate" value={`${kpi.utilization}%`} color="#6366F1" icon={TrendingUp} leftBorderColor="#6366F1" sub="on-trip ratio" />
            <KPICard label="Pending Cargo" value={kpi.pendingCargo} color="#94A3B8" icon={Package} leftBorderColor="#94A3B8" />
          </div>

          <div className="ff-card p-4" style={{ borderRadius: 16 }}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="text-[13px] font-semibold text-slate-200">Filters</div>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex rounded-full p-1" style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(51,65,85,0.8)' }}>
                  {typeOptions.map(t => (
                    <button
                      key={t}
                      onClick={() => setVehicleType(t)}
                      className="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors"
                      style={{
                        color: vehicleType === t ? '#FFFFFF' : '#94A3B8',
                        background: vehicleType === t ? 'rgba(99,102,241,0.22)' : 'transparent',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="inline-flex rounded-full p-1" style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(51,65,85,0.8)' }}>
                  {['All', 'available', 'on_trip', 'in_shop', 'retired'].map(s => (
                    <button
                      key={s}
                      onClick={() => setVehicleStatus(s)}
                      className="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors"
                      style={{
                        color: vehicleStatus === s ? '#FFFFFF' : '#94A3B8',
                        background: vehicleStatus === s ? 'rgba(99,102,241,0.22)' : 'transparent',
                        textTransform: 'capitalize',
                      }}
                    >
                      {s === 'on_trip' ? 'On Trip' : s}
                    </button>
                  ))}

                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <DataTable
              title="Recent Trips"
              columns={tripColumns}
              rows={tripsMock.slice(0, 5)}
              rowKey={(r) => r.id}
              emptyTitle="No trips yet"
              emptyMessage="Create your first trip dispatch to see it here."
              className="overflow-hidden"
            />

            <div className="ff-card p-5" style={{ borderRadius: 16 }}>
              <div className="flex items-center justify-between">
                <div className="text-[14px] font-bold text-slate-100">Fleet Status</div>
                <div className="text-[12px] text-slate-400">Current distribution</div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div style={{ width: '100%', height: 240 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={fleetStatus}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={62}
                        outerRadius={90}
                        paddingAngle={3}
                      >
                        {fleetStatus.map((e) => (
                          <Cell key={e.name} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  {fleetStatus.map((s) => (
                    <div key={s.name} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: 'rgba(38,53,72,0.65)', border: '1px solid rgba(51,65,85,0.75)' }}>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                        <span className="text-[13px] font-semibold text-slate-200">{s.name}</span>
                      </div>
                      <span className="ff-mono text-[13px] text-slate-200">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="ff-card p-5" style={{ borderRadius: 16 }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[14px] font-bold text-slate-100">Driver Compliance Alerts</div>
                <div className="text-[12px] text-slate-400 mt-0.5">Licenses expiring within 30 days</div>
              </div>
              <div className="text-[12px] text-slate-500">Next 30 days</div>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
              {complianceMock.map((d) => (
                <div
                  key={d.id}
                  className="rounded-xl px-4 py-3 flex items-start gap-3"
                  style={{
                    background: d.severity === 'danger' ? 'rgba(239,68,68,0.10)' : 'rgba(245,158,11,0.10)',
                    border: `1px solid ${d.severity === 'danger' ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`,
                  }}
                >
                  <div className="w-9 h-9 rounded-xl grid place-items-center" style={{ background: 'rgba(15,17,23,0.45)', border: '1px solid rgba(51,65,85,0.75)' }}>
                    <AlertTriangle size={16} className={d.severity === 'danger' ? 'text-red-400' : 'text-amber-300'} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-slate-100 truncate">{d.name}</div>
                    <div className="text-[12px] text-slate-400 ff-mono truncate">{d.license}</div>
                    <div className={`mt-1 text-[12px] font-bold ${d.severity === 'danger' ? 'text-red-400' : 'text-amber-300'}`}>
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
