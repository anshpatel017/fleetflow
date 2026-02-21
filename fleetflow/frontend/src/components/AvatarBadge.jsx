import React from 'react';

function getInitials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'U';
  const first = parts[0]?.[0] ?? 'U';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

const DOT = {
  available: '#22C55E',
  on_trip: '#38BDF8',
  in_shop: '#F59E0B',
  retired: '#64748B',
  on_duty: '#22C55E',
  off_duty: '#94A3B8',
  suspended: '#EF4444',
};

export default function AvatarBadge({ name, status, size = 36 }) {
  const initials = getInitials(name);
  const s = String(status || '').toLowerCase().replaceAll(' ', '_');
  const dot = DOT[s] ?? '#94A3B8';

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="grid place-items-center rounded-full ff-mono text-[12px] font-semibold"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(14,165,233,0.25))',
          border: '1px solid rgba(51,65,85,0.9)',
          color: '#F1F5F9',
        }}
      >
        {initials}
      </div>
      <span
        className="absolute -bottom-0.5 -right-0.5 rounded-full"
        style={{ width: 10, height: 10, background: dot, border: '2px solid #0F1117' }}
      />
    </div>
  );
}
