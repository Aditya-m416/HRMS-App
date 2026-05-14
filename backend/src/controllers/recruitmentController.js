import { atsStages, listCandidates, listJobs, updateCandidateStage } from '../models/recruitmentModel.js';
import { fail, ok } from '../utils/http.js';

export function jobs(req, res) {
  ok(res, listJobs());
}

export function candidates(req, res) {
  ok(res, listCandidates(req.query));
}

export function updateStage(req, res) {
  if (!req.body.stage) return fail(res, 400, 'Stage is required');
  const candidate = updateCandidateStage(req.params.id, req.body.stage);
  if (!candidate) return fail(res, 404, 'Candidate not found');
  ok(res, candidate);
}

export function stages(req, res) {
  ok(res, atsStages());
}
