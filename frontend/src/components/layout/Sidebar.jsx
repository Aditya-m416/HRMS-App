import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, Users, DollarSign, Clock, Calendar,
  Target, Briefcase, Rocket, BarChart3, Settings,
  ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';

const navItems = [
  { section: 'CORE', items: [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/employees', icon: Users, label: 'Employees', badge: null },
  ]},
  { section: 'HR OPERATIONS', items: [
    { path: '/payroll', icon: DollarSign, label: 'Payroll' },
    { path: '/attendance', icon: Clock, label: 'Attendance' },
    { path: '/leave', icon: Calendar, label: 'Leave', badge: 3 },
  ]},
  { section: 'TALENT', items: [
    { path: '/performance', icon: Target, label: 'Performance' },
    { path: '/recruitment', icon: Briefcase, label: 'Recruitment', badge: 5 },
    { path: '/onboarding', icon: Rocket, label: 'Onboarding' },
  ]},
  { section: 'INSIGHTS', items: [
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]},
];

// EasySoftecH "R" mark SVG — matches brand logo
function EasySoftechMark({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#B03525"/>
      {/* Stem */}
      <rect x="8" y="8" width="5" height="24" rx="2" fill="white"/>
      {/* Top bowl arch */}
      <path d="M13 8 Q30 8 30 17 Q30 26 13 26" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Leg */}
      <line x1="19" y1="24" x2="30" y2="32" stroke="white" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  );
}

export default function Sidebar({ mobile = false, onClose }) {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const collapsed = state.sidebarCollapsed && !mobile;

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} style={mobile ? { position: 'relative', width: 'var(--sidebar-width)' } : {}}>
      {/* Logo */}
      <div className="sidebar-logo" style={{ gap: collapsed ? 0 : 10, padding: collapsed ? '18px 0' : '18px 20px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <EasySoftechMark size={32} />
        {!collapsed && (
          <div style={{ lineHeight: 1 }}>
            {/* Mixed typography: EASY in sans-serif, SoftecH in serif */}
            <div style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: 2,
              color: 'var(--primary-light)',
              textTransform: 'uppercase',
            }}>
              EASY
            </div>
            <div style={{
              fontFamily: 'var(--font-brand, Georgia, serif)',
              fontWeight: 700,
              fontSize: 14,
              color: 'var(--text-primary)',
              letterSpacing: 0.5,
              marginTop: -1,
            }}>
              SoftecH
            </div>
            <div style={{
              fontSize: 9,
              color: 'var(--text-muted)',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              marginTop: 2,
            }}>
              HR Platform
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle — desktop only */}
      {!mobile && (
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          style={{
            position: 'absolute',
            right: '-13px',
            top: '72px',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            border: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'var(--transition)',
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      )}

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(section => (
          <div key={section.section}>
            {!collapsed && <div className="nav-section-label">{section.section}</div>}
            {section.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={20} className="nav-item-icon" />
                {!collapsed && <span className="nav-item-text">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer / User */}
      <div className="sidebar-footer">
        {state.user && (
          <div className="sidebar-user">
            <div className="avatar-placeholder" style={{ width: 32, height: 32, fontSize: 12, background: 'var(--gradient-primary)' }}>
              {state.user.initials}
            </div>
            {!collapsed && (
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{state.user.name}</div>
                <div className="sidebar-user-role">{state.user.label}</div>
              </div>
            )}
            {!collapsed && (
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }} title="Logout">
                <LogOut size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
