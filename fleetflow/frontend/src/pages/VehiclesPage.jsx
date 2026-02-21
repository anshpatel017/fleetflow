import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import StatusPill from '../components/StatusPill';
import DataTable from '../components/DataTable';

const EMPTY = {
  name: '',
  plate: '',
  type: 'Truck',
  capacityKg: 0,
  odometerKm: 0,
  status: 'available',
  region: 'West',
  acquisitionCost: 0,
  retired: false,
};

function VehicleModal({ open, initial, onClose, onSave }) {
  const [v, setV] = useState(initial ?? EMPTY);

  React.useEffect(() => {
    if (open) setV(initial ?? EMPTY);
  }, [open, initial]);

  const submit = () => {
    onSave({
      ...v,
      capacityKg: Number(v.capacityKg) || 0,
      odometerKm: Number(v.odometerKm) || 0,
      acquisitionCost: Number(v.acquisitionCost) || 0,
      status: v.retired ? 'retired' : v.status,
    });
  };

  return (
    <Modal
      open={open}
      title={initial ? 'Edit Vehicle' : 'Add Vehicle'}
      onClose={onClose}
      footer={
        <>
          <button className="ff-btn ff-btn-ghost h-11 px-5" onClick={onClose}>Cancel</button>
          <button className="ff-btn ff-btn-primary h-11 px-5" onClick={submit}>Save</button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput label="Name / Model" value={v.name} onChange={(e) => setV(p => ({ ...p, name: e.target.value }))} placeholder="Truck-11" />
        <FormInput label="License Plate" mono value={v.plate} onChange={(e) => setV(p => ({ ...p, plate: e.target.value }))} placeholder="GJ-01-TR-011" />

        <FormSelect label="Type" value={v.type} onChange={(e) => setV(p => ({ ...p, type: e.target.value }))}>
          <option value="Truck">Truck</option>
          <option value="Van">Van</option>
          <option value="Bike">Bike</option>
        </FormSelect>

        <FormSelect label="Status" value={v.status} onChange={(e) => setV(p => ({ ...p, status: e.target.value }))}>
          <option value="available">Available</option>
          <option value="on_trip">On Trip</option>
          <option value="in_shop">In Shop</option>
          <option value="retired">Retired</option>
        </FormSelect>

        <FormInput label="Max Capacity (kg)" mono type="number" value={v.capacityKg} onChange={(e) => setV(p => ({ ...p, capacityKg: e.target.value }))} />
        <FormInput label="Odometer (km)" mono type="number" value={v.odometerKm} onChange={(e) => setV(p => ({ ...p, odometerKm: e.target.value }))} />

        <FormSelect label="Region" value={v.region} onChange={(e) => setV(p => ({ ...p, region: e.target.value }))}>
          <option value="West">West</option>
          <option value="North">North</option>
          <option value="East">East</option>
          <option value="South">South</option>
        </FormSelect>
        <FormInput label="Acquisition Cost" mono type="number" value={v.acquisitionCost} onChange={(e) => setV(p => ({ ...p, acquisitionCost: e.target.value }))} />

        <div className="md:col-span-2">
          <div className="ff-label mb-2">Preview</div>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: 'rgba(38,53,72,0.65)', border: '1px solid rgba(51,65,85,0.75)' }}>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-slate-100">{v.name || '—'}</div>
              <div className="text-[12px] text-slate-400 ff-mono" style={{ marginTop: 3 }}>{v.plate || '—'}</div>
            </div>
            <div className="ml-auto"><StatusPill status={v.status} /></div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function VehiclesPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [status, setStatus] = useState('All');
  const [region, setRegion] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [rows, setRows] = useState([
    { id: 1, name: 'Truck-11', plate: 'GJ-01-TR-011', type: 'Truck', capacityKg: 18000, odometerKm: 182340, status: 'available', region: 'West', acquisitionCost: 4200000, retired: false },
    { id: 2, name: 'Van-05', plate: 'MH-12-VN-005', type: 'Van', capacityKg: 500, odometerKm: 48210, status: 'on_trip', region: 'North', acquisitionCost: 980000, retired: false },
    { id: 3, name: 'Bike-02', plate: 'DL-09-BK-002', type: 'Bike', capacityKg: 25, odometerKm: 9310, status: 'available', region: 'East', acquisitionCost: 85000, retired: false },
    { id: 4, name: 'Truck-07', plate: 'KA-03-TR-007', type: 'Truck', capacityKg: 14000, odometerKm: 210901, status: 'in_shop', region: 'South', acquisitionCost: 3900000, retired: false },
    { id: 5, name: 'Van-01', plate: 'GJ-05-VN-001', type: 'Van', capacityKg: 650, odometerKm: 75220, status: 'retired', region: 'West', acquisitionCost: 920000, retired: true },
  ]);

  const regions = ['All', ...Array.from(new Set(rows.map(r => r.region)))];

  const filtered = rows.filter(r => {
    const q = search.trim().toLowerCase();
    const okQ = !q ? true : (r.name.toLowerCase().includes(q) || r.plate.toLowerCase().includes(q));
    const okType = type === 'All' ? true : r.type === type;
    const okStatus = status === 'All' ? true : r.status === status;
    const okRegion = region === 'All' ? true : r.region === region;
    return okQ && okType && okStatus && okRegion;
  });

  const onAdd = () => { setEditing(null); setModalOpen(true); };
  const onEdit = (r) => { setEditing(r); setModalOpen(true); };
  const onRetireToggle = (id) => {
    setRows(prev => prev.map(r => r.id === id ? ({
      ...r,
      retired: !r.retired,
      status: !r.retired ? 'retired' : 'available',
    }) : r));
  };

  const saveVehicle = (payload) => {
    setRows(prev => {
      if (payload.id) return prev.map(r => r.id === payload.id ? payload : r);
      const nextId = Math.max(...prev.map(x => x.id)) + 1;
      return [{ ...payload, id: nextId }, ...prev];
    });
    setModalOpen(false);
  };

  const columns = [
    {
      id: 'vehicle',
      header: 'Vehicle',
      accessor: (r) => r.name,
      cell: (_v, r) => (
        <div style={{ opacity: r.retired ? 0.5 : 1 }}>
          <div className={`text-[13px] font-bold text-slate-100 ${r.retired ? 'line-through' : ''}`}>{r.name}</div>
          <div className="text-[12px] text-slate-400 ff-mono" style={{ marginTop: 3 }}>{r.plate}</div>
        </div>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      accessor: 'type',
      cell: (v) => (
        <span
          className="px-2 py-1 rounded-md text-[12px] font-semibold"
          style={{
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#C7D2FE',
          }}
        >
          {v}
        </span>
      ),
    },
    { id: 'capacity', header: 'Capacity', accessor: 'capacityKg', cell: (v) => <span className="ff-mono">{Number(v).toLocaleString()} kg</span> },
    { id: 'odometer', header: 'Odometer', accessor: 'odometerKm', cell: (v) => <span className="ff-mono">{Number(v).toLocaleString()} km</span> },
    { id: 'status', header: 'Status', accessor: 'status', sortable: false, cell: (v) => <StatusPill status={v} /> },
    { id: 'region', header: 'Region', accessor: 'region' },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (r) => r.id,
      sortable: false,
      searchable: false,
      cell: (_v, r) => (
        <div className="flex items-center gap-2 justify-end">
          <button className="ff-btn ff-btn-ghost h-9 px-3" onClick={() => onEdit(r)}>Edit</button>
          <button
            className="ff-btn ff-btn-ghost h-9 px-3"
            onClick={() => onRetireToggle(r.id)}
            style={{ borderColor: r.retired ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)' }}
          >
            {r.retired ? 'Unretire' : 'Retire'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 22, color: '#F1F5F9', letterSpacing: '-0.02em' }}>Vehicle Registry</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#94A3B8', marginTop: 4 }}>Manage assets, capacity, and availability.</div>
        </div>
        <button className="ff-btn ff-btn-primary h-11 px-5" onClick={onAdd}>
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      <div className="ff-card p-5" style={{ borderRadius: 16 }}>
        <div className="ff-label" style={{ marginBottom: 10 }}>Filters</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input className="ff-input h-11" placeholder="Search name or plate" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="ff-input h-11" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="All">All types</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Bike">Bike</option>
          </select>
          <select className="ff-input h-11" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">All status</option>
            <option value="available">Available</option>
            <option value="on_trip">On Trip</option>
            <option value="in_shop">In Shop</option>
            <option value="retired">Retired</option>
          </select>
          <select className="ff-input h-11" value={region} onChange={(e) => setRegion(e.target.value)}>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <DataTable
        title={`Vehicles (${filtered.length})`}
        columns={columns}
        rows={filtered}
        rowKey={(r) => r.id}
        emptyTitle="No vehicles found"
        emptyMessage="Add your first vehicle to begin tracking your fleet."
        className="overflow-hidden"
      />

      <VehicleModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={saveVehicle}
      />
    </div>
  );
}
