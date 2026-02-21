import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import SidePanel from '../components/SidePanel';
import StatusPill from '../components/StatusPill';

function daysUntil(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const ms = d.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function ExpiryCell({ date }) {
  const days = daysUntil(date);
  const expired = days < 0;
  const warn = days <= 30;
  const color = expired ? '#EF4444' : warn ? '#F59E0B' : '#22C55E';
  const bg = expired ? 'rgba(239,68,68,0.10)' : warn ? 'rgba(245,158,11,0.10)' : 'rgba(34,197,94,0.10)';
  const br = expired ? 'rgba(239,68,68,0.25)' : warn ? 'rgba(245,158,11,0.25)' : 'rgba(34,197,94,0.25)';
  return (
    <span className="px-2 py-1 rounded-md text-[12px] font-bold" style={{ background: bg, border: `1px solid ${br}`, color }}>
      {expired ? 'Expired' : `${days}d`}
    </span>
  );
}

function SafetyBar({ score }) {
  const s = Number(score) || 0;
  const color = s >= 80 ? '#22C55E' : s >= 50 ? '#F59E0B' : '#EF4444';
  return (
    <div className="h-2 rounded-full" style={{ background: 'rgba(51,65,85,0.8)', overflow: 'hidden' }}>
      <div className="h-full" style={{ width: `${Math.max(0, Math.min(100, s))}%`, background: color }} />
    </div>
  );
}

function SafetyGauge({ score }) {
  const s = Math.max(0, Math.min(100, Number(score) || 0));
  const color = s >= 80 ? '#22C55E' : s >= 50 ? '#F59E0B' : '#EF4444';
  return (
    <div className="relative w-28 h-28">
      <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.9)' }} />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${color} ${s * 3.6}deg, rgba(51,65,85,0.35) 0deg)`,
          mask: 'radial-gradient(circle at center, transparent 58%, black 59%)',
          WebkitMask: 'radial-gradient(circle at center, transparent 58%, black 59%)',
        }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-[22px] font-extrabold ff-mono" style={{ color: '#F1F5F9' }}>{s}</div>
          <div className="text-[12px] text-slate-400 font-semibold">Safety</div>
        </div>
      </div>
    </div>
  );
}

