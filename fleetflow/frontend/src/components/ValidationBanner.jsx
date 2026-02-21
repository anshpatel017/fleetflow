import React from 'react';
import { CircleCheck, TriangleAlert } from 'lucide-react';

export default function ValidationBanner({ type, message }) {
  const isOk = type === 'success';
  return (
    <div
      className="flex items-start gap-2 rounded-xl px-3 py-2 border"
      style={{
        background: isOk ? 'rgba(34,197,94,0.10)' : 'rgba(239,68,68,0.10)',
        borderColor: isOk ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)',
        color: isOk ? '#22C55E' : '#EF4444',
      }}
    >
      {isOk ? <CircleCheck size={16} className="mt-0.5" /> : <TriangleAlert size={16} className="mt-0.5" />}
      <div className="text-[13px] font-semibold" style={{ color: isOk ? '#BBF7D0' : '#FECACA' }}>{message}</div>
    </div>
  );
}
