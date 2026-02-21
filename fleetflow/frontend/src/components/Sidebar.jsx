import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Truck,
    Users,
    MapPin,
    Wrench,
    Fuel,
    BarChart3,
    LogOut,
    ChevronRight,
    X,
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const SidebarItem = ({ to, icon: Icon, label, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`
        }
    >
        <Icon size={19} className="shrink-0" />
        <span className="font-medium text-sm">{label}</span>
        <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
    </NavLink>
);

export default function Sidebar({ onClose }) {
    const { user, logout } = useAuthStore();

    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard',   roles: ['manager', 'dispatcher', 'safety_officer', 'analyst'] },
        { to: '/vehicles',  icon: Truck,           label: 'Vehicles',    roles: ['manager', 'dispatcher'] },
        { to: '/drivers',   icon: Users,           label: 'Drivers',     roles: ['manager', 'safety_officer', 'dispatcher'] },
        { to: '/trips',     icon: MapPin,          label: 'Trips',       roles: ['dispatcher', 'manager'] },
        { to: '/maintenance',icon: Wrench,         label: 'Maintenance', roles: ['manager', 'safety_officer'] },
        { to: '/fuel',      icon: Fuel,            label: 'Fuel Logs',   roles: ['manager', 'analyst'] },
        { to: '/analytics', icon: BarChart3,       label: 'Analytics',   roles: ['manager', 'analyst'] },
    ];

    const filteredItems = navItems.filter(item => !item.roles || item.roles.includes(user?.role));

    const roleLabel = {
        manager: 'Fleet Manager',
        dispatcher: 'Dispatcher',
        safety_officer: 'Safety Officer',
        analyst: 'Financial Analyst',
    }[user?.role] ?? user?.role;

    return (
        <aside className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col">
            {/* Logo */}
            <div className="px-5 pt-6 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-200">
                        FF
                    </div>
                    <div>
                        <span className="text-base font-bold text-slate-800 tracking-tight block leading-none">FleetFlow</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Fleet OS</span>
                    </div>
                </div>
                {/* Close button — mobile only */}
                {onClose && (
                    <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Section label */}
            <div className="px-5 mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navigation</span>
            </div>

            <nav className="px-3 flex-1 space-y-0.5 overflow-y-auto">
                {filteredItems.map((item) => (
                    <SidebarItem key={item.to} {...item} onClick={onClose} />
                ))}
            </nav>

            {/* User card */}
            <div className="p-3 border-t border-slate-100">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shrink-0">
                        {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-slate-800 truncate leading-tight">{user?.full_name || 'User'}</p>
                        <p className="text-[11px] text-slate-500 truncate">{roleLabel}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-sm font-semibold"
                >
                    <LogOut size={16} />
                    <span>Sign out</span>
                </button>
            </div>
        </aside>
    );
}
