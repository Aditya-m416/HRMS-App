import { all, get, nextId, run, toJson } from '../config/database.js';
import { employeeFromRow } from '../utils/serializers.js';
import { today } from '../utils/date.js';

export function listEmployees(filters = {}) {
  let rows = all('SELECT * FROM employees ORDER BY id').map(employeeFromRow);
  if (filters.dept) rows = rows.filter((emp) => emp.dept === filters.dept);
  if (filters.status) rows = rows.filter((emp) => emp.status === filters.status);
  if (filters.q) {
    const term = String(filters.q).toLowerCase();
    rows = rows.filter((emp) =>
      [emp.name, emp.role, emp.dept, emp.email, emp.location].some((value) =>
        String(value || '').toLowerCase().includes(term)
      )
    );
  }
  return rows;
}

export function findEmployeeById(id) {
  return employeeFromRow(get('SELECT * FROM employees WHERE id = ?', [id]));
}

export function createEmployee(payload) {
  const id = payload.id || nextId('E', 'employees');
  const initials = payload.initials || String(payload.name).split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase();

  run(
    `INSERT INTO employees
    (id, name, role, dept, email, phone, location, status, join_date, salary, manager, reportees, avatar, initials, skills, level)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      payload.name,
      payload.role,
      payload.dept,
      payload.email,
      payload.phone || null,
      payload.location || null,
      payload.status || 'active',
      payload.joinDate || today(),
      Number(payload.salary),
      payload.manager || null,
      toJson(payload.reportees),
      payload.avatar || null,
      initials,
      toJson(payload.skills),
      payload.level || null,
    ]
  );

  return findEmployeeById(id);
}

export function updateEmployee(id, payload) {
  const existing = findEmployeeById(id);
  if (!existing) return null;

  const next = { ...existing, ...payload };
  run(
    `UPDATE employees SET
      name = ?, role = ?, dept = ?, email = ?, phone = ?, location = ?, status = ?,
      join_date = ?, salary = ?, manager = ?, reportees = ?, avatar = ?, initials = ?,
      skills = ?, level = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [
      next.name,
      next.role,
      next.dept,
      next.email,
      next.phone || null,
      next.location || null,
      next.status || 'active',
      next.joinDate || null,
      Number(next.salary || 0),
      next.manager || null,
      toJson(next.reportees),
      next.avatar || null,
      next.initials || null,
      toJson(next.skills),
      next.level || null,
      id,
    ]
  );
  return findEmployeeById(id);
}

export function deleteEmployee(id) {
  return run('DELETE FROM employees WHERE id = ?', [id]).changes > 0;
}
