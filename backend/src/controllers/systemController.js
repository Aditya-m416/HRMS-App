import { seed } from '../database/seed.js';
import { findReference } from '../models/referenceModel.js';
import { fail, ok } from '../utils/http.js';

export function root(req, res) {
  ok(res, {
    service: 'nexushr-api',
    status: 'running',
    message: 'Use /api routes for backend resources.',
    routes: {
      health: '/api/health',
      employees: '/api/employees',
      payroll: '/api/payroll/runs',
      leave: '/api/leave/requests',
      analytics: '/api/analytics',
    },
  });
}

export function health(req, res) {
  ok(res, {
    status: 'ok',
    service: 'nexushr-api',
    database: 'sqlite',
    timestamp: new Date().toISOString(),
  });
}

export function referenceByKey(req, res) {
  const value = findReference(req.params.key);
  if (value === null) return fail(res, 404, 'Reference data not found');
  ok(res, value);
}

export function departments(req, res) {
  ok(res, findReference('departments', []));
}

export function reseed(req, res) {
  if (process.env.NODE_ENV === 'production') return fail(res, 403, 'Reseed is disabled in production');
  seed({ force: true });
  ok(res, { reseeded: true });
}
