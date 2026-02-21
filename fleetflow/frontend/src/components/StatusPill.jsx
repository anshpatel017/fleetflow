import React from 'react';

const MAP = {
  available:  { bg: 'rgba(20,83,45,0.19)', fg: '#22C55E', br: 'rgba(34,197,94,0.19)', label: 'Available' },
  on_trip:    { bg: 'rgba(30,58,95,0.19)', fg: '#38BDF8', br: 'rgba(56,189,248,0.19)', label: 'On Trip', pulse: true },
  in_shop:    { bg: 'rgba(120,53,15,0.19)', fg: '#F59E0B', br: 'rgba(245,158,11,0.19)', label: 'In Shop' },
  retired:    { bg: '#1E293B', fg: '#475569', br: 'rgba(51,65,85,0.25)', label: 'Retired' },
  on_duty:    { bg: 'rgba(20,83,45,0.19)', fg: '#22C55E', br: 'rgba(34,197,94,0.19)', label: 'On Duty' },
  off_duty:   { bg: '#1E293B', fg: '#64748B', br: 'rgba(51,65,85,0.25)', label: 'Off Duty' },
  suspended:  { bg: 'rgba(69,10,10,0.19)', fg: '#EF4444', br: 'rgba(239,68,68,0.19)', label: 'Suspended' },
  draft:      { bg: '#1E293B', fg: '#64748B', br: 'rgba(51,65,85,0.25)', label: 'Draft' },
  dispatched: { bg: 'rgba(30,58,95,0.19)', fg: '#38BDF8', br: 'rgba(56,189,248,0.19)', label: 'Dispatched', pulse: true },
  completed:  { bg: 'rgba(20,83,45,0.19)', fg: '#22C55E', br: 'rgba(34,197,94,0.19)', label: 'Completed' },
  cancelled:  { bg: 'rgba(69,10,10,0.19)', fg: '#EF4444', br: 'rgba(239,68,68,0.19)', label: 'Cancelled' },
};

function normalize(status) {
  if (!status) return 'draft';
  return String(status).trim().toLowerCase().replaceAll(' ', '_');
}

export default function StatusPill({ status }) {
  const key = normalize(status);
  const c = MAP[key] ?? { bg: '#1E293B', fg: '#64748B', br: 'rgba(51,65,85,0.25)', label: status ?? 'Unknown' };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      borderRadius: 20, padding: '3px 10px',
      fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
      fontFamily: 'var(--font-body)',
      background: c.bg, color: c.fg, border: `1px solid ${c.br}`, lineHeight: 1.4,
    }}>
      <span
        className={c.pulse ? 'status-dot-pulse' : ''}
        style={{ width: 5, height: 5, borderRadius: '50%', background: c.fg, flexShrink: 0 }}
      />
      {c.label}
    </span>
  );
}
