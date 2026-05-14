import { useState } from 'react';
import {
  headcountTrend, attritionData, deptDistribution,
  genderDiversity, locationData, payrollTrend
} from '../data/mockData';
import { BarChart3, TrendingDown, Users, DollarSign, Globe, Download, Filter } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color || 'var(--primary-light)', fontWeight: 700 }}>{p.name}: {p.value}{typeof p.value === 'number' && p.value < 20 ? '%' : ''}</div>)}
    </div>
  );
};

function LocationMap() {
  return (
    <div style={{ position: 'relative', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: 240, border: '1px solid var(--border)' }}>
      {/* India map SVG outline (simplified) */}
      <svg viewBox="0 0 400 440" style={{ width: '100%', height: '100%', opacity: 0.15, position: 'absolute', inset: 0 }}>
        <path d="M180,20 L220,20 L240,40 L280,50 L300,80 L320,100 L310,140 L330,160 L320,190 L300,220 L280,250 L260,280 L240,310 L220,340 L200,370 L180,400 L160,380 L140,350 L120,320 L100,290 L80,260 L70,230 L80,200 L70,170 L80,140 L100,110 L120,80 L140,60 Z" fill="var(--primary)" stroke="var(--primary)" strokeWidth="2" />
      </svg>
      {/* Location dots */}
      {locationData.map(loc => {
        const x = ((loc.lng - 69) / (82 - 69)) * 300 + 40;
        const y = ((32 - loc.lat) / (32 - 8)) * 300 + 30;
        return (
          <div key={loc.city} style={{
            position: 'absolute',
            left: `${x}px`, top: `${y}px`,
            transform: 'translate(-50%, -50%)',
          }}>
            <div style={{
              width: Math.max(20, loc.count * 5), height: Math.max(20, loc.count * 5),
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
              opacity: 0.8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 16px rgba(124,58,237,0.5)',
              animation: 'pulse-glow 2s ease-in-out infinite',
              fontSize: 9, fontWeight: 700, color: 'white',
            }} title={`${loc.city}: ${loc.count} employees`}>
              {loc.count}
            </div>
            <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: 'var(--text-muted)', whiteSpace: 'nowrap', marginTop: 2 }}>
              {loc.city}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [reportDept, setReportDept] = useState('All');
  const [reportMetric, setReportMetric] = useState('headcount');

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <div className="page-header-left">
          <h1>Analytics & People Insights</h1>
          <p>Real-time HR metrics, trends and custom reports</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-ghost btn-sm"><Filter size={15} /> Filter</button>
          <button className="btn btn-primary btn-sm"><Download size={15} /> Export PDF</button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--spacing-md)' }}>
        {[
          { label: 'Total Headcount', value: '23', change: '+2 MoM', up: true, color: 'var(--primary)', icon: Users },
          { label: 'Attrition Rate', value: '4.3%', change: '-0.8%', up: false, color: 'var(--success)', icon: TrendingDown },
          { label: 'Avg Tenure', value: '2.4 yrs', change: '+0.2', up: true, color: 'var(--accent)', icon: BarChart3 },
          { label: 'Monthly Payroll', value: '₹3.85Cr', change: '+3.5%', up: true, color: 'var(--warning)', icon: DollarSign },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`glass-card animate-fade-in-up delay-${i+1}`}>
              <div className="glass-card-inner" style={{ padding: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} style={{ color: s.color }} />
                  </div>
                  <span className={`badge ${s.up ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: 10 }}>{s.change}</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="tabs animate-fade-in-up delay-2" style={{ marginBottom: 'var(--spacing-md)' }}>
        {['overview', 'headcount', 'attrition', 'diversity', 'payroll', 'report builder'].map(t => (
          <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner chart-wrapper">
              <div className="chart-title mb-md"><Users size={16} color="var(--primary-light)" /> Headcount Trend</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={headcountTrend}>
                  <defs><linearGradient id="hcGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/><stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} domain={[15,27]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="headcount" stroke="#7C3AED" strokeWidth={2} fill="url(#hcGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner chart-wrapper">
              <div className="chart-title mb-md"><TrendingDown size={16} color="var(--danger)" /> Attrition Rate (%)</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={attritionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', r: 4 }} name="Attrition %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner chart-wrapper">
              <div className="chart-title mb-md"><BarChart3 size={16} color="var(--accent)" /> Dept Distribution</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={deptDistribution} layout="vertical" barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="dept" type="category" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0,6,6,0]}>
                    {deptDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner">
              <div className="chart-title mb-md"><Globe size={16} color="var(--primary-light)" /> Office Locations</div>
              <LocationMap />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                {locationData.map(loc => (
                  <div key={loc.city} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gradient-primary)' }} />
                    {loc.city} ({loc.count})
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'headcount' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner chart-wrapper">
              <div className="chart-title mb-md">Monthly Headcount — Full Year 2024</div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={headcountTrend}>
                  <defs><linearGradient id="hcGrad2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35}/><stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} domain={[14,28]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="headcount" stroke="#7C3AED" strokeWidth={3} fill="url(#hcGrad2)" dot={{ fill: '#7C3AED', r: 5, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--spacing-md)' }}>
            {[
              { label: 'New Hires (2024)', value: '5', color: 'var(--success)' },
              { label: 'Separations (2024)', value: '1', color: 'var(--danger)' },
              { label: 'Net Growth', value: '+4', color: 'var(--primary-light)' },
            ].map(s => (
              <div key={s.label} className="glass-card animate-fade-in-up">
                <div className="glass-card-inner" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                  <div style={{ fontSize: 36, fontWeight: 800, color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'attrition' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-md)' }}>
          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner chart-wrapper">
              <div className="chart-title mb-md">Monthly Attrition Rate (%)</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attritionData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="rate" fill="url(#attrGrad)" radius={[6,6,0,0]} name="Attrition %" />
                  <defs>
                    <linearGradient id="attrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" /><stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner">
              <div className="chart-title mb-md">Exit Reasons (YTD)</div>
              {[
                { reason: 'Better Opportunity', count: 1, pct: 100 },
                { reason: 'Personal Reasons', count: 0, pct: 0 },
                { reason: 'Relocation', count: 0, pct: 0 },
                { reason: 'Performance', count: 0, pct: 0 },
              ].map(r => (
                <div key={r.reason} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{r.reason}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${r.pct}%`, background: 'var(--danger)' }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: '12px 14px', background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.15)', fontSize: 13, color: 'var(--success)' }}>
                ✓ Attrition is <strong>below</strong> industry average of 18%
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'diversity' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner chart-wrapper">
              <div className="chart-title mb-md">Gender Distribution</div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={genderDiversity} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4}>
                    {genderDiversity.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
                61% Male · 39% Female
              </div>
            </div>
          </div>

          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner chart-wrapper">
              <div className="chart-title mb-md">Age Distribution</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[{group:'22–26',count:4},{group:'27–31',count:9},{group:'32–36',count:7},{group:'37–42',count:3}]} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                  <XAxis dataKey="group" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8 }} />
                  <Bar dataKey="count" fill="#06B6D4" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner">
              <div className="chart-title mb-md">Diversity Metrics</div>
              {[
                { label: 'Women in Leadership', value: '33%', color: 'var(--accent)', good: true },
                { label: 'Female Engineers', value: '25%', color: 'var(--warning)', good: false },
                { label: 'Avg Age', value: '30.4 yrs', color: 'var(--success)', good: true },
                { label: 'Cities Covered', value: '7', color: 'var(--primary-light)', good: true },
                { label: 'Work Arrangements', value: '3 types', color: 'var(--success)', good: true },
              ].map(m => (
                <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                  <span style={{ fontWeight: 700, color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-md)' }}>
          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner chart-wrapper">
              <div className="chart-title mb-md">Monthly Payroll Cost (₹ Crore)</div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={payrollTrend}>
                  <defs><linearGradient id="prGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/><stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/10000000).toFixed(1)}Cr`} />
                  <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8 }} formatter={v => [`₹${(v/10000000).toFixed(2)} Cr`, 'Gross Payroll']} labelStyle={{ color: 'var(--text-muted)' }} />
                  <Area type="monotone" dataKey="gross" stroke="#06B6D4" strokeWidth={2.5} fill="url(#prGrad)" dot={{ fill: '#06B6D4', r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner">
              <div className="chart-title mb-md">Dept Payroll Share</div>
              {deptDistribution.map(d => {
                const deptPayroll = Math.round((d.count / 23) * 100);
                return (
                  <div key={d.dept} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{d.dept}</span>
                      <span style={{ fontWeight: 700, color: d.color }}>{deptPayroll}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${deptPayroll * 2.5}%`, background: d.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'report builder' && (
        <div className="glass-card animate-fade-in-up">
          <div className="glass-card-inner">
            <div className="chart-title mb-md">Custom Report Builder</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-input form-select" value={reportDept} onChange={e => setReportDept(e.target.value)}>
                  <option value="All">All Departments</option>
                  {['Engineering','Product','Design','Sales','HR','Finance'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Metric</label>
                <select className="form-input form-select" value={reportMetric} onChange={e => setReportMetric(e.target.value)}>
                  <option value="headcount">Headcount</option>
                  <option value="payroll">Payroll Cost</option>
                  <option value="attrition">Attrition</option>
                  <option value="leave">Leave Usage</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Period</label>
                <select className="form-input form-select">
                  <option>Q1 2024</option><option>Q2 2024</option>
                  <option>H1 2024</option><option>Full Year 2024</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
              <button className="btn btn-primary"><BarChart3 size={15} /> Generate Report</button>
              <button className="btn btn-ghost"><Download size={15} /> Export Excel</button>
              <button className="btn btn-ghost"><Download size={15} /> Export PDF</button>
            </div>
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', padding: 'var(--spacing-lg)', textAlign: 'center' }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={headcountTrend} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="headcount" fill="url(#repGrad)" radius={[6,6,0,0]} name="Headcount" />
                  <defs>
                    <linearGradient id="repGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED"/><stop offset="100%" stopColor="#06B6D4"/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                {reportDept === 'All' ? 'Organisation-wide' : reportDept} · {reportMetric} · Q1 2024
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
