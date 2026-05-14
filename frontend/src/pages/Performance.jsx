import { useState } from 'react';
import { goals, feedbackItems, bellCurveData, performanceCycles, employees } from '../data/mockData';
import { Target, Star, TrendingUp, MessageSquare, Plus, ChevronRight, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const statusColor = { on_track: 'badge-success', at_risk: 'badge-warning', behind: 'badge-danger' };

export default function Performance() {
  const [activeTab, setActiveTab] = useState('goals');
  const [selectedCycle, setSelectedCycle] = useState('PC001');

  const radarData = [
    { subject: 'Technical', A: 85 }, { subject: 'Leadership', A: 70 },
    { subject: 'Communication', A: 90 }, { subject: 'Delivery', A: 88 },
    { subject: 'Collaboration', A: 75 }, { subject: 'Innovation', A: 80 },
  ];

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <div className="page-header-left">
          <h1>Performance Management</h1>
          <p>Goals, reviews, feedback and appraisals</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-ghost btn-sm"><TrendingUp size={15} /> View Reports</button>
          <button className="btn btn-primary btn-sm"><Plus size={15} /> Add Goal</button>
        </div>
      </div>

      {/* Cycle Selector */}
      <div className="glass-card animate-fade-in-up delay-1" style={{ marginBottom: 'var(--spacing-md)' }}>
        <div className="glass-card-inner" style={{ padding: 'var(--spacing-md)', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Active Cycle:</span>
          {performanceCycles.map(cycle => (
            <button
              key={cycle.id}
              onClick={() => setSelectedCycle(cycle.id)}
              style={{
                padding: '8px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${selectedCycle === cycle.id ? 'var(--primary)' : 'var(--border)'}`,
                background: selectedCycle === cycle.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: selectedCycle === cycle.id ? 'var(--primary-light)' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'var(--transition)',
              }}
            >
              {cycle.name}
              <span className={`badge ${cycle.status === 'completed' ? 'badge-success' : 'badge-info'}`} style={{ marginLeft: 8, fontSize: 10 }}>{cycle.status === 'in_progress' ? `${cycle.completion}%` : 'Done'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--spacing-md)' }}>
        {[
          { label: 'Total Goals', value: goals.length, color: 'var(--primary)', icon: Target },
          { label: 'On Track', value: goals.filter(g=>g.status==='on_track').length, color: 'var(--success)', icon: TrendingUp },
          { label: 'At Risk', value: goals.filter(g=>g.status==='at_risk').length, color: 'var(--warning)', icon: Award },
          { label: 'Avg Rating', value: '4.2', color: 'var(--accent)', icon: Star },
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
        {['goals', 'feedback', 'bell curve', 'scorecard'].map(t => (
          <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {activeTab === 'goals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {goals.map((goal, i) => {
            const emp = employees.find(e => e.id === goal.employee);
            const pct = Math.round((goal.achieved / goal.target) * 100);
            return (
              <div key={goal.id} className={`glass-card animate-fade-in-up delay-${Math.min(i+1,4)}`}>
                <div className="glass-card-inner" style={{ padding: 'var(--spacing-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: 12, flexShrink: 0 }}>{emp?.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{goal.title}</span>
                        <span className={`badge ${statusColor[goal.status]}`}>{goal.status.replace('_', ' ')}</span>
                        <span className="badge badge-muted">{goal.category}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                        {emp?.name} · Due {new Date(goal.dueDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className="progress-fill" style={{
                            width: `${pct}%`,
                            background: goal.status === 'at_risk' ? 'var(--warning)' : goal.status === 'behind' ? 'var(--danger)' : 'var(--gradient-primary)'
                          }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, minWidth: 36, color: goal.status === 'at_risk' ? 'var(--warning)' : 'var(--primary-light)' }}>{pct}%</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{goal.achieved}/{goal.target}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} color="var(--text-muted)" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'feedback' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {feedbackItems.map((fb, i) => {
            const fromEmp = employees.find(e => e.id === fb.from);
            const toEmp = employees.find(e => e.id === fb.to);
            return (
              <div key={fb.id} className={`glass-card animate-fade-in-up delay-${i+1}`}>
                <div className="glass-card-inner" style={{ padding: 'var(--spacing-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div className="avatar-placeholder" style={{ width: 40, height: 40, fontSize: 13 }}>{fromEmp?.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{fromEmp?.name}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>→</span>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{toEmp?.name}</span>
                        <span className="badge badge-primary">{fb.type}</span>
                        <span style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
                          {Array(5).fill(0).map((_, si) => (
                            <Star key={si} size={13} style={{ color: si < Math.floor(fb.rating) ? 'var(--warning)' : 'var(--text-disabled)' }} fill={si < Math.floor(fb.rating) ? 'var(--warning)' : 'none'} />
                          ))}
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>{fb.rating}</span>
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>"{fb.comment}"</p>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{new Date(fb.date).toLocaleDateString('en-IN', { day:'numeric',month:'long',year:'numeric' })}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <button className="btn btn-secondary w-full"><MessageSquare size={15} /> Give Feedback</button>
        </div>
      )}

      {activeTab === 'bell curve' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--spacing-md)' }}>
          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner chart-wrapper">
              <div className="chart-title mb-md">Performance Distribution — Bell Curve</div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={bellCurveData} barSize={48}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                  <XAxis dataKey="rating" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8 }} labelStyle={{ color: 'var(--text-muted)' }} />
                  <Bar dataKey="count" fill="url(#perfGradient)" radius={[8,8,0,0]} />
                  <defs>
                    <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner">
              <div className="chart-title mb-md">Breakdown</div>
              {bellCurveData.map(d => (
                <div key={d.rating} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{d.rating}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="progress-bar" style={{ width: 70 }}>
                      <div className="progress-fill" style={{ width: `${d.percent * 2}%` }} />
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--primary-light)', width: 28, textAlign: 'right' }}>{d.count}</span>
                    <span style={{ color: 'var(--text-muted)', width: 28 }}>{d.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scorecard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner chart-wrapper">
              <div className="chart-title mb-md">Competency Radar — Ravi Kumar</div>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(148,163,184,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} />
                  <Radar dataKey="A" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.25} strokeWidth={2} dot={{ fill: '#7C3AED', r: 4 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner">
              <div className="chart-title mb-md">Overall Scorecard</div>
              {radarData.map(r => (
                <div key={r.subject} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{r.subject}</span>
                    <span style={{ fontWeight: 700, color: r.A >= 85 ? 'var(--success)' : r.A >= 70 ? 'var(--warning)' : 'var(--danger)' }}>{r.A}/100</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${r.A}%`, background: r.A >= 85 ? 'var(--success)' : r.A >= 70 ? 'var(--warning)' : 'var(--danger)' }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(124,58,237,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(124,58,237,0.2)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Overall Score</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary-light)', fontFamily: 'var(--font-display)' }}>
                  {Math.round(radarData.reduce((a, b) => a + b.A, 0) / radarData.length)}<span style={{ fontSize: 16 }}>/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
