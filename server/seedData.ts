/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Department, Incident, Report, UserProfile, IncidentEvent, IncidentStatus, PriorityLevel } from '../src/types';

export const DEPARTMENTS_SEED: Department[] = [
  {
    id: 'roads',
    name: 'Roads & Maintenance',
    supportedCategories: ['POTHOLE', 'ROAD_DAMAGE'],
    slaHours: 72,
    description: 'Handles potholes, road damage, asphalt repairs, and public pathways.',
    isActive: true,
    createdAt: new Date('2026-01-01').toISOString(),
    updatedAt: new Date('2026-01-01').toISOString()
  },
  {
    id: 'electrical',
    name: 'Electrical Services',
    supportedCategories: ['BROKEN_STREETLIGHT', 'ELECTRICAL_HAZARD'],
    slaHours: 120,
    description: 'Responsible for streetlighting, exposed wiring, traffic signals, and electrical hazards.',
    isActive: true,
    createdAt: new Date('2026-01-01').toISOString(),
    updatedAt: new Date('2026-01-01').toISOString()
  },
  {
    id: 'water',
    name: 'Water Services',
    supportedCategories: ['WATER_LEAKAGE', 'DAMAGED_PIPE', 'DRAINAGE_ISSUE'],
    slaHours: 24,
    description: 'Manages burst pipes, water mains, drainage blockages, and clean water leakage.',
    isActive: true,
    createdAt: new Date('2026-01-01').toISOString(),
    updatedAt: new Date('2026-01-01').toISOString()
  },
  {
    id: 'sanitation',
    name: 'Sanitation Department',
    supportedCategories: ['GARBAGE_OVERFLOW', 'ILLEGAL_DUMPING', 'WASTE_MANAGEMENT'],
    slaHours: 48,
    description: 'Maintains city cleanliness, garbage collection, illegal dumping removal, and waste bins.',
    isActive: true,
    createdAt: new Date('2026-01-01').toISOString(),
    updatedAt: new Date('2026-01-01').toISOString()
  },
  {
    id: 'general',
    name: 'General Administration',
    supportedCategories: ['OTHER', 'UNCLEAR'],
    slaHours: 96,
    description: 'General municipal issues, policy queries, or complex issues spanning multiple departments.',
    isActive: true,
    createdAt: new Date('2026-01-01').toISOString(),
    updatedAt: new Date('2026-01-01').toISOString()
  }
];

export const USERS_SEED: UserProfile[] = [
  {
    uid: 'demo-citizen-id',
    name: 'Sarah Jenkins',
    email: 'citizen@civicresolve.demo',
    role: 'CITIZEN',
    createdAt: new Date('2026-02-15').toISOString(),
    updatedAt: new Date('2026-02-15').toISOString(),
    isActive: true
  },
  {
    uid: 'demo-admin-id',
    name: 'Chief Inspector Arthur Pendelton',
    email: 'admin@civicresolve.demo',
    role: 'ADMIN',
    createdAt: new Date('2026-01-10').toISOString(),
    updatedAt: new Date('2026-01-10').toISOString(),
    isActive: true
  },
  {
    uid: 'demo-roads-id',
    name: 'Marcus Vance',
    email: 'roads@civicresolve.demo',
    role: 'DEPARTMENT_MANAGER',
    departmentId: 'roads',
    createdAt: new Date('2026-01-15').toISOString(),
    updatedAt: new Date('2026-01-15').toISOString(),
    isActive: true
  },
  {
    uid: 'demo-water-id',
    name: 'Elena Rostova',
    email: 'water@civicresolve.demo',
    role: 'DEPARTMENT_MANAGER',
    departmentId: 'water',
    createdAt: new Date('2026-01-15').toISOString(),
    updatedAt: new Date('2026-01-15').toISOString(),
    isActive: true
  },
  {
    uid: 'demo-electrical-id',
    name: 'Thomas Edison Jr',
    email: 'electrical@civicresolve.demo',
    role: 'DEPARTMENT_MANAGER',
    departmentId: 'electrical',
    createdAt: new Date('2026-01-15').toISOString(),
    updatedAt: new Date('2026-01-15').toISOString(),
    isActive: true
  },
  {
    uid: 'demo-sanitation-id',
    name: 'Frank Cleanwood',
    email: 'sanitation@civicresolve.demo',
    role: 'DEPARTMENT_MANAGER',
    departmentId: 'sanitation',
    createdAt: new Date('2026-01-15').toISOString(),
    updatedAt: new Date('2026-01-15').toISOString(),
    isActive: true
  }
];

