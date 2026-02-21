import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function SidePanel({ open, title, children, footer, onClose, width = 480 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110]">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 ff-animate-panel" style={{ width }}>
        <div className="h-full ff-card" style={{ borderRadius: 0, background: 'var(--ff-surface)', borderLeft: '1px solid var(--ff-border)', boxShadow: 'var(--ff-shadow-modal)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--ff-border)' }}>
            <div className="text-[14px] font-bold text-slate-100">{title}</div>
            <button className="ff-btn ff-btn-ghost w-9 h-9" onClick={onClose} aria-label="Close">
              <X size={16} />
            </button>
          </div>
          <div className="p-5 overflow-y-auto" style={{ height: 'calc(100% - 64px - 72px)' }}>
            {children}
          </div>
          {footer && (
            <div className="px-5 py-4 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--ff-border)' }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
