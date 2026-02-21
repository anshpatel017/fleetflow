import { useState, useRef, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import StatusPill from '../components/StatusPill';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { useFleet } from '../context/FleetContext';

function getSafetyColor(score) {
    if (score >= 80) return { bg: 'rgba(52,199,89,0.12)', text: '#34C759' };
    if (score >= 60) return { bg: 'rgba(234,179,8,0.12)', text: '#CA8A04' };
    return { bg: 'rgba(176,58,6,0.12)', text: '#B03A06' };
}

function isExpiringSoon(dateStr) {
    const expiry = new Date(dateStr);
    const now = new Date();
    const diff = (expiry - now) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 30;
}

function isExpired(dateStr) {
    return new Date(dateStr) < new Date();
}

function ExpiryBadge({ dateStr }) {
    if (isExpired(dateStr)) return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: 'rgba(176,58,6,0.1)', color: '#B03A06' }}>EXPIRED ⚠️</span>
    );
    if (isExpiringSoon(dateStr)) return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: 'rgba(212,80,10,0.1)', color: '#D4500A' }}>Expiring Soon</span>
    );
    return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: 'rgba(52,199,89,0.08)', color: '#34C759' }}>{dateStr}</span>
    );
}

// Status transition map for drivers
const STATUS_ACTIONS = {
    on_duty: [
        { label: 'Switch to Off Duty', next: 'off_duty' },
        { label: 'Suspend', next: 'suspended' },
    ],
    off_duty: [
        { label: 'Switch to On Duty', next: 'on_duty' },
        { label: 'Suspend', next: 'suspended' },
    ],
    suspended: [
        { label: 'Reinstate', next: 'on_duty' },
    ],
    on_trip: null, // no toggle
};

