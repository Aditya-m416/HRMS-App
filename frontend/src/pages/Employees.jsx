import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { departments } from '../data/mockData';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../data/store';
import { useToast } from '../components/ui/Toast';
import { usePermission } from '../context/AppContext';
import { Search, Plus, Mail, Phone, MapPin, X, Award, Calendar, Building2, Users, Edit2, Trash2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statusColors = { active: 'badge-success', on_leave: 'badge-warning', inactive: 'badge-danger' };
const statusLabels = { active: 'Active', on_leave: 'On Leave', inactive: 'Inactive' };
const deptColors = {
  Engineering: '#7C3AED', Product: '#06B6D4', Design: '#10B981',
  Marketing: '#F59E0B', Sales: '#EF4444', HR: '#8B5CF6',
  Finance: '#3B82F6', Operations: '#EC4899', 'Customer Success': '#14B8A6', Legal: '#F97316'
};

const levels = ['L1','L2','L3','L4','L5','L6','L7'];
const locations = ['Bangalore','Mumbai','Delhi','Hyderabad','Pune','Chennai','Kochi','Kolkata','Ahmedabad','Remote'];

const EMPTY_FORM = {
  name: '', role: '', dept: 'Engineering', email: '', phone: '',
  location: 'Bangalore', salary: '', level: 'L3', skills: '',
  joinDate: new Date().toISOString().split('T')[0],
};

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
}

// ── Add / Edit Employee Modal ──────────────────────────────────────────────
function EmployeeFormModal({ emp, onClose, onSave }) {
  const [form, setForm] = useState(emp ? {
    ...emp, skills: Array.isArray(emp.skills) ? emp.skills.join(', ') : emp.skills,
  } : EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!form.role.trim())  e.role  = 'Role is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.salary || isNaN(form.salary)) e.salary = 'Valid salary required';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    const payload = {
      ...form,
      salary: Number(form.salary),
      initials: getInitials(form.name),
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      avatar: null,
    };
    setTimeout(() => {
      onSave(payload);
      setSaving(false);
    }, 600);
  }

  function field(label, key, type='text', options=null) {
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        {options ? (
          <select className={`form-input form-select ${errors[key] ? 'error' : ''}`} value={form[key]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))}>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input className={`form-input ${errors[key] ? 'error' : ''}`} type={type} value={form[key]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))} />
        )}
        {errors[key] && <span style={{ fontSize: 11, color: 'var(--danger)', marginTop: 2 }}>{errors[key]}</span>}
      </div>
    );
  }

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(6,182,212,0.05) 100%)' }}>
          <div>
            <h3 style={{ fontSize: 18 }}>{emp ? 'Edit Employee' : 'Add New Employee'}</h3>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              {emp ? `Editing ${emp.name}` : 'Fill in the details to add a new team member'}
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {field('Full Name *', 'name')}
            {field('Role / Designation *', 'role')}
            {field('Email *', 'email', 'email')}
            {field('Phone', 'phone', 'tel')}
            {field('Department *', 'dept', 'text', departments)}
            {field('Location *', 'location', 'text', locations)}
            {field('Annual CTC (₹) *', 'salary', 'number')}
            {field('Level', 'level', 'text', levels)}
            {field('Join Date', 'joinDate', 'date')}
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input form-select" value={form.status || 'active'} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Skills (comma-separated)</label>
              <input className="form-input" value={form.skills} onChange={e => setForm(f => ({...f, skills: e.target.value}))} placeholder="e.g. React, Node.js, TypeScript" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? '⏳ Saving...' : emp ? '✓ Save Changes' : '+ Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── View Employee Modal ─────────────────────────────────────────────────────