// Helper to generate IDs
const generateId = (prefix: string, num: number) => `${prefix}-${num}`;

export const INCIDENTS_SEED: Incident[] = [
  {
    id: 'inc-pothole-school',
    incidentCode: 'CR-1001',
    title: 'Severe Deep Pothole Near Oakwood Elementary School Crosswalk',
    category: 'POTHOLE',
    status: 'PENDING_ADMIN_REVIEW',
    priorityScore: 88,
    priorityLevel: 'CRITICAL',
    assignedDepartmentId: 'roads',
    assignedDepartmentName: 'Roads & Maintenance',
    assignedOfficerId: null,
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      displayAddress: '350 Oakwood Street, near School Main Gate',
      ward: 'Ward 4 - Education District'
    },
    primaryImageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      categoryRecommendation: 'POTHOLE',
      confidenceScore: 95,
      urgencyLevel: 'CRITICAL',
      safetyRiskScore: 90,
      recommendedDepartmentId: 'roads',
      explanation: 'The pothole is directly in front of an elementary school pedestrian crosswalk, presenting an immediate safety risk to children, parents, and school buses.',
      possibleDuplicateIds: []
    },
    duplicateCandidateIds: [],
    reportCount: 3,
    confirmationCount: 12,
    isPublic: true,
    containsSensitiveContent: false,
    createdAt: new Date('2026-06-20T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-06-24T14:30:00Z').toISOString(),
    resolvedAt: null,
    reopenedCount: 0
  },
  {
    id: 'inc-streetlight-resolved',
    incidentCode: 'CR-1002',
    title: 'Completely Dark Streetlight Block on Elm Street',
    category: 'BROKEN_STREETLIGHT',
    status: 'RESOLVED',
    priorityScore: 45,
    priorityLevel: 'MEDIUM',
    assignedDepartmentId: 'electrical',
    assignedDepartmentName: 'Electrical Services',
    assignedOfficerId: 'demo-electrical-id',
    location: {
      latitude: 37.7801,
      longitude: -122.4125,
      displayAddress: '1240 Elm Street, between 12th & 14th Ave',
      ward: 'Ward 2 - Central Hill'
    },
    primaryImageUrl: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      categoryRecommendation: 'BROKEN_STREETLIGHT',
      confidenceScore: 89,
      urgencyLevel: 'MEDIUM',
      safetyRiskScore: 40,
      recommendedDepartmentId: 'electrical',
      explanation: 'Multiple non-functioning streetlights make the block extremely dark, increasing petty crime risk but not representing an active immediate hazard.',
      possibleDuplicateIds: []
    },
    duplicateCandidateIds: [],
    reportCount: 1,
    confirmationCount: 4,
    isPublic: true,
    containsSensitiveContent: false,
    createdAt: new Date('2026-06-15T21:30:00Z').toISOString(),
    updatedAt: new Date('2026-06-18T16:00:00Z').toISOString(),
    resolvedAt: new Date('2026-06-18T16:00:00Z').toISOString(),
    reopenedCount: 0
  },
  {
    id: 'inc-water-leakage',
    incidentCode: 'CR-1003',
    title: 'Gushing Fresh Water Leakage from Main Line under Sidewalk',
    category: 'WATER_LEAKAGE',
    status: 'IN_PROGRESS',
    priorityScore: 78,
    priorityLevel: 'HIGH',
    assignedDepartmentId: 'water',
    assignedDepartmentName: 'Water Services',
    assignedOfficerId: 'demo-water-id',
    location: {
      latitude: 37.7699,
      longitude: -122.4468,
      displayAddress: 'Pine Boulevard & 20th Street intersection',
      ward: 'Ward 7 - West End'
    },
    primaryImageUrl: 'https://images.unsplash.com/photo-1542013936693-8848e5744a70?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      categoryRecommendation: 'WATER_LEAKAGE',
      confidenceScore: 97,
      urgencyLevel: 'HIGH',
      safetyRiskScore: 60,
      recommendedDepartmentId: 'water',
      explanation: 'Potable water is gushing out rapidly, flooding the sidewalk and wasting clean water, with moderate erosion risk under the concrete.',
      possibleDuplicateIds: []
    },
    duplicateCandidateIds: [],
    reportCount: 2,
    confirmationCount: 8,
    isPublic: true,
    containsSensitiveContent: false,
    createdAt: new Date('2026-06-22T08:15:00Z').toISOString(),
    updatedAt: new Date('2026-06-23T11:00:00Z').toISOString(),
    resolvedAt: null,
    reopenedCount: 0
  },
  {
    id: 'inc-garbage-overflow',
    incidentCode: 'CR-1004',
    title: 'Massive Commercial Garbage Overflow Behind Market Square Mall',
    category: 'GARBAGE_OVERFLOW',
    status: 'RESOLUTION_EVIDENCE_SUBMITTED',
    priorityScore: 55,
    priorityLevel: 'MEDIUM',
    assignedDepartmentId: 'sanitation',
    assignedDepartmentName: 'Sanitation Department',
    assignedOfficerId: 'demo-sanitation-id',
    location: {
      latitude: 37.7854,
      longitude: -122.4008,
      displayAddress: 'Market Square Service Alleyway, near loading dock B',
      ward: 'Ward 1 - Downtown Commercial'
    },
    primaryImageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      categoryRecommendation: 'GARBAGE_OVERFLOW',
      confidenceScore: 92,
      urgencyLevel: 'MEDIUM',
      safetyRiskScore: 50,
      recommendedDepartmentId: 'sanitation',
      explanation: 'Uncollected refuse is rotting, causing bad odors and attracting pests (rats/birds). It constitutes a health hazard but is confined to the alley.',
      possibleDuplicateIds: []
    },
    duplicateCandidateIds: [],
    reportCount: 1,
    confirmationCount: 5,
    isPublic: true,
    containsSensitiveContent: false,
    createdAt: new Date('2026-06-21T14:20:00Z').toISOString(),
    updatedAt: new Date('2026-06-24T09:15:00Z').toISOString(),
    resolvedAt: null,
    reopenedCount: 0
  },
  {
    id: 'inc-illegal-dumping',
    incidentCode: 'CR-1005',
    title: 'Illegal Dumping of Dangerous Construction Waste and Asbestos Tiles',
    category: 'ILLEGAL_DUMPING',
    status: 'ACCEPTED_BY_DEPARTMENT',
    priorityScore: 82,
    priorityLevel: 'HIGH',
    assignedDepartmentId: 'sanitation',
    assignedDepartmentName: 'Sanitation Department',
    assignedOfficerId: 'demo-sanitation-id',
    location: {
      latitude: 37.7532,
      longitude: -122.4312,
      displayAddress: 'Greenwood Park North Perimeter Trail',
      ward: 'Ward 5 - Parks & Recreation'
    },
    primaryImageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      categoryRecommendation: 'ILLEGAL_DUMPING',
      confidenceScore: 94,
      urgencyLevel: 'HIGH',
      safetyRiskScore: 85,
      recommendedDepartmentId: 'sanitation',
      explanation: 'Dumping contains construction debris and high risk of loose asbestos materials. Poses direct respiratory hazards to park visitors and children.',
      possibleDuplicateIds: []
    },
    duplicateCandidateIds: [],
    reportCount: 1,
    confirmationCount: 3,
    isPublic: true,
    containsSensitiveContent: false,
    createdAt: new Date('2026-06-23T06:45:00Z').toISOString(),
    updatedAt: new Date('2026-06-24T12:00:00Z').toISOString(),
    resolvedAt: null,
    reopenedCount: 0
  },
  // We will seed another 15 incidents to hit the 20 mark! We can auto-generate or code them.
  // Let's add them systematically in seedData to fulfill "at least 20 incidents", "3 duplicate examples", "3 resolved", "5 critical/high"
  {
    id: 'inc-pothole-dup1',
    incidentCode: 'CR-1006',
    title: 'Tire Damaging Pothole in Middle of Highway Lane',
    category: 'ROAD_DAMAGE',
    status: 'ASSIGNED_TO_DEPARTMENT',
    priorityScore: 75,
    priorityLevel: 'HIGH',
    assignedDepartmentId: 'roads',
    assignedDepartmentName: 'Roads & Maintenance',
    assignedOfficerId: null,
    location: {
      latitude: 37.7412,
      longitude: -122.4215,
      displayAddress: 'Highway 101 Southbound, near Exit 42',
      ward: 'Ward 9 - Highways'
    },
    primaryImageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      categoryRecommendation: 'ROAD_DAMAGE',
      confidenceScore: 88,
      urgencyLevel: 'HIGH',
      safetyRiskScore: 80,
      recommendedDepartmentId: 'roads',
      explanation: 'High speed traffic hitting a deep pothole poses extreme risk of vehicle loss of control and pileup.',
      possibleDuplicateIds: []
    },
    duplicateCandidateIds: [],
    reportCount: 1,
    confirmationCount: 2,
    isPublic: true,
    containsSensitiveContent: false,
    createdAt: new Date('2026-06-24T05:00:00Z').toISOString(),
    updatedAt: new Date('2026-06-24T05:00:00Z').toISOString(),
    resolvedAt: null,
    reopenedCount: 0
  },
  {
    id: 'inc-electrical-hazard',
    incidentCode: 'CR-1007',
    title: 'Exposed Live Wires from Damaged Junction Box on Sidewalk',
    category: 'ELECTRICAL_HAZARD',
    status: 'ACCEPTED_BY_DEPARTMENT',
    priorityScore: 92,
    priorityLevel: 'CRITICAL',
    assignedDepartmentId: 'electrical',
    assignedDepartmentName: 'Electrical Services',
    assignedOfficerId: null,
    location: {
      latitude: 37.7612,
      longitude: -122.4354,
      displayAddress: '890 Castro Street, in front of Metro Station',
      ward: 'Ward 3 - Castro Commercial'
    },
    primaryImageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      categoryRecommendation: 'ELECTRICAL_HAZARD',
      confidenceScore: 98,
      urgencyLevel: 'CRITICAL',
      safetyRiskScore: 95,
      recommendedDepartmentId: 'electrical',
      explanation: 'Exposed live wiring in a heavily trafficked pedestrian area during high humidity. Immediate fatal electrocution hazard.',
      possibleDuplicateIds: []
    },
    duplicateCandidateIds: [],
    reportCount: 2,
    confirmationCount: 14,
    isPublic: true,
    containsSensitiveContent: false,
    createdAt: new Date('2026-06-23T18:30:00Z').toISOString(),
    updatedAt: new Date('2026-06-24T08:00:00Z').toISOString(),
    resolvedAt: null,
    reopenedCount: 0
  },
  {
    id: 'inc-resolved-water',
    incidentCode: 'CR-1008',
    title: 'Burst Water Pipe Flooding Residential Front Yards',
    category: 'WATER_LEAKAGE',
    status: 'RESOLVED',
    priorityScore: 80,
    priorityLevel: 'HIGH',
    assignedDepartmentId: 'water',
    assignedDepartmentName: 'Water Services',
    assignedOfficerId: 'demo-water-id',
    location: {
      latitude: 37.7315,
      longitude: -122.4611,
      displayAddress: '423 Orchid Court, residential cul-de-sac',
      ward: 'Ward 6 - Orchard Suburbs'
    },
    primaryImageUrl: 'https://images.unsplash.com/photo-1542013936693-8848e5744a70?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      categoryRecommendation: 'WATER_LEAKAGE',
      confidenceScore: 96,
      urgencyLevel: 'HIGH',
      safetyRiskScore: 70,
      recommendedDepartmentId: 'water',
      explanation: 'Flooding poses immediate risk of property damage to basement levels and structural soil settling.',
      possibleDuplicateIds: []
    },
    duplicateCandidateIds: [],
    reportCount: 1,
    confirmationCount: 6,
    isPublic: true,
    containsSensitiveContent: false,
    createdAt: new Date('2026-06-10T08:00:00Z').toISOString(),
    updatedAt: new Date('2026-06-12T15:30:00Z').toISOString(),
    resolvedAt: new Date('2026-06-12T15:30:00Z').toISOString(),
    reopenedCount: 0
  },
  {
    id: 'inc-resolved-sanitation',
    incidentCode: 'CR-1009',
    title: 'Dead Animal Carcass Blocking Sidewalk Near Bus Stop',
    category: 'WASTE_MANAGEMENT',
    status: 'RESOLVED',
    priorityScore: 70,
    priorityLevel: 'HIGH',
    assignedDepartmentId: 'sanitation',
    assignedDepartmentName: 'Sanitation Department',
    assignedOfficerId: 'demo-sanitation-id',
    location: {
      latitude: 37.7915,
      longitude: -122.3988,
      displayAddress: 'Broadway & Sansome St Bus Shelter',
      ward: 'Ward 1 - Downtown Commercial'
    },
    primaryImageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      categoryRecommendation: 'WASTE_MANAGEMENT',
      confidenceScore: 99,
      urgencyLevel: 'HIGH',
      safetyRiskScore: 75,
      recommendedDepartmentId: 'sanitation',
      explanation: 'Biological hazard directly in front of public transit boarding point. Attracts pests and represents disease transmission vector.',
      possibleDuplicateIds: []
    },
    duplicateCandidateIds: [],
    reportCount: 1,
    confirmationCount: 3,
    isPublic: true,
    containsSensitiveContent: false,
    createdAt: new Date('2026-06-14T07:15:00Z').toISOString(),
    updatedAt: new Date('2026-06-14T11:45:00Z').toISOString(),
    resolvedAt: new Date('2026-06-14T11:45:00Z').toISOString(),
    reopenedCount: 0
  },
  {
    id: 'inc-drainage-block',
    incidentCode: 'CR-1010',
    title: 'Completely Blocked Storm Drain Causing Street Inundation',
    category: 'DRAINAGE_ISSUE',
    status: 'IN_PROGRESS',
    priorityScore: 74,
    priorityLevel: 'HIGH',
    assignedDepartmentId: 'water',
    assignedDepartmentName: 'Water Services',
    assignedOfficerId: null,
    location: {
      latitude: 37.7482,
      longitude: -122.4589,
      displayAddress: '150 Forest Hill Road, near curve',
      ward: 'Ward 6 - Orchard Suburbs'
    },
    primaryImageUrl: 'https://images.unsplash.com/photo-1542013936693-8848e5744a70?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      categoryRecommendation: 'DRAINAGE_ISSUE',
      confidenceScore: 92,
      urgencyLevel: 'HIGH',
      safetyRiskScore: 65,
      recommendedDepartmentId: 'water',
      explanation: 'Drain blockage is causing 6-inch deep pooling across half the road, creating a severe hydroplaning hazard for fast moving traffic.',
      possibleDuplicateIds: []
    },
    duplicateCandidateIds: [],
    reportCount: 1,
    confirmationCount: 4,
    isPublic: true,
    containsSensitiveContent: false,
    createdAt: new Date('2026-06-24T01:00:00Z').toISOString(),
    updatedAt: new Date('2026-06-24T15:00:00Z').toISOString(),
    resolvedAt: null,
    reopenedCount: 0
  }
];

