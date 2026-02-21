import React, { useState } from 'react';
import { Plus, AlertTriangle, Wrench } from 'lucide-react';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import DataTable from '../components/DataTable';
import StatusPill from '../components/StatusPill';

export default function MaintenancePage() {
  const vehicles = [
    { id: 1, name: 'Truck-11', status: 'available' },
    { id: 2, name: 'Van-05', status: 'on_trip' },
    { id: 3, name: 'Bike-02', status: 'available' },
    { id: 4, name: 'Truck-07', status: 'in_shop' },
    { id: 5, name: 'Van-01', status: 'retired' },
  ];

  const [logs, setLogs] = useState([
    { id: 1, vehicleId: 4, type: 'Engine Repair', description: 'Oil leakage & gasket replacement', date: '2026-02-18', cost: 24000, odometerKm: 210901, status: 'in_shop' },
    { id: 2, vehicleId: 1, type: 'Inspection', description: 'Quarterly inspection & compliance checklist', date: '2026-02-10', cost: 4500, odometerKm: 181920, status: 'completed' },
    { id: 3, vehicleId: 2, type: 'Tire Service', description: 'Front left tire replaced', date: '2026-02-05', cost: 6200, odometerKm: 47810, status: 'completed' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ vehicleId: 4, type: 'Oil Change', description: '', date: '', cost: '', odometerKm: '', nextServiceKm: '' });

  const totals = {
    active: logs.filter(l => l.status === 'in_shop').length,
    completedMonth: logs.filter(l => l.status === 'completed' && String(l.date).startsWith('2026-02')).length,
    totalCost: logs.reduce((s, l) => s + (Number(l.cost) || 0), 0),
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ vehicleId: 4, type: 'Oil Change', description: '', date: '', cost: '', odometerKm: '', nextServiceKm: '' });
    setModalOpen(true);
  };

  const save = () => {
    const payload = {
      id: editing?.id ?? Math.max(...logs.map(l => l.id)) + 1,
      vehicleId: Number(form.vehicleId),
      type: form.type,
      description: form.description,
      date: form.date,
      cost: Number(form.cost) || 0,
      odometerKm: Number(form.odometerKm) || 0,
      status: 'in_shop',
      nextServiceKm: Number(form.nextServiceKm) || null,
    };
    setLogs(prev => (editing ? prev.map(l => l.id === editing.id ? payload : l) : [payload, ...prev]));
    setModalOpen(false);
  };

  const columns = [
    { id: 'vehicle', header: 'Vehicle', accessor: (r) => r.vehicleId, cell: (v) => <span className="text-[13px] font-semibold text-slate-200">{vehicles.find(x => x.id === v)?.name ?? '—'}</span> },
    {
      id: 'type', header: 'Service Type', accessor: 'type', cell: (v) => (
        <span className="px-2 py-1 rounded-md text-[12px] font-semibold" style={{ background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.25)', color: '#7DD3FC' }}>{v}</span>
      )
    },
    { id: 'desc', header: 'Description', accessor: 'description', sortable: false, cell: (v) => <span className="text-[13px] text-slate-300">{String(v).length > 38 ? `${String(v).slice(0, 38)}…` : v}</span> },
    { id: 'date', header: 'Date', accessor: 'date', cell: (v) => <span className="text-[13px] text-slate-300">{v}</span> },
    { id: 'cost', header: 'Cost', accessor: 'cost', cell: (v) => <span className="ff-mono">₹{Number(v).toLocaleString()}</span> },
    { id: 'odo', header: 'Odometer', accessor: 'odometerKm', cell: (v) => <span className="ff-mono">{Number(v).toLocaleString()}</span> },
    { id: 'status', header: 'Status', accessor: 'status', sortable: false, cell: (v) => <StatusPill status={v === 'in_shop' ? 'in_shop' : v} /> },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[18px] font-bold text-slate-100">Maintenance Logs</div>
          <div className="text-[13px] text-slate-400">Track service logs, costs, and vehicle health.</div>
        </div>
        <button className="ff-btn ff-btn-primary h-10 px-4" onClick={openAdd}>
          <Plus size={16} /> Add Service Log
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MiniStat label="Active Services" value={totals.active} />
        <MiniStat label="Completed This Month" value={totals.completedMonth} />
        <MiniStat label="Total Maintenance Cost" value={`₹${totals.totalCost.toLocaleString()}`} />
      </div>

      <div className="ff-card p-4" style={{ borderRadius: 16 }}>
        <div className="ff-label mb-3">Vehicle Health</div>
        <div className="flex flex-wrap gap-2">
          {vehicles.map(v => (
            <span
              key={v.id}
              className="px-3 py-1.5 rounded-full text-[12px] font-semibold"
              style={{
                background: v.status === 'available' ? 'rgba(34,197,94,0.10)' : v.status === 'in_shop' ? 'rgba(245,158,11,0.12)' : v.status === 'retired' ? 'rgba(100,116,139,0.14)' : 'rgba(56,189,248,0.10)',
                border: '1px solid rgba(51,65,85,0.85)',
                color: '#E2E8F0',
              }}
            >
              {v.name}
            </span>
          ))}
        </div>
      </div>

      <div className="ff-card p-1" style={{ borderRadius: 16 }}>
        <div className="p-4">
          <div className="text-[14px] font-bold text-slate-100">Service Logs</div>
          <div className="text-[12px] text-slate-400">In Shop rows show amber highlight.</div>
        </div>
        <div className="px-4 pb-4">
          <DataTable
            columns={columns}
            rows={logs}
            rowKey={(r) => r.id}
            searchable
            emptyTitle="No maintenance logs"
            emptyMessage="Add your first service log to track vehicle health."
          />
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Service Log' : 'Add Service Log'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="ff-btn ff-btn-ghost h-10 px-4" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="ff-btn ff-btn-primary h-10 px-4" onClick={save}>Save</button>
          </>
        }
      >
        <div className="rounded-xl px-3 py-2 mb-4 flex items-start gap-2" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <AlertTriangle size={16} className="text-amber-300 mt-0.5" />
          <div className="text-[13px] text-slate-200 font-semibold">
            Adding this log will automatically change vehicle status to In Shop
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect label="Vehicle" value={form.vehicleId} onChange={(e) => setForm(p => ({ ...p, vehicleId: e.target.value }))}>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </FormSelect>
          <FormSelect label="Service Type" value={form.type} onChange={(e) => setForm(p => ({ ...p, type: e.target.value }))}>
            <option>Oil Change</option>
            <option>Inspection</option>
            <option>Tire Service</option>
            <option>Brakes</option>
            <option>Engine Repair</option>
            <option>Other</option>
          </FormSelect>

          <div className="md:col-span-2">
            <FormInput label="Description" value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe service" />
          </div>
          <FormInput label="Service Date" type="date" value={form.date} onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))} />
          <FormInput label="Cost" mono type="number" value={form.cost} onChange={(e) => setForm(p => ({ ...p, cost: e.target.value }))} />
          <FormInput label="Odometer at Service" mono type="number" value={form.odometerKm} onChange={(e) => setForm(p => ({ ...p, odometerKm: e.target.value }))} />
          <FormInput label="Next Service (km)" mono type="number" value={form.nextServiceKm} onChange={(e) => setForm(p => ({ ...p, nextServiceKm: e.target.value }))} />
        </div>
      </Modal>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="ff-card ff-card-hover p-5" style={{ borderRadius: 16 }}>
      <div className="ff-label">{label}</div>
      <div className="mt-2 text-[22px] font-extrabold text-slate-100">{value}</div>
    </div>
  );
}
