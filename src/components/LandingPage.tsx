/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useRouter } from '../lib/router';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Incident } from '../types';
import MapComponent from './MapComponent';
import { toast } from './Toast';
import { Shield, AlertTriangle, CheckCircle, Flame, Server, ArrowRight, Layers, HelpCircle } from 'lucide-react';

export default function LandingPage() {
  const { navigate } = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Load incidents real-time
  useEffect(() => {
    const q = query(collection(db, 'incidents'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Incident[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() } as Incident);
      });
      setIncidents(list);
      setLoading(false);
    }, (error) => {
      console.error('[CivicResolve] Error loading landing incidents:', error);
      setLoading(false);
      handleFirestoreError(error, OperationType.LIST, 'incidents');
    });
    return () => unsubscribe();
  }, []);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      toast('Connecting to Veridale Server and seeding records...', 'info');
      
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force: true })
      });
      const data = await response.json();
      if (data.success) {
        toast('Workspace data successfully seeded! Welcome to Veridale.', 'success');
      } else {
        toast('Seeding failed: ' + data.error, 'error');
      }
    } catch (err: any) {
      toast('Seeding error: ' + err.message, 'error');
    } finally {
      setSeeding(false);
    }
  };

  // Compute live statistics
  const total = incidents.length;
  const critical = incidents.filter(i => i.priorityLevel === 'CRITICAL' && i.status !== 'RESOLVED' && i.status !== 'REJECTED').length;
  const inProgress = incidents.filter(i => i.status === 'IN_PROGRESS' || i.status === 'ACCEPTED_BY_DEPARTMENT' || i.status === 'RESOLUTION_EVIDENCE_SUBMITTED').length;
  const resolved = incidents.filter(i => i.status === 'RESOLVED').length;
  const pendingTriage = incidents.filter(i => i.status === 'SUBMITTED' || i.status === 'AI_TRIAGED' || i.status === 'PENDING_ADMIN_REVIEW').length;

  return (
    <div id="landing-page" className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Banner Section */}
      <section className="bg-white border-b border-slate-200 py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-xs font-semibold tracking-wide mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            Demo Municipal Workflow Simulator
          </div>

          <h2 className="font-sans font-extrabold text-4xl sm:text-5xl tracking-tight text-slate-900 mb-6 leading-tight">
            From Citizen Report to Verified Resolution
          </h2>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            CivicResolve AI connects citizens, administrators, and repair departments in an open-ledger, transparent workspace. Report potholes, streetlights, leaks, or dumping, and let AI triage routing while humans verify action.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/report')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <AlertTriangle className="w-4.5 h-4.5 text-rose-400" />
              Report an Issue
            </button>
            <button
              onClick={() => navigate('/community-map')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-2xl text-sm font-bold transition-all"
            >
              <Layers className="w-4.5 h-4.5" />
              Explore Live Map
            </button>
          </div>
        </div>
      </section>

      {/* Database Empty Warning / Seeder */}
      {total === 0 && !loading && (
        <div className="max-w-5xl mx-auto px-4 mt-12 w-full">
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl shadow-sm text-center">
            <Server className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-amber-900">Workspace Databases are Empty</h3>
            <p className="text-sm text-amber-800 max-w-xl mx-auto mt-1 leading-relaxed">
              Your new Firestore database has been provisioned but has no mock data. Click below to seed 20 realistic incidents, 5 departments, and 6 role accounts instantly for hackathon evaluation!
            </p>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="mt-4 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2"
            >
              {seeding && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              Seed Mock Workspace Data
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12 w-full grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 font-mono">
              Workspace Cases
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">
              {loading ? '...' : total}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4">Total municipal incidents</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-rose-500 font-mono flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-500 fill-rose-500" /> Active Critical
            </span>
            <div className="text-3xl font-extrabold text-rose-600 mt-2">
              {loading ? '...' : critical}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4">Posing immediate danger</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-blue-500 font-mono">
              In Triage / Review
            </span>
            <div className="text-3xl font-extrabold text-blue-600 mt-2">
              {loading ? '...' : pendingTriage}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4">Awaiting administrative validation</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-500 font-mono">
              In Repair Progress
            </span>
            <div className="text-3xl font-extrabold text-amber-600 mt-2">
              {loading ? '...' : inProgress}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4">Assigned or in progress</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm col-span-2 lg:col-span-1 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 font-mono flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Total Resolved
            </span>
            <div className="text-3xl font-extrabold text-emerald-600 mt-2">
              {loading ? '...' : resolved}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-4">Verified by administration</div>
        </div>
      </section>

      {/* Live Map Preview Block */}
      <section className="max-w-7xl mx-auto px-4 pb-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="font-sans font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
            Veridale Incident Radar Map
          </h3>
          <MapComponent
            incidents={incidents}
            onSelectIncident={(id) => navigate(`/incident/${id}`)}
          />
        </div>

        <div className="flex flex-col justify-between gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex-1">
            <h4 className="font-sans font-bold text-sm text-slate-900 mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-slate-700" /> Transparent SLA Timelines
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Our audit ledger is completely immutable. Every report triggers detailed, publicly verifiable timestamps when departments accept a case or publish resolution evidence.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shrink-0"></span>
                <span className="text-xs font-semibold text-slate-700">Sarah Jenkins reported deep pothole</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0"></span>
                <span className="text-xs font-semibold text-slate-700">AI suggested routing to Roads Dept</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <span className="text-xs font-semibold text-slate-700">Roads Dept uploaded repair proof photo</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-xs font-semibold text-slate-700">Admin Inspector closed incident</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between shrink-0">
            <div>
              <h4 className="font-sans font-bold text-sm text-white mb-2 flex items-center gap-1.5">
                <Server className="w-4.5 h-4.5 text-indigo-400" /> Hackathon Notice
              </h4>
              <p className="text-[11px] text-slate-300 leading-normal">
                This app is a high-fidelity municipal-workflow simulation for hackathon demonstration. All external maps, API integrations, and departments are fully interactive simulations.
              </p>
            </div>
            <button
              onClick={() => navigate('/community-map')}
              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all group"
            >
              Launch Live Map Explorer <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
