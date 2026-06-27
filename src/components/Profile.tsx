/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { auth } from '../lib/firebase';
import { useRouter } from '../lib/router';
import { UserProfile } from '../types';
import { signOut } from 'firebase/auth';
import { toast } from './Toast';
import { User, Mail, Shield, HardHat, LogOut, ArrowLeft } from 'lucide-react';

interface ProfileProps {
  user: UserProfile | null;
}

export default function Profile({ user }: ProfileProps) {
  const { navigate } = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast('Signed out successfully!', 'success');
      navigate('/');
    } catch (err: any) {
      toast('Logout failed: ' + err.message, 'error');
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <h4 className="font-bold text-slate-800">Authentication Required</h4>
        <p className="text-xs text-slate-500 mt-1">Please login to inspect profile settings.</p>
      </div>
    );
  }

  return (
    <div id="user-profile-page" className="civic-page-narrow max-w-md space-y-6 text-left">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="civic-icon-button"
          aria-label="Back to home"
          title="Back to home"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </button>
        <span className="text-xs font-mono font-bold text-slate-400">INDEX / PROFILE</span>
      </div>

      <section className="civic-panel space-y-4 p-6 text-center" aria-labelledby="profile-name">
        {/* Large Profile Letter Icon */}
        <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-extrabold text-2xl uppercase mx-auto">
          {user.name.charAt(0)}
        </div>

        <div>
          <h1 id="profile-name" className="text-lg font-extrabold text-slate-900">{user.name}</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
        </div>

        <div className="py-2.5 border-t border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-bold">
            <Shield className="w-4 h-4 text-indigo-500" /> Authority Role
          </div>
          <span className="font-bold uppercase font-mono tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
            {user.role}
          </span>
        </div>

        {user.departmentId && (
          <div className="py-2.5 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-bold">
              <HardHat className="w-4 h-4 text-amber-500" /> Department ID
            </div>
            <span className="font-bold uppercase font-mono tracking-wider bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px]">
              {user.departmentId}
            </span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 rounded-xl text-xs font-bold transition"
        >
          <LogOut className="w-4 h-4" /> Sign Out from Ledger
        </button>
      </section>
    </div>
  );
}
