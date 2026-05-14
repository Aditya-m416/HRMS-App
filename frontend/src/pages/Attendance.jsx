import { useState, useEffect } from 'react';
import { employees, attendanceSummary, generateAttendanceHeatmap, shiftSchedule } from '../data/mockData';
import { Clock, CheckCircle, XCircle, AlertTriangle, Users, MapPin, Timer } from 'lucide-react';

export default function Attendance() {
  const [heatmap] = useState(generateAttendanceHeatmap);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkTime, setCheckTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleCheckIn = () => {
    if (!checkedIn) { setCheckedIn(true); setCheckTime(new Date()); }
    else { setCheckedIn(false); }
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div>
      <div className="page-header animate-fade-in-up">
        <div className="page-header-left">
          <h1>Attendance & Time Tracking</h1>
          <p>{currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="page-header-actions">
          <div style={{ padding: '8px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--accent)', letterSpacing: 2 }}>
            {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Check In/Out Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
        <div className="glass-card animate-fade-in-up delay-1">
          <div className="glass-card-inner" style={{ textAlign: 'center', padding: 'var(--spacing-xl)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 120, height: 120, borderRadius: '50%',
                border: `4px solid ${checkedIn ? 'var(--success)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: checkedIn ? 'rgba(16,185,129,0.1)' : 'var(--bg-elevated)',
                boxShadow: checkedIn ? '0 0 40px rgba(16,185,129,0.3)' : 'none',
                transition: 'all 0.5s ease',
                cursor: 'pointer',
              }} onClick={handleCheckIn}>
                <div>
                  <Clock size={36} color={checkedIn ? 'var(--success)' : 'var(--text-muted)'} />
                </div>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: checkedIn ? 'var(--success)' : 'var(--text-secondary)' }}>
              {checkedIn ? '✓ Checked In' : 'Not Checked In'}
            </div>
            {checkTime && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Since {checkTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
            <button
              className={`btn ${checkedIn ? 'btn-danger' : 'btn-primary'} w-full`}
              onClick={handleCheckIn}
              id="checkin-btn"
            >
              {checkedIn ? <> <XCircle size={16} /> Check Out</> : <><CheckCircle size={16} /> Check In</>}
            </button>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={11} /> Bangalore Office · Geo-verified
            </div>
          </div>
        </div>

        {/* Today's stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
          {[
            { label: 'Present Today', value: attendanceSummary.presentToday, total: 23, color: 'var(--success)', icon: CheckCircle },
            { label: 'Absent Today', value: attendanceSummary.absentToday, total: 23, color: 'var(--danger)', icon: XCircle },
            { label: 'On Leave', value: attendanceSummary.onLeave, total: 23, color: 'var(--warning)', icon: Timer },
            { label: 'Late Arrivals', value: attendanceSummary.lateArrivals, total: 23, color: 'var(--accent)', icon: AlertTriangle },
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
                    <div className="progress-bar" style={{ width: 80, marginTop: 6 }}>
                      <div className="progress-fill" style={{ width: `${(s.value/s.total)*100}%`, background: s.color }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs animate-fade-in-up delay-2" style={{ marginBottom: 'var(--spacing-md)' }}>
        {['today', 'heatmap', 'shifts', 'team log'].map(t => (
          <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {activeTab === 'today' && (
        <div className="glass-card animate-fade-in-up">
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="data-table">
              <thead><tr><th>Employee</th><th>Check In</th><th>Check Out</th><th>Work Hours</th><th>Status</th><th>Location</th></tr></thead>
              <tbody>
                {employees.filter(e=>e.status!=='inactive').map((emp, i) => {
                  const inTime = `0${8 + Math.floor(Math.random()*2)}:${Math.random() > 0.7 ? Math.floor(Math.random()*59).toString().padStart(2,'0') : '00'} AM`;
                  const hours = (7 + Math.random() * 2).toFixed(1);
                  const isLate = inTime.includes('09') || inTime.includes('10');
                  const isLeave = emp.status === 'on_leave';
                  return (
                    <tr key={emp.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="avatar-placeholder" style={{ width: 28, height: 28, fontSize: 10 }}>{emp.initials}</div>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{emp.name}</span>
                        </div>
                      </td>
                      <td style={{ color: isLate ? 'var(--warning)' : 'var(--text-secondary)' }}>{isLeave ? '—' : inTime}</td>
                      <td>{isLeave ? '—' : (i < 3 ? '—' : `0${5+Math.floor(Math.random()*2)}:30 PM`)}</td>
                      <td style={{ fontWeight: 600 }}>{isLeave ? '—' : `${hours}h`}</td>
                      <td>
                        {isLeave
                          ? <span className="badge badge-warning">On Leave</span>
                          : isLate
                          ? <span className="badge badge-warning">Late</span>
                          : <span className="badge badge-success">Present</span>
                        }
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} /> {emp.location}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'heatmap' && (
        <div className="glass-card animate-fade-in-up">
          <div className="glass-card-inner">
            <div className="chart-title mb-md flex gap-md" style={{ justifyContent: 'space-between' }}>
              <span>Attendance Heatmap — March 2024</span>
              <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                {[['present','Present','var(--success)'],['absent','Absent','var(--danger)'],['leave','Leave','var(--warning)'],['weekend','Weekend','var(--text-muted)']].map(([type,label,color]) => (
                  <span key={type} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: color, opacity: 0.6 }} />{label}
                  </span>
                ))}
              </div>
            </div>

            {/* Weekday headers */}
            <div className="heatmap-grid" style={{ marginBottom: 4 }}>
              {weekDays.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, padding: 4 }}>{d}</div>)}
            </div>

            <div className="heatmap-grid">
              {/* Padding for first day */}
              {Array(4).fill(null).map((_,i) => <div key={`p${i}`} />)}
              {heatmap.map((day) => (
                <div key={day.day} className={`heatmap-cell ${day.status}`} title={`March ${day.day}: ${day.status}`}>
                  {day.day}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
              {[
                { status: 'present', label: 'Present', count: heatmap.filter(d=>d.status==='present').length },
                { status: 'absent', label: 'Absent', count: heatmap.filter(d=>d.status==='absent').length },
                { status: 'leave', label: 'Leave', count: heatmap.filter(d=>d.status==='leave').length },
              ].map(s => (
                <div key={s.label} style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.count}</span> {s.label} days
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'shifts' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-md)' }}>
          {shiftSchedule.map(shift => (
            <div key={shift.id} className="glass-card animate-fade-in-up">
              <div className="glass-card-inner">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${shift.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={20} style={{ color: shift.color }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{shift.name} Shift</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{shift.time}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Employees</span>
                  <span style={{ fontWeight: 700, color: shift.color }}>{shift.employees}</span>
                </div>
                <div className="progress-bar" style={{ marginTop: 10 }}>
                  <div className="progress-fill" style={{ width: `${(shift.employees / 23) * 100}%`, background: shift.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'team log' && (
        <div className="glass-card animate-fade-in-up">
          <div className="glass-card-inner">
            <div className="chart-title mb-md">Team Overtime & Late Arrivals</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {employees.slice(0, 10).map(emp => {
                const lateMin = Math.random() > 0.7 ? Math.floor(Math.random() * 45) : 0;
                const overtime = Math.random() > 0.6 ? Math.floor(Math.random() * 120) : 0;
                return (
                  <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div className="avatar-placeholder" style={{ width: 32, height: 32, fontSize: 11 }}>{emp.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{emp.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.dept}</div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 90 }}>
                      {lateMin > 0 && <span className="badge badge-warning">{lateMin}m late</span>}
                      {overtime > 0 && <span className="badge badge-info" style={{ marginLeft: 4 }}>+{overtime}m OT</span>}
                      {lateMin === 0 && overtime === 0 && <span className="badge badge-success">On time</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
