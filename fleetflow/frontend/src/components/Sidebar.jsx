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
    ChevronRight
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const SidebarItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`
        }
    >
        <Icon size={20} className="shrink-0" />
        <span className="font-medium">{label}</span>
        <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </NavLink>
);

export default function Sidebar() {
    const { user, logout } = useAuthStore();

    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['manager', 'dispatcher', 'safety_officer', 'analyst'] },
        { to: '/vehicles', icon: Truck, label: 'Vehicles', roles: ['manager', 'dispatcher'] },
        { to: '/drivers', icon: Users, label: 'Drivers', roles: ['manager', 'safety_officer', 'dispatcher'] },
        { to: '/trips', icon: MapPin, label: 'Trips', roles: ['dispatcher', 'manager'] },
        { to: '/maintenance', icon: Wrench, label: 'Maintenance', roles: ['manager', 'safety_officer'] },
        { to: '/fuel', icon: Fuel, label: 'Fuel Logs', roles: ['manager', 'analyst'] },
        { to: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['manager', 'analyst'] },
    ];

    const filteredItems = navItems.filter(item => !item.roles || item.roles.includes(user?.role));

    return (
        <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col sticky top-0">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner">
                        FF
                    </div>
                    <span className="text-xl font-bold text-slate-800 tracking-tight">FleetFlow</span>
                </div>

                <nav className="space-y-1">
                    {filteredItems.map((item) => (
                        <SidebarItem key={item.to} {...item} />
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 px-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-600">
                        {user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-slate-800 truncate">{user?.full_name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
