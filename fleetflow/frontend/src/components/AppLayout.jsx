import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Truck, Route, Users, Wrench, Fuel, BarChart3, LogOut, ChevronDown,
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import useRoleStore from '../store/roleStore';
import TopBar from './TopBar';
import AvatarBadge from './AvatarBadge';

const NAV = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['manager', 'dispatcher', 'safety_officer', 'analyst'] },
  { path: '/vehicles', label: 'Vehicles', icon: Truck, roles: ['manager', 'dispatcher'] },
  { path: '/trips', label: 'Trips', icon: Route, roles: ['manager', 'dispatcher'] },
  { path: '/drivers', label: 'Drivers', icon: Users, roles: ['manager', 'safety_officer'] },
  { path: '/maintenance', label: 'Maintenance', icon: Wrench, roles: ['manager'] },
  { path: '/fuel', label: 'Fuel & Expenses', icon: Fuel, roles: ['manager', 'analyst'] },
  { path: '/analytics', label: 'Analytics', icon: BarChart3, roles: ['manager', 'analyst'] },
];

const PAGE_TITLES = {
  '/dashboard': 'Command Center',
  '/vehicles': 'Vehicle Registry',
  '/trips': 'Trip Dispatcher',
  '/drivers': 'Driver Profiles',
  '/maintenance': 'Maintenance Logs',
  '/fuel': 'Fuel & Expenses',
  '/analytics': 'Analytics',
};

export default function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { role, roleLabel } = useRoleStore();

  const filtered = NAV.filter(n => n.roles.includes(role));
  const title = PAGE_TITLES[location.pathname] || 'FleetFlow';
  const userName = user?.full_name || user?.email || 'Fleet Manager';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 260,
        background: 'var(--surface)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', zIndex: 40,
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px 24px 20px', display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366F1, #818CF8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Truck size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              FleetFlow
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Fleet Management
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            color: 'var(--text-faint)', padding: '0 12px', marginBottom: 8,
          }}>
            Navigation
          </div>
          {filtered.map(item => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10, marginBottom: 2,
                  textDecoration: 'none', transition: 'all 0.15s',
                  background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                  borderLeft: active ? '3px solid #6366F1' : '3px solid transparent',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={18} style={{ color: active ? '#818CF8' : 'var(--text-faint)', flexShrink: 0 }} />
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: active ? 600 : 500,
                  color: active ? 'var(--text)' : 'var(--text-muted)',
                }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div style={{
          padding: '16px 16px 20px', borderTop: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AvatarBadge name={userName} size="md" status="online" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {userName}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {roleLabel(role)}
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 6,
                color: 'var(--text-faint)', borderRadius: 8, display: 'flex',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-faint)'; }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 260, display: 'flex', flexDirection: 'column', minHeight: '100vh', width: 'calc(100vw - 260px)', maxWidth: 'calc(100vw - 260px)' }}>
        <TopBar title={title} userName={userName} />
        <main className="ff-grid-bg" style={{
          flex: 1, padding: '32px 40px 48px', marginTop: 56,
          overflowX: 'hidden', overflowY: 'auto',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
