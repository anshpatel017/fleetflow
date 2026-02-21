export default function SlideDrawer({ isOpen, onClose, title, children }) {
    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={onClose} />
            )}

            {/* Drawer panel */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ background: '#FFFFFF', boxShadow: isOpen ? '-8px 0 30px rgba(0,0,0,0.15)' : 'none' }}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 h-16 shrink-0"
                    style={{ borderBottom: '1px solid rgba(28,28,30,0.08)' }}>
                    <h2 className="text-base font-bold tracking-tight" style={{ color: '#1C1C1E' }}>{title}</h2>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors bg-transparent border-none text-lg"
                        style={{ color: 'rgba(28,28,30,0.4)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(28,28,30,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        ✕
                    </button>
                </div>

                {/* Body — scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </>
    );
}
