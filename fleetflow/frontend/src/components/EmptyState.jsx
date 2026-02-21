import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'No Data', message = 'Nothing to show here yet.', cta, onCta }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '56px 24px', textAlign: 'center',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--surface2)', border: '1px solid var(--border)', marginBottom: 16,
      }}>
        <Icon size={24} style={{ color: 'var(--text-faint)' }} />
      </div>
      <h3 style={{
        fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 16, color: 'var(--text)',
        margin: '0 0 6px',
      }}>{title}</h3>
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)', margin: 0,
        maxWidth: 260, lineHeight: 1.5,
      }}>{message}</p>
      {cta && (
        <button className="ff-btn ff-btn-primary" onClick={onCta} style={{ marginTop: 18, fontSize: 13 }}>
          {cta}
        </button>
      )}
    </div>
  );
}
