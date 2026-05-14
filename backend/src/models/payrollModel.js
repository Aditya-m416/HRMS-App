import { all, get, nextId, run } from '../config/database.js';
import { payrollRunFromRow } from '../utils/serializers.js';
import { today } from '../utils/date.js';
import { findEmployeeById, listEmployees } from './employeeModel.js';
import { findReference } from './referenceModel.js';

export function payrollEmployeeSummary(emp) {
  const basic = Math.round(emp.salary * 0.40 / 12);
  const hra = Math.round(emp.salary * 0.20 / 12);
  const special = Math.round(emp.salary * 0.25 / 12);
  const gross = basic + hra + special;
  const deductions = Math.round(gross * 0.22);
  const net = gross - deductions;
  return { employee: emp, basic, hra, special, gross, deductions, net };
}

export function listPayrollRuns() {
  return all('SELECT * FROM payroll_runs ORDER BY processed_on DESC, id DESC').map(payrollRunFromRow);
}

export function createPayrollRun({ month, processedBy } = {}) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  const period = month || `${months[now.getMonth()]} ${now.getFullYear()}`;
  if (get('SELECT id FROM payroll_runs WHERE month = ?', [period])) return null;

  const employees = listEmployees().filter((emp) => emp.status !== 'inactive');
  const totalGross = employees.reduce((sum, emp) => sum + Math.round(emp.salary * 0.85 / 12), 0);
  const totalDeductions = Math.round(totalGross * 0.109);
  const totalNet = totalGross - totalDeductions;
  const id = nextId('PR', 'payroll_runs');

  run(
    `INSERT INTO payroll_runs
    (id, month, status, total_employees, total_gross, total_deductions, total_net, processed_on, approved_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, period, 'completed', employees.length, totalGross, totalDeductions, totalNet, today(), processedBy || 'HR Admin']
  );

  return payrollRunFromRow(get('SELECT * FROM payroll_runs WHERE id = ?', [id]));
}

export function listPayrollEmployees() {
  return listEmployees().filter((emp) => emp.status !== 'inactive').map(payrollEmployeeSummary);
}

export function getPayslip(employeeId) {
  const emp = findEmployeeById(employeeId);
  return emp ? payrollEmployeeSummary(emp) : null;
}

export function payrollTrend() {
  return findReference('payrollTrend', []);
}

export function ctcBreakdown() {
  return findReference('ctcBreakdown', []);
}
