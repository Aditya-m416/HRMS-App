import { useState } from 'react';
import { getPayrollRuns, runPayroll } from '../data/store';
import { getEmployees } from '../data/store';
import { payrollTrend, ctcBreakdown } from '../data/mockData';
import { useToast } from '../components/ui/Toast';
import { useApp } from '../context/AppContext';
import { usePermission } from '../context/AppContext';
import { DollarSign, Download, Eye, Check, Play, FileText, TrendingUp, Users, X, Lock } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const statusBadge = { completed: 'badge-success', pending: 'badge-warning', processing: 'badge-info' };

function PayslipModal({ employee, onClose }) {
  const basic = Math.round(employee.salary * 0.40 / 12);
  const hra   = Math.round(employee.salary * 0.20 / 12);
  const spa   = Math.round(employee.salary * 0.25 / 12);
  const gross = basic + hra + spa;
  const pf    = Math.round(basic * 0.12);
  const pt    = 200;
  const tds   = Math.round(gross * 0.10);
  const net   = gross - pf - pt - tds;

  function downloadPDF() {
    const content = `NEXUSHR PAYSLIP - MARCH 2024\n\nEmployee: ${employee.name}\nDepartment: ${employee.dept}\nEmployee ID: ${employee.id}\n\n--- EARNINGS ---\nBasic Salary: ₹${basic.toLocaleString('en-IN')}\nHRA: ₹${hra.toLocaleString('en-IN')}\nSpecial Allowance: ₹${spa.toLocaleString('en-IN')}\nGross Pay: ₹${gross.toLocaleString('en-IN')}\n\n--- DEDUCTIONS ---\nPF (12%): ₹${pf.toLocaleString('en-IN')}\nProfessional Tax: ₹${pt.toLocaleString('en-IN')}\nTDS: ₹${tds.toLocaleString('en-IN')}\n\nNET TAKE-HOME: ₹${net.toLocaleString('en-IN')}`;
    const a = document.createElement('a');
    a.href = 'data:text/plain,' + encodeURIComponent(content);
    a.download = `payslip_${employee.id}_march2024.txt`;
    a.click();
  }

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Payslip — March 2024</h3>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{employee.name} · {employee.id}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={downloadPDF} className="btn btn-ghost btn-sm"><FileText size={15} /> Download</button>
            <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={16} /></button>
          </div>
        </div>
        <div className="modal-body">
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Employee</div><div style={{ fontWeight: 700 }}>{employee.name}</div></div>
              <div style={{ textAlign:'right' }}><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Department</div><div style={{ fontWeight: 700 }}>{employee.dept}</div></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pay Period</div><div style={{ fontWeight: 700 }}>March 2024</div></div>
              <div style={{ textAlign:'right' }}><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pay Date</div><div style={{ fontWeight: 700 }}>28 Mar 2024</div></div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--success)' }}>Earnings</div>
              {[['Basic Salary', basic], ['HRA', hra], ['Special Allowance', spa]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>₹{v.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>
                <span>Gross Pay</span><span>₹{gross.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--danger)' }}>Deductions</div>
              {[['PF (Employee 12%)', pf], ['Professional Tax', pt], ['TDS', tds]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: 'var(--danger)' }}>₹{v.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 14, fontWeight: 700, color: 'var(--danger)' }}>
                <span>Total Deductions</span><span>₹{(pf+pt+tds).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          <div style={{ background: 'var(--gradient-primary)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>Net Take-Home</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)' }}>₹{net.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Payroll() {
  const { addToast } = useToast();
  const { state } = useApp();
  const { canRunPayroll, canExportData } = usePermission();
  const [payrollRuns, setPayrollRuns] = useState(() => getPayrollRuns());
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [activeTab, setActiveTab] = useState('runs');
  const [running, setRunning] = useState(false);
  const employees = getEmployees().filter(e => e.status !== 'inactive');

  const latestRun = payrollRuns[0] || {};
  const totalGross = (latestRun.totalGross || 38500000) / 10000000;
  const totalDeductions = (latestRun.totalDeductions || 4200000) / 10000000;
  const totalNet = (latestRun.totalNet || 34300000) / 10000000;
  const empPaid = latestRun.totalEmployees || employees.length;

  function handleRunPayroll() {
    setRunning(true);
    addToast({ type: 'info', title: 'Processing Payroll', message: 'Calculating salaries for all employees...' });
    setTimeout(() => {
      const result = runPayroll(state.user?.name || 'HR Admin');
      setPayrollRuns(getPayrollRuns());
      setRunning(false);
      if (result) {
        addToast({ type: 'success', title: '✅ Payroll Processed!', message: `${result.month} payroll for ${result.totalEmployees} employees completed. Net: ₹${(result.totalNet/10000000).toFixed(2)} Cr` });
      } else {
        addToast({ type: 'warning', title: 'Already Processed', message: 'Payroll for this month has already been run.' });
      }
    }, 2000);
  }

  function handleExport() {
    const csv = [
      ['Month','Employees','Gross','Deductions','Net','Processed On','Approved By'].join(','),
      ...payrollRuns.map(r => [r.month, r.totalEmployees, r.totalGross, r.totalDeductions, r.totalNet, r.processedOn, r.approvedBy].join(','))
    ].join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv,' + encodeURIComponent(csv);
    a.download = 'nexushr_payroll.csv';
    a.click();
    addToast({ type: 'info', title: 'Export Ready', message: 'Payroll data downloaded as CSV.' });
  }

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <div className="page-header-left">
          <h1>Payroll Management</h1>
          <p>Process payroll, view payslips, manage compensation</p>
        </div>
        <div className="page-header-actions">
          {canExportData && (
            <button className="btn btn-ghost btn-sm" onClick={handleExport}><Download size={15} /> Export</button>
          )}
          {canRunPayroll ? (
            <button className="btn btn-primary btn-sm" onClick={handleRunPayroll} disabled={running} id="run-payroll-btn">
              <Play size={15} /> {running ? 'Processing...' : 'Run Payroll'}
            </button>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', fontSize:12, color:'var(--text-muted)', background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)' }}>
              <Lock size={12} /> Run Payroll (Admin only)
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Monthly Gross', value: `₹${totalGross.toFixed(2)} Cr`, color: 'var(--primary)', icon: DollarSign, bg: 'rgba(124,58,237,0.12)' },
          { label: 'Total Deductions', value: `₹${(totalDeductions * 100).toFixed(1)} L`, color: 'var(--danger)', icon: TrendingUp, bg: 'rgba(239,68,68,0.1)' },
          { label: 'Net Payable', value: `₹${totalNet.toFixed(2)} Cr`, color: 'var(--success)', icon: Check, bg: 'rgba(16,185,129,0.1)' },
          { label: 'Employees Paid', value: `${empPaid} / ${empPaid}`, color: 'var(--accent)', icon: Users, bg: 'rgba(6,182,212,0.1)' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`glass-card animate-fade-in-up delay-${i+1}`}>
              <div className="glass-card-inner stat-card" style={{ padding: 'var(--spacing-md)' }}>
                <div className="stat-card-icon" style={{ background: s.bg, width: 40, height: 40 }}>
                  <Icon size={18} style={{ color: s.color }} />
                </div>
                <div className="stat-card-value" style={{ color: s.color, fontSize: 22 }}>{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="tabs animate-fade-in-up delay-2" style={{ marginBottom: 'var(--spacing-md)' }}>
        {['runs', 'employees', 'ctc breakdown', 'statutory'].map(t => (
          <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {activeTab === 'runs' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <div className="glass-card">
            <div className="glass-card-inner">
              <div className="chart-title mb-md"><DollarSign size={18} color="var(--primary-light)" /> Payroll History</div>
              {payrollRuns.map(run => (
                <div key={run.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{run.month}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{run.totalEmployees} employees · Processed by {run.approvedBy}</div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span className={`badge ${statusBadge[run.status]}`}>{run.status}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>₹{(run.totalNet/10000000).toFixed(2)} Cr</span>
                  </div>
                </div>
              ))}
              {payrollRuns.length === 0 && <div className="empty-state"><div>No payroll runs yet. Click "Run Payroll" to process.</div></div>}
            </div>
          </div>
          <div className="glass-card">
            <div className="glass-card-inner chart-wrapper">
              <div className="chart-title mb-md"><TrendingUp size={18} color="var(--accent)" /> 6-Month Payroll Trend</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={payrollTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/10000000).toFixed(1)}Cr`} />
                  <Tooltip formatter={v => ['₹' + (v/10000000).toFixed(2) + ' Cr', 'Gross Payroll']} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8 }} />
                  <Line type="monotone" dataKey="gross" stroke="#7C3AED" strokeWidth={3} dot={{ fill: '#7C3AED', r: 5, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'employees' && (
        <div className="glass-card animate-fade-in-up">
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="data-table">
              <thead><tr><th>Employee</th><th>Department</th><th>Basic</th><th>HRA</th><th>Special Allow.</th><th>Deductions</th><th>Net Pay</th><th>Payslip</th></tr></thead>
              <tbody>
                {employees.map(emp => {
                  const basic = Math.round(emp.salary * 0.40 / 12);
                  const hra   = Math.round(emp.salary * 0.20 / 12);
                  const special = Math.round(emp.salary * 0.25 / 12);
                  const gross = basic + hra + special;
                  const deductions = Math.round(gross * 0.22);
                  const net = gross - deductions;
                  return (
                    <tr key={emp.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="avatar-placeholder" style={{ width: 28, height: 28, fontSize: 10 }}>{emp.initials}</div>
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{emp.name}</span>
                        </div>
                      </td>
                      <td>{emp.dept}</td>
                      <td>₹{basic.toLocaleString('en-IN')}</td>
                      <td>₹{hra.toLocaleString('en-IN')}</td>
                      <td>₹{special.toLocaleString('en-IN')}</td>
                      <td style={{ color: 'var(--danger)' }}>₹{deductions.toLocaleString('en-IN')}</td>
                      <td style={{ color: 'var(--success)', fontWeight: 700 }}>₹{net.toLocaleString('en-IN')}</td>
                      <td><button className="btn btn-ghost btn-sm" onClick={() => setSelectedEmp(emp)}><Eye size={13} /> View</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ctc breakdown' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner chart-wrapper">
              <div className="chart-title mb-md">CTC Component Breakdown</div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={ctcBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3}>
                    {ctcBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8 }} formatter={v => [`${v}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-card animate-fade-in-up">
            <div className="glass-card-inner">
              <div className="chart-title mb-md">Breakdown Details</div>
              {ctcBreakdown.map(item => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color }} />
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="progress-bar" style={{ width: 80 }}>
                      <div className="progress-fill" style={{ width: `${item.value * 2.5}%`, background: item.color }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: item.color, width: 35, textAlign: 'right' }}>{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'statutory' && (
        <div className="glass-card animate-fade-in-up">
          <div className="glass-card-inner">
            <div className="chart-title mb-md">Statutory Deductions Summary — March 2024</div>
            <div className="table-wrapper" style={{ border: 'none' }}>
              <table className="data-table">
                <thead><tr><th>Component</th><th>Employee</th><th>Employer</th><th>Total</th><th>Due Date</th><th>Status</th></tr></thead>
                <tbody>
                  {[
                    { name: 'Provident Fund (PF)', emp: '₹3,42,000', emplr: '₹3,42,000', total: '₹6,84,000', due: '15 Apr 2024', status: 'pending' },
                    { name: 'ESI', emp: '₹68,400', emplr: '₹1,18,500', total: '₹1,86,900', due: '15 Apr 2024', status: 'pending' },
                    { name: 'Professional Tax', emp: '₹4,600', emplr: '—', total: '₹4,600', due: '31 Mar 2024', status: 'completed' },
                    { name: 'TDS (Income Tax)', emp: '₹8,55,000', emplr: '—', total: '₹8,55,000', due: '7 Apr 2024', status: 'pending' },
                  ].map(row => (
                    <tr key={row.name}>
                      <td style={{ fontWeight: 600 }}>{row.name}</td>
                      <td>{row.emp}</td><td>{row.emplr}</td>
                      <td style={{ fontWeight: 700 }}>{row.total}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{row.due}</td>
                      <td><span className={`badge ${row.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{row.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedEmp && <PayslipModal employee={selectedEmp} onClose={() => setSelectedEmp(null)} />}
    </div>
  );
}