function EmployeeViewModal({ emp, allEmployees, onClose, onEdit, onDelete }) {
  const [activeTab, setActiveTab] = useState('overview');
  const manager = allEmployees.find(e => e.id === emp.manager);
  const reportees = allEmployees.filter(e => emp.reportees?.includes(e.id));
  const tabs = ['overview', 'employment', 'documents', 'timeline'];

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.04) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="avatar-placeholder" style={{ width: 56, height: 56, fontSize: 20, background: `linear-gradient(135deg, ${deptColors[emp.dept] || '#7C3AED'}, ${deptColors[emp.dept] || '#7C3AED'}99)`, boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}>
              {emp.initials}
            </div>
            <div>
              <h3 style={{ fontSize: 20 }}>{emp.name}</h3>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{emp.role} · {emp.dept}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <span className={`badge ${statusColors[emp.status]}`}>
                  <span className={`status-dot ${emp.status === 'active' ? 'active' : emp.status === 'on_leave' ? 'warning' : 'inactive'}`} />
                  {statusLabels[emp.status]}
                </span>
                <span className="badge badge-primary">{emp.level}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {onEdit && (
              <button onClick={onEdit} className="btn btn-secondary btn-sm"><Edit2 size={13} /> Edit</button>
            )}
            {onDelete && (
              <button onClick={onDelete} className="btn btn-danger btn-sm"><Trash2 size={13} /></button>
            )}
            <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={16} /></button>
          </div>
        </div>
        <div style={{ padding: '12px 20px 0', borderBottom: '1px solid var(--border)' }}>
          <div className="tabs" style={{ border: 'none', background: 'none', padding: 0, gap: 0 }}>
            {tabs.map(t => (
              <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
            ))}
          </div>
        </div>
        <div className="modal-body">
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
              {[
                { icon: Mail, label: 'Email', value: emp.email },
                { icon: Phone, label: 'Phone', value: emp.phone || '—' },
                { icon: MapPin, label: 'Location', value: emp.location },
                { icon: Calendar, label: 'Joined', value: new Date(emp.joinDate).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' }) },
                { icon: Building2, label: 'Department', value: emp.dept },
                { icon: Award, label: 'Employee ID', value: emp.id },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon size={15} style={{ color: 'var(--primary-light)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{item.value}</div>
                  </div>
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Skills</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(Array.isArray(emp.skills) ? emp.skills : []).map(s => <span key={s} className="badge badge-primary">{s}</span>)}
                </div>
              </div>
              {manager && (
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Reports To</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar-placeholder" style={{ width: 30, height: 30, fontSize: 11 }}>{manager.initials}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{manager.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{manager.role}</div>
                    </div>
                  </div>
                </div>
              )}
              {reportees.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Direct Reports ({reportees.length})</div>
                  <div className="avatar-group">{reportees.map(r => <div key={r.id} className="avatar-placeholder" style={{ width: 28, height: 28, fontSize: 10 }} title={r.name}>{r.initials}</div>)}</div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'employment' && (
            <div className="glass-card" style={{ padding: 0 }}>
              <div className="glass-card-inner">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    ['Employment Type', 'Full-Time'], ['Work Mode', 'Hybrid'],
                    ['Annual CTC', `₹${(emp.salary/100000).toFixed(1)}L`], ['Band', emp.level],
                    ['Employee ID', emp.id], ['PAN', 'ABCDE1234F'],
                    ['PF Account', 'PF001234567'], ['ESI Number', 'ESI98765432'],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'documents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Offer Letter', 'Employment Contract', 'Aadhar Card', 'PAN Card', 'Educational Certificates', 'Form 16 (2023-24)'].map(doc => (
                <div key={doc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, background: 'rgba(124,58,237,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award size={14} color="var(--primary-light)" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{doc}</span>
                  </div>
                  <span className="badge badge-success">Uploaded</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'timeline' && (
            <div className="timeline">
              {[
                { date: '2024-01-15', event: 'Promoted to ' + emp.role, type: 'done' },
                { date: '2023-07-01', event: 'Performance Review — Exceeds Expectations', type: 'done' },
                { date: emp.joinDate, event: 'Joined NexusHR as ' + emp.dept + ' team member', type: 'done' },
              ].map((item, i) => (
                <div key={i} className="timeline-item">
                  <div className={`timeline-dot ${item.type}`} />
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{item.event}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{new Date(item.date).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Employees Page ─────────────────────────────────────────────────────
// ── Role badge shown at top of page ───────────────────────────────
const roleMeta = {
  hr_admin: { label: 'HR Admin', color: '#7C3AED', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.3)', desc: 'Full access — add, edit & delete employees' },
  manager:  { label: 'Manager',  color: '#06B6D4', bg: 'rgba(6,182,212,0.10)',  border: 'rgba(6,182,212,0.3)',   desc: 'Can edit employee profiles. Cannot add or delete.' },
  employee: { label: 'Employee', color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.3)',  desc: 'Read-only access to employee directory.' },
};

export default function Employees() {
  const { addToast } = useToast();
  const { canAddEmployee, canDeleteEmployee, canEditEmployee, canExportData, role } = usePermission();
  const location = useLocation();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState(() => getEmployees());
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [status, setStatus] = useState('All');
  const [view, setView] = useState('grid');
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    if (!location.state?.openAddEmployee) return;

    if (canAddEmployee) {
      setSelected(null);
      setEditTarget(null);
      setShowForm(true);
    } else {
      addToast({ type: 'warning', title: 'Admin Access Required', message: 'Only HR Admin can add new employees.' });
    }

    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state, location.pathname, canAddEmployee, addToast, navigate]);

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.dept.toLowerCase().includes(q);
    const matchDept   = dept === 'All' || e.dept === dept;
    const matchStatus = status === 'All' || e.status === status;
    return matchSearch && matchDept && matchStatus;
  });

  function handleAddSave(payload) {
    const newEmp = addEmployee(payload);
    setEmployees(getEmployees());
    setShowForm(false);
    addToast({ type: 'success', title: 'Employee Added', message: `${newEmp.name} has been added successfully.` });
  }

  function handleEditSave(payload) {
    updateEmployee(editTarget.id, payload);
    setEmployees(getEmployees());
    setSelected(null);
    setEditTarget(null);
    addToast({ type: 'success', title: 'Employee Updated', message: `${payload.name}'s profile has been updated.` });
  }

  function handleDelete(id, name) {
    if (!window.confirm(`Remove ${name} from the directory?`)) return;
    deleteEmployee(id);
    setEmployees(getEmployees());
    setSelected(null);
    addToast({ type: 'warning', title: 'Employee Removed', message: `${name} has been removed.` });
  }

  function handleExport() {
    const csv = [
      ['ID','Name','Role','Department','Email','Location','CTC','Status'].join(','),
      ...employees.map(e => [e.id, e.name, e.role, e.dept, e.email, e.location, e.salary, e.status].join(','))
    ].join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv,' + encodeURIComponent(csv);
    a.download = 'nexushr_employees.csv';
    a.click();
    addToast({ type: 'info', title: 'Export Ready', message: 'Employee data downloaded as CSV.' });
  }

  const meta = roleMeta[role] || roleMeta.employee;

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <div className="page-header-left">
          <h1>Employee Directory</h1>
          <p>{filtered.length} employees · {employees.filter(e=>e.status==='active').length} active</p>
        </div>
        <div className="page-header-actions">
          {canExportData && (
            <button className="btn btn-ghost btn-sm" onClick={handleExport}>⬇ Export CSV</button>
          )}
          <button className="btn btn-ghost btn-sm" onClick={() => setView(v => v==='grid'?'table':'grid')}>
            {view==='grid' ? 'Table View' : 'Card View'}
          </button>
          {canAddEmployee ? (
            <button className="btn btn-primary btn-sm" id="add-employee-btn" onClick={() => { setEditTarget(null); setShowForm(true); }}>
              <Plus size={15} /> Add Employee
            </button>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', fontSize:12, color:'var(--text-muted)', background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)' }}>
              <Lock size={12} /> Add Employee (Admin only)
            </div>
          )}
        </div>
      </div>

      {/* Role-awareness banner */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', marginBottom:'var(--spacing-md)', background: meta.bg, border:`1px solid ${meta.border}`, borderRadius:'var(--radius-md)', fontSize:13 }} className="animate-fade-in-up">
        <div style={{ width:8, height:8, borderRadius:'50%', background: meta.color, flexShrink:0 }} />
        <span style={{ fontWeight:700, color: meta.color }}>{meta.label}</span>
        <span style={{ color:'var(--text-secondary)' }}>—</span>
        <span style={{ color:'var(--text-secondary)' }}>{meta.desc}</span>
      </div>

      {/* Filters */}
      <div className="glass-card animate-fade-in-up delay-1" style={{ marginBottom: 'var(--spacing-md)' }}>
        <div className="glass-card-inner" style={{ padding: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-input-wrapper" style={{ flex: '1 1 200px', minWidth: 200 }}>
            <Search size={16} className="search-icon" />
            <input className="form-input" placeholder="Search name, role, email..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-input form-select" value={dept} onChange={e => setDept(e.target.value)} style={{ flex: '0 0 160px' }}>
            <option value="All">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="form-input form-select" value={status} onChange={e => setStatus(e.target.value)} style={{ flex: '0 0 140px' }}>
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
          {(search || dept !== 'All' || status !== 'All') && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setDept('All'); setStatus('All'); }}>
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Department chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 'var(--spacing-md)' }}>
        {['All', ...departments].map(d => (
          <button key={d} onClick={() => setDept(d)} className="btn btn-sm" style={{
            background: dept===d ? (deptColors[d]||'var(--primary)') : 'transparent',
            border: `1px solid ${dept===d ? (deptColors[d]||'var(--primary)') : 'var(--border)'}`,
            color: dept===d ? 'white' : 'var(--text-muted)', padding: '4px 12px', fontSize: 12,
          }}>{d}</button>
        ))}
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--spacing-md)' }}>
          <AnimatePresence>
            {filtered.map((emp, i) => (
              <motion.div key={emp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }}
                className="glass-card" onClick={() => setSelected(emp)} style={{ cursor: 'pointer' }}>
                <div className="glass-card-inner employee-card">
                  <div className="avatar-placeholder animate-pulse-glow" style={{ width: 64, height: 64, fontSize: 22, background: `linear-gradient(135deg, ${deptColors[emp.dept]||'#7C3AED'}, ${deptColors[emp.dept]||'#7C3AED'}88)` }}>
                    {emp.initials}
                  </div>
                  <div className="employee-card-name">{emp.name}</div>
                  <div className="employee-card-role">{emp.role}</div>
                  <div className="employee-card-dept" style={{ background: `${deptColors[emp.dept]||'var(--primary)'}18`, color: deptColors[emp.dept]||'var(--primary-light)', border: `1px solid ${deptColors[emp.dept]||'var(--primary)'}33` }}>
                    {emp.dept}
                  </div>
                  <span className={`badge ${statusColors[emp.status]}`} style={{ marginTop: 4 }}>
                    <span className={`status-dot ${emp.status==='active'?'active':emp.status==='on_leave'?'warning':'inactive'}`} />
                    {statusLabels[emp.status]}
                  </span>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, fontSize: 11, color: 'var(--text-muted)', alignItems: 'center' }}>
                    <MapPin size={10} />{emp.location}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="glass-card animate-fade-in-up">
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th><th>Role</th><th>Department</th>
                  <th>Location</th><th>Joined</th><th>CTC</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => (
                  <tr key={emp.id} onClick={() => setSelected(emp)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar-placeholder" style={{ width: 32, height: 32, fontSize: 12, background: `linear-gradient(135deg, ${deptColors[emp.dept]||'#7C3AED'}, ${deptColors[emp.dept]||'#7C3AED'}88)` }}>{emp.initials}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{emp.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{emp.role}</td>
                    <td><span className="badge badge-primary" style={{ background: `${deptColors[emp.dept]||'var(--primary)'}18`, color: deptColors[emp.dept]||'var(--primary-light)' }}>{emp.dept}</span></td>
                    <td><span style={{ display:'flex', alignItems:'center', gap:4 }}><MapPin size={12} color="var(--text-muted)" />{emp.location}</span></td>
                    <td>{new Date(emp.joinDate).getFullYear()}</td>
                    <td style={{ fontWeight: 700, color: 'var(--success)' }}>₹{(emp.salary/100000).toFixed(1)}L</td>
                    <td><span className={`badge ${statusColors[emp.status]}`}>{statusLabels[emp.status]}</span></td>
                    <td>
                      <div style={{ display:'flex', gap:6 }} onClick={e => e.stopPropagation()}>
                        {canEditEmployee && (
                          <button className="btn btn-ghost btn-sm" title="Edit employee" onClick={() => { setEditTarget(emp); setShowForm(true); }}><Edit2 size={12} /></button>
                        )}
                        {canDeleteEmployee && (
                          <button className="btn btn-danger btn-sm" title="Delete employee" onClick={() => handleDelete(emp.id, emp.name)}><Trash2 size={12} /></button>
                        )}
                        {!canEditEmployee && !canDeleteEmployee && (
                          <span style={{ fontSize:11, color:'var(--text-muted)', padding:'4px 8px' }}>View only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon"><Users size={28} /></div>
          <div style={{ fontWeight: 600 }}>No employees found</div>
          <div style={{ fontSize: 13 }}>Try adjusting your search or filters</div>
        </div>
      )}

      {/* View modal — pass permission flags so action buttons respect RBAC */}
      {selected && !showForm && (
        <EmployeeViewModal
          emp={selected}
          allEmployees={employees}
          onClose={() => setSelected(null)}
          onEdit={canEditEmployee ? () => { setEditTarget(selected); setSelected(null); setShowForm(true); } : null}
          onDelete={canDeleteEmployee ? () => handleDelete(selected.id, selected.name) : null}
        />
      )}

      {/* Add / Edit form modal */}
      {showForm && (
        <EmployeeFormModal
          emp={editTarget}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          onSave={editTarget ? handleEditSave : handleAddSave}
        />
      )}
    </div>
  );
}
