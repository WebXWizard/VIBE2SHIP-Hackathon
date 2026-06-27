/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from './Toast';
import { Shield, User, Droplet, Zap, Trash2, HardHat, LogOut, ChevronUp, ChevronDown } from 'lucide-react';

export default function RoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const demoAccounts = [
    {
      label: 'Sarah Jenkins',
      email: 'citizen@civicresolve.demo',
      role: 'CITIZEN',
      icon: User,
      color: 'bg-indigo-600',
      textColor: 'text-indigo-600',
      desc: 'Citizen (Reports issues, adds confirmations, tracks cases)'
    },
    {
      label: 'Chief Inspector Arthur Pendelton',
      email: 'admin@civicresolve.demo',
      role: 'ADMIN',
      icon: Shield,
      color: 'bg-rose-600',
      textColor: 'text-rose-600',
      desc: 'Admin (Triages reports, assigns departments, verifies resolutions)'
    },
    {
      label: 'Marcus Vance',
      email: 'roads@civicresolve.demo',
      role: 'DEPARTMENT_MANAGER',
      deptId: 'roads',
      icon: HardHat,
      color: 'bg-amber-600',
      textColor: 'text-amber-600',
      desc: 'Roads Dept Manager (Potholes, Road damage)'
    },
    {
      label: 'Elena Rostova',
      email: 'water@civicresolve.demo',
      role: 'DEPARTMENT_MANAGER',
      deptId: 'water',
      icon: Droplet,
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
      desc: 'Water Dept Manager (Leaks, Drainage, Pipes)'
    },
    {
      label: 'Thomas Edison Jr',
      email: 'electrical@civicresolve.demo',
      role: 'DEPARTMENT_MANAGER',
      deptId: 'electrical',
      icon: Zap,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      desc: 'Electrical Dept Manager (Lights, Hazards)'
    },
    {
      label: 'Frank Cleanwood',
      email: 'sanitation@civicresolve.demo',
      role: 'DEPARTMENT_MANAGER',
      deptId: 'sanitation',
      icon: Trash2,
      color: 'bg-emerald-600',
      textColor: 'text-emerald-600',
      desc: 'Sanitation Manager (Overflow, Dumping)'
    }
  ];

  const handleSwitch = async (account: typeof demoAccounts[0]) => {
    try {
      setLoadingRole(account.role + (account.deptId || ''));
      toast(`Logging in as ${account.label}...`, 'info');

      // Attempt to sign in
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, account.email, 'password123');
      } catch (err: any) {
        // If user not found, auto-create!
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
          console.log('[CivicResolve Switcher] Demo account not found, creating on the fly...');
          userCredential = await createUserWithEmailAndPassword(auth, account.email, 'password123');
        } else {
          throw err;
        }
      }

      const user = userCredential.user;

      // Update /users doc to ensure sync with seed roles
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name: account.label,
        email: account.email,
        role: account.role,
        departmentId: account.deptId || null,
        photoURL: user.photoURL || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      }, { merge: true });

      toast(`Successfully authenticated as ${account.label}!`, 'success');
      setIsOpen(false);
    } catch (error: any) {
      console.error('[CivicResolve Switcher] Switch login failed:', error);
      toast(`Failed switching role: ${error.message}`, 'error');
    } finally {
      setLoadingRole(null);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast('Signed out successfully', 'success');
      setIsOpen(false);
    } catch (error: any) {
      toast('Logout failed: ' + error.message, 'error');
    }
  };

  return (
    <div id="role-switcher-panel" className="fixed bottom-4 left-4 z-50">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 overflow-hidden max-w-sm w-80 sm:w-96 transition-all duration-300">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 hover:bg-slate-900 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-xs tracking-wider text-slate-300 uppercase">
              Hackathon Role Switcher
            </span>
          </div>
          {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
        </button>

        {isOpen && (
          <div className="p-4 max-h-[350px] overflow-y-auto space-y-3">
            <p className="text-xs text-slate-400 pb-1 leading-relaxed">
              Use these presets to instantly toggle workspace roles and test municipal workflows. Demo password is <code className="bg-slate-800 px-1 py-0.5 rounded text-indigo-300">password123</code>.
            </p>

            <div className="grid grid-cols-1 gap-2">
              {demoAccounts.map(account => {
                const IconComp = account.icon;
                const isLoading = loadingRole === (account.role + (account.deptId || ''));
                return (
                  <button
                    key={account.email}
                    onClick={() => handleSwitch(account)}
                    disabled={loadingRole !== null}
                    className="flex items-start text-left gap-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800 transition-all duration-200"
                  >
                    <div className={`p-2 rounded-lg ${account.color} text-white shrink-0 mt-0.5`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{account.label}</div>
                      <div className="text-[10px] text-slate-300 font-medium">{account.email}</div>
                      <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5 leading-tight">{account.desc}</div>
                    </div>
                    {isLoading && (
                      <span className="ml-auto w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin shrink-0 self-center"></span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
