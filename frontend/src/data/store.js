// ============================================
// NEXUSHR — DATA STORE (localStorage-backed)
// Single source of truth for all mutable data
// ============================================

import { employees as seedEmployees, departments, payrollRuns as seedPayrollRuns,
  leaveRequests as seedLeaveRequests, onboardingTasks as seedTasks,
  candidates as seedCandidates, jobOpenings as seedJobs } from './mockData';

const KEYS = {
  employees: 'nexushr_employees',
  payrollRuns: 'nexushr_payroll_runs',
  leaveRequests: 'nexushr_leave_requests',
  onboardingTasks: 'nexushr_onboarding_tasks',
  candidates: 'nexushr_candidates',
  jobOpenings: 'nexushr_job_openings',
  checkedIn: 'nexushr_checked_in',
};

function load(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : seed;
  } catch {
    return seed;
  }
}

function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error', e);
  }
}

// ---- Employees ----
export function getEmployees() { return load(KEYS.employees, seedEmployees); }
export function saveEmployees(data) { save(KEYS.employees, data); }

export function addEmployee(emp) {
  const all = getEmployees();
  const maxId = all.map(e => parseInt(e.id.replace('E',''))).reduce((a,b) => Math.max(a,b), 0);
  const newEmp = {
    ...emp,
    id: `E${String(maxId + 1).padStart('3','0')}`,
    status: 'active',
    reportees: [],
    manager: emp.manager || null,
  };
  const updated = [newEmp, ...all];
  saveEmployees(updated);
  return newEmp;
}

export function updateEmployee(id, fields) {
  const all = getEmployees();
  const updated = all.map(e => e.id === id ? { ...e, ...fields } : e);
  saveEmployees(updated);
  return updated.find(e => e.id === id);
}

export function deleteEmployee(id) {
  const all = getEmployees();
  const updated = all.filter(e => e.id !== id);
  saveEmployees(updated);
}

// ---- Payroll Runs ----
export function getPayrollRuns() { return load(KEYS.payrollRuns, seedPayrollRuns); }
export function savePayrollRuns(data) { save(KEYS.payrollRuns, data); }

export function runPayroll(processedBy) {
  const runs = getPayrollRuns();
  const emps = getEmployees().filter(e => e.status !== 'inactive');
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const now = new Date();
  const monthStr = `${months[now.getMonth()]} ${now.getFullYear()}`;
  // avoid duplicating
  if (runs.some(r => r.month === monthStr)) return null;
  const totalGross = emps.reduce((s, e) => s + Math.round(e.salary * 0.85 / 12), 0);
  const totalDeductions = Math.round(totalGross * 0.109);
  const totalNet = totalGross - totalDeductions;
  const newRun = {
    id: `PR${String(runs.length + 1).padStart(3,'0')}`,
    month: monthStr,
    status: 'completed',
    totalEmployees: emps.length,
    totalGross,
    totalDeductions,
    totalNet,
    processedOn: now.toISOString().split('T')[0],
    approvedBy: processedBy || 'HR Admin',
  };
  const updated = [newRun, ...runs];
  savePayrollRuns(updated);
  return newRun;
}

// ---- Leave Requests ----
export function getLeaveRequests() { return load(KEYS.leaveRequests, seedLeaveRequests); }
export function saveLeaveRequests(data) { save(KEYS.leaveRequests, data); }

export function applyLeave(req) {
  const all = getLeaveRequests();
  const newReq = {
    ...req,
    id: `LR${String(all.length + 1).padStart(3,'0')}`,
    status: 'pending',
    appliedOn: new Date().toISOString().split('T')[0],
  };
  const updated = [newReq, ...all];
  saveLeaveRequests(updated);
  return newReq;
}

export function approveLeave(id) {
  const all = getLeaveRequests();
  const updated = all.map(r => r.id === id ? { ...r, status: 'approved' } : r);
  saveLeaveRequests(updated);
}

export function rejectLeave(id) {
  const all = getLeaveRequests();
  const updated = all.map(r => r.id === id ? { ...r, status: 'rejected' } : r);
  saveLeaveRequests(updated);
}

// ---- Onboarding Tasks ----
export function getOnboardingTasks() { return load(KEYS.onboardingTasks, seedTasks); }
export function toggleOnboardingTask(taskId) {
  const all = getOnboardingTasks();
  const updated = all.map(t => t.id === taskId ? { ...t, done: !t.done } : t);
  save(KEYS.onboardingTasks, updated);
  return updated;
}

// ---- Candidates ----
export function getCandidates() { return load(KEYS.candidates, seedCandidates); }
export function saveCandidates(data) { save(KEYS.candidates, data); }
export function moveCandidateStage(candidateId, newStage) {
  const all = getCandidates();
  const updated = all.map(c => c.id === candidateId ? { ...c, stage: newStage } : c);
  saveCandidates(updated);
  return updated;
}

// ---- Job Openings ----
export function getJobOpenings() { return load(KEYS.jobOpenings, seedJobs); }
export function saveJobOpenings(data) { save(KEYS.jobOpenings, data); }

// ---- Attendance / Check-in ----
export function getCheckedIn() {
  try { return JSON.parse(localStorage.getItem(KEYS.checkedIn)) || {}; } catch { return {}; }
}
export function setCheckedInState(state) {
  localStorage.setItem(KEYS.checkedIn, JSON.stringify(state));
}
