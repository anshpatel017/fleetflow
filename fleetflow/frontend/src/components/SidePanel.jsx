import React, { useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';

export default function SidePanel({ open, title, children, footer, onClose, width = 480 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 110 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div className="ff-animate-panel" style={{
        position: 'absolute', inset: '0 0 0 auto', width,
        background: 'var(--surface)', borderLeft: '1px solid var(--border2)',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="ff-btn ff-btn-ghost" style={{ width: 32, height: 32, padding: 0 }} onClick={onClose}>
              <ArrowLeft size={16} />
            </button>
            <span style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em' }}>{title}</span>
          </div>
          <button className="ff-btn ff-btn-ghost" style={{ width: 32, height: 32, padding: 0 }} onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: 20, flex: 1, overflowY: 'auto' }}>{children}</div>
        {footer && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10, flexShrink: 0 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
