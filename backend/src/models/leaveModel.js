import { all, get, nextId, run } from '../config/database.js';
import { leaveRequestFromRow } from '../utils/serializers.js';
import { today } from '../utils/date.js';
import { findReference } from './referenceModel.js';

export function listLeaveRequests(filters = {}) {
  let rows = all('SELECT * FROM leave_requests ORDER BY applied_on DESC, id DESC').map(leaveRequestFromRow);
  if (filters.employee) rows = rows.filter((item) => item.employee === filters.employee);
  if (filters.status) rows = rows.filter((item) => item.status === filters.status);
  return rows;
}

export function createLeaveRequest(payload) {
  const from = new Date(payload.from);
  const to = new Date(payload.to);
  const days = payload.days || Math.max(1, Math.round((to - from) / 86400000) + 1);
  const id = nextId('LR', 'leave_requests');

  run(
    `INSERT INTO leave_requests
    (id, employee, type, from_date, to_date, days, reason, status, applied_on)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, payload.employee, payload.type, payload.from, payload.to, days, payload.reason || '', 'pending', today()]
  );
  return findLeaveRequest(id);
}

export function findLeaveRequest(id) {
  return leaveRequestFromRow(get('SELECT * FROM leave_requests WHERE id = ?', [id]));
}

export function updateLeaveRequest(id, payload) {
  const current = findLeaveRequest(id);
  if (!current) return null;
  const next = { ...current, ...payload };
  run(
    `UPDATE leave_requests SET
      employee = ?, type = ?, from_date = ?, to_date = ?, days = ?, reason = ?,
      status = ?, decided_on = ?
    WHERE id = ?`,
    [
      next.employee,
      next.type,
      next.from,
      next.to,
      Number(next.days),
      next.reason || '',
      next.status,
      next.status !== current.status ? today() : current.decidedOn,
      id,
    ]
  );
  return findLeaveRequest(id);
}

export function setLeaveStatus(id, status) {
  const result = run('UPDATE leave_requests SET status = ?, decided_on = ? WHERE id = ?', [status, today(), id]);
  return result.changes > 0 ? findLeaveRequest(id) : null;
}

export function leaveTypes() {
  return findReference('leaveTypes', []);
}

export function holidays() {
  return findReference('holidays', []);
}
