import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useApp } from '../../context/AppContext';

export default function Layout() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.user) navigate('/login');
  }, [state.user]);

  if (!state.user) return null;

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Nav Overlay */}
      {state.mobileNavOpen && (
        <>
          <div
            className="mobile-nav-overlay open"
            onClick={() => dispatch({ type: 'CLOSE_MOBILE_NAV' })}
          />
          <div className="mobile-sidebar sidebar" style={{ display: 'flex' }}>
            <Sidebar mobile={true} onClose={() => dispatch({ type: 'CLOSE_MOBILE_NAV' })} />
          </div>
        </>
      )}

      {/* Main area */}
      <main className={`app-main ${state.sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <TopBar />
        <div className="page-content">
          <Outlet />
        </div>
      </main>

      {/* Mobile hamburger (CSS-driven visibility) */}
      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
