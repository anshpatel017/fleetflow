import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import AvatarBadge from './AvatarBadge';
import useRoleStore from '../store/roleStore';

const TITLES = {
  '/dashboard': 'Command Center',
  '/vehicles': 'Vehicle Registry',
  '/trips': 'Trip Dispatcher',
  '/drivers': 'Driver Profiles',
  '/maintenance': 'Maintenance Logs',
  '/fuel': 'Fuel & Expenses',
  '/analytics': 'Analytics',
};

export default function TopBar() {
  const location = useLocation();
  const { role, roleLabel } = useRoleStore();

  const title = TITLES[location.pathname] ?? 'FleetFlow';

  return (
    <header
      className="fixed left-0 right-0 top-0 h-[60px] z-40"
      style={{ background: 'var(--ff-bg)', borderBottom: '1px solid var(--ff-border)' }}
    >
      <div className="h-full flex items-center justify-between px-8" style={{ marginLeft: 260 }}>
        <div className="text-[18px] font-bold text-slate-100">{title}</div>

        <div className="flex items-center gap-3">
          <div className="relative w-[320px] hidden md:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="ff-input pl-9 h-10" placeholder="Search vehicles, trips, drivers…" />
          </div>

          <button className="ff-btn ff-btn-ghost w-10 h-10 relative" aria-label="Notifications">
            <Bell size={18} />
            <span
              className="absolute -top-1 -right-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(239,68,68,0.95)', color: 'white', lineHeight: 1 }}
            >
              3
            </span>
          </button>

          <div className="flex items-center gap-3 pl-2 border-l" style={{ borderColor: 'rgba(51,65,85,0.9)' }}>
            <AvatarBadge name="Alex Morgan" status={role === 'dispatcher' ? 'on_trip' : 'available'} size={34} />
            <div className="hidden sm:block">
              <div className="text-[13px] font-semibold text-slate-100 leading-tight">Alex Morgan</div>
              <div className="text-[12px] text-slate-400 leading-tight">{roleLabel(role)}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
