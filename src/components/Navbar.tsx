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
    return `flex min-h-10 shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold tracking-wide transition-colors ${
      isActive(target)
        ? 'border-[#174f78] bg-[#174f78] text-white shadow-sm'
        : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-950'
    }`;
  };

  const navigationItems = [
    { target: '/', label: 'Home', icon: Home, visible: true },
    { target: '/community-map', label: 'Live Map', icon: Map, visible: true },
    { target: '/report', label: 'Report Issue', icon: AlertTriangle, visible: user?.role === 'CITIZEN' },
    { target: '/my-reports', label: 'My Reports', icon: List, visible: user?.role === 'CITIZEN' },
    { target: '/admin', label: 'Admin Portal', icon: Shield, visible: user?.role === 'ADMIN' },
    { target: '/admin/triage', label: 'Triage Queue', icon: Activity, visible: user?.role === 'ADMIN' },
    { target: '/department', label: 'Department Queue', icon: HardHat, visible: user?.role === 'DEPARTMENT_MANAGER' },
  ].filter(item => item.visible);

  const roleLabel = user?.role === 'DEPARTMENT_MANAGER'
    ? `${user.departmentId || 'General'} department`
    : user?.role === 'ADMIN'
      ? 'Municipal administrator'
      : user
        ? 'Citizen workspace'
        : 'Public workspace';

  return (
    <header id="app-header" className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-[0_1px_4px_rgba(15,37,55,0.08)]">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-3 py-2 sm:px-4">
        {/* Logo and Brand */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="group flex min-w-0 items-center gap-2.5 rounded-lg text-left"
          aria-label="CivicResolve AI home"
        >
          <span className="rounded-lg bg-[#174f78] p-2 text-white transition-colors group-hover:bg-[#103c5d]">
            <Shield className="w-5 h-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-extrabold leading-tight tracking-tight text-slate-950">
              CivicResolve AI
            </span>
            <span className="block truncate text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
              Veridale civic operations
            </span>
          </span>
        </button>

        {/* Dynamic Navigation Tabs */}
        {!loading && (
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {navigationItems.map(item => {
              const Icon = item.icon;
              return (
                <button key={item.target} type="button" onClick={() => navigate(item.target)} className={linkClass(item.target)} aria-current={isActive(item.target) ? 'page' : undefined}>
                  <Icon className="h-4 w-4" aria-hidden="true" /> {item.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* User Right Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {loading ? (
            <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-slate-800 animate-spin"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button
                type="button"
                onClick={() => navigate('/notifications')}
                className={`civic-icon-button relative ${
                  isActive('/notifications') ? 'border-[#174f78] bg-[#e8f1f7] text-[#174f78]' : ''
                }`}
                aria-label="Open notifications"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-white bg-rose-600" aria-hidden="true"></span>
              </button>

              {/* Profile Block */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#174f78] text-xs font-extrabold uppercase text-white hover:bg-[#103c5d]"
                  aria-label={`Open profile for ${user.name}`}
                  title="Profile"
                >
                  {user.name.charAt(0)}
                </button>
                <div className="hidden text-left sm:block">
                  <div className="max-w-36 truncate text-xs font-extrabold leading-tight text-slate-900">{user.name}</div>
                  <div className="mt-0.5 max-w-40 truncate text-[10px] font-bold uppercase tracking-wider text-[#174f78]">
                    {roleLabel}
                  </div>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleSignOut}
                className="civic-icon-button hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                title="Sign Out"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <LogIn className="w-4 h-4" /> Login
              </button>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="civic-primary-button hidden px-3.5 text-xs md:block"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      {!loading && (
        <nav className="border-t border-slate-100 px-2 py-2 lg:hidden" aria-label="Mobile workspace navigation">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto pb-0.5">
            {navigationItems.map(item => {
              const Icon = item.icon;
              return (
                <button key={item.target} type="button" onClick={() => navigate(item.target)} className={linkClass(item.target)} aria-current={isActive(item.target) ? 'page' : undefined}>
                  <Icon className="h-4 w-4" aria-hidden="true" /> {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