export default function DriversPage() {
    const { drivers, addDriver: ctxAddDriver, updateDriverStatus } = useFleet();
    const [view, setView] = useState('grid'); // 'grid' | 'table'

    // Add Driver modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({ name: '', licenseNo: '', role: 'Delivery', licenseExpiry: '', phone: '', status: 'on_duty' });

    // Profile modal
    const [profileDriver, setProfileDriver] = useState(null);

    // Status dropdown
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRef = useRef(null);

    // Toast
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
    const showToast = (message, type = 'success') => setToast({ visible: true, message, type });

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpenDropdownId(null);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const updateStatus = (driverId, newStatus) => {
        updateDriverStatus(driverId, newStatus);
        setOpenDropdownId(null);
        const label = newStatus === 'on_duty' ? 'On Duty' : newStatus === 'off_duty' ? 'Off Duty' : 'Suspended';
        showToast(`Driver status → ${label}`);
    };

    const handleAddDriver = (e) => {
        e.preventDefault();
        const initials = addForm.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        const driver = {
            id: Math.max(0, ...drivers.map(d => d.id)) + 1,
            name: addForm.name,
            initials,
            licenseNo: addForm.licenseNo,
            role: addForm.role,
            safetyScore: 75,
            completion: 0,
            complaints: 0,
            licenseExpiry: addForm.licenseExpiry,
            status: addForm.status,
            phone: addForm.phone,
            tripHistory: [],
            complaintsLog: [],
            safetyHistory: [75],
        };
        ctxAddDriver(driver);
        setAddForm({ name: '', licenseNo: '', role: 'Delivery', licenseExpiry: '', phone: '', status: 'on_duty' });
        setShowAddModal(false);
        showToast('Driver added successfully');
    };

    const isAddFormValid = addForm.name && addForm.licenseNo && addForm.licenseExpiry;

    const onDutyCount = drivers.filter(d => d.status === 'on_duty').length;

    return (
        <div className="flex flex-col gap-5 fade-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold tracking-tight" style={{ color: '#1C1C1E' }}>Driver Profiles</h2>
                    <p className="text-xs mt-1" style={{ color: 'rgba(28,28,30,0.4)' }}>
                        {drivers.length} drivers · {onDutyCount} on duty
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* View toggle */}
                    <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(28,28,30,0.1)' }}>
                        <button onClick={() => setView('grid')}
                            className="px-3.5 py-2 text-xs font-semibold cursor-pointer border-none transition-colors"
                            style={{ background: view === 'grid' ? '#1A6EA8' : '#FFFFFF', color: view === 'grid' ? '#FFFFFF' : 'rgba(28,28,30,0.5)' }}>
                            ▦ Grid
                        </button>
                        <button onClick={() => setView('table')}
                            className="px-3.5 py-2 text-xs font-semibold cursor-pointer border-none transition-colors"
                            style={{ background: view === 'table' ? '#1A6EA8' : '#FFFFFF', color: view === 'table' ? '#FFFFFF' : 'rgba(28,28,30,0.5)' }}>
                            ≡ Table
                        </button>
                    </div>
                    <button onClick={() => setShowAddModal(true)}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer transition-all hover:scale-105 border-none whitespace-nowrap"
                        style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                        + Add Driver
                    </button>
                </div>
            </div>

            {/* ════════════════ GRID VIEW ════════════════ */}
            {view === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {drivers.map(driver => {
                        const safety = getSafetyColor(driver.safetyScore);
                        const actions = STATUS_ACTIONS[driver.status];
                        return (
                            <div key={driver.id}
                                className="rounded-2xl p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col"
                                style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>

                                {/* Avatar row */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-base font-bold text-white shrink-0"
                                        style={{ background: 'linear-gradient(135deg, #1A6EA8, #3B9FD4)' }}>
                                        {driver.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold truncate" style={{ color: '#1C1C1E' }}>{driver.name}</h3>
                                        <p className="text-[11px] font-mono mt-0.5" style={{ color: 'rgba(28,28,30,0.4)' }}>{driver.licenseNo}</p>
                                    </div>
                                    <StatusPill status={driver.status} />
                                </div>

                                {/* License expiry */}
                                <div className="mb-3">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider mr-2" style={{ color: 'rgba(28,28,30,0.35)' }}>License</span>
                                    <ExpiryBadge dateStr={driver.licenseExpiry} />
                                </div>

                                {/* Safety score */}
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(28,28,30,0.35)' }}>Safety</span>
                                    <span className="px-3 py-1 rounded-lg text-xs font-bold" style={{ background: safety.bg, color: safety.text }}>
                                        {driver.safetyScore}
                                    </span>
                                </div>

                                {/* Completion rate bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(28,28,30,0.35)' }}>Completion</span>
                                        <span className="text-[10px] font-bold" style={{ color: '#3B9FD4' }}>{driver.completion}%</span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(28,28,30,0.06)' }}>
                                        <div className="h-full rounded-full transition-all" style={{ width: `${driver.completion}%`, background: '#3B9FD4' }} />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-auto relative" ref={openDropdownId === driver.id ? dropdownRef : null}>
                                    <button onClick={() => setProfileDriver(driver)}
                                        className="flex-1 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                                        style={{ background: 'transparent', border: '1.5px solid rgba(26,110,168,0.3)', color: '#1A6EA8' }}>
                                        View Profile
                                    </button>
                                    {/* Status toggle dropdown */}
                                    <div className="relative">
                                        <button onClick={() => setOpenDropdownId(openDropdownId === driver.id ? null : driver.id)}
                                            className="py-2.5 px-3 rounded-xl text-xs font-semibold cursor-pointer border-none transition-all"
                                            style={{
                                                background: actions ? 'rgba(28,28,30,0.05)' : 'rgba(28,28,30,0.03)',
                                                color: actions ? '#1C1C1E' : 'rgba(28,28,30,0.25)',
                                                cursor: actions ? 'pointer' : 'not-allowed',
                                            }}
                                            disabled={!actions}
                                            title={!actions ? 'Currently on trip' : ''}>
                                            ▾
                                        </button>
                                        {openDropdownId === driver.id && actions && (
                                            <div className="absolute right-0 bottom-full mb-1 z-20 rounded-xl shadow-lg overflow-hidden min-w-[160px]"
                                                style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.1)' }}>
                                                {actions.map(a => (
                                                    <button key={a.next}
                                                        onClick={() => updateStatus(driver.id, a.next)}
                                                        className="w-full text-left px-4 py-2.5 text-xs font-medium cursor-pointer border-none bg-transparent transition-colors"
                                                        style={{ color: a.next === 'suspended' ? '#B03A06' : '#1C1C1E' }}
                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(28,28,30,0.04)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                        {a.label}
                                                    </button>
                                                ))}
                                                {!actions && (
                                                    <p className="px-4 py-2.5 text-[11px]" style={{ color: 'rgba(28,28,30,0.3)' }}>Currently on trip</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ════════════════ TABLE VIEW ════════════════ */}
            {view === 'table' && (
                <div className="rounded-2xl shadow-sm overflow-hidden"
                    style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                            <thead>
                                <tr>
                                    {['Name', 'License #', 'Expiry', 'Safety Score', 'Completion', 'Complaints', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="text-[10px] font-bold uppercase tracking-wider px-4 py-3.5"
                                            style={{ color: 'rgba(28,28,30,0.35)', borderBottom: '1px solid rgba(28,28,30,0.06)' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {drivers.map(driver => {
                                    const safety = getSafetyColor(driver.safetyScore);
                                    const actions = STATUS_ACTIONS[driver.status];
                                    return (
                                        <tr key={driver.id} className="transition-colors"
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,159,212,0.03)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                                                        style={{ background: 'linear-gradient(135deg, #1A6EA8, #3B9FD4)' }}>
                                                        {driver.initials}
                                                    </div>
                                                    <span className="text-xs font-semibold" style={{ color: '#1C1C1E' }}>{driver.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-xs font-mono" style={{ color: 'rgba(28,28,30,0.5)' }}>{driver.licenseNo}</td>
                                            <td className="px-4 py-3.5"><ExpiryBadge dateStr={driver.licenseExpiry} /></td>
                                            <td className="px-4 py-3.5">
                                                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ background: safety.bg, color: safety.text }}>
                                                    {driver.safetyScore}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 rounded-full" style={{ background: 'rgba(28,28,30,0.06)' }}>
                                                        <div className="h-full rounded-full" style={{ width: `${driver.completion}%`, background: '#3B9FD4' }} />
                                                    </div>
                                                    <span className="text-[10px] font-bold" style={{ color: '#3B9FD4' }}>{driver.completion}%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-xs font-semibold"
                                                style={{ color: driver.complaints === 0 ? '#34C759' : driver.complaints >= 5 ? '#B03A06' : '#CA8A04' }}>
                                                {driver.complaints}
                                            </td>
                                            <td className="px-4 py-3.5"><StatusPill status={driver.status} /></td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2 relative" ref={openDropdownId === `tbl-${driver.id}` ? dropdownRef : null}>
                                                    <button onClick={() => setProfileDriver(driver)}
                                                        className="text-[10px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer border-none"
                                                        style={{ color: '#1A6EA8', background: 'rgba(26,110,168,0.08)' }}>
                                                        Profile
                                                    </button>
                                                    {actions ? (
                                                        <div className="relative">
                                                            <button onClick={() => setOpenDropdownId(openDropdownId === `tbl-${driver.id}` ? null : `tbl-${driver.id}`)}
                                                                className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer border-none"
                                                                style={{ background: 'rgba(28,28,30,0.05)', color: '#1C1C1E' }}>
                                                                ▾
                                                            </button>
                                                            {openDropdownId === `tbl-${driver.id}` && (
                                                                <div className="absolute right-0 top-full mt-1 z-20 rounded-xl shadow-lg overflow-hidden min-w-[150px]"
                                                                    style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.1)' }}>
                                                                    {actions.map(a => (
                                                                        <button key={a.next}
                                                                            onClick={() => updateStatus(driver.id, a.next)}
                                                                            className="w-full text-left px-4 py-2.5 text-xs font-medium cursor-pointer border-none bg-transparent transition-colors"
                                                                            style={{ color: a.next === 'suspended' ? '#B03A06' : '#1C1C1E' }}
                                                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(28,28,30,0.04)'}
                                                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                                            {a.label}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] px-2.5 py-1.5" style={{ color: 'rgba(28,28,30,0.25)' }}>On Trip</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ════════════════ ADD DRIVER MODAL ════════════════ */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Driver" width="max-w-lg">
                <form onSubmit={handleAddDriver} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'rgba(244,242,238,0.5)' }}>Full Name</label>
                        <input type="text" placeholder="e.g. Ama Darko" required value={addForm.name}
                            onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} className="fleet-input" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'rgba(244,242,238,0.5)' }}>License No.</label>
                            <input type="text" placeholder="DL-GH-XXXXX" required value={addForm.licenseNo}
                                onChange={e => setAddForm(f => ({ ...f, licenseNo: e.target.value }))} className="fleet-input" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'rgba(244,242,238,0.5)' }}>License Expiry</label>
                            <input type="date" required value={addForm.licenseExpiry}
                                onChange={e => setAddForm(f => ({ ...f, licenseExpiry: e.target.value }))} className="fleet-input cursor-pointer" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'rgba(244,242,238,0.5)' }}>Role</label>
                            <select value={addForm.role} onChange={e => setAddForm(f => ({ ...f, role: e.target.value }))} className="fleet-input cursor-pointer">
                                {['Delivery', 'City Routes', 'Long Haul'].map(r => (
                                    <option key={r} value={r} style={{ background: '#1C1C1E', color: '#F4F2EE' }}>{r}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'rgba(244,242,238,0.5)' }}>Initial Status</label>
                            <select value={addForm.status} onChange={e => setAddForm(f => ({ ...f, status: e.target.value }))} className="fleet-input cursor-pointer">
                                <option value="on_duty" style={{ background: '#1C1C1E', color: '#34C759' }}>On Duty</option>
                                <option value="off_duty" style={{ background: '#1C1C1E', color: '#F4F2EE' }}>Off Duty</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: 'rgba(244,242,238,0.5)' }}>Phone</label>
                            <input type="tel" placeholder="+233-555-XXXX" value={addForm.phone}
                                onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} className="fleet-input" />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-2">
                        <button type="button" onClick={() => setShowAddModal(false)}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer border-none"
                            style={{ background: 'rgba(244,242,238,0.08)', color: 'rgba(244,242,238,0.5)' }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={!isAddFormValid}
                            className="flex-1 py-3 rounded-xl text-sm font-bold text-white cursor-pointer border-none transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                            Add Driver
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ════════════════ VIEW PROFILE MODAL ════════════════ */}
            <Modal isOpen={!!profileDriver} onClose={() => setProfileDriver(null)}
                title={profileDriver ? `${profileDriver.name}` : ''} width="max-w-2xl">
                {profileDriver && (() => {
                    const safety = getSafetyColor(profileDriver.safetyScore);
                    const historyData = profileDriver.safetyHistory.map((s, i) => ({ idx: i, score: s }));
                    return (
                        <div className="flex flex-col gap-5">
                            {/* Top info */}
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
                                    style={{ background: 'linear-gradient(135deg, #1A6EA8, #3B9FD4)' }}>
                                    {profileDriver.initials}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-bold" style={{ color: '#F4F2EE' }}>{profileDriver.name}</h3>
                                    <p className="text-xs font-mono mt-0.5" style={{ color: 'rgba(244,242,238,0.4)' }}>{profileDriver.licenseNo}</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'rgba(244,242,238,0.5)' }}>{profileDriver.role} · {profileDriver.phone}</p>
                                </div>
                                <StatusPill status={profileDriver.status} />
                            </div>

                            {/* Stats grid */}
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { label: 'Safety Score', value: profileDriver.safetyScore, color: safety.text },
                                    { label: 'Completion', value: `${profileDriver.completion}%`, color: '#3B9FD4' },
                                    { label: 'Complaints', value: profileDriver.complaints, color: profileDriver.complaints >= 5 ? '#B03A06' : '#CA8A04' },
                                    { label: 'License', value: isExpired(profileDriver.licenseExpiry) ? 'EXPIRED' : profileDriver.licenseExpiry, color: isExpired(profileDriver.licenseExpiry) ? '#B03A06' : '#34C759' },
                                ].map(s => (
                                    <div key={s.label} className="p-3 rounded-xl text-center"
                                        style={{ background: 'rgba(244,242,238,0.04)', border: '1px solid rgba(244,242,238,0.06)' }}>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'rgba(244,242,238,0.35)' }}>{s.label}</p>
                                        <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Safety Score Sparkline */}
                            <div className="p-4 rounded-xl" style={{ background: 'rgba(244,242,238,0.04)', border: '1px solid rgba(244,242,238,0.06)' }}>
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(244,242,238,0.35)' }}>Safety Score History</p>
                                <ResponsiveContainer width="100%" height={60}>
                                    <LineChart data={historyData}>
                                        <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                                        <Line type="monotone" dataKey="score" stroke={safety.text} strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Trip History */}
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(244,242,238,0.35)' }}>
                                    Recent Trips ({profileDriver.tripHistory.length})
                                </p>
                                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(244,242,238,0.06)' }}>
                                    <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                                        <thead>
                                            <tr>
                                                {['Trip ID', 'Route', 'Date', 'Status'].map(h => (
                                                    <th key={h} className="text-[9px] font-bold uppercase tracking-wider px-3 py-2"
                                                        style={{ color: 'rgba(244,242,238,0.25)', borderBottom: '1px solid rgba(244,242,238,0.06)' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {profileDriver.tripHistory.map(t => (
                                                <tr key={t.id}>
                                                    <td className="px-3 py-2 text-[11px] font-bold" style={{ color: '#3B9FD4' }}>{t.id}</td>
                                                    <td className="px-3 py-2 text-[11px]" style={{ color: 'rgba(244,242,238,0.5)' }}>{t.route}</td>
                                                    <td className="px-3 py-2 text-[11px]" style={{ color: 'rgba(244,242,238,0.4)' }}>{t.date}</td>
                                                    <td className="px-3 py-2"><StatusPill status={t.status} /></td>
                                                </tr>
                                            ))}
                                            {profileDriver.tripHistory.length === 0 && (
                                                <tr><td colSpan={4} className="text-center py-4 text-[11px]" style={{ color: 'rgba(244,242,238,0.2)' }}>No trips</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Complaints Log */}
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(244,242,238,0.35)' }}>
                                    Complaints Log ({profileDriver.complaintsLog.length})
                                </p>
                                {profileDriver.complaintsLog.length === 0 ? (
                                    <p className="text-xs py-3 text-center" style={{ color: 'rgba(244,242,238,0.2)' }}>No complaints — clean record ✓</p>
                                ) : (
                                    <div className="flex flex-col gap-1.5">
                                        {profileDriver.complaintsLog.map((c, i) => (
                                            <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg"
                                                style={{ background: 'rgba(176,58,6,0.06)', border: '1px solid rgba(176,58,6,0.08)' }}>
                                                <span className="text-[10px] mt-0.5" style={{ color: '#B03A06' }}>●</span>
                                                <span className="text-[11px]" style={{ color: 'rgba(244,242,238,0.6)' }}>{c}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })()}
            </Modal>

            {/* Toast */}
            <Toast message={toast.message} type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))} />
        </div>
    );
}
