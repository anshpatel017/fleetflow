import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  MapPin,
  Users,
  Wrench,
  Fuel,
  BarChart3,
  LogOut,
} from 'lucide-react';
import AvatarBadge from './AvatarBadge';
import useRoleStore from '../store/roleStore';
import TopBar from './TopBar';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['manager', 'dispatcher', 'safety_officer', 'analyst'] },
  { to: '/vehicles', label: 'Vehicles', icon: Truck, roles: ['manager', 'dispatcher'] },
  { to: '/trips', label: 'Trips', icon: MapPin, roles: ['manager', 'dispatcher'] },
  { to: '/drivers', label: 'Drivers', icon: Users, roles: ['manager', 'dispatcher', 'safety_officer'] },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench, roles: ['manager', 'safety_officer'] },
  { to: '/fuel', label: 'Fuel & Expenses', icon: Fuel, roles: ['manager', 'analyst'] },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, roles: ['manager', 'analyst'] },
];

export default function AppLayout({ children }) {
  const { role, roleLabel, setRole } = useRoleStore();
  const location = useLocation();

  const navItems = useMemo(
    () => NAV.filter((n) => !n.roles || n.roles.includes(role)),
    [role]
  );

  const isMobileAuthLayout = location.pathname === '/login';
  if (isMobileAuthLayout) return <>{children}</>;

  return (
    <div className="min-h-screen" style={{ background: 'var(--ff-bg)' }}>
      <TopBar />

      <aside
        className="fixed left-0 top-0 bottom-0 z-50 flex flex-col"
        style={{ width: 260, background: 'var(--ff-bg)', borderRight: '1px solid var(--ff-border)' }}
      >
        <div className="px-5 pt-6 pb-4">
          <div className="text-[22px] font-extrabold tracking-tight">
            <span className="text-white">Fleet</span>
            <span style={{ color: 'var(--ff-primary)' }}>Flow</span>
          </div>

          <div className="mt-3 inline-flex items-center gap-2 rounded-md px-2.5 py-1 border"
            style={{ background: 'rgba(30,41,59,0.55)', borderColor: 'rgba(51,65,85,0.8)' }}
          >
            <span className="text-[12px] font-semibold text-slate-200">{roleLabel(role)}</span>
          </div>

          <div className="mt-4">
            <select
              className="ff-input h-9 text-[13px]"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              aria-label="Role"
            >
              <option value="manager">Manager</option>
              <option value="dispatcher">Dispatcher</option>
              <option value="safety_officer">Safety Officer</option>
              <option value="analyst">Analyst</option>
            </select>
          </div>
        </div>

        <nav className="px-3 flex-1 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-500 hover:text-slate-200'
                    }`
                  }
                  style={({ isActive }) => ({
                    background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                    borderLeft: isActive ? '3px solid #6366F1' : '3px solid transparent',
                  })}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="text-[13px] font-semibold">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--ff-border)' }}>
          <div className="flex items-center gap-3">
            <AvatarBadge name="Alex Morgan" status={role === 'dispatcher' ? 'on_trip' : 'available'} size={38} />
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-slate-100 truncate">Alex Morgan</div>
              <div className="text-[12px] text-slate-400 truncate">{roleLabel(role)}</div>
            </div>
            <button
              className="ml-auto ff-btn ff-btn-ghost w-9 h-9"
              aria-label="Logout"
              title="Logout"
              onClick={() => window.location.assign('/login')}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main
        className="pt-[60px]"
        style={{ marginLeft: 260, padding: 32, minHeight: '100vh', background: 'var(--ff-bg)' }}
      >
        {children}
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{ background: 'rgba(15,17,23,0.95)', borderTop: '1px solid var(--ff-border)' }}
      >
        <div className="grid grid-cols-5 px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 py-2 rounded-lg ${isActive ? 'text-indigo-300' : 'text-slate-500'}`
                }
              >
                <Icon size={18} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
