import { parseJson } from '../config/database.js';

export function employeeFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    dept: row.dept,
    email: row.email,
    phone: row.phone,
    location: row.location,
    status: row.status,
    joinDate: row.join_date,
    salary: row.salary,
    manager: row.manager,
    reportees: parseJson(row.reportees, []),
    avatar: row.avatar,
    initials: row.initials,
    skills: parseJson(row.skills, []),
    level: row.level,
  };
}

export function payrollRunFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    month: row.month,
    status: row.status,
    totalEmployees: row.total_employees,
    totalGross: row.total_gross,
    totalDeductions: row.total_deductions,
    totalNet: row.total_net,
    processedOn: row.processed_on,
    approvedBy: row.approved_by,
  };
}

export function leaveRequestFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    employee: row.employee,
    type: row.type,
    from: row.from_date,
    to: row.to_date,
    days: row.days,
    reason: row.reason,
    status: row.status,
    appliedOn: row.applied_on,
    decidedOn: row.decided_on,
  };
}

export function onboardingTaskFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    category: row.category,
    task: row.task,
    done: Boolean(row.done),
  };
}

export function jobOpeningFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    dept: row.dept,
    location: row.location,
    type: row.type,
    openedOn: row.opened_on,
    applicants: row.applicants,
    status: row.status,
  };
}

export function candidateFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    stage: row.stage,
    email: row.email,
    phone: row.phone,
    score: row.score,
    appliedOn: row.applied_on,
    source: row.source,
  };
}
