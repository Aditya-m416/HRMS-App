import { all, get, run } from '../config/database.js';
import { candidateFromRow, jobOpeningFromRow } from '../utils/serializers.js';
import { findReference } from './referenceModel.js';

export function listJobs() {
  return all('SELECT * FROM job_openings ORDER BY opened_on DESC, id DESC').map(jobOpeningFromRow);
}

export function listCandidates(filters = {}) {
  let rows = all('SELECT * FROM candidates ORDER BY score DESC, id').map(candidateFromRow);
  if (filters.stage) rows = rows.filter((item) => item.stage === filters.stage);
  if (filters.role) rows = rows.filter((item) => item.role === filters.role);
  return rows;
}

export function updateCandidateStage(id, stage) {
  const result = run('UPDATE candidates SET stage = ? WHERE id = ?', [stage, id]);
  return result.changes > 0 ? candidateFromRow(get('SELECT * FROM candidates WHERE id = ?', [id])) : null;
}

export function atsStages() {
  return findReference('atsStages', []);
}
