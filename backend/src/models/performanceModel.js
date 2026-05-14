import { findReference } from './referenceModel.js';

export function performanceSnapshot() {
  return {
    cycles: findReference('performanceCycles', []),
    goals: findReference('goals', []),
    feedback: findReference('feedbackItems', []),
    bellCurve: findReference('bellCurveData', []),
  };
}
