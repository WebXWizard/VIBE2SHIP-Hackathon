/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DuplicateAnalysisResult {
  candidateId: string;
  candidateCode: string;
  title: string;
  distanceMeters: number;
  locationScore: number;
  categoryScore: number;
  textScore: number;
  timeScore: number;
  totalScore: number;
  matchType: 'STRONG' | 'POSSIBLE' | 'NONE';
  explanation: string;
}

export function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
}

function getTextSimilarity(text1: string, text2: string): number {
  const clean = (t: string) =>
    t
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3);

  const words1 = clean(text1);
  const words2 = clean(text2);

  if (words1.length === 0 || words2.length === 0) return 0;

  const s1 = new Set(words1);
  const s2 = new Set(words2);

  const intersection = new Set([...s1].filter((x) => s2.has(x)));
  const union = new Set([...s1, ...s2]);

  return intersection.size / union.size;
}

function areCategoriesRelated(cat1: string, cat2: string): boolean {
  const c1 = cat1.toUpperCase();
  const c2 = cat2.toUpperCase();

  const roads = ['POTHOLE', 'ROAD_DAMAGE'];
  const electrical = ['BROKEN_STREETLIGHT', 'ELECTRICAL_HAZARD'];
  const water = ['WATER_LEAKAGE', 'DAMAGED_PIPE', 'DRAINAGE_ISSUE'];
  const sanitation = ['GARBAGE_OVERFLOW', 'ILLEGAL_DUMPING', 'WASTE_MANAGEMENT'];

  if (roads.includes(c1) && roads.includes(c2)) return true;
  if (electrical.includes(c1) && electrical.includes(c2)) return true;
  if (water.includes(c1) && water.includes(c2)) return true;
  if (sanitation.includes(c1) && sanitation.includes(c2)) return true;

  return false;
}

export function evaluateDuplicateCandidate(
  report: { description: string; category: string; latitude: number; longitude: number; createdAt: string },
  candidate: { id: string; incidentCode: string; title: string; description: string; category: string; latitude: number; longitude: number; createdAt: string }
): DuplicateAnalysisResult {
  // 1. Location proximity: 40 percent
  const distance = getDistanceInMeters(
    report.latitude,
    report.longitude,
    candidate.latitude,
    candidate.longitude
  );

  let locationScore = 0;
  if (distance <= 10) locationScore = 40;
  else if (distance <= 25) locationScore = 30;
  else if (distance <= 50) locationScore = 20;
  else if (distance <= 100) locationScore = 10;

  // 2. Category match: 30 percent
  let categoryScore = 0;
  if (report.category.toUpperCase() === candidate.category.toUpperCase()) {
    categoryScore = 30;
  } else if (areCategoriesRelated(report.category, candidate.category)) {
    categoryScore = 15;
  }

  // 3. Text/Semantic Similarity: 20 percent
  const textSim = getTextSimilarity(report.description, candidate.description);
  const textScore = Math.round(textSim * 20);

  // 4. Time Proximity: 10 percent
  const t1 = new Date(report.createdAt).getTime();
  const t2 = new Date(candidate.createdAt).getTime();
  const diffDays = Math.abs(t1 - t2) / (1000 * 60 * 60 * 24);

  let timeScore = 0;
  if (diffDays <= 3) timeScore = 10;
  else if (diffDays <= 7) timeScore = 8;
  else if (diffDays <= 14) timeScore = 5;
  else if (diffDays <= 21) timeScore = 2;

  const totalScore = locationScore + categoryScore + textScore + timeScore;

  let matchType: 'STRONG' | 'POSSIBLE' | 'NONE' = 'NONE';
  if (totalScore >= 80) {
    matchType = 'STRONG';
  } else if (totalScore >= 60) {
    matchType = 'POSSIBLE';
  }

  // Generate transparent explanation
  let expl = `Duplicate candidate check scores: Location proximity within ${Math.round(distance)}m yields ${locationScore}/40 points. `;
  expl += `Category relationship yields ${categoryScore}/30 points. `;
  expl += `Description text similarity of ${Math.round(textSim * 100)}% yields ${textScore}/20 points. `;
  expl += `Submission time difference of ${Math.round(diffDays)} days yields ${timeScore}/10 points. `;
  expl += `Total Score: ${totalScore}/100. `;

  return {
    candidateId: candidate.id,
    candidateCode: candidate.incidentCode,
    title: candidate.title,
    distanceMeters: distance,
    locationScore,
    categoryScore,
    textScore,
    timeScore,
    totalScore,
    matchType,
    explanation: expl,
  };
}
