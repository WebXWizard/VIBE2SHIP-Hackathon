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
    <div id="signup-panel" className="max-w-md mx-auto px-4 py-12 text-left">
      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-sans font-extrabold text-xl text-slate-900">Create Citizen Profile</h3>
          <p className="text-xs text-slate-400">Join the Veridale City Council collaborative workspace.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-200 focus:outline-none focus:border-indigo-500 pl-10 pr-4 py-3 text-xs rounded-xl"
                placeholder="Sarah Jenkins"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Ledger Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 focus:outline-none focus:border-indigo-500 pl-10 pr-4 py-3 text-xs rounded-xl"
                placeholder="citizen@civicresolve.demo"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Ledger Access Password</label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="password"
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
            className="w-full py-3 bg-slate-950 hover:bg-slate-900 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            {loading ? 'Creating account...' : 'Register Profile'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 pt-2">
          Already registered?{' '}
          <button onClick={() => navigate('/login')} className="text-indigo-600 font-bold hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
