import { useEffect } from 'react';

export default function Toast({ message, type = 'success', isVisible, onClose }) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const colors = {
        success: { bg: '#34C759', icon: '✓' },
        error: { bg: '#B03A06', icon: '✕' },
        info: { bg: '#3B9FD4', icon: 'ℹ' },
    };

    const c = colors[type] || colors.success;

    return (
        <div className="fixed top-6 right-6 z-[100] toast-in">
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-semibold text-white"
                style={{ background: '#1C1C1E', border: `1px solid ${c.bg}33` }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: c.bg }}>
                    {c.icon}
                </span>
                {message}
            </div>
        </div>
    );
}
