/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useRouter } from '../lib/router';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { UserProfile, Incident } from '../types';
import { Clock, CheckCircle2, ChevronRight, AlertTriangle, HelpCircle } from 'lucide-react';

interface MyReportsProps {
  user: UserProfile | null;
}

export default function MyReports({ user }: MyReportsProps) {
  const { navigate } = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Load incidents where either creator matches or we fetch all reports and cross reference.
    // To keep it clean and performant, we can subscribe to all reports for reporterId, then fetch their matching incidents.
    // Or we can load all incidents and filter client-side, or query 'reports' collection first.
    // Let's query reports first for reporterId! This is extremely efficient and matches the data structure perfectly.
    const reportsQuery = query(collection(db, 'reports'), where('reporterId', '==', user.uid));
    
    const unsubscribeReports = onSnapshot(reportsQuery, (reportsSnap) => {
      const incidentIds: string[] = [];
      reportsSnap.forEach(docSnap => {
        const rep = docSnap.data();
        if (rep.incidentId) {
          incidentIds.push(rep.incidentId);
        }
      });

      if (incidentIds.length === 0) {
        setIncidents([]);
        setLoading(false);
        return;
      }

      // Query incidents containing these IDs
      // Firestore 'in' query has 10 limit, so let's fetch all incidents and filter in memory, or query dynamically.
      // Fetching all incidents is very robust for a hackathon sandbox.
      const incQuery = query(collection(db, 'incidents'));
      const unsubscribeInc = onSnapshot(incQuery, (incSnap) => {
        const list: Incident[] = [];
        incSnap.forEach(docSnap => {
          const inc = { id: docSnap.id, ...docSnap.data() } as Incident;
          if (incidentIds.includes(inc.id)) {
            list.push(inc);
          }
        });
        setIncidents(list);
        setLoading(false);
      });

      return () => unsubscribeInc();
    }, (error) => {
      console.error('[CivicResolve MyReports] Error loading reports:', error);
      setLoading(false);
    });

    return () => unsubscribeReports();
  }, [user]);

  const getStatusLabel = (status: string) => {
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
      default: return status.replace(/_/g, ' ');
    }
  };

  const getStatusStyles = (status: string) => {
    if (status === 'RESOLVED') return 'bg-emerald-50 border-emerald-200 text-emerald-800';
    if (status === 'REJECTED' || status === 'RETURNED_TO_ADMIN') return 'bg-rose-50 border-rose-200 text-rose-800';
    if (status === 'IN_PROGRESS' || status === 'ACCEPTED_BY_DEPARTMENT') return 'bg-amber-50 border-amber-200 text-amber-800';
    return 'bg-blue-50 border-blue-200 text-blue-800';
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
        <h4 className="font-bold text-slate-800">Authentication Required</h4>
        <p className="text-xs text-slate-500 mt-1">Please login to view your personal citizen incident dashboard.</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div id="my-reports-page" className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h3 className="font-sans font-extrabold text-xl text-slate-950">
          My Reported Incidents
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Review the active repair workflows, SLA countdowns, and audit logs for cases submitted by your profile.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      ) : incidents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <Clock className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 text-sm">No Incidents Reported Yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-normal">
            Your ledger account has not registered any submissions. Be the change in Veridale City by filing your first public report!
          </p>
          <button
            onClick={() => navigate('/report')}
            className="mt-4 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
          >
            File a Report
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map(inc => (
            <div
              key={inc.id}
              onClick={() => navigate(`/incident/${inc.id}`)}
              className="bg-white border border-slate-200 hover:border-slate-300 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
              <div className="flex gap-3.5 items-center min-w-0">
                {inc.primaryImageUrl ? (
                  <img
                    src={inc.primaryImageUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                )}
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">{inc.incidentCode}</span>
                    <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full border uppercase ${getStatusStyles(inc.status)}`}>
                      {getStatusLabel(inc.status)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 truncate mt-1 leading-snug">{inc.title}</h4>
                  <p className="text-xs text-slate-500 truncate leading-tight mt-0.5">{inc.location.displayAddress}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-mono">Priority</p>
                  <p className={`text-xs font-bold uppercase mt-0.5 ${
                    inc.priorityLevel === 'CRITICAL' ? 'text-rose-600' :
                    inc.priorityLevel === 'HIGH' ? 'text-amber-600' :
                    'text-slate-700'
                  }`}>
                    {inc.priorityLevel}
                  </p>
                </div>
                <div className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all">
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
