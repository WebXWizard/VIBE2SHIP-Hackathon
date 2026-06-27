/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRouter } from '../lib/router';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from './Toast';
import { Shield, Key, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const { navigate } = useRouter();

  // Inputs
  const [email, setEmail] = useState(() => sessionStorage.getItem('civicresolve_login_email') || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast('Please enter both email and password.', 'warning');
      return;
    }

    try {
      setLoading(true);
      toast('Authenticating your civic ledger keys...', 'info');

      // Sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Make sure Firestore has profile, if missing write default
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: email.split('@')[0],
          email: user.email,
          role: 'CITIZEN',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        });
      }

      toast('Welcome back to CivicResolve AI!', 'success');
      const target = sessionStorage.getItem('civicresolve_login_target') || '/';
      sessionStorage.removeItem('civicresolve_login_email');
      sessionStorage.removeItem('civicresolve_login_target');
      navigate(target);
    } catch (err: any) {
      console.error('[CivicResolve Login] Error:', err);
      toast('Authentication failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-panel" className="civic-page-narrow max-w-md text-left">
      <div className="civic-panel space-y-6 p-6 sm:p-8">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[#174f78] text-white shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Sign in to CivicResolve</h1>
          <p className="text-xs text-slate-500">Access your authorized civic workspace.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Ledger Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 focus:outline-none focus:border-indigo-500 pl-10 pr-4 py-3 text-xs rounded-xl"
                placeholder="citizen@civicresolve.demo"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Password</label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="password"
                id="login-password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 focus:outline-none focus:border-indigo-500 pl-10 pr-4 py-3 text-xs rounded-xl"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="civic-primary-button flex w-full items-center justify-center gap-1.5 px-4 text-xs tracking-wide shadow-sm disabled:bg-slate-300"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 pt-2">
          Don't have an account?{' '}
          <button type="button" onClick={() => navigate('/signup')} className="min-h-10 px-2 text-[#174f78] font-bold hover:underline">
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
