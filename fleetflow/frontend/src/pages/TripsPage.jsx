import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '../components/DataTable';
import SidePanel from '../components/SidePanel';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import ValidationBanner from '../components/ValidationBanner';
import StatusPill from '../components/StatusPill';

const idSeq = (() => {
  let n = 10500;
  return () => `TRP-${n++}`;
})();

export default function TripsPage() {
  const [tab, setTab] = useState('All');
  const [panelOpen, setPanelOpen] = useState(false);

  const vehicles = [
    { id: 1, name: 'Truck-11', capacityKg: 18000, status: 'available' },
    { id: 2, name: 'Van-05', capacityKg: 500, status: 'available' },
    { id: 3, name: 'Bike-02', capacityKg: 25, status: 'available' },
    { id: 4, name: 'Truck-07', capacityKg: 14000, status: 'in_shop' },
  ];
  const drivers = [
    { id: 1, name: 'R. Patel', status: 'on_duty', licenseValid: true },
    { id: 2, name: 'S. Sharma', status: 'on_duty', licenseValid: true },
    { id: 3, name: 'P. Nair', status: 'off_duty', licenseValid: true },
    { id: 4, name: 'A. Khan', status: 'on_duty', licenseValid: false },
  ];

  const [trips, setTrips] = useState([
    { id: 'TRP-10492', origin: 'Ahmedabad', destination: 'Surat', vehicleId: 2, driverId: 1, weightKg: 450, status: 'dispatched', date: '2026-02-21' },
    { id: 'TRP-10487', origin: 'Mumbai', destination: 'Pune', vehicleId: 1, driverId: 2, weightKg: 8600, status: 'completed', date: '2026-02-20' },
    { id: 'TRP-10481', origin: 'Delhi', destination: 'Noida', vehicleId: 3, driverId: 4, weightKg: 12, status: 'draft', date: '2026-02-20' },
    { id: 'TRP-10479', origin: 'Bengaluru', destination: 'Mysuru', vehicleId: 4, driverId: 3, weightKg: 11200, status: 'cancelled', date: '2026-02-19' },
  ]);

  const filtered = trips.filter(t => tab === 'All' ? true : t.status === tab);

  const tripColumns = [
    {
      id: 'id',
      header: 'Trip ID',
      accessor: 'id',
      cell: (v) => <span className="ff-mono text-slate-200">{v}</span>,
    },
    {
      id: 'route',
      header: 'Origin → Destination',
      accessor: (r) => `${r.origin} ${r.destination}`,
      sortable: false,
      cell: (_v, r) => (
        <div className="text-[13px] font-semibold text-slate-100">
          {r.origin} <span className="text-slate-500">→</span> {r.destination}
        </div>
      ),
    },
    {
      id: 'assign',
      header: 'Vehicle + Driver',
      accessor: (r) => `${r.vehicleId}-${r.driverId}`,
      sortable: false,
      cell: (_v, r) => {
        const v = vehicles.find(x => x.id === r.vehicleId);
        const d = drivers.find(x => x.id === r.driverId);
        return (
          <div>
            <div className="text-[13px] font-semibold text-slate-200">{v?.name ?? '—'}</div>
            <div className="text-[12px] text-slate-400" style={{ marginTop: 3 }}>{d?.name ?? '—'}</div>
          </div>
        );
      }
    },
    { id: 'weight', header: 'Cargo (kg)', accessor: 'weightKg', cell: (v) => <span className="ff-mono">{v}</span> },
    { id: 'status', header: 'Status', accessor: 'status', sortable: false, cell: (v) => <StatusPill status={v} /> },
    { id: 'date', header: 'Date', accessor: 'date', cell: (v) => <span className="text-[13px] text-slate-300">{v}</span> },
  ];

  const createTrip = (payload) => {
    setTrips(prev => [payload, ...prev]);
    setPanelOpen(false);
    setTab('All');
  };

  const submit = (payload) => {
    createTrip(payload);
  };

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 22, color: '#F1F5F9', letterSpacing: '-0.02em' }}>Trip Dispatcher</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#94A3B8', marginTop: 4 }}>Dispatch routes, assign vehicles and drivers.</div>
        </div>
        <button className="ff-btn ff-btn-primary h-11 px-5" onClick={() => setPanelOpen(true)}>
          Create Trip
        </button>
      </div>

      <div className="ff-card p-4" style={{ borderRadius: 16 }}>
        <div className="flex flex-wrap gap-3">
          {['All', 'draft', 'dispatched', 'completed', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setTab(s)}
              className="px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-colors"
              style={{
                background: tab === s ? 'rgba(99,102,241,0.18)' : 'transparent',
                border: '1px solid rgba(51,65,85,0.8)',
                color: tab === s ? '#F1F5F9' : '#94A3B8',
                textTransform: s === 'All' ? 'none' : 'capitalize',
              }}
            >
              {s === 'All' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        title={`Trips (${filtered.length})`}
        columns={tripColumns}
        rows={filtered}
        rowKey={(r) => r.id}
        emptyTitle="No trips"
        emptyMessage="Create your first dispatch to see activity here."
        className="overflow-hidden"
      />

      <CreateTripPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        vehicles={vehicles}
        drivers={drivers}
        onCreate={submit}
      />
    </div>
  );
}

