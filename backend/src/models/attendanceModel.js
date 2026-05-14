import { all, get, run } from '../config/database.js';
import { findReference } from './referenceModel.js';

export function attendanceSummary() {
  return findReference('attendanceSummary', {});
}

export function shiftSchedule() {
  return findReference('shiftSchedule', []);
}

export function attendanceHeatmap() {
  const statuses = ['present', 'present', 'present', 'present', 'present', 'weekend', 'weekend', 'absent', 'leave'];
  return Array.from({ length: 31 }, (_, index) => ({
    day: index + 1,
    status: statuses[(index * 7 + 3) % statuses.length],
  }));
}

export function listCheckins() {
  return all('SELECT * FROM attendance_checkins ORDER BY employee_id');
}

export function setCheckin(employeeId, checkedIn) {
  run(
    `INSERT INTO attendance_checkins (employee_id, checked_in, checked_in_at, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(employee_id) DO UPDATE SET
      checked_in = excluded.checked_in,
      checked_in_at = excluded.checked_in_at,
      updated_at = CURRENT_TIMESTAMP`,
    [employeeId, checkedIn ? 1 : 0, checkedIn ? new Date().toISOString() : null]
  );
  return get('SELECT * FROM attendance_checkins WHERE employee_id = ?', [employeeId]);
}
