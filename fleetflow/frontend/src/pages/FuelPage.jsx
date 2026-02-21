import React, { useState } from 'react';
import { Plus, Fuel } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';

export default function FuelPage() {
  const vehicles = [
    { id: 1, name: 'Truck-11', plate: 'GJ-01-TR-011' },
    { id: 2, name: 'Van-05', plate: 'MH-12-VN-005' },
    { id: 3, name: 'Bike-02', plate: 'DL-09-BK-002' },
  ];

  const [logs, setLogs] = useState([
    { id: 1, vehicleId: 1, tripId: 'TRP-10487', date: '2026-02-20', liters: 148, costPerLiter: 97.2, odometerKm: 182010, station: 'HP - SG Highway' },
    { id: 2, vehicleId: 2, tripId: 'TRP-10492', date: '2026-02-21', liters: 42, costPerLiter: 101.1, odometerKm: 48210, station: 'IOCL - Ring Road' },
    { id: 3, vehicleId: 3, tripId: null, date: '2026-02-19', liters: 6, costPerLiter: 108.5, odometerKm: 9302, station: 'BP - Sector 18' },
  ]);

  const efficiency = [
    { month: 'Sep', truck11: 3.8, van05: 13.2, bike02: 42.0 },
    { month: 'Oct', truck11: 4.1, van05: 12.6, bike02: 40.5 },
    { month: 'Nov', truck11: 3.9, van05: 13.1, bike02: 41.2 },
    { month: 'Dec', truck11: 4.2, van05: 13.4, bike02: 43.1 },
    { month: 'Jan', truck11: 4.0, van05: 12.9, bike02: 42.7 },
    { month: 'Feb', truck11: 4.3, van05: 13.6, bike02: 43.8 },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ vehicleId: 1, tripId: '', date: '', liters: '', costPerLiter: '', odometerKm: '', station: '' });

  const totals = {
    totalSpend: logs.reduce((s, l) => s + (l.liters * l.costPerLiter), 0),
    totalLiters: logs.reduce((s, l) => s + l.liters, 0),
  };
  const avgCost = totals.totalLiters ? totals.totalSpend / totals.totalLiters : 0;

  const columns = [
    {
      id: 'veh', header: 'Vehicle', accessor: (r) => r.vehicleId,
      cell: (vId) => {
        const v = vehicles.find(x => x.id === vId);
        return (
          <div>
            <div className="text-[13px] font-bold text-slate-100">{v?.name ?? '—'}</div>
            <div className="text-[12px] text-slate-400 ff-mono">{v?.plate ?? '—'}</div>
          </div>
        );
      }
    },
    { id: 'trip', header: 'Trip ID', accessor: 'tripId', cell: (v) => v ? <span className="ff-mono text-slate-200">{v}</span> : <span className="text-slate-500">—</span> },
    { id: 'date', header: 'Date', accessor: 'date' },
    { id: 'liters', header: 'Liters', accessor: 'liters', cell: (v) => <span className="ff-mono">{v} L</span> },
    { id: 'cpl', header: 'Cost/L', accessor: 'costPerLiter', cell: (v) => <span className="ff-mono">₹{Number(v).toFixed(2)}</span> },
    { id: 'total', header: 'Total Cost', accessor: (r) => r.liters * r.costPerLiter, cell: (v) => <span className="ff-mono">₹{Number(v).toFixed(0)}</span> },
    { id: 'odo', header: 'Odometer', accessor: 'odometerKm', cell: (v) => <span className="ff-mono">{Number(v).toLocaleString()}</span> },
    { id: 'station', header: 'Station', accessor: 'station', sortable: false },
  ];

  const liveTotal = (Number(form.liters) || 0) * (Number(form.costPerLiter) || 0);

  const openAdd = () => {
    setForm({ vehicleId: 1, tripId: '', date: '', liters: '', costPerLiter: '', odometerKm: '', station: '' });
    setModalOpen(true);
  };

  const save = () => {
    const next = {
      id: Math.max(...logs.map(l => l.id)) + 1,
      vehicleId: Number(form.vehicleId),
      tripId: form.tripId.trim() ? form.tripId.trim() : null,
      date: form.date,
      liters: Number(form.liters) || 0,
      costPerLiter: Number(form.costPerLiter) || 0,
      odometerKm: Number(form.odometerKm) || 0,
      station: form.station,
    };
    setLogs(prev => [next, ...prev]);
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[18px] font-bold text-slate-100">Fuel & Expenses</div>
          <div className="text-[13px] text-slate-400">Track spend, liters, and efficiency trends.</div>
        </div>
        <button className="ff-btn ff-btn-primary h-10 px-4" onClick={openAdd}>
          <Plus size={16} /> Add Fuel Log
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MiniStat label="Total Fuel Spend (This Month)" value={`₹${totals.totalSpend.toFixed(0)}`} />
        <MiniStat label="Total Liters" value={`${totals.totalLiters.toFixed(0)} L`} />
        <MiniStat label="Avg Cost/L" value={`₹${avgCost.toFixed(2)}`} />
        <MiniStat label="Best Efficiency Vehicle" value="Bike-02" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <DataTable
          title={`Fuel Logs (${logs.length})`}
          columns={columns}
          rows={logs}
          rowKey={(r) => r.id}
          emptyTitle="No fuel logs"
          emptyMessage="Add your first fill-up entry to track expenses."
          className="overflow-hidden"
        />

        <div className="ff-card p-5" style={{ borderRadius: 16 }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[14px] font-bold text-slate-100">Efficiency Trend</div>
              <div className="text-[12px] text-slate-400">km/L over last 6 months</div>
            </div>
            <div className="inline-flex items-center gap-2 text-[12px] text-slate-400">
              <Fuel size={14} />
              Efficiency
            </div>
          </div>

          <div className="mt-4" style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={efficiency}>
                <CartesianGrid stroke="rgba(51,65,85,0.6)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#263548', border: '1px solid rgba(51,65,85,0.8)', borderRadius: 12, color: '#E2E8F0' }}
                  labelStyle={{ color: '#E2E8F0', fontWeight: 700 }}
                />
                <Line type="monotone" dataKey="truck11" stroke="#38BDF8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="van05" stroke="#6366F1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="bike02" stroke="#22C55E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title="Add Fuel Log"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="ff-btn ff-btn-ghost h-10 px-4" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="ff-btn ff-btn-primary h-10 px-4" onClick={save}>Save</button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect label="Vehicle" value={form.vehicleId} onChange={(e) => setForm(p => ({ ...p, vehicleId: e.target.value }))}>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} ({v.plate})</option>)}
          </FormSelect>
          <FormInput label="Trip (optional)" mono value={form.tripId} onChange={(e) => setForm(p => ({ ...p, tripId: e.target.value }))} placeholder="TRP-10492" />
          <FormInput label="Date" type="date" value={form.date} onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))} />
          <FormInput label="Liters" mono type="number" value={form.liters} onChange={(e) => setForm(p => ({ ...p, liters: e.target.value }))} />
          <FormInput label="Cost per Liter" mono type="number" value={form.costPerLiter} onChange={(e) => setForm(p => ({ ...p, costPerLiter: e.target.value }))} />
          <FormInput label="Total Cost (auto)" mono value={liveTotal ? `₹${liveTotal.toFixed(2)}` : '—'} readOnly />
          <FormInput label="Odometer at Fill" mono type="number" value={form.odometerKm} onChange={(e) => setForm(p => ({ ...p, odometerKm: e.target.value }))} />
          <FormInput label="Station Name" value={form.station} onChange={(e) => setForm(p => ({ ...p, station: e.target.value }))} placeholder="HP - SG Highway" />
        </div>
      </Modal>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="ff-card ff-card-hover p-5" style={{ borderRadius: 16 }}>
      <div className="ff-label">{label}</div>
      <div className="mt-2 text-[20px] font-extrabold text-slate-100">{value}</div>
    </div>
  );
}
