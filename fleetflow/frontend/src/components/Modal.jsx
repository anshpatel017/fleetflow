import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, title, children, footer, onClose }) {
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
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div
          className="w-full max-w-[880px] ff-card ff-animate-modal"
          style={{ borderRadius: 'var(--ff-radius-modal)', boxShadow: 'var(--ff-shadow-modal)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--ff-border)' }}>
            <div className="text-[14px] font-bold text-slate-100">{title}</div>
            <button className="ff-btn ff-btn-ghost w-9 h-9" onClick={onClose} aria-label="Close">
              <X size={16} />
            </button>
          </div>

          <div className="px-6 py-5">{children}</div>

          {footer && (
            <div className="px-6 py-4 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--ff-border)' }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
