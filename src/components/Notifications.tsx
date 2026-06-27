/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, where, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { useRouter } from '../lib/router';
import { UserProfile, Notification } from '../types';
import { Bell, Check, Clock, Trash, AlertTriangle } from 'lucide-react';
import { toast } from './Toast';
import { EmptyState, PageHeader } from './ui/CivicUI';

interface NotificationsProps {
  user: UserProfile | null;
}

export default function Notifications({ user }: NotificationsProps) {
  const { navigate } = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    // Fetch notifications directed to the logged-in user or system-wide if citizen
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const list: Notification[] = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() } as Notification);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotifications(list);
      setLoading(false);
    }, (err) => {
      console.error('[CivicResolve Notifications] Fetch error:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { isRead: true });
    } catch (err: any) {
      console.error('[CivicResolve Notifications] Mark read failed:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      toast('Clearing notifications inbox...', 'info');
      const batch = writeBatch(db);
      notifications.forEach(n => {
        batch.update(doc(db, 'notifications', n.id), { isRead: true });
      });
      await batch.commit();
      toast('Inbox cleared!', 'success');
    } catch (err: any) {
      toast('Clear failed: ' + err.message, 'error');
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
        <h4 className="font-bold text-slate-800">Authentication Required</h4>
        <p className="text-xs text-slate-500 mt-1">Please login to inspect notifications.</p>
      </div>
    );
  }

  return (
    <div id="notifications-panel" className="civic-page-narrow space-y-6 text-left">
      <PageHeader
        eyebrow="Account updates"
        title="Alerts & notifications"
        description="Updates on reported incidents and workflow verification actions."
        actions={notifications.length > 0 ? (
          <button
            type="button"
            onClick={handleClearAll}
            className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Clear Inbox
          </button>
        ) : undefined}
      />

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={<Bell className="h-5 w-5" />} title="Inbox is clear" description="There are no active notifications for your municipal cases." />
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <button
              type="button"
              key={n.id}
              onClick={() => {
                handleMarkAsRead(n.id);
                if (n.incidentId) navigate(`/incident/${n.incidentId}`);
              }}
              className={`w-full rounded-lg border p-4 text-left transition-colors ${
                n.isRead
                  ? 'bg-slate-50 border-slate-150 text-slate-600'
                  : 'bg-indigo-50/40 border-indigo-100 text-indigo-950 font-medium hover:bg-indigo-50'
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold">{n.title}</h4>
                  <p className="text-xs leading-normal">{n.message}</p>
                </div>
                {!n.isRead && <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0 mt-1"></span>}
              </div>
              <span className="text-[9px] text-slate-400 font-mono mt-2 block">
                {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
