/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScoringBreakdown {
  safetySeverityPoints: number;
  categoryBaselinePoints: number;
  locationSensitivityPoints: number;
  communityConfirmationsPoints: number;
  timeUnresolvedPoints: number;
  evidenceQualityPoints: number;
  explanations: {
    safetySeverity: string;
    categoryBaseline: string;
    locationSensitivity: string;
    communityConfirmations: string;
    timeUnresolved: string;
    evidenceQuality: string;
  };
}

export interface CalculatedPriority {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  breakdown: ScoringBreakdown;
}

export function calculatePriorityScore(
  severity: number, // 1 to 5
  category: string,
  description: string,
  landmark: string,
  confirmations: number,
  createdAtStr: string,
  evidenceQuality: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT'
): CalculatedPriority {
  // 1. Safety Severity (0 to 35 points)
  const safetySeverityPoints = Math.min(Math.max(severity, 1), 5) * 7;
  const safetySeverityExpl = `Safety severity score assigned as level ${severity} (out of 5), yielding ${safetySeverityPoints} points.`;

  // 2. Category Baseline (0 to 20 points)
  let categoryBaselinePoints = 8;
  const cat = category.toUpperCase();
  if (['WATER_LEAKAGE', 'DAMAGED_PIPE', 'ELECTRICAL_HAZARD'].includes(cat)) {
    categoryBaselinePoints = 20;
  } else if (['POTHOLE', 'ROAD_DAMAGE', 'BROKEN_STREETLIGHT'].includes(cat)) {
    categoryBaselinePoints = 18;
  } else if (['DRAINAGE_ISSUE', 'GARBAGE_OVERFLOW', 'ILLEGAL_DUMPING'].includes(cat)) {
    categoryBaselinePoints = 14;
  }
  const categoryBaselineExpl = `Baseline priority for category "${category}" yields ${categoryBaselinePoints} points.`;

  // 3. Location Sensitivity (0 to 15 points)
  let locationSensitivityPoints = 5; // Standard street or residential
  let locType = 'Standard street or residential area';
  const text = (description + ' ' + landmark).toLowerCase();
  if (
    text.includes('school') ||
    text.includes('child') ||
    text.includes('kid') ||
    text.includes('student') ||
    text.includes('hospital') ||
    text.includes('clinic') ||
    text.includes('bus stop') ||
    text.includes('bus shelter') ||
    text.includes('crossing') ||
    text.includes('gate')
  ) {
    locationSensitivityPoints = 15;
    locType = 'Near school, hospital, bus stop, or major public crossing';
  } else if (
    text.includes('market') ||
    text.includes('mall') ||
    text.includes('plaza') ||
    text.includes('downtown') ||
    text.includes('footfall') ||
    text.includes('commercial') ||
    text.includes('highway') ||
    text.includes('main road')
  ) {
    locationSensitivityPoints = 10;
    locType = 'High-footfall public or commercial area';
  } else if (text.trim() === '') {
    locationSensitivityPoints = 0;
    locType = 'Unknown location area context';
  }
  const locationSensitivityExpl = `Location class: "${locType}" yields ${locationSensitivityPoints} points.`;

  // 4. Community Confirmations (0 to 15 points)
  const communityConfirmationsPoints = Math.min(confirmations * 3, 15);
  const communityConfirmationsExpl = `${confirmations} citizen confirmations logged, yielding ${communityConfirmationsPoints} points.`;

  // 5. Time Unresolved (0 to 10 points)
  const createdTime = new Date(createdAtStr).getTime();
  const now = new Date().getTime();
  const diffHours = Math.max(0, (now - createdTime) / (1000 * 60 * 60));
  const timeUnresolvedPoints = Math.min(Math.round(diffHours * 0.2 * 10) / 10, 10);
  const timeUnresolvedExpl = `Unresolved for ${Math.round(diffHours)} hours, adding ${timeUnresolvedPoints} points.`;

  // 6. Evidence Quality (0 to 5 points)
  let evidenceQualityPoints = 2;
  const eq = (evidenceQuality || 'FAIR').toUpperCase();
  if (eq === 'EXCELLENT') {
    evidenceQualityPoints = 5;
  } else if (eq === 'GOOD') {
    evidenceQualityPoints = 4;
  } else if (eq === 'FAIR') {
    evidenceQualityPoints = 2;
  } else if (eq === 'POOR') {
    evidenceQualityPoints = 1;
  }
  const evidenceQualityExpl = `Evidence quality is rated "${eq}", yielding ${evidenceQualityPoints} points.`;

  // Calculate Total Priority Score (capped at 100)
  const totalScore = Math.min(
    100,
    safetySeverityPoints +
      categoryBaselinePoints +
      locationSensitivityPoints +
      communityConfirmationsPoints +
      timeUnresolvedPoints +
      evidenceQualityPoints
  );

  // Map to Label
  let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (totalScore >= 80) {
    level = 'CRITICAL';
  } else if (totalScore >= 60) {
    level = 'HIGH';
  } else if (totalScore >= 35) {
    level = 'MEDIUM';
  }

  return {
    score: totalScore,
    level,
    breakdown: {
      safetySeverityPoints,
      categoryBaselinePoints,
      locationSensitivityPoints,
      communityConfirmationsPoints,
      timeUnresolvedPoints,
      evidenceQualityPoints,
      explanations: {
        safetySeverity: safetySeverityExpl,
        categoryBaseline: categoryBaselineExpl,
        locationSensitivity: locationSensitivityExpl,
        communityConfirmations: communityConfirmationsExpl,
        timeUnresolved: timeUnresolvedExpl,
        evidenceQuality: evidenceQualityExpl,
      },
    },
  };
}
