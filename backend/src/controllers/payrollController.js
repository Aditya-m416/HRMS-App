import {
  createPayrollRun,
  ctcBreakdown,
  getPayslip,
  listPayrollEmployees,
  listPayrollRuns,
  payrollTrend,
} from '../models/payrollModel.js';
import { fail, ok } from '../utils/http.js';

export function runs(req, res) {
  ok(res, listPayrollRuns());
}

export function runPayroll(req, res) {
  const result = createPayrollRun({ month: req.body.month, processedBy: req.body.processedBy });
  if (!result) return fail(res, 409, 'Payroll for this month has already been processed');
  ok(res, result, 201);
}

export function employees(req, res) {
  ok(res, listPayrollEmployees());
}

export function payslip(req, res) {
  const result = getPayslip(req.params.employeeId);
  if (!result) return fail(res, 404, 'Employee not found');
  ok(res, result);
}

export function trend(req, res) {
  ok(res, payrollTrend());
}

export function ctc(req, res) {
  ok(res, ctcBreakdown());
}
