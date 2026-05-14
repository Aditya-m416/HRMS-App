import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, DollarSign, Calendar, BarChart2, X, ArrowRight } from 'lucide-react';
import { getEmployees } from '../../data/store';
import { departments } from '../../data/mockData';

const categories = [
  { key: 'employees', label: 'Employees', icon: Users, color: '#7C3AED', path: '/employees' },
  { key: 'payroll',   label: 'Payroll',   icon: DollarSign, color: '#10B981', path: '/payroll' },
  { key: 'leave',     label: 'Leave',     icon: Calendar, color: '#F59E0B', path: '/leave' },
  { key: 'analytics', label: 'Analytics', icon: BarChart2, color: '#06B6D4', path: '/analytics' },
];

const quickActions = [
  { label: 'Add Employee', path: '/employees', action: 'add', icon: Users },
  { label: 'Run Payroll',  path: '/payroll',   icon: DollarSign },
  { label: 'Apply Leave',  path: '/leave',     icon: Calendar },
  { label: 'View Analytics', path: '/analytics', icon: BarChart2 },
];

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const emps = getEmployees();

    const empResults = emps
      .filter(e => e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) ||
                   e.email.toLowerCase().includes(q) || e.dept.toLowerCase().includes(q))
      .slice(0, 5)
      .map(e => ({
        type: 'employee', label: e.name, sub: `${e.role} · ${e.dept}`,
        icon: Users, color: '#7C3AED', path: '/employees', data: e,
      }));

    const deptResults = departments
      .filter(d => d.toLowerCase().includes(q))
      .slice(0, 2)
      .map(d => ({
        type: 'department', label: d + ' Department', sub: 'View department',
        icon: Users, color: '#06B6D4', path: '/employees',
      }));

    const pageResults = categories
      .filter(c => c.label.toLowerCase().includes(q))
      .map(c => ({
        type: 'page', label: c.label, sub: 'Navigate to page',
        icon: c.icon, color: c.color, path: c.path,
      }));

    setResults([...empResults, ...deptResults, ...pageResults]);
    setSelectedIdx(0);
  }, [query]);

  function handleKeyDown(e) {
    const list = results.length ? results : query ? [] : quickActions;
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => (i + 1) % list.length); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelectedIdx(i => (i - 1 + list.length) % list.length); }
    if (e.key === 'Enter')     { const item = list[selectedIdx]; if (item) { navigate(item.path); onClose(); } }
    if (e.key === 'Escape')    { onClose(); }
  }

  if (!open) return null;

  const displayItems = results.length ? results : quickActions.map(a => ({ ...a, sub: 'Quick action' }));

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 80 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,11,20,0.7)', backdropFilter: 'blur(8px)' }} />

      <div
        style={{
          position: 'relative', width: '100%', maxWidth: 600,
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.15)',
          overflow: 'hidden', animation: 'slideDown 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <Search size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search employees, payroll, leaves, analytics..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: 16, color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          )}
          <kbd style={{ fontSize: 11, padding: '2px 8px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-muted)', fontFamily: 'monospace' }}>Esc</kbd>
        </div>

        {/* Category pills */}
        {!query && (
          <div style={{ display: 'flex', gap: 8, padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
            {categories.map(c => {
              const Icon = c.icon;
              return (
                <button key={c.key} onClick={() => { navigate(c.path); onClose(); }} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
                  background: `${c.color}12`, border: `1px solid ${c.color}30`, borderRadius: 'var(--radius-full)',
                  color: c.color, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>
                  <Icon size={13} /> {c.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Results */}
        <div style={{ maxHeight: 360, overflowY: 'auto' }}>
          {!query && <div style={{ padding: '10px 20px 4px', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Quick Actions</div>}
          {query && !results.length && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              <Search size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
              <div>No results for "<strong>{query}</strong>"</div>
            </div>
          )}
          {displayItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                onClick={() => { navigate(item.path); onClose(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', cursor: 'pointer',
                  background: i === selectedIdx ? 'rgba(124,58,237,0.08)' : 'transparent',
                  borderLeft: i === selectedIdx ? '2px solid var(--primary)' : '2px solid transparent',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={() => setSelectedIdx(i)}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: `${item.color || '#7C3AED'}14`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={16} style={{ color: item.color || '#7C3AED' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{item.sub}</div>
                </div>
                <ArrowRight size={14} style={{ color: 'var(--text-muted)', opacity: i === selectedIdx ? 1 : 0 }} />
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
          <span><kbd style={{ fontFamily: 'monospace', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 6px' }}>↑↓</kbd> Navigate</span>
          <span><kbd style={{ fontFamily: 'monospace', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 6px' }}>Enter</kbd> Open</span>
          <span><kbd style={{ fontFamily: 'monospace', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 6px' }}>Esc</kbd> Close</span>
        </div>
      </div>
      <style>{`@keyframes slideDown { from { opacity:0; transform:translateY(-12px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
    </div>
  );
}
