import { all, get, run } from '../config/database.js';
import { onboardingTaskFromRow } from '../utils/serializers.js';
import { findReference } from './referenceModel.js';

export function listOnboardingTasks() {
  return all('SELECT * FROM onboarding_tasks ORDER BY id').map(onboardingTaskFromRow);
}

export function toggleOnboardingTask(id) {
  const task = get('SELECT * FROM onboarding_tasks WHERE id = ?', [id]);
  if (!task) return null;
  run('UPDATE onboarding_tasks SET done = ? WHERE id = ?', [task.done ? 0 : 1, id]);
  return onboardingTaskFromRow(get('SELECT * FROM onboarding_tasks WHERE id = ?', [id]));
}

export function newJoiners() {
  return findReference('newJoiners', []);
}

export function exitEmployees() {
  return findReference('exitEmployees', []);
}
