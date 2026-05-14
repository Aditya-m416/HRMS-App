import { useState } from 'react';
import { leaveTypes, holidays } from '../data/mockData';
import { getLeaveRequests, applyLeave, approveLeave, rejectLeave } from '../data/store';
import { getEmployees } from '../data/store';
import { useToast } from '../components/ui/Toast';
import { usePermission } from '../context/AppContext';
import { Calendar, Plus, Check, X, Palmtree } from 'lucide-react';

const statusBadge = { approved: 'badge-success', pending: 'badge-warning', rejected: 'badge-danger' };

function ApplyLeaveModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ type: 'CL', from: '', to: '', reason: '' });
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(form); onClose(); };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Apply for Leave</h3>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Leave Type</label>
              <select className="form-input form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                {leaveTypes.map(l => <option key={l.code} value={l.code}>{l.type} ({l.pending} days remaining)</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">From Date</label>
                <input type="date" className="form-input" value={form.from} onChange={e => setForm({...form, from: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">To Date</label>
                <input type="date" className="form-input" value={form.to} onChange={e => setForm({...form, to: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Reason</label>
              <textarea className="form-input" rows={3} placeholder="Brief reason for leave..." value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ padding: '12px 16px', background: 'rgba(124,58,237,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(124,58,237,0.2)', fontSize: 13, color: 'var(--text-secondary)' }}>
              📋 Leave requests are auto-routed to your manager for approval. You'll be notified via email.
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" id="submit-leave-btn">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Leave() {
  const { addToast } = useToast();
  const { canApproveLeave } = usePermission();
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState(() => getLeaveRequests());
  // Employees default to 'my leaves', admins/managers default to 'my leaves' too but can switch to approval queue
  const [activeTab, setActiveTab] = useState('my leaves');
  const employees = getEmployees();

  // Only show approval queue tab to users who can approve
  const availableTabs = canApproveLeave
    ? ['my leaves', 'approval queue', 'holidays']
    : ['my leaves', 'holidays'];

  const handleSubmit = (form) => {
    const daysMs = new Date(form.to) - new Date(form.from);
    const days = Math.max(1, Math.round(daysMs / 86400000) + 1);
    const newReq = applyLeave({ employee: 'E002', type: form.type, from: form.from, to: form.to, days, reason: form.reason });
    setRequests(getLeaveRequests());
    addToast({ type: 'success', title: 'Leave Applied', message: `Your ${form.type} request for ${days} day(s) has been submitted.` });
  };

  const handleApprove = (id, empName) => {
    approveLeave(id);
    setRequests(getLeaveRequests());
    addToast({ type: 'success', title: 'Leave Approved', message: `Leave request for ${empName} has been approved.` });
  };

  const handleReject = (id, empName) => {
    rejectLeave(id);
    setRequests(getLeaveRequests());
    addToast({ type: 'warning', title: 'Leave Rejected', message: `Leave request for ${empName} has been rejected.` });
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <div className="page-header-left">
          <h1>Leave Management</h1>
          <p>Apply, track and approve leave requests</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary btn-sm" id="apply-leave-btn" onClick={() => setShowModal(true)}>
            <Plus size={15} /> Apply Leave
          </button>
        </div>
      </div>

      {/* Leave Balance Cards */}
      <div className="stats-grid animate-fade-in-up delay-1">
        {leaveTypes.map((l, i) => (
          <div key={l.code} className={`glass-card delay-${i+1}`}>
            <div className="glass-card-inner" style={{ padding: 'var(--spacing-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: 0.5 }}>{l.code}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginTop: 2 }}>{l.type}</div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${l.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={20} style={{ color: l.color }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                <div><div style={{ color: 'var(--text-muted)', fontSize: 11 }}>Allotted</div><div style={{ fontWeight: 700 }}>{l.total}</div></div>
                <div><div style={{ color: 'var(--text-muted)', fontSize: 11 }}>Used</div><div style={{ fontWeight: 700, color: 'var(--danger)' }}>{l.used}</div></div>
                <div><div style={{ color: 'var(--text-muted)', fontSize: 11 }}>Balance</div><div style={{ fontWeight: 800, fontSize: 18, color: l.color, fontFamily: 'var(--font-display)' }}>{l.pending}</div></div>
              </div>
              <div className="progress-bar" style={{ marginTop: 12 }}>
                <div className="progress-fill" style={{ width: `${(l.used / l.total) * 100}%`, background: l.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs — approval queue only shown to admins/managers */}
      <div className="tabs animate-fade-in-up delay-2" style={{ marginBottom: 'var(--spacing-md)' }}>
        {availableTabs.map(t => (
          <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)} style={{ textTransform: 'capitalize' }}>
            {t} {t === 'approval queue' && pendingCount > 0 && <span className="nav-badge" style={{ marginLeft: 4 }}>{pendingCount}</span>}
          </button>
        ))}
      </div>

      {activeTab === 'my leaves' && (
        <div className="glass-card animate-fade-in-up">
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="data-table">
              <thead><tr><th>Leave Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Applied On</th><th>Status</th></tr></thead>
              <tbody>
                {requests.filter(r => r.employee === 'E002').length === 0 ? (
                  <tr><td colSpan={7}>
                    <div className="empty-state" style={{ padding: 32 }}>
                      <Palmtree size={28} color="var(--text-muted)" />
                      <div>No leave requests yet. Apply your first leave!</div>
                    </div>
                  </td></tr>
                ) : requests.filter(r => r.employee === 'E002').map(req => (
                  <tr key={req.id}>
                    <td><span className="badge badge-primary">{req.type}</span></td>
                    <td>{new Date(req.from).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</td>
                    <td>{new Date(req.to).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</td>
                    <td style={{ fontWeight: 700 }}>{req.days}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.reason}</td>
                    <td>{new Date(req.appliedOn).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</td>
                    <td><span className={`badge ${statusBadge[req.status]}`}>{req.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'approval queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {requests.map(req => {
            const emp = employees.find(e => e.id === req.employee);
            return (
              <div key={req.id} className="glass-card animate-fade-in-up">
                <div className="glass-card-inner" style={{ padding: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div className="avatar-placeholder" style={{ width: 40, height: 40, fontSize: 14 }}>{emp?.initials || '?'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{emp?.name || 'Unknown'}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      <span className="badge badge-primary" style={{ marginRight: 8, fontSize: 10 }}>{req.type}</span>
                      {new Date(req.from).toLocaleDateString('en-IN', {day:'numeric',month:'short'})} –{' '}
                      {new Date(req.to).toLocaleDateString('en-IN', {day:'numeric',month:'short'})} ({req.days} {req.days > 1 ? 'days' : 'day'})
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{req.reason}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                    <span className={`badge ${statusBadge[req.status]}`}>{req.status}</span>
                    {req.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.2)', padding: '4px 10px' }}
                          onClick={() => handleApprove(req.id, emp?.name || 'Employee')}>
                          <Check size={12} /> Approve
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleReject(req.id, emp?.name || 'Employee')}>
                          <X size={12} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {requests.length === 0 && (
            <div className="empty-state"><Palmtree size={28} /><div>No leave requests to review</div></div>
          )}
        </div>
      )}

      {activeTab === 'holidays' && (
        <div className="glass-card animate-fade-in-up">
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="data-table">
              <thead><tr><th>Date</th><th>Holiday</th><th>Type</th><th>Day</th></tr></thead>
              <tbody>
                {holidays.map(h => (
                  <tr key={h.date}>
                    <td style={{ fontWeight: 600 }}>{new Date(h.date).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{h.name}</td>
                    <td><span className={`badge ${h.type === 'national' ? 'badge-info' : 'badge-warning'}`}>{h.type === 'national' ? 'National Holiday' : 'Festival'}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(h.date).toLocaleDateString('en-IN', { weekday: 'long' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && <ApplyLeaveModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} />}
    </div>
  );
}
