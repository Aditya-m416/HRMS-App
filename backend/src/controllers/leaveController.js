import {
  createLeaveRequest,
  holidays,
  leaveTypes,
  listLeaveRequests,
  setLeaveStatus,
  updateLeaveRequest,
} from '../models/leaveModel.js';
import { fail, ok, requireFields } from '../utils/http.js';

export function types(req, res) {
  ok(res, leaveTypes());
}

export function holidayList(req, res) {
  ok(res, holidays());
}

export function index(req, res) {
  ok(res, listLeaveRequests(req.query));
}

export function create(req, res) {
  const missing = requireFields(req.body, ['employee', 'type', 'from', 'to']);
  if (missing.length) return fail(res, 400, 'Missing required fields', { missing });
  ok(res, createLeaveRequest(req.body), 201);
}

export function update(req, res) {
  const request = updateLeaveRequest(req.params.id, req.body);
  if (!request) return fail(res, 404, 'Leave request not found');
  ok(res, request);
}

export function approve(req, res) {
  const request = setLeaveStatus(req.params.id, 'approved');
  if (!request) return fail(res, 404, 'Leave request not found');
  ok(res, request);
}

export function reject(req, res) {
  const request = setLeaveStatus(req.params.id, 'rejected');
  if (!request) return fail(res, 404, 'Leave request not found');
  ok(res, request);
}
