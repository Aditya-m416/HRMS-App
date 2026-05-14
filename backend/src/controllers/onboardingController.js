import { exitEmployees, listOnboardingTasks, newJoiners, toggleOnboardingTask } from '../models/onboardingModel.js';
import { fail, ok } from '../utils/http.js';

export function tasks(req, res) {
  ok(res, listOnboardingTasks());
}

export function toggleTask(req, res) {
  const task = toggleOnboardingTask(req.params.id);
  if (!task) return fail(res, 404, 'Onboarding task not found');
  ok(res, task);
}

export function joiners(req, res) {
  ok(res, newJoiners());
}

export function exits(req, res) {
  ok(res, exitEmployees());
}
