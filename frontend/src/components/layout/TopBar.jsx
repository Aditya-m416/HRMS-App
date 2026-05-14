import { useState } from 'react';
import { Bell, Search, Menu, Moon, Sun, Command } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GlobalSearch from '../ui/GlobalSearch';

export default function TopBar() {
  const { state, dispatch } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const unread = state.notifications.filter(n => !n.read).length;
  const isDark = state.theme === 'dark';

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useState(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <header className={`topbar ${state.sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Mobile hamburger */}
        <button className="topbar-icon-btn" style={{ display: 'none' }} id="mobile-menu-btn"
          onClick={() => dispatch({ type: 'TOGGLE_MOBILE_NAV' })}>
          <Menu size={18} />
        </button>

        {/* Search trigger */}
        <div
          className="topbar-search search-input-wrapper"
          style={{ flex: 1, maxWidth: 420, cursor: 'pointer' }}
          onClick={() => setSearchOpen(true)}
        >
          <Search size={16} className="search-icon" />
          <div style={{
            flex: 1, fontSize: 13, color: 'var(--text-muted)',
            background: 'transparent', border: 'none', outline: 'none',
            userSelect: 'none', pointerEvents: 'none',
          }}>
          Search employees, payroll, leaves...
          </div>
          <kbd style={{
            fontSize: 11, padding: '2px 8px',
            background: 'rgba(100,116,139,0.12)',
            border: '1px solid var(--border)',
            borderRadius: 6, color: 'var(--text-muted)',
            fontFamily: 'monospace', flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            <Command size={10} /> K
          </kbd>
        </div>

        <div className="topbar-right">
          {/* Theme Toggle */}
          <button className="topbar-icon-btn" id="theme-toggle-btn"
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{ position: 'relative' }}>
            <span style={{
              display: 'block',
              transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(180deg) scale(1.1)',
            }}>
              {isDark ? <Moon size={18} /> : <Sun size={18} style={{ color: '#F59E0B' }} />}
            </span>
          </button>

          {/* Notification bell */}
          <div style={{ position: 'relative' }}>
            <button className="topbar-icon-btn" id="notif-btn" onClick={() => setShowNotifs(v => !v)}>
              <Bell size={18} />
              {unread > 0 && <span className="notification-dot" />}
            </button>
            {showNotifs && (
              <div style={{
                position: 'absolute', right: 0, top: '44px', width: 340,
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 200, overflow: 'hidden',
              }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
                  <button onClick={() => { dispatch({ type: 'MARK_ALL_READ' }); setShowNotifs(false); }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                    Mark all read
                  </button>
                </div>
                {state.notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '12px 16px', borderBottom: '1px solid rgba(148,163,184,0.06)',
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    background: n.read ? 'transparent' : 'rgba(124,58,237,0.06)',
                    cursor: 'pointer', transition: 'var(--transition)',
                  }} onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: n.id })}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: n.read ? 'transparent' : 'var(--primary)' }} />
                    <div>
                      <div style={{ fontSize: 13, color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)', lineHeight: 1.4 }}>{n.text}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User avatar */}
          {state.user && (
            <div className="avatar-placeholder"
              style={{ width: 34, height: 34, fontSize: 12, cursor: 'pointer', border: '2px solid var(--primary-glow)' }}
              title={state.user.name}>
              {state.user.initials}
            </div>
          )}
        </div>

        {/* Close notifs on outside click */}
        {showNotifs && <div onClick={() => setShowNotifs(false)} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />}
      </header>

      {/* Global Search */}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
