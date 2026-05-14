import { useState } from 'react';
import { useApp, roles } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  User, Bell, Shield, Palette, Globe, Zap,
  Moon, Save, LogOut, Check, ChevronRight
} from 'lucide-react';

export default function Settings() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    leaveApprovals: true, payrollProcessed: true, newHires: false,
    performanceReminders: true, systemAlerts: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'integrations', icon: Globe, label: 'Integrations' },
    { id: 'role', icon: Zap, label: 'Switch Role' },
  ];

  const integrations = [
    { name: 'Slack', desc: 'HR notifications to Slack channels', connected: true, icon: '💬' },
    { name: 'Google Workspace', desc: 'Sync calendar and emails', connected: true, icon: '🔵' },
    { name: 'QuickBooks', desc: 'Accounting & payroll sync', connected: false, icon: '💚' },
    { name: 'MS Teams', desc: 'Meeting and approval notifications', connected: false, icon: '🟣' },
    { name: 'Tally', desc: 'Indian accounting integration', connected: false, icon: '📊' },
    { name: 'Jira', desc: 'Engineering task tracking', connected: true, icon: '🔷' },
  ];

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <div className="page-header-left">
          <h1>Settings</h1>
          <p>Manage your account, preferences and integrations</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={handleSave} id="save-settings-btn">
            {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--spacing-md)' }}>
        {/* Sidebar */}
        <div className="glass-card animate-fade-in-up" style={{ height: 'fit-content' }}>
          <div className="glass-card-inner" style={{ padding: 'var(--spacing-sm)' }}>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className="nav-item"
                style={{
                  background: activeSection === s.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                  color: activeSection === s.id ? 'var(--primary-light)' : 'var(--text-secondary)',
                  width: '100%',
                }}
              >
                <s.icon size={17} />
                {s.label}
                {activeSection === s.id && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </button>
            ))}
            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
            <button
              className="nav-item"
              style={{ color: 'var(--danger)', width: '100%' }}
              onClick={() => { dispatch({ type: 'LOGOUT' }); navigate('/login'); }}
            >
              <LogOut size={17} /> Sign Out
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="glass-card animate-fade-in-up delay-1">
          <div className="glass-card-inner" style={{ padding: 'var(--spacing-xl)' }}>

            {activeSection === 'profile' && (
              <div>
                <h3 style={{ marginBottom: 24, fontSize: 18 }}>Profile Information</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, padding: '20px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                  <div className="avatar-placeholder animate-pulse-glow" style={{ width: 72, height: 72, fontSize: 26, background: 'var(--gradient-primary)' }}>
                    {state.user?.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{state.user?.name}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{state.user?.label} · {state.user?.employeeId}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{state.user?.email}</div>
                  </div>
                  <button className="btn btn-ghost btn-sm">Change Photo</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                  {[
                    { label: 'First Name', value: state.user?.name.split(' ')[0] },
                    { label: 'Last Name', value: state.user?.name.split(' ')[1] || '' },
                    { label: 'Email Address', value: state.user?.email },
                    { label: 'Phone', value: '+91 98765 43210' },
                    { label: 'Department', value: 'HR' },
                    { label: 'Location', value: 'Mumbai, India' },
                  ].map(field => (
                    <div key={field.label} className="form-group">
                      <label className="form-label">{field.label}</label>
                      <input className="form-input" defaultValue={field.value} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div>
                <h3 style={{ marginBottom: 24, fontSize: 18 }}>Notification Preferences</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {Object.entries(notifSettings).map(([key, val]) => {
                    const labels = {
                      leaveApprovals: { label: 'Leave Approvals', desc: 'Get notified when leave requests need approval' },
                      payrollProcessed: { label: 'Payroll Processed', desc: 'Monthly payslip and payroll run notifications' },
                      newHires: { label: 'New Hires', desc: 'When a new employee joins your team' },
                      performanceReminders: { label: 'Performance Reminders', desc: 'Goal deadlines and review cycle alerts' },
                      systemAlerts: { label: 'System Alerts', desc: 'Platform updates and maintenance windows' },
                    };
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{labels[key].label}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{labels[key].desc}</div>
                        </div>
                        <button
                          onClick={() => setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                          style={{
                            width: 44, height: 24, borderRadius: 12,
                            background: val ? 'var(--primary)' : 'var(--bg-elevated)',
                            border: `1px solid ${val ? 'var(--primary)' : 'var(--border)'}`,
                            cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease',
                            flexShrink: 0,
                          }}
                        >
                          <div style={{
                            width: 18, height: 18, borderRadius: '50%', background: 'white',
                            position: 'absolute', top: 2,
                            left: val ? 22 : 2,
                            transition: 'left 0.3s ease',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                          }} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div>
                <h3 style={{ marginBottom: 24, fontSize: 18 }}>Security Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  <div style={{ padding: 'var(--spacing-lg)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 700, marginBottom: 16 }}>Change Password</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div className="form-group"><label className="form-label">Current Password</label><input type="password" className="form-input" placeholder="••••••••" /></div>
                      <div className="form-group"><label className="form-label">New Password</label><input type="password" className="form-input" placeholder="Min 8 characters" /></div>
                      <div className="form-group"><label className="form-label">Confirm Password</label><input type="password" className="form-input" placeholder="Re-enter password" /></div>
                      <button className="btn btn-primary" style={{ width: 'fit-content' }}>Update Password</button>
                    </div>
                  </div>
                  <div style={{ padding: 'var(--spacing-lg)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>Two-Factor Authentication</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Add an extra layer of security to your account</div>
                      </div>
                      <span className="badge badge-warning">Disabled</span>
                    </div>
                    <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>Enable 2FA</button>
                  </div>
                  <div style={{ padding: 'var(--spacing-lg)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 700, marginBottom: 12 }}>Active Sessions</div>
                    {[
                      { device: 'Chrome on Windows', location: 'Mumbai, India', current: true },
                      { device: 'Safari on iPhone', location: 'Mumbai, India', current: false },
                    ].map((s, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i === 0 ? '1px solid var(--border)' : 'none' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{s.device}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.location}</div>
                        </div>
                        {s.current ? <span className="badge badge-success">Current</span> : <button className="btn btn-danger btn-sm">Revoke</button>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div>
                <h3 style={{ marginBottom: 24, fontSize: 18 }}>Appearance</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 12 }}>Theme</div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {[['Dark (Default)', '#070B14'], ['Midnight', '#0F0F1A'], ['Ocean', '#0A1628']].map(([name, bg]) => (
                        <button key={name} style={{
                          padding: '16px 20px', borderRadius: 'var(--radius-md)',
                          background: bg, border: `2px solid ${name === 'Dark (Default)' ? 'var(--primary)' : 'var(--border)'}`,
                          cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                        }}>
                          <div style={{ width: 40, height: 25, borderRadius: 6, background: 'var(--gradient-primary)', opacity: 0.7 }} />
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 12 }}>Accent Color</div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {['#7C3AED','#2563EB','#0891B2','#059669','#DC2626','#D97706'].map(color => (
                        <button key={color} style={{ width: 32, height: 32, borderRadius: '50%', background: color, border: color === '#7C3AED' ? '3px solid white' : '3px solid transparent', cursor: 'pointer' }} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 12 }}>Font Size</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['Small', 'Medium', 'Large'].map((size, i) => (
                        <button key={size} className={`btn ${i === 1 ? 'btn-primary' : 'btn-ghost'} btn-sm`}>{size}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'integrations' && (
              <div>
                <h3 style={{ marginBottom: 24, fontSize: 18 }}>Integrations</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                  {integrations.map(intg => (
                    <div key={intg.name} style={{ padding: 'var(--spacing-md)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: `1px solid ${intg.connected ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{ fontSize: 28, lineHeight: 1 }}>{intg.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{intg.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, marginBottom: 10 }}>{intg.desc}</div>
                        <button className={`btn btn-sm ${intg.connected ? 'btn-danger' : 'btn-secondary'}`}>
                          {intg.connected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                      {intg.connected && <span className="badge badge-success">Active</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'role' && (
              <div>
                <h3 style={{ marginBottom: 8, fontSize: 18 }}>Switch Role</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
                  Explore NexusHR from different perspectives. Your current role is highlighted.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {roles.map(role => {
                    const isCurrent = state.user?.id === role.id;
                    return (
                      <div key={role.id} style={{
                        padding: 'var(--spacing-md)', borderRadius: 'var(--radius-lg)',
                        border: `1px solid ${isCurrent ? 'var(--primary)' : 'var(--border)'}`,
                        background: isCurrent ? 'rgba(124,58,237,0.1)' : 'var(--bg-elevated)',
                        display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
                        transition: 'var(--transition)',
                      }} onClick={() => dispatch({ type: 'LOGIN', payload: role })}>
                        <div className="avatar-placeholder" style={{ width: 48, height: 48, fontSize: 17, background: isCurrent ? 'var(--gradient-primary)' : 'var(--bg-surface)' }}>
                          {role.initials}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>{role.name}</div>
                          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{role.label} · {role.email}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                            Permissions: {role.permissions.join(' · ')}
                          </div>
                        </div>
                        {isCurrent ? (
                          <span className="badge badge-success"><Check size={11} /> Active</span>
                        ) : (
                          <button className="btn btn-secondary btn-sm">Switch</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
