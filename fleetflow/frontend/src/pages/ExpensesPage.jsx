import { useState, useMemo } from 'react';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { useFleet } from '../context/FleetContext';

export default function ExpensesPage() {
    const { expenses, trips, addExpense } = useFleet();
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ tripId: '', fuelL: '', fuelCost: '', misc: '', date: '', notes: '' });
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
    const showToast = (message, type = 'success') => setToast({ visible: true, message, type });

    // Summary stats
    const totals = useMemo(() => {
        const fuel = expenses.reduce((s, e) => s + e.fuelCost, 0);
        const misc = expenses.reduce((s, e) => s + e.misc, 0);
        return { fuel, misc, total: fuel + misc };
    }, [expenses]);

    // Trips suitable for expense logging (active or completed)
    const eligibleTrips = trips.filter(t => ['completed', 'dispatched', 'on_way'].includes(t.status));

    // Auto-populate from selected trip
    const selectedTrip = eligibleTrips.find(t => t.id === form.tripId);
    const autoDriver = selectedTrip?.driver || '—';
    const autoVehicle = selectedTrip?.vehicle || '—';
    const lineTotal = ((Number(form.fuelCost) || 0) + (Number(form.misc) || 0)).toFixed(2);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedTrip || !form.fuelL || !form.fuelCost || !form.date) return;

        const expense = {
            id: `EXP-${String(expenses.length + 1).padStart(3, '0')}`,
            tripId: selectedTrip.id,
            driver: autoDriver,
            vehicle: autoVehicle,
            fuelL: Number(form.fuelL),
            fuelCost: Number(form.fuelCost),
            misc: Number(form.misc) || 0,
            date: form.date,
            notes: form.notes,
            status: 'logged',
        };
        addExpense(expense);
        resetForm();
        showToast('Expense logged successfully');
    };

    const resetForm = () => {
        setForm({ tripId: '', fuelL: '', fuelCost: '', misc: '', date: '', notes: '' });
        setShowModal(false);
    };

    const isFormValid = form.tripId && form.fuelL && form.fuelCost && form.date;

    const statCards = [
        { label: 'Total Fuel Cost', value: `$${totals.fuel.toLocaleString()}`, color: '#D4500A', bg: 'rgba(212,80,10,0.06)' },
        { label: 'Total Misc', value: `$${totals.misc.toLocaleString()}`, color: '#1A6EA8', bg: 'rgba(26,110,168,0.06)' },
        { label: 'Total Expenses', value: `$${totals.total.toLocaleString()}`, color: '#1C1C1E', bg: 'rgba(28,28,30,0.04)' },
    ];

    return (
        <div className="flex flex-col gap-5 fade-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-xl font-bold tracking-tight" style={{ color: '#1C1C1E' }}>Expense & Fuel Log</h2>
                <button onClick={() => setShowModal(true)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer transition-all hover:scale-105 border-none whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                    + Log Expense
                </button>
            </div>

            {/* Summary bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statCards.map(s => (
                    <div key={s.label} className="flex flex-col gap-1 p-5 rounded-2xl"
                        style={{ background: s.bg, border: `1px solid ${s.color}15` }}>
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(28,28,30,0.4)' }}>{s.label}</span>
                        <span className="text-2xl font-black" style={{ color: s.color }}>{s.value}</span>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-2xl shadow-sm overflow-hidden"
                style={{ background: '#FFFFFF', border: '1px solid rgba(28,28,30,0.06)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead>
                            <tr>
                                {['Trip ID', 'Driver', 'Vehicle', 'Fuel (L)', 'Fuel Cost', 'Misc $', 'Total', 'Date', 'Status'].map(h => (
                                    <th key={h} className="text-[10px] font-bold uppercase tracking-wider px-4 py-3.5"
                                        style={{ color: 'rgba(28,28,30,0.35)', borderBottom: '1px solid rgba(28,28,30,0.06)' }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(ex => {
                                const total = ex.fuelCost + ex.misc;
                                return (
                                    <tr key={ex.id} className="transition-colors"
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,159,212,0.03)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td className="px-4 py-3.5 text-xs font-bold" style={{ color: '#1A6EA8' }}>{ex.tripId}</td>
                                        <td className="px-4 py-3.5 text-xs font-medium" style={{ color: '#1C1C1E' }}>{ex.driver}</td>
                                        <td className="px-4 py-3.5 text-xs font-mono" style={{ color: 'rgba(28,28,30,0.6)' }}>{ex.vehicle}</td>
                                        <td className="px-4 py-3.5 text-xs font-mono" style={{ color: 'rgba(28,28,30,0.6)' }}>{ex.fuelL}</td>
                                        <td className="px-4 py-3.5 text-xs font-semibold" style={{ color: '#D4500A' }}>${ex.fuelCost.toLocaleString()}</td>
                                        <td className="px-4 py-3.5 text-xs font-mono" style={{ color: 'rgba(28,28,30,0.6)' }}>${ex.misc.toLocaleString()}</td>
                                        <td className="px-4 py-3.5 text-xs font-bold" style={{ color: '#1C1C1E' }}>${total.toLocaleString()}</td>
                                        <td className="px-4 py-3.5 text-xs" style={{ color: 'rgba(28,28,30,0.5)' }}>{ex.date}</td>
                                        <td className="px-4 py-3.5">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                                style={{ background: 'rgba(34,197,94,0.08)', color: '#16a34a' }}>
                                                {ex.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {expenses.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="text-center py-12 text-sm" style={{ color: 'rgba(28,28,30,0.3)' }}>
                                        No expenses logged
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Log Expense Modal ── */}
            <Modal isOpen={showModal} onClose={resetForm} title="Log Expense" width="max-w-lg">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Trip selection */}
                    <div>
                        <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                            style={{ color: 'rgba(244,242,238,0.5)' }}>Trip</label>
                        <select value={form.tripId} required
                            onChange={e => setForm(f => ({ ...f, tripId: e.target.value }))}
                            className="fleet-input cursor-pointer">
                            <option value="" style={{ background: '#1C1C1E', color: '#F4F2EE' }}>Select a trip…</option>
                            {eligibleTrips.map(t => (
                                <option key={t.id} value={t.id} style={{ background: '#1C1C1E', color: '#F4F2EE' }}>
                                    {t.id} — {t.origin} → {t.destination} ({t.status})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Auto-populated driver + vehicle */}
                    {selectedTrip && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3.5 rounded-xl" style={{ background: 'rgba(59,159,212,0.06)', border: '1px solid rgba(59,159,212,0.1)' }}>
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(244,242,238,0.35)' }}>Driver</p>
                                <p className="text-sm font-semibold" style={{ color: '#F4F2EE' }}>{autoDriver}</p>
                            </div>
                            <div className="p-3.5 rounded-xl" style={{ background: 'rgba(59,159,212,0.06)', border: '1px solid rgba(59,159,212,0.1)' }}>
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(244,242,238,0.35)' }}>Vehicle</p>
                                <p className="text-sm font-semibold font-mono" style={{ color: '#F4F2EE' }}>{autoVehicle}</p>
                            </div>
                        </div>
                    )}

                    {/* Fuel fields */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>Fuel (Litres)</label>
                            <input type="number" placeholder="e.g. 120" required min="0" step="0.1"
                                value={form.fuelL}
                                onChange={e => setForm(f => ({ ...f, fuelL: e.target.value }))}
                                className="fleet-input" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>Fuel Cost ($)</label>
                            <input type="number" placeholder="e.g. 180" required min="0" step="0.01"
                                value={form.fuelCost}
                                onChange={e => setForm(f => ({ ...f, fuelCost: e.target.value }))}
                                className="fleet-input" />
                        </div>
                    </div>

                    {/* Misc + Date */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>Misc Expense ($)</label>
                            <input type="number" placeholder="0" min="0" step="0.01"
                                value={form.misc}
                                onChange={e => setForm(f => ({ ...f, misc: e.target.value }))}
                                className="fleet-input" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                                style={{ color: 'rgba(244,242,238,0.5)' }}>Date</label>
                            <input type="date" required
                                value={form.date}
                                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                className="fleet-input cursor-pointer" />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                            style={{ color: 'rgba(244,242,238,0.5)' }}>Notes (optional)</label>
                        <textarea placeholder="Any details…" rows={2}
                            value={form.notes}
                            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                            className="fleet-input" style={{ resize: 'vertical', minHeight: 56, fontFamily: 'inherit' }} />
                    </div>

                    {/* Total (read-only) */}
                    <div className="flex items-center justify-between p-4 rounded-xl"
                        style={{ background: 'rgba(28,28,30,0.06)', border: '1px solid rgba(28,28,30,0.1)' }}>
                        <span className="text-xs font-semibold" style={{ color: 'rgba(244,242,238,0.5)' }}>Line Total</span>
                        <span className="text-lg font-black" style={{ color: '#1C1C1E' }}>${lineTotal}</span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-2">
                        <button type="button" onClick={resetForm}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer border-none"
                            style={{ background: 'rgba(244,242,238,0.08)', color: 'rgba(244,242,238,0.5)' }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={!isFormValid}
                            className="flex-1 py-3 rounded-xl text-sm font-bold text-white cursor-pointer border-none transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                            💾 Save Expense
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Toast */}
            <Toast message={toast.message} type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))} />
        </div>
    );
}
