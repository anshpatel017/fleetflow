const STATUS_CONFIG = {
    // Trip statuses
    draft: { label: 'Draft', bg: 'rgba(28,28,30,0.08)', text: '#6B7280', dot: '#6B7280' },
    dispatched: { label: 'Dispatched', bg: 'rgba(59,159,212,0.15)', text: '#3B9FD4', dot: '#3B9FD4' },
    on_way: { label: 'On Way', bg: 'rgba(212,80,10,0.15)', text: '#D4500A', dot: '#D4500A' },
    completed: { label: 'Completed', bg: 'rgba(52,199,89,0.15)', text: '#34C759', dot: '#34C759' },
    cancelled: { label: 'Cancelled', bg: 'rgba(176,58,6,0.15)', text: '#B03A06', dot: '#B03A06' },

    // Vehicle statuses
    available: { label: 'Available', bg: 'rgba(52,199,89,0.15)', text: '#34C759', dot: '#34C759' },
    on_trip: { label: 'On Trip', bg: 'rgba(212,80,10,0.15)', text: '#D4500A', dot: '#D4500A' },
    in_shop: { label: 'In Shop', bg: 'rgba(234,179,8,0.15)', text: '#CA8A04', dot: '#CA8A04' },
    out_of_service: { label: 'Out of Service', bg: 'rgba(176,58,6,0.15)', text: '#B03A06', dot: '#B03A06' },

    // Maintenance statuses
    open: { label: 'Open', bg: 'rgba(176,58,6,0.15)', text: '#B03A06', dot: '#B03A06' },
    resolved: { label: 'Resolved', bg: 'rgba(52,199,89,0.15)', text: '#34C759', dot: '#34C759' },

    // Driver statuses (on_trip reused from vehicle statuses above)
    on_duty: { label: 'On Duty', bg: 'rgba(52,199,89,0.15)', text: '#34C759', dot: '#34C759' },
    off_duty: { label: 'Off Duty', bg: 'rgba(244,242,238,0.1)', text: 'rgba(244,242,238,0.5)', dot: 'rgba(244,242,238,0.3)' },
    suspended: { label: 'Suspended', bg: 'rgba(176,58,6,0.15)', text: '#B03A06', dot: '#B03A06' },
};

export default function StatusPill({ status }) {
    const config = STATUS_CONFIG[status] || { label: status, bg: 'rgba(244,242,238,0.1)', text: '#F4F2EE', dot: '#F4F2EE' };

    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
            style={{ background: config.bg, color: config.text }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.dot }} />
            {config.label}
        </span>
    );
}
