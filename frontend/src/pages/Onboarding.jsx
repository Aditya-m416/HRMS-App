import { useState } from 'react';
import { newJoiners, exitEmployees } from '../data/mockData';
import { getOnboardingTasks, toggleOnboardingTask, getEmployees } from '../data/store';
import { useToast } from '../components/ui/Toast';
import { Rocket, CheckCircle, UserCheck, UserMinus, Package, FileText, MessageSquare } from 'lucide-react';

export default function Onboarding() {
  const { addToast } = useToast();
  const [tasks, setTasks] = useState(() => getOnboardingTasks());
  const [activeTab, setActiveTab] = useState('new joiners');
  const employees = getEmployees();

  const toggleTask = (id) => {
    const updated = toggleOnboardingTask(id);
    setTasks(updated);
    const task = updated.find(t => t.id === id);
    if (task) {
      addToast({ type: task.done ? 'success' : 'info', message: task.done ? `✓ "${task.task}" marked done!` : `"${task.task}" marked pending.` });
    }
  };

  const completedCount = tasks.filter(t => t.done).length;
  const completionPct = Math.round((completedCount / tasks.length) * 100);
  const categories = [...new Set(tasks.map(t => t.category))];

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <div className="page-header-left">
          <h1>Onboarding &amp; Offboarding</h1>
          <p>New joiner setup, checklists, exit management</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary btn-sm" onClick={() => addToast({ type: 'info', title: 'Coming Soon', message: 'New joiner wizard will be available soon!' })}>
            <Rocket size={15} /> New Joiner
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 'var(--spacing-md)' }}>
        {[
          { label: 'Upcoming Joiners', value: newJoiners.length, color: 'var(--primary)', icon: UserCheck },
          { label: 'Checklist Done', value: `${completionPct}%`, color: 'var(--success)', icon: CheckCircle },
          { label: 'Offboarding', value: exitEmployees.length, color: 'var(--danger)', icon: UserMinus },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`glass-card animate-fade-in-up delay-${i+1}`}>
              <div className="glass-card-inner" style={{ padding: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} style={{ color: s.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="tabs animate-fade-in-up delay-2" style={{ marginBottom: 'var(--spacing-md)' }}>
        {['new joiners', 'checklist', 'offboarding'].map(t => (
          <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {activeTab === 'new joiners' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {newJoiners.map((joiner, i) => {
            const manager = employees.find(e => e.id === joiner.manager);
            return (
              <div key={joiner.id} className={`glass-card animate-fade-in-up delay-${i+1}`}>
                <div className="glass-card-inner" style={{ padding: 'var(--spacing-lg)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div className="avatar-placeholder" style={{ width: 56, height: 56, fontSize: 20, background: 'var(--gradient-primary)', boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}>
                      {joiner.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <div style={{ fontWeight: 700, fontSize: 18 }}>{joiner.name}</div>
                        <span className="badge badge-success">Joining Soon</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{joiner.role} · {joiner.dept}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <span>📅 Joining: <strong>{new Date(joiner.joiningDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</strong></span>
                        <span>👤 Manager: <strong>{manager?.name}</strong></span>
                      </div>
                      <div style={{ marginTop: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                          <span style={{ color: 'var(--text-muted)' }}>Onboarding Progress</span>
                          <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{joiner.progress}%</span>
                        </div>
                        <div className="progress-bar" style={{ height: 8 }}>
                          <div className="progress-fill" style={{ width: `${joiner.progress}%` }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 'var(--radius-md)', padding: '12px 16px', textAlign: 'center', minWidth: 130 }}>
                      <Rocket size={24} color="var(--primary-light)" style={{ marginBottom: 6 }} />
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-light)' }}>Welcome Kit</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Ready to send</div>
                      <button className="btn btn-primary btn-sm" style={{ marginTop: 10, width: '100%', justifyContent: 'center' }}
                        onClick={() => addToast({ type: 'success', title: 'Kit Sent!', message: `Welcome kit sent to ${joiner.name}.` })}>
                        Send
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                    {[
                      { icon: Package, label: 'IT Provision', color: 'var(--accent)' },
                      { icon: FileText, label: 'Documents', color: 'var(--warning)' },
                      { icon: MessageSquare, label: 'Buddy Assign', color: 'var(--success)' },
                    ].map(action => (
                      <button key={action.label} className="btn btn-ghost btn-sm" style={{ borderColor: `${action.color}44`, color: action.color }}
                        onClick={() => addToast({ type: 'info', message: `${action.label} action triggered for ${joiner.name}` })}>
                        <action.icon size={13} /> {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'checklist' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-md)' }}>
          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                <div className="chart-title">Onboarding Checklist</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{completedCount}/{tasks.length} tasks</div>
              </div>
              {categories.map(cat => (
                <div key={cat} style={{ marginBottom: 'var(--spacing-md)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '4px 12px', marginBottom: 6 }}>{cat}</div>
                  {tasks.filter(t => t.category === cat).map(task => (
                    <div key={task.id} className="checklist-item" onClick={() => toggleTask(task.id)}>
                      <div className={`checkbox ${task.done ? 'checked' : ''}`}>
                        {task.done && <CheckCircle size={12} color="white" />}
                      </div>
                      <span style={{ fontSize: 14, color: task.done ? 'var(--text-muted)' : 'var(--text-secondary)', textDecoration: task.done ? 'line-through' : 'none', transition: 'var(--transition)', cursor: 'pointer' }}>
                        {task.task}
                      </span>
                      {task.done && <span className="badge badge-success" style={{ marginLeft: 'auto', fontSize: 10 }}>Done</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div className="glass-card animate-fade-in-up">
              <div className="glass-card-inner" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 16px' }}>
                  <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-elevated)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="url(#progGradient)" strokeWidth="10"
                      strokeDasharray={`${2*Math.PI*50}`}
                      strokeDashoffset={`${2*Math.PI*50*(1-completionPct/100)}`}
                      strokeLinecap="round" transform="rotate(-90 60 60)"
                      style={{ transition: 'stroke-dashoffset 1s ease' }} />
                    <defs>
                      <linearGradient id="progGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary-light)' }}>{completionPct}%</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Complete</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Aryan Kapoor</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Senior React Engineer</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Joining April 1, 2024</div>
              </div>
            </div>
            <div className="glass-card animate-fade-in-up">
              <div className="glass-card-inner">
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Category Progress</div>
                {categories.map(cat => {
                  const catTasks = tasks.filter(t => t.category === cat);
                  const catDone = catTasks.filter(t => t.done).length;
                  const catPct = Math.round((catDone / catTasks.length) * 100);
                  return (
                    <div key={cat} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{cat}</span>
                        <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{catDone}/{catTasks.length}</span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${catPct}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'offboarding' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {exitEmployees.map(exit => {
            const emp = employees.find(e => e.id === exit.employee);
            const exitChecks = [
              { label: 'Notice Period Served', done: true },
              { label: 'Assets Returned', done: exit.assetsReturned },
              { label: 'Exit Interview Done', done: exit.exitInterviewDone },
              { label: 'NOC Issued', done: false },
              { label: 'Final Settlement', done: false },
            ];
            const exitPct = Math.round((exitChecks.filter(c => c.done).length / exitChecks.length) * 100);
            return (
              <div key={exit.id} className="glass-card animate-fade-in-up delay-1">
                <div className="glass-card-inner">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                    <div className="avatar-placeholder" style={{ width: 52, height: 52, fontSize: 18, background: 'var(--danger-bg)', color: 'var(--danger)' }}>{emp?.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{emp?.name}</div>
                        <span className="badge badge-danger">Offboarding</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{emp?.role} · {emp?.dept}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        <span>📅 Last Day: <strong>{exit.lastDay}</strong></span>
                        <span>⏱ Notice: <strong>{exit.noticePeriod}</strong></span>
                        <span>💼 Reason: <strong>{exit.reason}</strong></span>
                        <span>💰 FnF: <span className={`badge ${exit.fnfStatus === 'done' ? 'badge-success' : 'badge-warning'}`}>{exit.fnfStatus}</span></span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--danger)', fontFamily: 'var(--font-display)' }}>{exitPct}%</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Complete</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
                    {exitChecks.map(check => (
                      <div key={check.label} className="checklist-item" style={{ background: check.done ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.04)', borderRadius: 'var(--radius-sm)', border: `1px solid ${check.done ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)'}` }}>
                        <div className={`checkbox ${check.done ? 'checked' : ''}`} style={{ pointerEvents: 'none' }}>
                          {check.done && <CheckCircle size={11} color="white" />}
                        </div>
                        <span style={{ fontSize: 12, color: check.done ? 'var(--success)' : 'var(--text-muted)' }}>{check.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
