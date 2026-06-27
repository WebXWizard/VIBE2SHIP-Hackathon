import assert from 'node:assert/strict';
import test from 'node:test';

import { calculatePriorityScore } from '../src/lib/scoring.ts';

test('critical hazards receive a bounded critical score', () => {
  const result = calculatePriorityScore(
    5,
    'ELECTRICAL_HAZARD',
    'Exposed cable beside a school gate',
    '',
    20,
    new Date().toISOString(),
    'EXCELLENT',
  );

  assert.equal(result.level, 'CRITICAL');
  assert.equal(result.score, 90);
  assert.equal(result.breakdown.communityConfirmationsPoints, 15);
});

test('invalidly low severity is clamped without changing score bounds', () => {
  const result = calculatePriorityScore(
    -10,
    'OTHER',
    '',
    '',
    0,
    new Date().toISOString(),
    'POOR',
  );

  assert.equal(result.level, 'LOW');
  assert.equal(result.score, 16);
  assert.equal(result.breakdown.safetySeverityPoints, 7);
});