function CreateTripPanel({ open, onClose, vehicles, drivers, onCreate }) {
  const availableVehicles = useMemo(() => vehicles.filter(v => v.status === 'available'), [vehicles]);
  const eligibleDrivers = useMemo(() => drivers.filter(d => d.status === 'on_duty' && d.licenseValid), [drivers]);

  const [vehicleId, setVehicleId] = useState(availableVehicles[0]?.id ?? '');
  const [driverId, setDriverId] = useState(eligibleDrivers[0]?.id ?? '');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (!open) return;
    setVehicleId(availableVehicles[0]?.id ?? '');
    setDriverId(eligibleDrivers[0]?.id ?? '');
    setOrigin('');
    setDestination('');
    setWeight('');
    setDesc('');
    setDate('');
  }, [open, availableVehicles, eligibleDrivers]);

  const v = availableVehicles.find(x => x.id === Number(vehicleId));
  const cap = v?.capacityKg ?? 0;
  const w = Number(weight) || 0;
  const hasWeight = String(weight).trim().length > 0;
  const isOver = hasWeight && v && w > cap;
  const isOk = hasWeight && v && w > 0 && w <= cap;

  const canSubmit = !!vehicleId && !!driverId && origin.trim() && destination.trim() && date && w > 0 && !isOver;

  const submit = () => {
    if (!canSubmit) return;
    onCreate({
      id: idSeq(),
      origin,
      destination,
      vehicleId: Number(vehicleId),
      driverId: Number(driverId),
      weightKg: w,
      status: 'dispatched',
      date,
      description: desc,
    });
  };

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Create Trip"
      footer={
        <>
          <button className="ff-btn ff-btn-ghost h-11 px-5" onClick={onClose}>Cancel</button>
          <button className="ff-btn ff-btn-primary h-11 px-5" onClick={submit} style={{ opacity: canSubmit ? 1 : 0.65 }}>
            Create Trip
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="ff-label">Step 1 — Select Vehicle</div>
        <FormSelect value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
          {availableVehicles.map(v => (
            <option key={v.id} value={v.id}>{v.name} (cap: {v.capacityKg} kg)</option>
          ))}
        </FormSelect>

        <div className="ff-label">Step 2 — Select Driver</div>
        <FormSelect value={driverId} onChange={(e) => setDriverId(e.target.value)}>
          {eligibleDrivers.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </FormSelect>

        <div className="ff-label">Step 3 — Cargo Details</div>
        <div className="grid grid-cols-1 gap-4">
          <FormInput label="Origin" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Ahmedabad" />
          <FormInput label="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Surat" />
          <FormInput label="Cargo Weight (kg)" mono type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="450" />
          <FormInput label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Electronics / FMCG / Parcels" />
          <FormInput label="Scheduled Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        {isOver && (
          <ValidationBanner
            type="danger"
            message={`⚠ Cargo weight (${w} kg) exceeds ${v?.name ?? 'selected vehicle'} max capacity (${cap} kg)`}
          />
        )}
        {isOk && (
          <ValidationBanner
            type="success"
            message={`✓ Load check passed (${w}/${cap} kg)`}
          />
        )}

        <div className="ff-card p-5" style={{ borderRadius: 16 }}>
          <div className="ff-label">Dispatch Preview</div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-[13px] font-bold text-slate-100">{origin || 'Origin'} <span className="text-slate-500">→</span> {destination || 'Destination'}</div>
              <div className="text-[12px] text-slate-400" style={{ marginTop: 3 }}>{v?.name ?? 'Vehicle'} · {eligibleDrivers.find(d => d.id === Number(driverId))?.name ?? 'Driver'}</div>
            </div>
            <StatusPill status="dispatched" />
          </div>
        </div>
      </div>
    </SidePanel>
  );
}
