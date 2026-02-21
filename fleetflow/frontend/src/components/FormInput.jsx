import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function FormInput({ label, hint, error, rightAdornment, mono = false, className = '', labelClassName = '', inputClassName = '', ...props }) {
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
        <input
          className={`ff-input ${hasError ? 'ff-input-error' : ''} ${inputClassName}`}
          style={{ fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)' }}
          {...props}
        />
        {rightAdornment && (
          <div style={{ position: 'absolute', inset: '0 8px 0 auto', display: 'flex', alignItems: 'center' }}>
            {rightAdornment}
          </div>
        )}
      </div>
      {hasError && (
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: 'var(--danger)' }}>
          <AlertTriangle size={12} /> {error}
        </div>
      )}
    </div>
  );
}