function DriverDetailPanel({ open, driver, onClose }) {
  const tripHistory = [
    { id: 'TRP-10492', route: 'Ahmedabad → Surat', status: 'completed', date: '2026-02-21' },
    { id: 'TRP-10487', route: 'Mumbai → Pune', status: 'completed', date: '2026-02-20' },
    { id: 'TRP-10481', route: 'Delhi → Noida', status: 'cancelled', date: '2026-02-19' },
  ];

  if (!open || !driver) return null;

  const days = daysUntil(driver.expiry);

  const columns = [
    { id: 'id', header: 'Trip ID', accessor: 'id', cell: (v) => <span className="ff-mono">{v}</span> },
    { id: 'route', header: 'Route', accessor: 'route', sortable: false, cell: (v) => <span className="text-[13px] text-slate-200">{v}</span> },
    { id: 'status', header: 'Status', accessor: 'status', sortable: false, cell: (v) => <StatusPill status={v} /> },
    { id: 'date', header: 'Date', accessor: 'date' },
  ];

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Driver Profile"
      width={520}
      footer={
        <>
          <button className="ff-btn ff-btn-ghost h-10 px-4" onClick={onClose}>Close</button>
          <button className="ff-btn ff-btn-primary h-10 px-4">Edit</button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="ff-card p-4" style={{ borderRadius: 16 }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[16px] font-bold text-slate-100">{driver.name}</div>
              <div className="text-[12px] text-slate-400 ff-mono mt-1">{driver.license}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2 py-1 rounded-md text-[12px] font-semibold" style={{ background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.25)', color: '#7DD3FC' }}>{driver.category}</span>
                <ExpiryCell date={driver.expiry} />
                <span className="text-[12px] text-slate-400 font-semibold">({days < 0 ? 'expired' : `${days} days left`})</span>
              </div>
            </div>
            <div className="shrink-0">
              <SafetyGauge score={driver.safety} />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="ff-label">Status</div>
              <div className="mt-1"><StatusPill status={driver.status} /></div>
            </div>
            <div className="text-right">
              <div className="ff-label">Trips Completed</div>
              <div className="mt-1 text-[14px] font-extrabold text-slate-100 ff-mono">{driver.trips}</div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-[14px] font-bold text-slate-100 mb-2">Trip History</div>
          <DataTable
            columns={columns}
            rows={tripHistory}
            rowKey={(r) => r.id}
            searchable={false}
            emptyTitle="No trips"
            emptyMessage="No trip history available for this driver."
            className="overflow-hidden"
          />
        </div>
      </div>
    </SidePanel>
  );
}

export default function DriversPage() {
  const [view, setView] = useState('cards');
  const [selected, setSelected] = useState(null);

  const drivers = [
    { id: 1, name: 'Ravi Patel', license: 'DL-IND-449120', category: 'Truck', expiry: '2026-03-05', status: 'on_duty', trips: 142, safety: 86 },
    { id: 2, name: 'Sneha Sharma', license: 'DL-IND-113980', category: 'Van', expiry: '2026-02-25', status: 'off_duty', trips: 88, safety: 78 },
    { id: 3, name: 'Pranav Nair', license: 'DL-IND-665430', category: 'Truck', expiry: '2026-02-22', status: 'suspended', trips: 54, safety: 42 },
    { id: 4, name: 'Ayaan Khan', license: 'DL-IND-901247', category: 'Bike', expiry: '2026-08-11', status: 'on_trip', trips: 210, safety: 91 },
  ];

  const listColumns = [
    { id: 'name', header: 'Driver', accessor: 'name', cell: (v, r) => (
      <div>
        <div className="text-[13px] font-bold text-slate-100">{v}</div>
        <div className="text-[12px] text-slate-400 ff-mono">{r.license}</div>
      </div>
    ) },
    { id: 'cat', header: 'Category', accessor: 'category', cell: (v) => <span className="px-2 py-1 rounded-md text-[12px] font-semibold" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#C7D2FE' }}>{v}</span> },
    { id: 'exp', header: 'Expiry', accessor: 'expiry', cell: (v, r) => <ExpiryCell date={v} /> },
    { id: 'status', header: 'Status', accessor: 'status', sortable: false, cell: (v) => <StatusPill status={v} /> },
    { id: 'trips', header: 'Trips', accessor: 'trips', cell: (v) => <span className="ff-mono">{v}</span> },
    { id: 'safety', header: 'Safety', accessor: 'safety', cell: (v) => <SafetyBar score={v} /> },
    { id: 'actions', header: 'Actions', accessor: 'id', sortable: false, searchable: false, cell: (_v, r) => (
      <div className="flex justify-end">
        <button className="ff-btn ff-btn-ghost h-9 px-3" onClick={() => setSelected(r)}>View Profile</button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[18px] font-bold text-slate-100">Driver Profiles</div>
          <div className="text-[13px] text-slate-400">License compliance and safety performance.</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="ff-btn ff-btn-ghost h-10 px-4" onClick={() => setView('cards')} style={{ borderColor: view === 'cards' ? 'rgba(99,102,241,0.45)' : 'rgba(51,65,85,0.9)' }}>
            Cards
          </button>
          <button className="ff-btn ff-btn-ghost h-10 px-4" onClick={() => setView('list')} style={{ borderColor: view === 'list' ? 'rgba(99,102,241,0.45)' : 'rgba(51,65,85,0.9)' }}>
            List
          </button>
        </div>
      </div>

      {view === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {drivers.map((d) => (
            <div key={d.id} className="ff-card ff-card-hover p-5" style={{ borderRadius: 16 }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[14px] font-bold text-slate-100">{d.name}</div>
                  <div className="text-[12px] text-slate-400 ff-mono">{d.license}</div>
                </div>
                <StatusPill status={d.status} />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="ff-label">License</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="px-2 py-1 rounded-md text-[12px] font-semibold" style={{ background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.25)', color: '#7DD3FC' }}>{d.category}</span>
                    <ExpiryCell date={d.expiry} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="ff-label">Trips Completed</div>
                  <div className="mt-1 text-[14px] font-bold text-slate-100 ff-mono">{d.trips}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="ff-label">Safety Score</div>
                  <div className="text-[12px] font-bold text-slate-200 ff-mono">{d.safety}/100</div>
                </div>
                <div className="mt-2">
                  <SafetyBar score={d.safety} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button className="ff-btn ff-btn-ghost h-10 px-4 flex-1" onClick={() => setSelected(d)}>View Profile</button>
                <button className="ff-btn ff-btn-primary h-10 px-4">Edit</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          title={`Drivers (${drivers.length})`}
          columns={listColumns}
          rows={drivers}
          rowKey={(r) => r.id}
          emptyTitle="No drivers"
          emptyMessage="Create driver profiles to track safety and compliance."
          className="overflow-hidden"
        />
      )}

      <DriverDetailPanel open={!!selected} driver={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
