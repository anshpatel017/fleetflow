import React from 'react';

export default function FormSelect({ label, hint, error, className = '', selectClassName = '', children, ...props }) {
  const hasError = !!error;

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="ff-label">{label}</label>
          {hint && <span className="text-[12px] text-slate-500">{hint}</span>}
        </div>
      )}
      <select
        className={`ff-input ${hasError ? 'ff-input-error' : ''} ${selectClassName}`}
        {...props}
      >
        {children}
      </select>
      {hasError && <div className="mt-2 text-[12px] font-medium text-red-400">{error}</div>}
    </div>
  );
}
