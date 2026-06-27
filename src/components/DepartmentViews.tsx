/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, onSnapshot, query, where, updateDoc, doc, addDoc } from 'firebase/firestore';
import { useRouter } from '../lib/router';
import { Incident, UserProfile, IncidentEvent, IncidentStatus, WorkUpdate } from '../types';
import { toast } from './Toast';
import { HardHat, List, Play, Check, RefreshCw, Send, Image, MessageSquare, AlertTriangle, Calendar, Clock } from 'lucide-react';

interface DepartmentViewsProps {
  user: UserProfile | null;
}

export default function DepartmentViews({ user }: DepartmentViewsProps) {
  const { navigate } = useRouter();

  // State
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  // Active repair action states
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const [workNote, setWorkNote] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [returningAdmin, setReturningAdmin] = useState(false);
  const [returnReason, setReturnReason] = useState('');

  // Loaded department queue
  useEffect(() => {
    if (!user || user.role !== 'DEPARTMENT_MANAGER' || !user.departmentId) return;

    setLoading(true);
    // Listen to incidents assigned strictly to this department
    const q = query(
      collection(db, 'incidents'),
      where('assignedDepartmentId', '==', user.departmentId)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const list: Incident[] = [];
      snap.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Incident);
      });
      // Sort priority and age
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setIncidents(list);
      setLoading(false);
    }, (err) => {
      console.error('[CivicResolve Dept] Error fetching assigned incidents:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Handle Accept Case
  const handleAccept = async (incId: string) => {
    try {
      toast('Signing department acknowledgement ticket...', 'info');
      const res = await fetch('/api/transition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Uid': user?.uid || '',
          'X-User-Name': user?.name || '',
          'X-User-Role': user?.role || ''
        },
        body: JSON.stringify({
          incidentId: incId,
          action: 'DEPT_ACCEPT'
        })
      });
      const data = await res.json();
      if (data.success) {
        toast('Incident accepted into department queue!', 'success');
      } else {
        toast('Acceptance failed: ' + data.error, 'error');
      }
    } catch (err: any) {
      toast('Acceptance failed: ' + err.message, 'error');
    }
  };

  // Handle Start Repair Work
  const handleStartWork = async (incId: string) => {
    try {
      toast('Logging mobilization of repair crew...', 'info');
      const res = await fetch('/api/transition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Uid': user?.uid || '',
          'X-User-Name': user?.name || '',
          'X-User-Role': user?.role || ''
        },
        body: JSON.stringify({
          incidentId: incId,
          action: 'DEPT_START_WORK'
        })
      });
      const data = await res.json();
      if (data.success) {
        toast('Ticket marked IN PROGRESS!', 'success');
      } else {
        toast('Mobilization failed: ' + data.error, 'error');
      }
    } catch (err: any) {
      toast('Mobilization failed: ' + err.message, 'error');
    }
  };

  // Handle Return to Admin with comments
  const handleReturnToAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeIncident || !returnReason.trim()) {
      toast('Please supply a reason for returning this ticket to the Admin.', 'warning');
      return;
    }

    try {
      setReturningAdmin(true);
      toast('Re-dispatching ticket to administrative pool...', 'info');
      const res = await fetch('/api/transition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Uid': user?.uid || '',
          'X-User-Name': user?.name || '',
          'X-User-Role': user?.role || ''
        },
        body: JSON.stringify({
          incidentId: activeIncident.id,
          action: 'DEPT_RETURN',
          notes: returnReason
        })
      });
      const data = await res.json();
      if (data.success) {
        toast('Ticket successfully returned to Admin review.', 'success');
        setReturnReason('');
        setActiveIncident(null);
      } else {
        toast('Return failed: ' + data.error, 'error');
      }
    } catch (err: any) {
      toast('Return failed: ' + err.message, 'error');
    } finally {
      setReturningAdmin(false);
    }
  };

  // Handle Submit work update notes and photo proof
  const handleAddWorkUpdate = async (e: React.FormEvent, isFinalResolution = false) => {
    e.preventDefault();
    if (!activeIncident || !workNote.trim()) {
      toast('Please type a descriptive progress log note.', 'warning');
      return;
    }

    if (isFinalResolution && !evidenceUrl.trim()) {
      toast('Uploading photo proof of completed repairs is mandatory for closure requests.', 'warning');
      return;
    }

    try {
      setSubmittingNote(true);
      toast(isFinalResolution ? 'Submitting resolution request...' : 'Adding progress notes to council registry...', 'info');

      const action = isFinalResolution ? 'DEPT_SUBMIT_RESOLVE' : 'DEPT_UPDATE_PROGRESS';
      const res = await fetch('/api/transition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Uid': user?.uid || '',
          'X-User-Name': user?.name || '',
          'X-User-Role': user?.role || ''
        },
        body: JSON.stringify({
          incidentId: activeIncident.id,
          action,
          notes: workNote,
          evidenceUrl: evidenceUrl || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        toast(isFinalResolution ? 'Resolution verification request submitted!' : 'Progress note added successfully!', 'success');
        setWorkNote('');
        setEvidenceUrl('');
        setActiveIncident(null);
      } else {
        toast('Update failed: ' + data.error, 'error');
      }
    } catch (err: any) {
      toast('Update write failed: ' + err.message, 'error');
    } finally {
      setSubmittingNote(false);
    }
  };

  const getSlaHoursLeft = (createdStr: string) => {
    const created = new Date(createdStr).getTime();
    const now = new Date().getTime();
    const slaMs = (user?.departmentId === 'roads' ? 72 :
                   user?.departmentId === 'electrical' ? 120 :
                   user?.departmentId === 'water' ? 24 :
                   user?.departmentId === 'sanitation' ? 48 : 96) * 60 * 60 * 1000;
    
    const diff = (created + slaMs) - now;
    const hoursLeft = Math.round(diff / (1000 * 60 * 60));
    return hoursLeft;
  };

  if (!user || user.role !== 'DEPARTMENT_MANAGER') {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h4 className="font-extrabold text-slate-800 text-sm">Access Denied</h4>
        <p className="text-xs text-slate-500 mt-1">This portal requires a Department Manager account to inspect assigned repair schedules.</p>
      </div>
    );
  }

  // Count active stats
  const activeQueued = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'REJECTED' && i.status !== 'DUPLICATE_MERGED');
  const assignedOnly = activeQueued.filter(i => i.status === 'ASSIGNED_TO_DEPARTMENT');
  const activeWork = activeQueued.filter(i => i.status === 'ACCEPTED_BY_DEPARTMENT' || i.status === 'IN_PROGRESS');

  return (
    <div id="department-dashboard" className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="font-sans font-extrabold text-2xl text-slate-950 flex items-center gap-2">
            <HardHat className="w-6.5 h-6.5 text-slate-900" /> Department Dispatch Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as manager for: <span className="font-extrabold text-slate-800 uppercase tracking-wide">{user.departmentId}</span>.
          </p>
        </div>

        {/* Workload Gauges */}
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Assigned Inbox</span>
            <span className="text-lg font-extrabold text-slate-900">{assignedOnly.length}</span>
          </div>
          <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider block font-mono">Active Repair</span>
            <span className="text-lg font-extrabold text-amber-600">{activeWork.length}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      ) : activeQueued.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8">
          <Check className="w-12 h-12 text-emerald-500 mx-auto mb-3 bg-emerald-50 p-2 rounded-full" />
          <h4 className="font-extrabold text-slate-900 text-sm">Department Queue is Clear!</h4>
          <p className="text-xs text-slate-500 mt-1">No pending or active repairs assigned to your sector in Veridale City.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Active assigned items queue */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-sans font-extrabold text-base text-slate-950 flex items-center gap-1.5">
              <List className="w-4.5 h-4.5" /> Assigned Maintenance Work Orders ({activeQueued.length})
            </h3>

            <div className="space-y-4">
              {activeQueued.map(inc => {
                const hoursLeft = getSlaHoursLeft(inc.createdAt);
                const isCritical = inc.priorityLevel === 'CRITICAL';
                return (
                  <div
                    key={inc.id}
                    onClick={() => {
                      setActiveIncident(inc);
                      setWorkNote('');
                      setEvidenceUrl('');
                    }}
                    className={`bg-white border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row gap-4 items-start justify-between ${
                      activeIncident?.id === inc.id ? 'border-indigo-500 ring-2 ring-indigo-50/50' : 'border-slate-200'
                    }`}
                  >
                    <div className="space-y-2 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{inc.incidentCode}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold border ${
                          inc.status === 'ASSIGNED_TO_DEPARTMENT' ? 'bg-indigo-50 border-indigo-200 text-indigo-800' :
                          inc.status === 'IN_PROGRESS' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                          'bg-blue-50 border-blue-200 text-blue-800'
                        }`}>
                          {inc.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{inc.title}</h4>
                      <p className="text-xs text-slate-500 truncate">{inc.location.displayAddress}</p>
                    </div>

                    <div className="text-right shrink-0 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 mt-3 sm:mt-0 gap-2">
                      <span className="text-[9px] font-bold text-slate-400 font-mono uppercase">SLA DEADLINE</span>
                      <span className={`text-xs font-bold font-mono inline-flex items-center gap-1 ${
                        hoursLeft <= 12 ? 'text-rose-600 animate-pulse' : 'text-slate-700'
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        {hoursLeft > 0 ? `${hoursLeft} hours left` : 'SLA OVERDUE'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Incident action drawer when an item is selected */}
          <div className="lg:col-span-2 space-y-6">
            {activeIncident ? (
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-5 animate-fade-in text-left">
                <div>
                  <span className="text-[9px] font-mono font-bold text-slate-400 block">{activeIncident.incidentCode}</span>
                  <h4 className="font-sans font-extrabold text-sm text-slate-900 mt-1">{activeIncident.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{activeIncident.location.displayAddress}</p>
                </div>

                {/* Accept / Return actions */}
                {activeIncident.status === 'ASSIGNED_TO_DEPARTMENT' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        // toggle return modal
                        setReturnReason('');
                        document.getElementById('return-reason-form')?.classList.toggle('hidden');
                      }}
                      className="px-4 py-2 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl transition-all"
                    >
                      Return to Admin
                    </button>
                    <button
                      onClick={() => handleAccept(activeIncident.id)}
                      className="px-4 py-2 bg-slate-950 text-white hover:bg-indigo-600 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4" /> Accept Ticket
                    </button>
                  </div>
                )}

                {/* Return reason box hidden by default */}
                <form id="return-reason-form" onSubmit={handleReturnToAdmin} className="hidden p-3.5 bg-rose-50 border border-rose-100 rounded-xl space-y-2">
                  <label className="text-[10px] font-bold text-rose-800 uppercase block font-mono">Return Reason Details</label>
                  <input
                    type="text"
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full border border-rose-200 p-2 text-xs rounded-lg bg-white"
                    placeholder="e.g. Requires electrical bucket truck, roads division cannot reach..."
                    required
                  />
                  <div className="flex justify-end gap-1.5 pt-1">
                    <button type="button" onClick={() => document.getElementById('return-reason-form')?.classList.add('hidden')} className="text-[10px] text-slate-500 font-semibold px-2">Cancel</button>
                    <button type="submit" className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded">Submit Return</button>
                  </div>
                </form>

                {/* Mobilize Action */}
                {activeIncident.status === 'ACCEPTED_BY_DEPARTMENT' && (
                  <button
                    onClick={() => handleStartWork(activeIncident.id)}
                    className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Play className="w-4.5 h-4.5 fill-white text-white" /> Mobilize Crews & Start Work
                  </button>
                )}

                {/* Repair progress updates & evidence upload */}
                {(activeIncident.status === 'ACCEPTED_BY_DEPARTMENT' || activeIncident.status === 'IN_PROGRESS' || activeIncident.status === 'RESOLUTION_EVIDENCE_SUBMITTED') && (
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-slate-500" /> Log Progress or Resolution Evidence
                    </h5>

                    <form onSubmit={(e) => handleAddWorkUpdate(e, false)} className="space-y-4">
                      <textarea
                        rows={3}
                        value={workNote}
                        onChange={(e) => setWorkNote(e.target.value)}
                        className="w-full border border-slate-200 p-3 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                        placeholder="Write repair updates: e.g. Crew arrived on site, asphalt cutting completed, awaiting concrete mix..."
                        required
                      ></textarea>

                      {/* Evidence Photo URL mockup for repair resolution */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono flex items-center gap-1">
                          <Image className="w-3.5 h-3.5 text-slate-400" /> Evidence Photo URL (Required for final completion)
                        </label>
                        <select
                          value={evidenceUrl}
                          onChange={(e) => setEvidenceUrl(e.target.value)}
                          className="w-full border border-slate-200 p-2 rounded-lg text-xs"
                        >
                          <option value="">-- Choose resolution placeholder photo --</option>
                          <option value="https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80">Road repaved patch (Unsplash)</option>
                          <option value="https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&w=600&q=80">Streetlight glowing (Unsplash)</option>
                          <option value="https://images.unsplash.com/photo-1542013936693-8848e5744a70?auto=format&fit=crop&w=600&q=80">Water pipe fixed (Unsplash)</option>
                          <option value="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80">Sanitation bin cleared (Unsplash)</option>
                        </select>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={submittingNote}
                          className="px-3 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition"
                        >
                          Add Log Note
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleAddWorkUpdate(e, true)}
                          disabled={submittingNote || !evidenceUrl}
                          className="px-3 py-2 bg-slate-900 hover:bg-emerald-600 text-white disabled:bg-slate-100 disabled:text-slate-400 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" /> Submit Resolution
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-200 border-dashed">
                <HardHat className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                <h5 className="text-xs font-bold text-slate-700">Select a Work Order</h5>
                <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto mt-1 leading-normal">
                  Click on any assigned card in the left queue to initiate acknowledgement, start repair crews, or upload photos.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
