import React from 'react';

const SIZES = { sm: 28, md: 36, lg: 48, xl: 64 };
const FONT_SIZES = { sm: 10, md: 12, lg: 16, xl: 22 };
const DOT_SIZES = { sm: 7, md: 9, lg: 11, xl: 13 };
const STATUS_COLORS = { online: '#10B981', offline: '#6B7280', busy: '#F59E0B', away: '#EF4444' };

export default function AvatarBadge({ name = '', size = 'md', status, src, style = {} }) {
  const dim = SIZES[size] || SIZES.md;
  const fs = FONT_SIZES[size] || FONT_SIZES.md;
  const dotDim = DOT_SIZES[size] || DOT_SIZES.md;
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ position: 'relative', width: dim, height: dim, flexShrink: 0, ...style }}>
      {src ? (
        <img src={src} alt={name} style={{
          width: dim, height: dim, borderRadius: '50%', objectFit: 'cover',
          border: '2px solid var(--border)',
        }} />
      ) : (
        <div style={{
          width: dim, height: dim, borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #6366F1, #818CF8)',
          color: '#fff', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: fs,
          letterSpacing: '0.02em',
        }}>
          {initials}
        </div>
      )}
      {status && (
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: dotDim, height: dotDim, borderRadius: '50%',
          background: STATUS_COLORS[status] || STATUS_COLORS.offline,
          border: '2px solid var(--bg)',
        }} />
      )}
    </div>
  );
}
