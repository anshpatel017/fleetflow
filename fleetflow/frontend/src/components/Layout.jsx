import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex bg-slate-50 min-h-screen">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar — fixed on desktop, slide-in on mobile */}
            <div className={`fixed lg:sticky top-0 z-30 h-screen transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main content */}
            <main className="flex-1 min-w-0 flex flex-col lg:ml-0">
                {/* Mobile top bar */}
                <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100 sticky top-0 z-10">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                    >
                        <Menu size={22} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">FF</div>
                        <span className="font-bold text-slate-800 tracking-tight">FleetFlow</span>
                    </div>
                </div>

                <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
