import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const icons = {
  success: <CheckCircle size={16} />,
  error: <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info: <Info size={16} />,
};

const colors = {
  success: { bg: 'rgba(5,150,105,0.12)', border: 'rgba(5,150,105,0.3)', color: '#10B981', glow: 'rgba(5,150,105,0.2)' },
  error:   { bg: 'rgba(220,38,38,0.12)', border: 'rgba(220,38,38,0.3)',  color: '#EF4444', glow: 'rgba(220,38,38,0.2)' },
  warning: { bg: 'rgba(217,119,6,0.12)', border: 'rgba(217,119,6,0.3)',  color: '#F59E0B', glow: 'rgba(217,119,6,0.2)' },
  info:    { bg: 'rgba(59,130,246,0.12)',border: 'rgba(59,130,246,0.3)', color: '#3B82F6', glow: 'rgba(59,130,246,0.2)' },
};

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);
  const c = colors[toast.type] || colors.info;

  useEffect(() => {
    // animate in
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 350);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '12px 16px',
      background: 'var(--bg-elevated)',
      border: `1px solid ${c.border}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: `0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px ${c.border}, 0 0 20px ${c.glow}`,
      maxWidth: 360,
      width: '100%',
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* left accent bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: c.color, borderRadius: '4px 0 0 4px' }} />
      <div style={{ color: c.color, flexShrink: 0, marginTop: 1 }}>{icons[toast.type]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{toast.title}</div>}
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{toast.message}</div>
      </div>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(toast.id), 350); }}
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0, padding: 2 }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'all' }}>
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
