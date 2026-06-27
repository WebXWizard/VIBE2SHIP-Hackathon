import { AlertTriangle, CheckCircle2, CircleDot, Clock3, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import type { IncidentStatus, PriorityLevel } from '../../types';

const statusTone: Record<IncidentStatus, string> = {
  DRAFT: 'civic-status-neutral',
  SUBMITTED: 'civic-status-info',
  AI_TRIAGED: 'civic-status-ai',
  PENDING_ADMIN_REVIEW: 'civic-status-warning',
  ASSIGNED_TO_DEPARTMENT: 'civic-status-info',
  ACCEPTED_BY_DEPARTMENT: 'civic-status-info',
  IN_PROGRESS: 'civic-status-warning',
  RESOLUTION_EVIDENCE_SUBMITTED: 'civic-status-ai',
  PENDING_ADMIN_VERIFICATION: 'civic-status-warning',
  RESOLVED: 'civic-status-success',
  REJECTED: 'civic-status-critical',
  DUPLICATE_MERGED: 'civic-status-neutral',
  RETURNED_TO_ADMIN: 'civic-status-critical',
  REOPENED: 'civic-status-critical',
};

const priorityTone: Record<PriorityLevel, string> = {
  LOW: 'civic-status-neutral',
  MEDIUM: 'civic-status-info',
  HIGH: 'civic-status-warning',
  CRITICAL: 'civic-status-critical',
};

export function StatusBadge({ status }: { status: IncidentStatus }) {
  const Icon = status === 'RESOLVED'
    ? CheckCircle2
    : status === 'REJECTED' || status === 'REOPENED'
      ? AlertTriangle
      : status === 'AI_TRIAGED' || status === 'RESOLUTION_EVIDENCE_SUBMITTED'
        ? Sparkles
        : CircleDot;

  return (
    <span className={`civic-status-badge ${statusTone[status]}`}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function PriorityIndicator({ level, score }: { level: PriorityLevel; score?: number }) {
  return (
    <span className={`civic-priority-badge ${priorityTone[level]}`}>
      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
      {level}{typeof score === 'number' ? ` · ${score}` : ''}
    </span>
  );
}

export function SLAIndicator({ hours }: { hours: number }) {
  const tone = hours < 0 ? 'civic-status-critical' : hours <= 12 ? 'civic-status-warning' : 'civic-status-info';
  return (
    <span className={`civic-status-badge civic-tabular ${tone}`}>
      <Clock3 className="h-3 w-3" aria-hidden="true" />
      {hours < 0 ? `${Math.abs(hours)}h overdue` : `${hours}h remaining`}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="civic-page-header">
      <div>
        <p className="civic-eyebrow">{eyebrow}</p>
        <h2 className="civic-title">{title}</h2>
        <p className="civic-subtitle">{description}</p>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
}

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="civic-empty-state">
      <div>
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          {icon}
        </div>
        <h3 className="text-sm font-extrabold text-slate-800">{title}</h3>
        <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-600">{description}</p>
      </div>
    </div>
  );
}
