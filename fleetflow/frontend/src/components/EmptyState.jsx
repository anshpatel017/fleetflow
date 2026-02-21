import React from 'react';

export default function EmptyState({ icon: Icon, title = 'Nothing here yet', message, ctaLabel, onCta }) {
  return (
    <div className="ff-card px-6 py-10 text-center">
      {Icon && (
        <div className="mx-auto mb-3 w-12 h-12 rounded-2xl grid place-items-center" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
          <Icon size={20} className="text-indigo-400" />
        </div>
      )}
      <h3 className="text-[14px] font-bold text-slate-100">{title}</h3>
      {message && <p className="text-[13px] text-slate-400 mt-1 max-w-sm mx-auto">{message}</p>}
      {ctaLabel && onCta && (
        <button onClick={onCta} className="ff-btn ff-btn-primary mt-5 px-4 h-10">
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
