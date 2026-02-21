import React from 'react';

const MAP = {
  available:  { bg: '#14532D', fg: '#22C55E', br: '#22C55E40', label: 'Available' },
  on_trip:    { bg: '#1E3A5F', fg: '#38BDF8', br: '#38BDF840', label: 'On Trip', pulse: true },
  in_shop:    { bg: '#78350F', fg: '#F59E0B', br: '#F59E0B40', label: 'In Shop' },
  retired:    { bg: '#1E1E2E', fg: '#64748B', br: '#33415540', label: 'Retired' },

  on_duty:    { bg: '#14532D', fg: '#22C55E', br: '#22C55E40', label: 'On Duty' },
  off_duty:   { bg: '#1E293B', fg: '#94A3B8', br: '#33415540', label: 'Off Duty' },
  suspended:  { bg: '#450A0A', fg: '#EF4444', br: '#EF444440', label: 'Suspended' },

  draft:      { bg: '#1E293B', fg: '#94A3B8', br: '#33415540', label: 'Draft' },
  dispatched: { bg: '#1E3A5F', fg: '#38BDF8', br: '#38BDF840', label: 'Dispatched' },
  completed:  { bg: '#14532D', fg: '#22C55E', br: '#22C55E40', label: 'Completed' },
  cancelled:  { bg: '#450A0A', fg: '#EF4444', br: '#EF444440', label: 'Cancelled' },
};

function normalize(status) {
  if (!status) return 'draft';
  return String(status).trim().toLowerCase().replaceAll(' ', '_');
}

export default function StatusPill({ status, className = '' }) {
  const key = normalize(status);
  const c = MAP[key] ?? {
    bg: '#1E293B',
    fg: '#94A3B8',
    br: '#33415540',
    label: status ?? 'Unknown',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md border text-[12px] font-semibold ${c.pulse ? 'ff-pulse-ontrip' : ''} ${className}`}
      style={{ background: c.bg, color: c.fg, borderColor: c.br, lineHeight: 1 }}
    >
      {c.label}
    </span>
  );
}
