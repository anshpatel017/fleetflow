import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/vehicles', label: 'Vehicles', icon: '🚛' },
    { path: '/trips', label: 'Trips', icon: '🗺️' },
    { path: '/drivers', label: 'Drivers', icon: '👤' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
];

export default function Sidebar({ isOpen, onToggle }) {
    const location = useLocation();

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onToggle} />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{ width: 260, background: '#1C1C1E', borderRight: '1px solid rgba(244,242,238,0.06)' }}>

                {/* Logo */}
                <div className="h-16 flex items-center px-6 gap-2.5"
                    style={{ borderBottom: '1px solid rgba(244,242,238,0.06)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs"
                        style={{ background: 'linear-gradient(135deg, #D4500A, #B03A06)' }}>
                        FF
                    </div>
                    <span className="font-extrabold text-lg tracking-tight" style={{ color: '#3B9FD4' }}>
                        FleetFlow
                    </span>
                    {/* Mobile close */}
                    <button onClick={onToggle}
                        className="lg:hidden ml-auto bg-transparent border-none cursor-pointer text-lg"
                        style={{ color: 'rgba(244,242,238,0.4)' }}>
                        ✕
                    </button>
                </div>

                {/* Navigation */}
                <nav className="px-3 py-4 flex flex-col gap-1">
                    <span className="text-[10px] font-bold tracking-widest uppercase px-3 mb-2"
                        style={{ color: 'rgba(244,242,238,0.25)' }}>
                        Main Menu
                    </span>

                    {navItems.map(item => {
                        const active = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg no-underline transition-all duration-200 group"
                                style={{
                                    background: active ? 'rgba(59,159,212,0.1)' : 'transparent',
                                    borderLeft: active ? '3px solid #3B9FD4' : '3px solid transparent',
                                    color: active ? '#3B9FD4' : 'rgba(244,242,238,0.5)',
                                }}
                                onClick={() => { if (window.innerWidth < 1024) onToggle(); }}>
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom section */}
                <div className="absolute bottom-0 left-0 right-0 p-4"
                    style={{ borderTop: '1px solid rgba(244,242,238,0.06)' }}>
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: 'linear-gradient(135deg, #1A6EA8, #3B9FD4)' }}>
                            FM
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">Fleet Manager</p>
                            <p className="text-[11px] truncate" style={{ color: 'rgba(244,242,238,0.35)' }}>admin@fleetflow.io</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
