import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, title, children, footer, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'grid', placeItems: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div ref={panelRef} className="ff-animate-modal" onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative', width: '100%', maxWidth: 520,
          background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 16,
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)', zIndex: 1,
        }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: '#F1F5F9' }}>{title}</div>
          <button className="ff-btn ff-btn-ghost" style={{ width: 32, height: 32, padding: 0 }} onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: '20px 24px', maxHeight: '60vh', overflowY: 'auto' }}>{children}</div>
        {footer && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