// Let's add 10 more short incident definitions to reach exactly 20 seed incidents.
// To keep things clean, we will populate them programmatically in seedData or expand the list here. Let's expand the list directly so types are checked.
const remainingTitles = [
  { title: 'Damaged Guardrail on Mountain Pass Viewpoint', cat: 'ROAD_DAMAGE', dept: 'roads', priority: 'HIGH', status: 'AI_TRIAGED', score: 72 },
  { title: 'Sinking Manhole Cover Creating High Impact Hole', cat: 'POTHOLE', dept: 'roads', priority: 'MEDIUM', status: 'PENDING_ADMIN_REVIEW', score: 58 },
  { title: 'Flickering Streetlight in Dark Alley near Housing Block', cat: 'BROKEN_STREETLIGHT', dept: 'electrical', priority: 'LOW', status: 'AI_TRIAGED', score: 28 },
  { title: 'Exposed High Voltage Transformer Box Door Open', cat: 'ELECTRICAL_HAZARD', dept: 'electrical', priority: 'CRITICAL', status: 'PENDING_ADMIN_REVIEW', score: 94 },
  { title: 'Clogged Drainage Ditch Flooding Sidewalk Lane', cat: 'DRAINAGE_ISSUE', dept: 'water', priority: 'MEDIUM', status: 'SUBMITTED', score: 48 },
  { title: 'Low Water Pressure and Discolored Water across Block', cat: 'DAMAGED_PIPE', dept: 'water', priority: 'MEDIUM', status: 'SUBMITTED', score: 52 },
  { title: 'illegal Garbage Dumping of Industrial Tires in Forest', cat: 'ILLEGAL_DUMPING', dept: 'sanitation', priority: 'HIGH', status: 'SUBMITTED', score: 76 },
  { title: 'Full Public Trash Cans Littering Main Tourist Boulevard', cat: 'GARBAGE_OVERFLOW', dept: 'sanitation', priority: 'MEDIUM', status: 'SUBMITTED', score: 40 },
  { title: 'Abandoned Vandalized Shopping Carts in Waterway Creek', cat: 'WASTE_MANAGEMENT', dept: 'sanitation', priority: 'LOW', status: 'DRAFT', score: 20 },
  { title: 'Unknown Foul Chemical Smell from Storm Drain Outlet', cat: 'OTHER', dept: 'general', priority: 'HIGH', status: 'AI_TRIAGED', score: 80 }
];

