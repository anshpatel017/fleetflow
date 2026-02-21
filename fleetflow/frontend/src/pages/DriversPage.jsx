import StatusPill from '../components/StatusPill';
import { mockDrivers } from '../data/mockData';

function getSafetyColor(score) {
    if (score >= 80) return { bg: 'rgba(52,199,89,0.12)', text: '#34C759' };
    if (score >= 60) return { bg: 'rgba(232,163,23,0.12)', text: '#E8A317' };
    return { bg: 'rgba(176,58,6,0.12)', text: '#B03A06' };
}

function isExpiringSoon(dateStr) {
    const expiry = new Date(dateStr);
    const now = new Date();
    const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
    return diffDays <= 30 && diffDays > 0;
}

function isExpired(dateStr) {
    return new Date(dateStr) < new Date();
}

export default function DriversPage() {
    return (
        <div className="flex flex-col gap-6 fade-up">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight" style={{ color: '#1C1C1E' }}>Driver Fleet</h2>
                    <p className="text-xs mt-1" style={{ color: 'rgba(28,28,30,0.4)' }}>
                        {mockDrivers.length} drivers · {mockDrivers.filter(d => d.status === 'on_duty').length} on duty
                    </p>
                </div>
            </div>

            {/* Card grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {mockDrivers.map(driver => {
                    const safety = getSafetyColor(driver.safetyScore);
                    const expiringSoon = isExpiringSoon(driver.licenseExpiry);
                    const expired = isExpired(driver.licenseExpiry);

                    return (
                        <div key={driver.id}
                            className="rounded-2xl p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                            style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>

                            {/* Top row: avatar + info */}
                            <div className="flex items-start gap-4 mb-5">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                                    style={{ background: 'linear-gradient(135deg, #1A6EA8, #3B9FD4)' }}>
                                    {driver.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold truncate" style={{ color: '#1C1C1E' }}>{driver.name}</h3>
                                    <p className="text-[11px] font-mono mt-0.5" style={{ color: 'rgba(28,28,30,0.4)' }}>{driver.licenseNo}</p>
                                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(28,28,30,0.5)' }}>{driver.role}</p>
                                </div>
                                <StatusPill status={driver.status} />
                            </div>

                            {/* Stats row */}
                            <div className="flex items-center gap-3 mb-4">
                                {/* Safety score */}
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                                    style={{ background: safety.bg }}>
                                    <span className="text-[10px] font-semibold" style={{ color: safety.text }}>
                                        Safety: {driver.safetyScore}/100
                                    </span>
                                </div>

                                {/* License expiry */}
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                                    style={{
                                        background: expired ? 'rgba(176,58,6,0.08)' : expiringSoon ? 'rgba(212,80,10,0.08)' : 'rgba(28,28,30,0.04)',
                                    }}>
                                    <span className="text-[10px] font-semibold"
                                        style={{
                                            color: expired ? '#B03A06' : expiringSoon ? '#D4500A' : 'rgba(28,28,30,0.5)',
                                        }}>
                                        {expired ? '⚠️ Expired' : expiringSoon ? '⏰ Expiring Soon' : `Exp: ${driver.licenseExpiry}`}
                                    </span>
                                </div>
                            </div>

                            {/* Action */}
                            <button className="w-full py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border-none"
                                style={{ background: 'rgba(59,159,212,0.08)', color: '#3B9FD4' }}
                                onMouseEnter={e => e.target.style.background = 'rgba(59,159,212,0.15)'}
                                onMouseLeave={e => e.target.style.background = 'rgba(59,159,212,0.08)'}>
                                View Profile →
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
