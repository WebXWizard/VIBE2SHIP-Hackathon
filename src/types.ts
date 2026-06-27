/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'CITIZEN' | 'ADMIN' | 'DEPARTMENT_MANAGER';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string | null;
  photoURL?: string | null;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  supportedCategories: string[];
  slaHours: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type IncidentStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'AI_TRIAGED'
  | 'PENDING_ADMIN_REVIEW'
  | 'ASSIGNED_TO_DEPARTMENT'
  | 'ACCEPTED_BY_DEPARTMENT'
  | 'IN_PROGRESS'
  | 'RESOLUTION_EVIDENCE_SUBMITTED'
  | 'PENDING_ADMIN_VERIFICATION'
  | 'RESOLVED'
  | 'REJECTED'
  | 'DUPLICATE_MERGED'
  | 'RETURNED_TO_ADMIN'
  | 'REOPENED';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface LocationData {
  latitude: number;
  longitude: number;
  displayAddress: string;
  ward?: string | null;
}

export interface AIAnalysis {
  categoryRecommendation: string;
  confidenceScore: number; // 0 to 100
  urgencyLevel: PriorityLevel;
  safetyRiskScore: number; // 0 to 100
  recommendedDepartmentId: string;
  explanation: string;
  possibleDuplicateIds: string[];
}

export interface Incident {
  id: string;
  incidentCode: string; // e.g. CR-1024
  title: string;
  category: string;
  status: IncidentStatus;
  priorityScore: number; // 0 to 100
  priorityLevel: PriorityLevel;
  assignedDepartmentId: string | null;
  assignedDepartmentName: string | null;
  assignedOfficerId: string | null;
  location: LocationData;
  primaryImageUrl: string | null;
  aiAnalysis: AIAnalysis;
  duplicateCandidateIds: string[];
  reportCount: number;
  confirmationCount: number;
  isPublic: boolean;
  containsSensitiveContent: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  reopenedCount: number;
  isPriorityManuallyAdjusted?: boolean;
  priorityAdjustmentReason?: string | null;
  resolutionEvidenceUrl?: string | null;
}

export interface Report {
  id: string;
  incidentId: string | null;
  reporterId: string;
  description: string;
  mediaUrls: string[];
  location: LocationData;
  submittedCategory: string | null;
  aiAnalysis: AIAnalysis | null;
  visibility: 'PUBLIC' | 'PRIVATE';
  submittedAt: string;
  updatedAt: string;
}

export interface IncidentEvent {
  id: string;
  incidentId: string;
  eventType: string;
  actorId: string | null;
  actorName: string;
  actorRole: UserRole | 'SYSTEM';
  message: string;
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export interface WorkUpdate {
  id: string;
  incidentId: string;
  departmentId: string;
  authorId: string;
  authorName: string;
  note: string;
  statusAfterUpdate: IncidentStatus;
  evidenceUrls: string[];
  createdAt: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  type: string;
  title: string;
  message: string;
  incidentId: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  incidentId: string;
  requestedBy: string; // userId or deptId
  requestType: 'RESOLUTION_VERIFICATION' | 'INFO_REQUEST';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes: string | null;
  createdAt: string;
  resolvedAt: string | null;
}