remainingTitles.forEach((item, index) => {
  const codeNum = 1011 + index;
  INCIDENTS_SEED.push({
    id: `inc-rem-${codeNum}`,
    incidentCode: `CR-${codeNum}`,
    title: item.title,
    category: item.cat,
    status: item.status as IncidentStatus,
    priorityScore: item.score,
    priorityLevel: item.priority as PriorityLevel,
    assignedDepartmentId: item.dept,
    assignedDepartmentName: DEPARTMENTS_SEED.find(d => d.id === item.dept)?.name || 'General Administration',
    assignedOfficerId: null,
    location: {
      latitude: 37.74 + (index * 0.005),
      longitude: -122.42 - (index * 0.005),
      displayAddress: `Street Address ${codeNum}, Ward ${1 + (index % 5)}`,
      ward: `Ward ${1 + (index % 5)}`
    },
    primaryImageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80',
    aiAnalysis: {
      categoryRecommendation: item.cat,
      confidenceScore: 85 + (index % 10),
      urgencyLevel: item.priority as PriorityLevel,
      safetyRiskScore: item.score,
      recommendedDepartmentId: item.dept,
      explanation: `Gemini automatic review of "${item.title}". Highly recommended routing to ${item.dept} department due to domain expertise.`,
      possibleDuplicateIds: []
    },
    duplicateCandidateIds: [],
    reportCount: 1,
    confirmationCount: 1 + (index % 3),
    isPublic: true,
    containsSensitiveContent: false,
    createdAt: new Date('2026-06-24T11:00:00Z').toISOString(),
    updatedAt: new Date('2026-06-24T11:00:00Z').toISOString(),
    resolvedAt: null,
    reopenedCount: 0
  });
});

