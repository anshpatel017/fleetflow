import React from 'react';
import { AlertTriangle, ChevronDown } from 'lucide-react';

export default function FormSelect({ label, hint, error, options = [], placeholder, className = '', labelClassName = '', children, ...props }) {
  const hasError = !!error;
  return (
    <div className={className}>
      {label && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <label className={labelClassName} style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)',
          }}>{label}</label>
          {hint && <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{hint}</span>}
        </div>
      )}
      <div style={{ position: 'relative' }}>
        <select
          className={`ff-input ${hasError ? 'ff-input-error' : ''}`}
          style={{ appearance: 'none', paddingRight: 36, cursor: 'pointer' }}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {children ? children : options.map(opt => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            return <option key={val} value={val}>{lbl}</option>;
          })}
        </select>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-faint)' }}>
          <ChevronDown size={16} />
        </div>
      </div>
      {hasError && (
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: 'var(--danger)' }}>
          <AlertTriangle size={12} /> {error}
        </div>
      )}
    </div>
  );
}
