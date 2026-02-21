import React from 'react';

export default function LoadingSpinner({ size = 20, color = 'var(--indigo)' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray="50 20" opacity="0.9" />
      </svg>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