export const REPORTS_SEED: Report[] = [
  {
    id: 'rep-pothole-1',
    incidentId: 'inc-pothole-school',
    reporterId: 'demo-citizen-id',
    description: 'Enormous pothole right at the crosswalk in front of Oakwood School. My daughter almost tripped over it today. This is incredibly dangerous for kids!',
    mediaUrls: ['https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80'],
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      displayAddress: '350 Oakwood Street, near School Main Gate',
      ward: 'Ward 4 - Education District'
    },
    submittedCategory: 'POTHOLE',
    aiAnalysis: {
      categoryRecommendation: 'POTHOLE',
      confidenceScore: 98,
      urgencyLevel: 'CRITICAL',
      safetyRiskScore: 90,
      recommendedDepartmentId: 'roads',
      explanation: 'Pothole at school pedestrian crosswalk has severe safety risks for minors.',
      possibleDuplicateIds: []
    },
    visibility: 'PUBLIC',
    submittedAt: new Date('2026-06-20T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-06-20T10:00:00Z').toISOString()
  },
  {
    id: 'rep-pothole-dup-2',
    incidentId: 'inc-pothole-school',
    reporterId: 'demo-citizen-id',
    description: 'Giant crater near the school crosswalk. Cars are swerving onto the opposite lane to avoid it, which is high risk during morning school drop-off hours.',
    mediaUrls: ['https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80'],
    location: {
      latitude: 37.7750,
      longitude: -122.4193,
      displayAddress: 'Oakwood Street Crossing',
      ward: 'Ward 4 - Education District'
    },
    submittedCategory: 'POTHOLE',
    aiAnalysis: {
      categoryRecommendation: 'POTHOLE',
      confidenceScore: 95,
      urgencyLevel: 'CRITICAL',
      safetyRiskScore: 92,
      recommendedDepartmentId: 'roads',
      explanation: 'Similar reports submitted at Oakwood school crosswalk.',
      possibleDuplicateIds: ['inc-pothole-school']
    },
    visibility: 'PUBLIC',
    submittedAt: new Date('2026-06-21T08:30:00Z').toISOString(),
    updatedAt: new Date('2026-06-21T08:30:00Z').toISOString()
  },
  {
    id: 'rep-pothole-dup-3',
    incidentId: 'inc-pothole-school',
    reporterId: 'demo-citizen-id',
    description: 'Large hole at Oakwood crosswalk, a bike tire got stuck in it and the rider fell. Needs emergency repair patch ASAP!',
    mediaUrls: ['https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80'],
    location: {
      latitude: 37.7748,
      longitude: -122.4195,
      displayAddress: '350 Oakwood Street',
      ward: 'Ward 4 - Education District'
    },
    submittedCategory: 'POTHOLE',
    aiAnalysis: {
      categoryRecommendation: 'POTHOLE',
      confidenceScore: 97,
      urgencyLevel: 'CRITICAL',
      safetyRiskScore: 95,
      recommendedDepartmentId: 'roads',
      explanation: 'Reported accident caused by the same pothole near Oakwood Elementary School.',
      possibleDuplicateIds: ['inc-pothole-school']
    },
    visibility: 'PUBLIC',
    submittedAt: new Date('2026-06-22T11:15:00Z').toISOString(),
    updatedAt: new Date('2026-06-22T11:15:00Z').toISOString()
  }
];

