import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const pageTitles = {
    '/dashboard': 'Command Center',
    '/vehicles': 'Vehicle Registry',
    '/trips': 'Trip Dispatcher',
    '/drivers': 'Driver Profiles',
    '/analytics': 'Financial Analytics',
};

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const pageTitle = pageTitles[location.pathname] || 'Dashboard';
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="min-h-screen" style={{ background: '#F4F2EE' }}>
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            {/* Main content area */}
            <div className="lg:ml-[260px] min-h-screen flex flex-col">
                {/* Top Navbar */}
                <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-30"
                    style={{ background: 'rgba(244,242,238,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(28,28,30,0.08)' }}>

                    {/* Left: hamburger + title */}
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)}
                            className="lg:hidden flex flex-col gap-1 cursor-pointer bg-transparent border-none p-2">
                            <span className="w-5 h-0.5 rounded" style={{ background: '#1C1C1E' }} />
                            <span className="w-5 h-0.5 rounded" style={{ background: '#1C1C1E' }} />
                            <span className="w-3.5 h-0.5 rounded" style={{ background: '#1C1C1E' }} />
                        </button>
                        <h1 className="text-lg font-bold tracking-tight" style={{ color: '#1C1C1E' }}>
                            {pageTitle}
                        </h1>
                    </div>

                    {/* Right: notification + user */}
                    <div className="flex items-center gap-4">
                        {/* Notification bell */}
                        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors bg-transparent border-none"
                            style={{ color: '#1C1C1E' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(28,28,30,0.06)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <span className="text-lg">🔔</span>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                                style={{ background: '#D4500A', boxShadow: '0 0 0 2px #F4F2EE' }} />
                        </button>

                        {/* User */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-semibold" style={{ color: '#1C1C1E' }}>
                                    {user?.full_name || 'Fleet Manager'}
                                </p>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                                style={{ background: 'rgba(212,80,10,0.12)', color: '#D4500A' }}>
                                {user?.role || 'Manager'}
                            </span>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                style={{ background: 'linear-gradient(135deg, #1A6EA8, #3B9FD4)' }}>
                                {(user?.full_name || 'FM').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
