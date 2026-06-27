import assert from 'node:assert/strict';
import test from 'node:test';

import { evaluateDuplicateCandidate, getDistanceInMeters } from '../src/lib/duplicates.ts';

test('distance is zero for identical coordinates', () => {
  assert.equal(getDistanceInMeters(28.6139, 77.209, 28.6139, 77.209), 0);
});

test('nearby matching reports are classified as strong duplicates', () => {
  const createdAt = '2026-06-27T00:00:00.000Z';
  const result = evaluateDuplicateCandidate(
    {
      description: 'Large pothole blocking the main road',
      category: 'POTHOLE',
      latitude: 28.6139,
      longitude: 77.209,
      createdAt,
    },
    {
      id: 'incident-1',
      incidentCode: 'CR-001',
      title: 'Main road pothole',
      description: 'Large pothole blocking the main road',
      category: 'POTHOLE',
      latitude: 28.6139,
      longitude: 77.209,
      createdAt,
    },
  );

  assert.equal(result.totalScore, 100);
  assert.equal(result.matchType, 'STRONG');
});
