import React, { useEffect, useMemo, useState } from 'react';

function useCountUp(value, durationMs = 900) {
  const target = Number(value);
  const [v, setV] = useState(Number.isFinite(target) ? 0 : value);
  useEffect(() => {
    if (!Number.isFinite(target)) { setV(value); return; }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, durationMs, value]);
  return v;
}

export default function KPICard({ label, value, color = '#6366F1', icon: Icon, sub, leftBorderColor }) {
  const isNumber = useMemo(() => typeof value === 'number' && Number.isFinite(value), [value]);
  const counted = useCountUp(isNumber ? value : value);

  return (
    <div className="ff-card ff-card-hover" style={{
      padding: '24px 24px 22px',
      borderLeft: `3px solid ${leftBorderColor ?? color}`,
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 14 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {Icon && (
          <div style={{
            width: 44, height: 44, borderRadius: 12, display: 'grid', placeItems: 'center',
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
          }}>
            <Icon size={20} style={{ color }} />
          </div>
        )}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 800, color, letterSpacing: '-0.04em', lineHeight: 1 }}>
            {isNumber ? counted : value}
          </div>
          {sub && <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}
