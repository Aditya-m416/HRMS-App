import { attendanceHeatmap, attendanceSummary, listCheckins, setCheckin, shiftSchedule } from '../models/attendanceModel.js';
import { ok } from '../utils/http.js';

export function summary(req, res) {
  ok(res, attendanceSummary());
}

export function shifts(req, res) {
  ok(res, shiftSchedule());
}

export function heatmap(req, res) {
  ok(res, attendanceHeatmap());
}

export function checkins(req, res) {
  ok(res, listCheckins());
}

export function updateCheckin(req, res) {
  ok(res, setCheckin(req.params.employeeId, Boolean(req.body.checkedIn)));
}
