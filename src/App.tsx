/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, collection, query } from 'firebase/firestore';
import { useRouter, RouterProvider } from './lib/router';
import { UserProfile, Incident, PriorityLevel } from './types';

// Component Imports
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ReportForm from './components/ReportForm';
import MyReports from './components/MyReports';
import IncidentDetail from './components/IncidentDetail';
import AdminViews from './components/AdminViews';
import DepartmentViews from './components/DepartmentViews';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import MapComponent from './components/MapComponent';
import RoleSwitcher from './components/RoleSwitcher';
import { ToastContainer } from './components/Toast';
import { Filter, Layers, ListFilter } from 'lucide-react';

function AppContent() {
  const { path, params, navigate } = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Community Map incident storage
  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
  const [mapCategory, setMapCategory] = useState('ALL');
  const [mapPriority, setMapPriority] = useState('ALL');
  const [mapStatus, setMapStatus] = useState('ALL');

  // Track Firebase Authentication changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Sync custom profile role from firestore doc
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubUserDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser({ uid: firebaseUser.uid, ...docSnap.data() } as UserProfile);
          } else {
            // Default citizen profile if database record hasn't synced
            setUser({
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Citizen',
              email: firebaseUser.email || '',
              role: 'CITIZEN',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isActive: true
            });
          }
          setLoading(false);
        }, (err) => {
          console.error('[CivicResolve App] user doc error:', err);
          setLoading(false);
        });
        return () => unsubUserDoc();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Load active incidents for the Community Map real-time
  useEffect(() => {
    const q = query(collection(db, 'incidents'));
    const unsubIncidents = onSnapshot(q, (snapshot) => {
      const list: Incident[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Incident);
      });
      setAllIncidents(list);
    }, (err) => {
      console.error('[CivicResolve App] loading map incidents failed:', err);
      handleFirestoreError(err, OperationType.LIST, 'incidents');
    });
    return () => unsubIncidents();
  }, []);

  // Public Community Map view with client-side filters
  const renderCommunityMap = () => {
    const filteredIncidents = allIncidents.filter(inc => {
      // Do not expose sensitive/hidden records on the public map
      if (!inc.isPublic) return false;

      const matchCat = mapCategory === 'ALL' || inc.category === mapCategory;
      const matchPrio = mapPriority === 'ALL' || inc.priorityLevel === mapPriority;
      
      let matchStat = true;
      if (mapStatus === 'ACTIVE') {
        matchStat = inc.status !== 'RESOLVED' && inc.status !== 'REJECTED' && inc.status !== 'DUPLICATE_MERGED';
      } else if (mapStatus === 'RESOLVED') {
        matchStat = inc.status === 'RESOLVED';
      }

      return matchCat && matchPrio && matchStat;
    });

    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-sans font-extrabold text-xl text-slate-950 flex items-center gap-2">
              <Layers className="w-5.5 h-5.5 text-indigo-600" /> Veridale Public Community Map
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Real-time visualization of reported issues in Veridale City. Hover or click markers to inspect timeline details.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="text-[10px] font-mono font-bold bg-indigo-50 border border-indigo-100 text-indigo-800 rounded-xl px-4 py-2 uppercase">
            Currently Displaying: {filteredIncidents.length} / {allIncidents.length} active issues
          </div>
        </div>

        {/* Filter Headers Toolbar */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0">
            <Filter className="w-4.5 h-4.5 text-slate-500" /> Filters:
          </div>

          <div className="flex flex-wrap gap-3 text-xs flex-1">
            <select
              value={mapCategory}
              onChange={(e) => setMapCategory(e.target.value)}
              className="border border-slate-200 focus:outline-none focus:border-indigo-500 p-2 rounded-xl text-slate-700"
            >
              <option value="ALL">All Categories</option>
              <option value="POTHOLE">Potholes</option>
              <option value="ROAD_DAMAGE">Road Damage</option>
              <option value="BROKEN_STREETLIGHT">Broken Streetlights</option>
              <option value="ELECTRICAL_HAZARD">Electrical Hazards</option>
              <option value="WATER_LEAKAGE">Water Leakages</option>
              <option value="DAMAGED_PIPE">Damaged Water Pipes</option>
              <option value="DRAINAGE_ISSUE">Drainage Issues</option>
              <option value="GARBAGE_OVERFLOW">Garbage Overflow</option>
              <option value="ILLEGAL_DUMPING">Illegal Dumping</option>
              <option value="WASTE_MANAGEMENT">Waste Management</option>
            </select>

            <select
              value={mapPriority}
              onChange={(e) => setMapPriority(e.target.value)}
              className="border border-slate-200 focus:outline-none focus:border-indigo-500 p-2 rounded-xl text-slate-700"
            >
              <option value="ALL">All Urgency</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <select
              value={mapStatus}
              onChange={(e) => setMapStatus(e.target.value)}
              className="border border-slate-200 focus:outline-none focus:border-indigo-500 p-2 rounded-xl text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Cases</option>
              <option value="RESOLVED">Resolved Cases</option>
            </select>
          </div>
        </div>

        {/* Embedded Interactive Vector Map */}
        <div className="max-w-5xl mx-auto">
          <MapComponent
            incidents={filteredIncidents}
            onSelectIncident={(id) => navigate(`/incident/${id}`)}
          />
        </div>
      </div>
    );
  };

  // Switch statement for page content based on custom router path
  const renderPage = () => {
    if (path === '/') return <LandingPage />;
    if (path === '/login') return <Login />;
    if (path === '/signup') return <Signup />;
    if (path === '/community-map') return renderCommunityMap();
    if (path === '/report') return <ReportForm user={user} />;
    if (path === '/my-reports') return <MyReports user={user} />;
    if (path === '/notifications') return <Notifications user={user} />;
    if (path === '/profile') return <Profile user={user} />;
    
    // Dynamic Parameterized Routes
    if (path.startsWith('/incident/')) {
      return <IncidentDetail user={user} incidentId={params.incidentId} />;
    }
    
    // Admin routes
    if (path.startsWith('/admin')) {
      return <AdminViews user={user} />;
    }

    // Department routes
    if (path.startsWith('/department')) {
      return <DepartmentViews user={user} />;
    }

    // Default Fallback: Landing Page
    return <LandingPage />;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="w-full flex flex-col">
        {/* Dynamic Navigation Header */}
        <Navbar user={user} loading={loading} />

        {/* Main Routed Workspace Container */}
        <main className="flex-grow pb-24">
          {renderPage()}
        </main>
      </div>

      {/* Global Hackathon Components */}
      <ToastContainer />
      <RoleSwitcher />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
