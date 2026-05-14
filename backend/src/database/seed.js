import {
  employees,
  payrollRuns,
  leaveRequests,
  onboardingTasks,
  jobOpenings,
  candidates,
  departments,
  leaveTypes,
  holidays,
  payrollTrend,
  ctcBreakdown,
  attendanceSummary,
  shiftSchedule,
  performanceCycles,
  goals,
  feedbackItems,
  bellCurveData,
  atsStages,
  newJoiners,
  exitEmployees,
  headcountTrend,
  attritionData,
  deptDistribution,
  genderDiversity,
  locationData,
  activityFeed,
} from './seedData.js';
import { db, get, migrate, run, toJson, transaction } from '../config/database.js';

function putReference(key, payload) {
  run(
    'INSERT OR REPLACE INTO reference_data (key, payload) VALUES (?, ?)',
    [key, JSON.stringify(payload)]
  );
}

export function seed({ force = false } = {}) {
  migrate();

  const existing = get('SELECT COUNT(*) AS count FROM employees');
  if (existing.count > 0 && !force) return false;

  transaction(() => {
    db.exec(`
      DELETE FROM attendance_checkins;
      DELETE FROM candidates;
      DELETE FROM job_openings;
      DELETE FROM onboarding_tasks;
      DELETE FROM leave_requests;
      DELETE FROM payroll_runs;
      DELETE FROM employees;
      DELETE FROM reference_data;
    `);

    const insertEmployee = db.prepare(`
      INSERT INTO employees
      (id, name, role, dept, email, phone, location, status, join_date, salary, manager, reportees, avatar, initials, skills, level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const emp of employees) {
      insertEmployee.run(
        emp.id,
        emp.name,
        emp.role,
        emp.dept,
        emp.email,
        emp.phone,
        emp.location,
        emp.status,
        emp.joinDate,
        emp.salary,
        emp.manager,
        toJson(emp.reportees),
        emp.avatar,
        emp.initials,
        toJson(emp.skills),
        emp.level
      );
    }

    const insertPayroll = db.prepare(`
      INSERT INTO payroll_runs
      (id, month, status, total_employees, total_gross, total_deductions, total_net, processed_on, approved_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const item of payrollRuns) {
      insertPayroll.run(
        item.id,
        item.month,
        item.status,
        item.totalEmployees,
        item.totalGross,
        item.totalDeductions,
        item.totalNet,
        item.processedOn,
        item.approvedBy
      );
    }

    const insertLeave = db.prepare(`
      INSERT INTO leave_requests
      (id, employee, type, from_date, to_date, days, reason, status, applied_on)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const item of leaveRequests) {
      insertLeave.run(item.id, item.employee, item.type, item.from, item.to, item.days, item.reason, item.status, item.appliedOn);
    }

    const insertTask = db.prepare('INSERT INTO onboarding_tasks (id, category, task, done) VALUES (?, ?, ?, ?)');
    for (const item of onboardingTasks) {
      insertTask.run(item.id, item.category, item.task, item.done ? 1 : 0);
    }

    const insertJob = db.prepare(`
      INSERT INTO job_openings (id, title, dept, location, type, opened_on, applicants, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const item of jobOpenings) {
      insertJob.run(item.id, item.title, item.dept, item.location, item.type, item.openedOn, item.applicants, item.status);
    }

    const insertCandidate = db.prepare(`
      INSERT INTO candidates (id, name, role, stage, email, phone, score, applied_on, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const item of candidates) {
      insertCandidate.run(item.id, item.name, item.role, item.stage, item.email, item.phone, item.score, item.appliedOn, item.source);
    }

    putReference('departments', departments);
    putReference('leaveTypes', leaveTypes);
    putReference('holidays', holidays);
    putReference('payrollTrend', payrollTrend);
    putReference('ctcBreakdown', ctcBreakdown);
    putReference('attendanceSummary', attendanceSummary);
    putReference('shiftSchedule', shiftSchedule);
    putReference('performanceCycles', performanceCycles);
    putReference('goals', goals);
    putReference('feedbackItems', feedbackItems);
    putReference('bellCurveData', bellCurveData);
    putReference('atsStages', atsStages);
    putReference('newJoiners', newJoiners);
    putReference('exitEmployees', exitEmployees);
    putReference('headcountTrend', headcountTrend);
    putReference('attritionData', attritionData);
    putReference('deptDistribution', deptDistribution);
    putReference('genderDiversity', genderDiversity);
    putReference('locationData', locationData);
    putReference('activityFeed', activityFeed);
  });

  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const force = process.argv.includes('--force');
  const changed = seed({ force });
  console.log(changed ? 'Database seeded.' : 'Database already has data. Use --force to reseed.');
}
