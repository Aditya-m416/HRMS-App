import { createEmployee, deleteEmployee, findEmployeeById, listEmployees, updateEmployee } from '../models/employeeModel.js';
import { fail, ok, requireFields } from '../utils/http.js';

export function index(req, res) {
  ok(res, listEmployees(req.query));
}

export function show(req, res) {
  const employee = findEmployeeById(req.params.id);
  if (!employee) return fail(res, 404, 'Employee not found');
  ok(res, employee);
}

export function create(req, res) {
  const missing = requireFields(req.body, ['name', 'role', 'dept', 'email', 'salary']);
  if (missing.length) return fail(res, 400, 'Missing required fields', { missing });

  try {
    ok(res, createEmployee(req.body), 201);
  } catch (err) {
    fail(res, 409, 'Could not create employee', err.message);
  }
}

export function update(req, res) {
  const employee = updateEmployee(req.params.id, req.body);
  if (!employee) return fail(res, 404, 'Employee not found');
  ok(res, employee);
}

export function destroy(req, res) {
  if (!deleteEmployee(req.params.id)) return fail(res, 404, 'Employee not found');
  ok(res, { id: req.params.id, deleted: true });
}
