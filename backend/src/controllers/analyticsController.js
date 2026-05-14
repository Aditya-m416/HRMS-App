import { analyticsSnapshot } from '../models/analyticsModel.js';
import { ok } from '../utils/http.js';

export function index(req, res) {
  ok(res, analyticsSnapshot());
}
