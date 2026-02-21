import React, { useState, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import AvatarBadge from './AvatarBadge';

export default function TopBar({ title, userName = '' }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const clock = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const dateStr = time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <header style={{
      position: 'fixed', top: 0, left: 260, right: 0, height: 56,
      background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', zIndex: 30,
    }}>
      {/* Left: title + clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <h1 style={{
          fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 17,
          color: 'var(--text)', margin: 0,
        }}>
          {title}
        </h1>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)',
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '4px 10px',
        }}>
          {clock} · {dateStr}
        </div>
      </div>

      {/* Right: search + notifications + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-faint)',
          }} />
          <input
            className="ff-input"
            placeholder="Search..."
            style={{
              width: 240, height: 34, paddingLeft: 32, fontSize: 13,
              borderRadius: 8,
            }}
          />
        </div>

        <button style={{
          position: 'relative', background: 'none', border: '1px solid var(--border)',
          borderRadius: 8, width: 34, height: 34, display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          color: 'var(--text-muted)',
        }}>
          <Bell size={16} />
          <span style={{
            position: 'absolute', top: -3, right: -3, width: 8, height: 8,
            borderRadius: '50%', background: 'var(--danger)',
            border: '2px solid var(--surface)',
          }} />
        </button>

        <AvatarBadge name={userName} size="sm" />
      </div>
    </header>
  );
}
