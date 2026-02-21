import { useState } from 'react';

export default function Modal({ isOpen, onClose, title, children, width = 'max-w-lg' }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal content */}
            <div className={`relative ${width} w-full rounded-2xl p-6 md:p-8 fade-up max-h-[90vh] overflow-y-auto`}
                style={{ background: '#2C2C2E', border: '1px solid rgba(244,242,238,0.08)' }}
                onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors bg-transparent border-none text-lg"
                        style={{ color: 'rgba(244,242,238,0.4)' }}
                        onMouseEnter={e => e.target.style.background = 'rgba(244,242,238,0.1)'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}>
                        ✕
                    </button>
                </div>

                {/* Body */}
                {children}
            </div>
        </div>
    );
}
