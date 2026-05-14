import { performanceSnapshot } from '../models/performanceModel.js';
import { ok } from '../utils/http.js';

export function index(req, res) {
  ok(res, performanceSnapshot());
}
