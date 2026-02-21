import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ValidationBanner({ type = 'pass', message }) {
  const isPass = type === 'pass' || type === 'success';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
      borderRadius: 10, fontSize: 13, fontWeight: 500,
      fontFamily: 'var(--font-body)',
      background: isPass ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
      border: `1px solid ${isPass ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
      color: isPass ? 'var(--success)' : 'var(--danger)',
    }}>
      {isPass ? <CheckCircle size={16} /> : <XCircle size={16} />}
      <span>{message}</span>
    </div>
  );
}
