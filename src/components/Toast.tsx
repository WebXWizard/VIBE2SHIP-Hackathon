/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
}

let toastListeners: ((msg: ToastMessage) => void)[] = [];

export function toast(text: string, type: ToastMessage['type'] = 'success') {
  const msg: ToastMessage = {
    id: Math.random().toString(36).substring(2, 9),
    text,
    type
  };
  toastListeners.forEach(listener => listener(msg));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (msg: ToastMessage) => {
      setToasts(prev => [...prev, msg]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== msg.id));
      }, 4000);
    };

    toastListeners.push(handleToast);
    return () => {
      toastListeners = toastListeners.filter(l => l !== handleToast);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center justify-between p-4 rounded-xl shadow-lg border text-sm transition-all duration-300 animate-slide-in ${
            t.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : t.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : t.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {t.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
            {t.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />}
            {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />}
            {t.text}
          </div>
          <button
            onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
            className="text-slate-400 hover:text-slate-600 ml-4 p-1 rounded-full hover:bg-slate-100 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
