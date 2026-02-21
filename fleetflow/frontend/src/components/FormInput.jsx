import React from 'react';

export default function FormInput({ label, hint, error, rightAdornment, mono = false, className = '', inputClassName = '', ...props }) {
  const hasError = !!error;

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="ff-label">{label}</label>
          {hint && <span className="text-[12px] text-slate-500">{hint}</span>}
        </div>
      )}
      <div className="relative">
        <input
          className={`ff-input ${mono ? 'ff-mono' : ''} ${hasError ? 'ff-input-error' : ''} ${inputClassName}`}
          {...props}
        />
        {rightAdornment && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {rightAdornment}
          </div>
        )}
      </div>
      {hasError && <div className="mt-2 text-[12px] font-medium text-red-400">{error}</div>}
    </div>
  );
}
