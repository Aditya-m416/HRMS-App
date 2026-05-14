import { findReference } from './referenceModel.js';

export function analyticsSnapshot() {
  return {
    headcountTrend: findReference('headcountTrend', []),
    attritionData: findReference('attritionData', []),
    deptDistribution: findReference('deptDistribution', []),
    genderDiversity: findReference('genderDiversity', []),
    locationData: findReference('locationData', []),
    payrollTrend: findReference('payrollTrend', []),
    activityFeed: findReference('activityFeed', []),
  };
}
