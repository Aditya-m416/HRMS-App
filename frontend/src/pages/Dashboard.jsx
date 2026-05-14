import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/Toast';
import { getEmployees } from '../data/store';
import {
  Users, DollarSign, TrendingUp, TrendingDown,
  UserCheck, Briefcase, ArrowUpRight, Clock,
  Calendar, Target, Activity, BarChart3,
  UserPlus, AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import {
  headcountTrend, activityFeed,
  attritionData, payrollTrend, deptDistribution
} from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 700 }}>{typeof p.value === 'number' && p.value > 1000 ? `₹${(p.value/100000).toFixed(1)}L` : p.value}</div>
      ))}
    </div>
  );
};

const activityTypeStyle = {
  leave:     { color: 'var(--warning)',  bg: 'rgba(245,158,11,0.1)',  Icon: Calendar },
  hire:      { color: 'var(--success)',  bg: 'rgba(16,185,129,0.1)',  Icon: UserCheck },
  payroll:   { color: 'var(--accent)',   bg: 'rgba(6,182,212,0.1)',   Icon: DollarSign },
  perf:      { color: 'var(--primary-light)', bg: 'rgba(124,58,237,0.1)', Icon: Target },
  employee:  { color: 'var(--danger)',   bg: 'rgba(239,68,68,0.1)',   Icon: Clock },
};

export default function Dashboard() {
  const { state } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const employees = getEmployees();

  const stats = [
    { label: 'Total Headcount', value: employees.filter(e => e.status !== 'inactive').length, change: '+2', up: true, icon: Users, color: '#7C3AED', bg: 'rgba(124,58,237,0.15)' },
    { label: 'Monthly Payroll', value: '₹3.85 Cr', change: '+3.5%', up: true, icon: DollarSign, color: '#06B6D4', bg: 'rgba(6,182,212,0.12)' },
    { label: 'Attrition Rate', value: '4.3%', change: '-0.8%', up: false, icon: TrendingDown, color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
    { label: 'Open Positions', value: '5', change: '+1', up: true, icon: Briefcase, color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  ];

  function csvValue(value) {
    return `"${String(value ?? '').replaceAll('"', '""')}"`;
  }

  function handleExportReport() {
    const rows = [
      ['NexusHR Dashboard Report'],
      ['Generated On', new Date().toLocaleString('en-IN')],
      [],
      ['Metric', 'Value', 'Change'],
      ...stats.map(item => [item.label, item.value, `${item.change} this month`]),
      [],
      ['Department', 'Headcount'],
      ...deptDistribution.map(item => [item.dept, item.count]),
      [],
      ['Payroll Month', 'Gross'],
      ...payrollTrend.map(item => [item.month, item.gross]),
      [],
      ['Activity', 'Time'],
      ...activityFeed.map(item => [item.text, item.time]),
    ];
    const csv = rows.map(row => row.map(csvValue).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nexushr_dashboard_report.csv';
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'info', title: 'Export Ready', message: 'Dashboard report downloaded as CSV.' });
  }

  function handleAddEmployee() {
    navigate('/employees', { state: { openAddEmployee: true } });
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header animate-fade-in-up">
        <div className="page-header-left">
          <h1>Good morning, {state.user?.name?.split(' ')[0]} 👋</h1>
          <p>Here's what's happening across your organization today</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-ghost btn-sm" onClick={handleExportReport}>
            <BarChart3 size={15} /> Export Report
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleAddEmployee}>
            <UserPlus size={15} /> Add Employee
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`glass-card animate-fade-in-up delay-${i+1}`}>
              <div className="glass-card-inner stat-card">
                <div className="stat-card-icon" style={{ background: s.bg }}>
                  <Icon size={22} style={{ color: s.color }} />
                </div>
                <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
                <div className={`stat-card-change ${s.up ? 'up' : 'down'}`}>
                  {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {s.change} this month
                </div>
                <div className="stat-card-bg" style={{ background: s.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
        {/* Headcount trend */}
        <div className="glass-card animate-fade-in-up delay-2">
          <div className="glass-card-inner chart-wrapper">
            <div className="chart-title">
              <Activity size={18} color="var(--primary-light)" />
              Headcount Trend — 2024
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={headcountTrend}>
                <defs>
                  <linearGradient id="headcountGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} domain={[15, 26]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="headcount" stroke="#7C3AED" strokeWidth={2.5} fill="url(#headcountGradient)" dot={{ fill: '#7C3AED', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dept distribution */}
        <div className="glass-card animate-fade-in-up delay-3">
          <div className="glass-card-inner chart-wrapper">
            <div className="chart-title">
              <Users size={18} color="var(--accent)" />
              By Department
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              {deptDistribution.slice(0, 5).map(d => (
                <div key={d.dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{d.dept}</span>
                    <span style={{ fontWeight: 700, color: d.color }}>{d.count}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(d.count / 23) * 100}%`, background: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Second row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
        {/* Payroll trend */}
        <div className="glass-card animate-fade-in-up delay-3">
          <div className="glass-card-inner chart-wrapper">
            <div className="chart-title">
              <DollarSign size={18} color="var(--accent)" />
              Payroll Trend (₹)
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={payrollTrend} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="gross" fill="url(#barGradient)" radius={[6,6,0,0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-card animate-fade-in-up delay-4">
          <div className="glass-card-inner">
            <div className="chart-title" style={{ marginBottom: 'var(--spacing-md)' }}>
              <Activity size={18} color="var(--primary-light)" />
              Live Activity Feed
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 260, overflowY: 'auto' }}>
              {activityFeed.map(item => {
                const style = activityTypeStyle[item.type] || activityTypeStyle.employee;
                const Icon = style.Icon;
                return (
                  <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: style.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} style={{ color: style.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item.text}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{item.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bottom */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
        {[
          { label: 'Present Today', value: '19', sub: 'Out of 23', color: 'var(--success)', icon: UserCheck },
          { label: 'Leave Today', value: '2', sub: 'On approved leave', color: 'var(--warning)', icon: Calendar },
          { label: 'Pending Approvals', value: '8', sub: '3 leave, 5 reimb.', color: 'var(--danger)', icon: AlertCircle },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card animate-fade-in-up delay-5">
              <div className="glass-card-inner" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 'var(--spacing-md)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} style={{ color: s.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.sub}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
