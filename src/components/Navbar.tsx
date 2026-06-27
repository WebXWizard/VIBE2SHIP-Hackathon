/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { auth } from '../lib/firebase';
import { useRouter } from '../lib/router';
import { UserProfile } from '../types';
import { signOut } from 'firebase/auth';
import { toast } from './Toast';
import { Map, AlertTriangle, List, Shield, Activity, Users, Home, Bell, User, LogOut, HardHat, LogIn } from 'lucide-react';

interface NavbarProps {
  user: UserProfile | null;
  loading: boolean;
}

export default function Navbar({ user, loading }: NavbarProps) {
  const { path, navigate } = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast('Signed out successfully!', 'success');
      navigate('/');
    } catch (err: any) {
      toast('Sign out failed: ' + err.message, 'error');
    }
  };

  const isActive = (target: string) => {
    if (target === '/') return path === '/';
    return path.startsWith(target);
  };

  const linkClass = (target: string) => {
    return `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
      isActive(target)
        ? 'bg-slate-900 text-white'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;
  };

  return (
    <header id="app-header" className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="p-2 bg-slate-900 text-white rounded-xl group-hover:bg-indigo-600 transition-colors">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-sm tracking-tight text-slate-900 leading-tight">
              CivicResolve AI
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider">
              VERIDALE WORKSPACE
            </p>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        {!loading && (
          <nav className="hidden md:flex items-center gap-1.5">
            {/* General Public Link */}
            <button onClick={() => navigate('/')} className={linkClass('/')}>
              <Home className="w-4 h-4" /> Home
            </button>
            <button onClick={() => navigate('/community-map')} className={linkClass('/community-map')}>
              <Map className="w-4 h-4" /> Live Map
            </button>

            {/* Citizen Links */}
            {user && user.role === 'CITIZEN' && (
              <>
                <button onClick={() => navigate('/report')} className={linkClass('/report')}>
                  <AlertTriangle className="w-4 h-4 text-rose-500" /> Report Issue
                </button>
                <button onClick={() => navigate('/my-reports')} className={linkClass('/my-reports')}>
                  <List className="w-4 h-4" /> My Reports
                </button>
              </>
            )}

            {/* Admin Links */}
            {user && user.role === 'ADMIN' && (
              <>
                <button onClick={() => navigate('/admin')} className={linkClass('/admin')}>
                  <Shield className="w-4 h-4" /> Admin Portal
                </button>
                <button onClick={() => navigate('/admin/triage')} className={linkClass('/admin/triage')}>
                  <Activity className="w-4 h-4 text-purple-500" /> Triage Queue
                </button>
              </>
            )}

            {/* Department Manager Links */}
            {user && user.role === 'DEPARTMENT_MANAGER' && (
              <>
                <button onClick={() => navigate('/department')} className={linkClass('/department')}>
                  <HardHat className="w-4 h-4 text-amber-500" /> Dept Queue
                </button>
              </>
            )}
          </nav>
        )}

        {/* User Right Actions */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-slate-800 animate-spin"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button
                onClick={() => navigate('/notifications')}
                className={`p-2 rounded-xl border border-slate-200 relative hover:bg-slate-50 transition-all ${
                  isActive('/notifications') ? 'bg-slate-50 border-slate-300 text-slate-800' : 'text-slate-500'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
              </button>

              {/* Profile Block */}
              <div className="flex items-center gap-2">
                <div
                  onClick={() => navigate('/profile')}
                  className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase cursor-pointer hover:bg-indigo-600 transition-colors"
                >
                  {user.name.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">{user.name}</div>
                  <div className="text-[10px] text-slate-500 leading-tight font-mono uppercase tracking-wider">
                    {user.role === 'DEPARTMENT_MANAGER' ? `${user.departmentId} Manager` : user.role}
                  </div>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="p-2 border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 rounded-xl hover:bg-rose-50 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl text-xs font-semibold tracking-wide transition-all"
              >
                <LogIn className="w-4 h-4" /> Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
