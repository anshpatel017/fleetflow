import React, { useEffect, useMemo, useState } from 'react';

function useCountUp(value, durationMs = 900) {
  const target = Number(value);
  const [v, setV] = useState(Number.isFinite(target) ? 0 : value);

  useEffect(() => {
    if (!Number.isFinite(target)) {
      setV(value);
      return;
    }

    const start = performance.now();
    const from = 0;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(Math.round(from + (target - from) * eased));
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
    <div
      className="ff-card ff-card-hover p-5"
      style={{ borderLeft: `3px solid ${leftBorderColor ?? color}` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="ff-label">{label}</div>
          <div className="mt-2 text-[28px] font-extrabold tracking-tight" style={{ color }}>
            {isNumber ? counted : value}
          </div>
          {sub && <div className="text-[13px] text-slate-400 mt-0.5">{sub}</div>}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(51,65,85,0.8)' }}>
            <Icon size={18} style={{ color }} />
          </div>
        )}
      </div>
    </div>
  );
}
