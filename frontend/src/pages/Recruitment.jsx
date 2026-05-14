import { useState } from 'react';
import { jobOpenings, candidates, atsStages } from '../data/mockData';
import { Briefcase, Users, TrendingUp, Plus, Search, Mail, Phone, Star, X, ChevronRight, MapPin } from 'lucide-react';

const stageColors = {
  applied: '#94A3B8', screening: '#F59E0B', interview: '#3B82F6', offer: '#10B981', hired: '#7C3AED'
};

function CandidateModal({ candidate, onClose, onMove }) {
  const job = jobOpenings.find(j => j.id === candidate.role);
  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div className="avatar-placeholder" style={{ width: 48, height: 48, fontSize: 18, background: `linear-gradient(135deg, ${stageColors[candidate.stage]}, ${stageColors[candidate.stage]}88)` }}>
              {candidate.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div>
              <h3>{candidate.name}</h3>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{job?.title}</div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={16} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: Mail, label: 'Email', value: candidate.email },
              { icon: Phone, label: 'Phone', value: candidate.phone },
              { icon: Star, label: 'Score', value: `${candidate.score}/100` },
              { icon: Briefcase, label: 'Source', value: candidate.source },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.icon size={14} color="var(--primary-light)" />
                </div>
                <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.label}</div><div style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</div></div>
              </div>
            ))}
          </div>

          {/* Score bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: 'var(--text-muted)' }}>Match Score</span>
              <span style={{ fontWeight: 700, color: candidate.score >= 85 ? 'var(--success)' : 'var(--warning)' }}>{candidate.score}%</span>
            </div>
            <div className="progress-bar" style={{ height: 8 }}>
              <div className="progress-fill" style={{ width: `${candidate.score}%`, background: candidate.score >= 85 ? 'var(--success)' : 'var(--warning)' }} />
            </div>
          </div>

          {/* Move to stage */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: 'var(--text-secondary)' }}>Move to Stage</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {atsStages.filter(s => s.id !== candidate.stage).map(stage => (
                <button key={stage.id} className="btn btn-ghost btn-sm" onClick={() => { onMove(candidate.id, stage.id); onClose(); }}
                  style={{ borderColor: stage.color, color: stage.color }}>
                  → {stage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scorecard */}
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Interview Scorecard</div>
            {['Communication', 'Technical Skills', 'Problem Solving', 'Cultural Fit'].map(skill => {
              const score = Math.floor(Math.random() * 3) + 3;
              return (
                <div key={skill} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{skill}</span>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} size={14} style={{ color: i < score ? 'var(--warning)' : 'var(--text-disabled)' }} fill={i < score ? 'var(--warning)' : 'none'} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-danger btn-sm">Reject</button>
          <button className="btn btn-primary">Send Offer</button>
        </div>
      </div>
    </div>
  );
}

export default function Recruitment() {
  const [cands, setCands] = useState(candidates);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('pipeline');
  const [search, setSearch] = useState('');

  const moveCandidate = (id, newStage) => {
    setCands(prev => prev.map(c => c.id === id ? { ...c, stage: newStage } : c));
  };

  const filtered = cands.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    jobOpenings.find(j=>j.id===c.role)?.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <div className="page-header-left">
          <h1>Recruitment (ATS)</h1>
          <p>{jobOpenings.filter(j=>j.status==='active').length} active openings · {cands.length} total candidates</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-ghost btn-sm"><Briefcase size={15} /> Post Job</button>
          <button className="btn btn-primary btn-sm"><Plus size={15} /> Add Candidate</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 'var(--spacing-md)' }}>
        {[
          { label: 'Open Positions', value: jobOpenings.filter(j=>j.status==='active').length, color: 'var(--primary)', icon: Briefcase },
          { label: 'Total Applicants', value: cands.length, color: 'var(--accent)', icon: Users },
          { label: 'In Interview', value: cands.filter(c=>c.stage==='interview').length, color: 'var(--warning)', icon: TrendingUp },
          { label: 'Offers Sent', value: cands.filter(c=>c.stage==='offer').length, color: 'var(--success)', icon: Star },
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
        {['pipeline', 'openings', 'all candidates'].map(t => (
          <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {activeTab === 'pipeline' && (
        <div className="kanban-board animate-fade-in-up">
          {atsStages.map(stage => {
            const stageCands = filtered.filter(c => c.stage === stage.id);
            return (
              <div key={stage.id} className="kanban-column">
                <div className="kanban-col-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: stage.color }} />
                    <span className="kanban-col-title" style={{ color: stage.color }}>{stage.label}</span>
                  </div>
                  <span className="kanban-col-count">{stageCands.length}</span>
                </div>
                <div className="kanban-cards">
                  {stageCands.map(cand => {
                    const job = jobOpenings.find(j => j.id === cand.role);
                    return (
                      <div key={cand.id} className="kanban-card" onClick={() => setSelected(cand)}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                          <div className="avatar-placeholder" style={{ width: 32, height: 32, fontSize: 11, background: `linear-gradient(135deg, ${stage.color}, ${stage.color}88)` }}>
                            {cand.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>{cand.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{job?.title || 'Unknown Role'}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="badge badge-muted" style={{ fontSize: 10 }}>{cand.source}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: cand.score >= 85 ? 'var(--success)' : 'var(--warning)' }}>
                            <Star size={11} fill="currentColor" /> {cand.score}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {stageCands.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-disabled)', fontSize: 12, padding: 20 }}>No candidates</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'openings' && (
        <div className="glass-card animate-fade-in-up">
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="data-table">
              <thead><tr><th>Position</th><th>Department</th><th>Location</th><th>Type</th><th>Applicants</th><th>Opened</th><th>Status</th></tr></thead>
              <tbody>
                {jobOpenings.map(job => (
                  <tr key={job.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{job.title}</td>
                    <td><span className="badge badge-primary">{job.dept}</span></td>
                    <td><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} color="var(--text-muted)" />{job.location}</span></td>
                    <td>{job.type}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{job.applicants}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(job.openedOn).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</td>
                    <td><span className={`badge ${job.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{job.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'all candidates' && (
        <div className="glass-card animate-fade-in-up">
          <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--border)' }}>
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input className="form-input" placeholder="Search candidates or roles..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="data-table">
              <thead><tr><th>Candidate</th><th>Applied For</th><th>Source</th><th>Score</th><th>Stage</th><th>Applied</th><th></th></tr></thead>
              <tbody>
                {filtered.map(cand => {
                  const job = jobOpenings.find(j => j.id === cand.role);
                  return (
                    <tr key={cand.id} onClick={() => setSelected(cand)} style={{ cursor: 'pointer' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="avatar-placeholder" style={{ width: 30, height: 30, fontSize: 11, background: `linear-gradient(135deg, ${stageColors[cand.stage]}, ${stageColors[cand.stage]}88)` }}>
                            {cand.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{cand.name}</div>
                        </div>
                      </td>
                      <td style={{ fontSize: 12 }}>{job?.title}</td>
                      <td><span className="badge badge-muted">{cand.source}</span></td>
                      <td style={{ fontWeight: 700, color: cand.score >= 85 ? 'var(--success)' : 'var(--warning)' }}>{cand.score}%</td>
                      <td><span className="badge" style={{ background: `${stageColors[cand.stage]}20`, color: stageColors[cand.stage], border: `1px solid ${stageColors[cand.stage]}33` }}>{cand.stage}</span></td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(cand.appliedOn).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</td>
                      <td><ChevronRight size={14} color="var(--text-muted)" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && <CandidateModal candidate={selected} onClose={() => setSelected(null)} onMove={moveCandidate} />}
    </div>
  );
}