export const EVENTS_SEED: IncidentEvent[] = [
  {
    id: 'evt-1',
    incidentId: 'inc-pothole-school',
    eventType: 'REPORT_SUBMITTED',
    actorId: 'demo-citizen-id',
    actorName: 'Sarah Jenkins',
    actorRole: 'CITIZEN',
    message: 'Report CR-1001 submitted by citizen.',
    createdAt: new Date('2026-06-20T10:00:00Z').toISOString()
  },
  {
    id: 'evt-2',
    incidentId: 'inc-pothole-school',
    eventType: 'AI_ANALYSIS_COMPLETED',
    actorId: null,
    actorName: 'CivicResolve AI Core',
    actorRole: 'SYSTEM',
    message: 'AI analyzed report description: Recommended Category: POTHOLE, Severity: CRITICAL (Safety risk score: 90/100). Auto-assigned target department: Roads & Maintenance.',
    createdAt: new Date('2026-06-20T10:01:00Z').toISOString()
  },
  {
    id: 'evt-3',
    incidentId: 'inc-pothole-school',
    eventType: 'ADMIN_VERIFIED',
    actorId: 'demo-admin-id',
    actorName: 'Arthur Pendelton',
    actorRole: 'ADMIN',
    message: 'Admin validated category and prioritized the incident as CRITICAL due to vicinity of school pedagogy.',
    createdAt: new Date('2026-06-20T14:30:00Z').toISOString()
  }
];
