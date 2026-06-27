/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { useRouter } from '../lib/router';
import { UserProfile, Incident, IncidentEvent, WorkUpdate, IncidentStatus } from '../types';
import MapComponent from './MapComponent';
import { toast } from './Toast';
import { PriorityIndicator, StatusBadge } from './ui/CivicUI';
import { ArrowLeft, Clock, Shield, Sparkles, MapPin, Users, CheckCircle, RefreshCcw, Send, Calendar, AlertTriangle } from 'lucide-react';

interface IncidentDetailProps {
  user: UserProfile | null;
  incidentId: string;
}

export default function IncidentDetail({ user, incidentId }: IncidentDetailProps) {
  const { navigate } = useRouter();
  
  // State
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Related lists
  const [events, setEvents] = useState<IncidentEvent[]>([]);
  const [workUpdates, setWorkUpdates] = useState<WorkUpdate[]>([]);
  
  // Interactive Actions
  const [confirming, setConfirming] = useState(false);
  const [reopening, setReopening] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [isReopenBoxOpen, setIsReopenBoxOpen] = useState(false);
  const hasConfirmed = Boolean(user && incident?.confirmedByUserIds?.includes(user.uid));

  // Load Incident Details dynamically
  useEffect(() => {
    if (!incidentId) return;

    setLoading(true);
    const incRef = doc(db, 'incidents', incidentId);
    
    // Listen to master incident real-time
    const unsubInc = onSnapshot(incRef, (snap) => {
      if (snap.exists()) {
        setIncident({ id: snap.id, ...snap.data() } as Incident);
      } else {
        setIncident(null);
      }
      setLoading(false);
    }, (err) => {
      console.error('[CivicResolve Detail] Error fetching incident:', err);
      setLoading(false);
    });

    // Listen to chronological timeline events
    const eventsQuery = query(collection(db, 'incidentEvents'), where('incidentId', '==', incidentId));
    const unsubEvents = onSnapshot(eventsQuery, (snap) => {
      const list: IncidentEvent[] = [];
      snap.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() } as IncidentEvent);
      });
      // Sort oldest first for chronological order
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setEvents(list);
    });

    // Listen to work updates
    const updatesQuery = query(collection(db, 'workUpdates'), where('incidentId', '==', incidentId));
    const unsubUpdates = onSnapshot(updatesQuery, (snap) => {
      const list: WorkUpdate[] = [];
      snap.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() } as WorkUpdate);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // newest notes first
      setWorkUpdates(list);
    });

    return () => {
      unsubInc();
      unsubEvents();
      unsubUpdates();
    };
  }, [incidentId]);

  // Handle Community confirmation click
  const handleConfirmation = async () => {
    if (!user) {
      toast('Please login or choose a preset role to confirm issues.', 'warning');
      return;
    }
    if (!incident) return;

    try {
      setConfirming(true);
      const res = await fetch('/api/transition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Uid': user.uid,
          'X-User-Name': user.name,
          'X-User-Role': user.role
        },
        body: JSON.stringify({
          incidentId,
          action: 'CITIZEN_CONFIRM'
        })
      });
      const data = await res.json();
      if (data.success) {
        toast('Your verification confirmation has been logged!', 'success');
      } else {
        toast('Verification failed: ' + data.error, 'error');
      }
    } catch (err: any) {
      toast('Verification log failed: ' + err.message, 'error');
    } finally {
      setConfirming(false);
    }
  };

  // Handle Reopen click
  const handleReopen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incident || !reopenReason.trim()) {
      toast('Please state a clear reason for reopening the repair ticket.', 'warning');
      return;
    }

    try {
      setReopening(true);
      const res = await fetch('/api/transition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Uid': user?.uid || '',
          'X-User-Name': user?.name || '',
          'X-User-Role': user?.role || 'CITIZEN'
        },
        body: JSON.stringify({
          incidentId,
          action: 'CITIZEN_REOPEN',
          notes: reopenReason
        })
      });
      const data = await res.json();
      if (data.success) {
        toast('Incident ticket has been reopened for council review!', 'success');
        setIsReopenBoxOpen(false);
        setReopenReason('');
      } else {
        toast('Reopen ticket failed: ' + data.error, 'error');
      }
    } catch (err: any) {
      toast('Reopen ticket failed: ' + err.message, 'error');
    } finally {
      setReopening(false);
    }
  };

  const getCitizenFacingLabel = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'Report received';
      case 'PENDING_ADMIN_REVIEW': return 'Under review';
      case 'ASSIGNED_TO_DEPARTMENT': return 'Assigned to department';
      case 'ACCEPTED_BY_DEPARTMENT': return 'Department accepted the case';
      case 'IN_PROGRESS': return 'Work in progress';
      case 'RESOLUTION_EVIDENCE_SUBMITTED': return 'Repair evidence submitted';
      case 'PENDING_ADMIN_VERIFICATION': return 'Resolution under verification';
      case 'RESOLVED': return 'Resolved';
      case 'REOPENED': return 'Reopened for review';
      case 'REJECTED': return 'Report not accepted';
      case 'DUPLICATE_MERGED': return 'Linked to an existing issue';
      case 'RETURNED_TO_ADMIN': return 'Returned to admin queue';
      default: return status.replace(/_/g, ' ');
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    if (status === 'RESOLVED') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (status === 'REJECTED' || status === 'RETURNED_TO_ADMIN') return 'bg-rose-100 text-rose-800 border-rose-200';
    if (status === 'IN_PROGRESS' || status === 'ACCEPTED_BY_DEPARTMENT' || status === 'RESOLUTION_EVIDENCE_SUBMITTED') {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    }
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  // Calculate target date based on mock SLA
  const calculateSlaDeadline = (createdStr: string, deptId: string | null) => {
    const created = new Date(createdStr);
    let hours = 96; // General SLA
    if (deptId === 'roads') hours = 72;
    if (deptId === 'electrical') hours = 120;
    if (deptId === 'water') hours = 24;
    if (deptId === 'sanitation') hours = 48;

    created.setHours(created.getHours() + hours);
    return created.toLocaleDateString() + ' ' + created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 min-h-screen">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h4 className="font-extrabold text-slate-800 text-base">Incident Not Found</h4>
        <p className="text-xs text-slate-500 mt-1">This report may have been deleted, archived, or is private.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div id={`incident-detail-${incident.incidentCode}`} className="civic-page space-y-6 text-left">
      {/* Back breadcrumb */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (user?.role === 'ADMIN') navigate('/admin');
            else if (user?.role === 'DEPARTMENT_MANAGER') navigate('/department');
            else navigate('/community-map');
          }}
          className="civic-icon-button"
          aria-label="Back to previous workspace"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </button>
        <span className="civic-data-label">Workspace / incidents / <span className="civic-tabular">{incident.incidentCode}</span></span>
      </div>

      {/* Main Grid: Info Cards and Image */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        
        {/* Left main content columns */}
        <div className="lg:col-span-3 space-y-6">
          <article className="civic-panel overflow-hidden">
            {incident.primaryImageUrl && (
              <img
                src={incident.primaryImageUrl}
                alt={`Citizen evidence for ${incident.title}`}
                referrerPolicy="no-referrer"
                className="w-full h-80 object-cover"
              />
            )}
            <div className="space-y-5 p-5 sm:p-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="civic-tabular text-xs font-bold text-slate-500">{incident.incidentCode}</span>
                  <StatusBadge status={incident.status} />
                  <PriorityIndicator level={incident.priorityLevel} score={incident.priorityScore} />
                </div>
                {incident.resolvedAt && (
                  <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Resolved {new Date(incident.resolvedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-950">
                {incident.title}
              </h1>

              <div className="civic-ai-panel p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="civic-data-label text-indigo-700">AI recommendation</span>
                  <span className="text-[11px] font-semibold text-indigo-700">Human review required</span>
                </div>
                <p className="text-xs leading-5 text-slate-700">{incident.aiAnalysis.explanation}</p>
              </div>

              {incident.status === 'RESOLVED' && incident.resolutionEvidenceUrl && (
                <div className="civic-evidence-panel mt-2 space-y-3.5 border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    <span className="text-xs font-bold font-mono uppercase tracking-wider">Official Repair Evidence Logged</span>
                  </div>
                  <img
                    src={incident.resolutionEvidenceUrl}
                    alt={`Official repair evidence for ${incident.title}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-64 object-cover rounded-xl border border-emerald-200 shadow-sm"
                  />
                  {incident.resolvedAt && (
                    <p className="text-[10px] text-emerald-600 font-mono font-semibold">
                      • Resolved and verified by Chief Inspector Arthur Pendelton on {new Date(incident.resolvedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Action overlays for citizen: Confirm, Reopen */}
              <div className="civic-action-bar">
                <button
                  onClick={handleConfirmation}
                  disabled={confirming || hasConfirmed || incident.status === 'RESOLVED' || incident.status === 'REJECTED'}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-400 text-slate-800 rounded-xl text-xs font-bold transition-all border border-slate-200"
                >
                  <Users className="w-4 h-4 text-slate-600" />
                  {hasConfirmed ? 'Issue Confirmed' : 'Confirm Issue'} ({incident.confirmationCount || 0})
                </button>

                {incident.status === 'RESOLVED' && user?.role === 'CITIZEN' && (
                  <button
                    onClick={() => setIsReopenBoxOpen(!isReopenBoxOpen)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all border border-rose-100 ml-auto"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Reopen Case
                  </button>
                )}
              </div>

              {/* Reopen input box panel */}
              {isReopenBoxOpen && (
                <form onSubmit={handleReopen} className="mt-4 p-4 bg-rose-50/50 border border-rose-100 rounded-xl space-y-3 animate-fade-in text-left">
                  <div className="flex items-center gap-1.5 text-rose-800">
                    <AlertTriangle className="w-4.5 h-4.5" />
                    <h5 className="text-xs font-bold">Request Ticket Reopening</h5>
                  </div>
                  <p className="text-[11px] text-rose-700 leading-relaxed">
                    If the physical repair is incomplete, low-quality, or has recurred, citizens may reopen the ticket. Please provide a brief justification:
                  </p>
                  <textarea
                    id="incident-reopen-reason"
                    aria-label="Reason for reopening this case"
                    rows={3}
                    value={reopenReason}
                    onChange={(e) => setReopenReason(e.target.value)}
                    className="w-full border border-rose-200 focus:border-rose-400 focus:outline-none p-3 rounded-lg text-xs bg-white text-slate-800"
                    placeholder="Provide justification reason: e.g. The asphalt patch has already cracked after last night's rainfall..."
                    required
                  ></textarea>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsReopenBoxOpen(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={reopening}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition"
                    >
                      {reopening ? 'Reopening...' : 'Submit Reopen Request'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </article>

          {/* Department updates and notes */}
          <section className="civic-panel space-y-4 p-5 sm:p-6" aria-labelledby="work-updates-heading">
            <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
              <Clock className="w-4.5 h-4.5 text-slate-500" /> <span id="work-updates-heading">Work updates & officer logs</span>
            </h3>
            
            {workUpdates.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                <p className="text-xs text-slate-500 font-medium">No work updates logged yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workUpdates.map(update => (
                  <div key={update.id} className="flex flex-col gap-2 border-l-2 border-[#8aa9bd] bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800">{update.authorName}</span>
                      <span className="text-slate-400 font-mono">{new Date(update.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-normal italic">
                      "{update.note}"
                    </p>
                    <div className="flex items-center justify-between text-[10px] mt-1 text-slate-400 font-semibold">
                      <span>Status set: <span className="text-slate-700 uppercase font-bold">{update.statusAfterUpdate.replace(/_/g, ' ')}</span></span>
                    </div>

                    {update.evidenceUrls && update.evidenceUrls.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {update.evidenceUrls.map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt={`Work evidence submitted by ${update.authorName}`}
                            referrerPolicy="no-referrer"
                            className="h-20 w-full object-cover rounded-lg border border-slate-200"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right side panels: SLA, Maps, AI Triage Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map centering coordinates */}
          <section className="civic-panel space-y-3 p-5" aria-labelledby="incident-location-heading">
            <h4 className="font-sans font-bold text-sm text-slate-950 flex items-center gap-1.5">
              <MapPin className="w-4.5 h-4.5 text-[#174f78]" /> <span id="incident-location-heading">Location & coordinates</span>
            </h4>
            
            <MapComponent
              incidents={[incident]}
            />
            
            <div className="text-xs font-semibold text-slate-700">
              {incident.location.displayAddress}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Ward: {incident.location.ward || 'Veridale Sector'} | Lat: {incident.location.latitude} | Lng: {incident.location.longitude}
            </div>
          </section>

          {/* Department assignment & SLA hours info */}
          <section className="civic-panel space-y-3.5 p-5" aria-labelledby="assignment-heading">
            <h4 className="font-sans font-bold text-sm text-slate-950 flex items-center gap-1.5">
              <Shield className="w-4.5 h-4.5 text-slate-700" /> <span id="assignment-heading">Ownership & target response</span>
            </h4>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Department</span>
                <span className="font-bold">{incident.assignedDepartmentName || 'General Administration'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Target Deadline</span>
                <span className="font-bold flex items-center gap-1 text-slate-900 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {calculateSlaDeadline(incident.createdAt, incident.assignedDepartmentId)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Audit Status</span>
                <span className="font-bold text-slate-900">{incident.status}</span>
              </div>
            </div>
          </section>

          {/* Chronological events list */}
          <section className="civic-panel space-y-3.5 p-5" aria-labelledby="timeline-heading">
            <h4 className="font-sans font-bold text-sm text-slate-950">
              <span id="timeline-heading">Audit timeline</span>
            </h4>

            <div className="max-h-[300px] space-y-4 overflow-y-auto pr-1" role="list">
              {events.map((evt, idx) => (
                <div key={evt.id || idx} className="flex gap-3 text-left" role="listitem">
                  <div className="flex flex-col items-center shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border-2 border-white ring-2 ring-slate-100"></span>
                    {idx < events.length - 1 && <span className="w-0.5 bg-slate-200 grow my-1"></span>}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-900 leading-none">
                      {evt.message}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-1 font-mono font-semibold">
                      {new Date(evt.createdAt).toLocaleDateString()} {new Date(evt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | {evt.actorName} ({evt.actorRole})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
