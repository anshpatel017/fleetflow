import React from 'react';

export default function LoadingSpinner({ size = 28, className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="animate-spin rounded-full"
        style={{
          width: size,
          height: size,
          border: '3px solid rgba(99,102,241,0.25)',
          borderTopColor: '#6366F1',
        }}
      />
    </div>
  );
}
