import { useState } from 'react';
import StatusPill from '../components/StatusPill';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { mockMaintenanceLogs, mockVehicles } from '../data/mockData';

const FILTERS = ['all', 'open', 'in_shop', 'resolved'];
const FILTER_LABELS = { all: 'All', open: 'Open', in_shop: 'In Shop', resolved: 'Resolved' };

const emptyLog = { vehicle: '', issue: '', date: '', cost: '', status: 'open' };

export default function MaintenancePage() {
    const [logs, setLogs] = useState(mockMaintenanceLogs);
    const [filter, setFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(emptyLog);
    const [formErrors, setFormErrors] = useState({});

    // Toast
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
    const showToast = (message, type = 'success') => setToast({ visible: true, message, type });

    // Counts
    const counts = {
        all: logs.length,
        open: logs.filter(l => l.status === 'open').length,
        in_shop: logs.filter(l => l.status === 'in_shop').length,
        resolved: logs.filter(l => l.status === 'resolved').length,
    };

    const filtered = logs.filter(l => filter === 'all' || l.status === filter);

    // ── Mark resolved ──
    const handleResolve = (id) => {
        setLogs(prev => prev.map(l => l.id === id ? { ...l, status: 'resolved' } : l));
        showToast('Maintenance log resolved — vehicle marked Available');
    };

    // ── Add log ──
    const validate = () => {
        const errs = {};
        if (!form.vehicle) errs.vehicle = 'Select a vehicle';
        if (!form.issue.trim()) errs.issue = 'Description is required';
        if (!form.date) errs.date = 'Date is required';
        if (!form.cost || Number(form.cost) <= 0) errs.cost = 'Must be a positive number';
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSaveLog = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const newLog = {
            id: Math.max(0, ...logs.map(l => l.id)) + 1,
            vehicle: form.vehicle,
            issue: form.issue.trim(),
            date: form.date,
            cost: Number(form.cost),
            status: form.status,
        };
        setLogs(prev => [newLog, ...prev]);
        setForm(emptyLog);
        setFormErrors({});
        setShowModal(false);
        showToast('Maintenance log saved — vehicle marked In Shop');
    };

    const openAddModal = () => {
        setForm(emptyLog);
        setFormErrors({});
        setShowModal(true);
    };

    // ── Input helper ──
    const inputStyle = (hasError) => ({
        background: 'rgba(28,28,30,0.7)',
        border: hasError ? '1.5px solid #B03A06' : '1.5px solid rgba(244,242,238,0.15)',
        color: '#F4F2EE',
        borderRadius: 10,
    });

    return (
        <div className="flex flex-col gap-5 fade-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-xl font-bold tracking-tight" style={{ color: '#1C1C1E' }}>Maintenance Logs</h2>
                <button onClick={openAddModal}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer transition-all hover:scale-105 border-none whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                    + Log Service
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2">
                {FILTERS.map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className="px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all border-none"
                        style={{
                            background: filter === f ? '#D4500A' : '#F4F2EE',
                            color: filter === f ? '#FFFFFF' : '#1C1C1E',
                        }}>
                        {FILTER_LABELS[f]} ({counts[f]})
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-2xl shadow-sm overflow-hidden"
                style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead>
                            <tr>
                                {['Vehicle', 'Issue / Service Type', 'Date', 'Cost ($)', 'Status', 'Action'].map(h => (
                                    <th key={h} className="text-[10px] font-bold uppercase tracking-wider px-5 py-3.5"
                                        style={{ color: 'rgba(28,28,30,0.35)', borderBottom: '1px solid rgba(28,28,30,0.06)' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(log => (
                                <tr key={log.id} className="transition-colors"
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,159,212,0.03)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td className="px-5 py-3.5 text-xs font-bold" style={{ color: '#1A6EA8' }}>{log.vehicle}</td>
                                    <td className="px-5 py-3.5 text-xs font-medium" style={{ color: '#1C1C1E' }}>{log.issue}</td>
                                    <td className="px-5 py-3.5 text-xs" style={{ color: 'rgba(28,28,30,0.5)' }}>{log.date}</td>
                                    <td className="px-5 py-3.5 text-xs font-mono font-semibold" style={{ color: '#1C1C1E' }}>
                                        ${log.cost.toLocaleString()}
                                    </td>
                                    <td className="px-5 py-3.5"><StatusPill status={log.status} /></td>
                                    <td className="px-5 py-3.5">
                                        {log.status !== 'resolved' ? (
                                            <button onClick={() => handleResolve(log.id)}
                                                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-all hover:scale-105"
                                                style={{ background: 'transparent', border: '1.5px solid #3B9FD4', color: '#3B9FD4' }}>
                                                Mark Resolved
                                            </button>
                                        ) : (
                                            <span className="text-[11px]" style={{ color: 'rgba(28,28,30,0.25)' }}>—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-sm" style={{ color: 'rgba(28,28,30,0.3)' }}>
                                        No maintenance logs found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Log Service Modal ── */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log Service">
                <form onSubmit={handleSaveLog} className="flex flex-col gap-4">
                    {/* Vehicle dropdown */}
                    <div>
                        <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                            style={{ color: 'rgba(244,242,238,0.5)' }}>Vehicle</label>
                        <select value={form.vehicle}
                            onChange={e => setForm({ ...form, vehicle: e.target.value })}
                            className="w-full px-4 py-3 text-sm outline-none cursor-pointer font-medium"
                            style={{ ...inputStyle(formErrors.vehicle), appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%23F4F2EE' stroke-width='1.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}>
                            <option value="" style={{ background: '#1C1C1E', color: '#F4F2EE' }}>Select vehicle…</option>
                            {mockVehicles.map(v => (
                                <option key={v.id} value={v.plate} style={{ background: '#1C1C1E', color: '#F4F2EE' }}>
                                    {v.plate} — {v.model}
                                </option>
                            ))}
                        </select>
                        {formErrors.vehicle && <p className="text-[11px] mt-1 font-medium" style={{ color: '#B03A06' }}>{formErrors.vehicle}</p>}
                    </div>

                    {/* Issue description */}
                    <div>
                        <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                            style={{ color: 'rgba(244,242,238,0.5)' }}>Issue / Service Description</label>
                        <textarea placeholder="Describe the issue or service…" rows={3} required
                            value={form.issue}
                            onChange={e => setForm({ ...form, issue: e.target.value })}
                            className="w-full px-4 py-3 text-sm outline-none resize-y font-medium"
                            style={{ ...inputStyle(formErrors.issue), fontFamily: 'inherit', minHeight: 80 }} />
                        {formErrors.issue && <p className="text-[11px] mt-1 font-medium" style={{ color: '#B03A06' }}>{formErrors.issue}</p>}
                    </div>

                    {/* Date + Cost */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>Service Date</label>
                            <input type="date" required
                                value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })}
                                className="w-full px-4 py-3 text-sm outline-none font-medium"
                                style={{ ...inputStyle(formErrors.date), colorScheme: 'dark' }} />
                            {formErrors.date && <p className="text-[11px] mt-1 font-medium" style={{ color: '#B03A06' }}>{formErrors.date}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>Estimated Cost ($)</label>
                            <input type="number" placeholder="0" required min="1"
                                value={form.cost}
                                onChange={e => setForm({ ...form, cost: e.target.value })}
                                className="w-full px-4 py-3 text-sm outline-none font-medium"
                                style={inputStyle(formErrors.cost)} />
                            {formErrors.cost && <p className="text-[11px] mt-1 font-medium" style={{ color: '#B03A06' }}>{formErrors.cost}</p>}
                        </div>
                    </div>

                    {/* Initial status */}
                    <div>
                        <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                            style={{ color: 'rgba(244,242,238,0.5)' }}>Initial Status</label>
                        <select value={form.status}
                            onChange={e => setForm({ ...form, status: e.target.value })}
                            className="w-full px-4 py-3 text-sm outline-none cursor-pointer font-medium"
                            style={{ ...inputStyle(false), appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%23F4F2EE' stroke-width='1.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}>
                            <option value="open" style={{ background: '#1C1C1E', color: '#F4F2EE' }}>Open</option>
                            <option value="in_shop" style={{ background: '#1C1C1E', color: '#F4F2EE' }}>In Shop</option>
                        </select>
                    </div>

                    {/* Warning note */}
                    <div className="flex gap-2.5 p-3 rounded-xl"
                        style={{ background: 'rgba(212,80,10,0.08)', border: '1px solid rgba(212,80,10,0.15)' }}>
                        <span className="text-sm mt-0.5">⚠️</span>
                        <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(244,242,238,0.6)' }}>
                            Logging a service will mark this vehicle as <strong style={{ color: '#D4500A' }}>IN_SHOP</strong> and remove it from the dispatcher pool.
                        </p>
                    </div>

                    {/* Button */}
                    <button type="submit"
                        className="w-full py-3 rounded-xl text-sm font-bold text-white cursor-pointer border-none transition-all hover:scale-[1.02] mt-1"
                        style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                        Save Log
                    </button>
                </form>
            </Modal>

            {/* Toast */}
            <Toast message={toast.message} type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))} />
        </div>
    );
}
