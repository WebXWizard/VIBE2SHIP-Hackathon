/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRouter } from '../lib/router';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from './Toast';
import { Shield, Key, Mail, User, ArrowRight } from 'lucide-react';

export default function Signup() {
  const { navigate } = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast('Please populate all registration details.', 'warning');
      return;
    }

    try {
      setLoading(true);
      toast('Registering new citizen profile on council ledger...', 'info');

      // Create authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Write Profile document
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name,
        email: user.email,
        role: 'CITIZEN', // Default is CITIZEN
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      });

      toast('Citizen profile created successfully!', 'success');
      navigate('/');
    } catch (err: any) {
      console.error('[CivicResolve Register] error:', err);
      toast('Registration failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="signup-panel" className="civic-page-narrow max-w-md text-left">
      <div className="civic-panel space-y-6 p-6 sm:p-8">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[#174f78] text-white shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Create citizen profile</h1>
          <p className="text-xs text-slate-400">Join the Veridale City Council collaborative workspace.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="signup-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                id="signup-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-200 focus:outline-none focus:border-indigo-500 pl-10 pr-4 py-3 text-xs rounded-xl"
                placeholder="Sarah Jenkins"
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="signup-email" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Ledger Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="email"
                id="signup-email"
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
            <label htmlFor="signup-password" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Ledger Access Password</label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="password"
                id="signup-password"
                autoComplete="new-password"
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
            {loading ? 'Creating account...' : 'Register Profile'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 pt-2">
          Already registered?{' '}
          <button type="button" onClick={() => navigate('/login')} className="min-h-10 px-2 text-[#174f78] font-bold hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
