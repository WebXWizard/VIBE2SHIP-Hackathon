/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  limit, 
  writeBatch 
} from 'firebase/firestore';

import { DEPARTMENTS_SEED, USERS_SEED, INCIDENTS_SEED, REPORTS_SEED, EVENTS_SEED } from './seedData';

// Load config
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Initialize real Firebase App and Firestore
const app = getApps().length === 0 ? initializeApp({
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
}) : getApp();

const realDb = initializeFirestore(app, {}, config.firestoreDatabaseId || "ai-studio-b0dad04a-6f52-4710-8c47-37560af0d7e8");

// Mock db path fallback for legacy support
const isVercel = !!process.env.VERCEL;
const dbPath = isVercel
  ? path.join('/tmp', 'db_mock.json')
  : path.join(process.cwd(), 'db_mock.json');

let memoryDb: any = null;

function getInitialPopulatedDb() {
  const initialDb: any = {
    users: {},
    incidents: {},
    reports: {},
    incidentEvents: {},
    workUpdates: {},
    notifications: {},
    departments: {}
  };
  return initialDb;
}

export function readDb() {
  if (memoryDb) return memoryDb;
  if (!fs.existsSync(dbPath)) {
    const initialDb = getInitialPopulatedDb();
    try {
      fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2), 'utf-8');
    } catch (err) {}
    memoryDb = initialDb;
    return memoryDb;
  }
  try {
    memoryDb = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    return memoryDb;
  } catch (e) {
    memoryDb = getInitialPopulatedDb();
    return memoryDb;
  }
}

export function writeDb(data: any) {
  memoryDb = data;
  fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8', (err) => {});
}

// Wrapper classes to bridge Server compat-API calls to real Firestore SDK
class RealAdminDocumentSnapshot {
  id: string;
  private _snap: any;
  constructor(snap: any) {
    this.id = snap.id;
    this._snap = snap;
  }
  get exists() {
    return this._snap.exists();
  }
  data() {
    return this._snap.data();
  }
}

class RealAdminQuerySnapshot {
  private _snap: any;
  constructor(snap: any) {
    this._snap = snap;
  }
  get empty() {
    return this._snap.empty;
  }
  get size() {
    return this._snap.size;
  }
  get docs() {
    return this._snap.docs.map((docSnap: any) => new RealAdminDocumentSnapshot(docSnap));
  }
  forEach(callback: (doc: RealAdminDocumentSnapshot) => void) {
    this.docs.forEach(callback);
  }
}

class RealAdminDocumentReference {
  collectionName: string;
  docId: string;
  _ref: any;

  constructor(collectionName: string, docId: string, ref: any) {
    this.collectionName = collectionName;
    this.docId = docId;
    this._ref = ref;
  }

  async get() {
    const snap = await getDoc(this._ref);
    return new RealAdminDocumentSnapshot(snap);
  }

  async set(data: any, options?: any) {
    await setDoc(this._ref, data, options);
  }

  async update(data: any) {
    await updateDoc(this._ref, data);
  }

  async delete() {
    await deleteDoc(this._ref);
  }
}

class RealAdminQuery {
  collectionName: string;
  protected _ref: any;

  constructor(collectionName: string, ref: any) {
    this.collectionName = collectionName;
    this._ref = ref;
  }

  where(field: string, operator: string, value: any) {
    const newRef = query(this._ref, where(field, operator as any, value));
    return new RealAdminQuery(this.collectionName, newRef);
  }

  limit(value: number) {
    const newRef = query(this._ref, limit(value));
    return new RealAdminQuery(this.collectionName, newRef);
  }

  async get() {
    const snap = await getDocs(this._ref);
    return new RealAdminQuerySnapshot(snap);
  }
}

class RealAdminCollectionReference extends RealAdminQuery {
  private _db: any;

  constructor(db: any, collectionName: string) {
    const colRef = collection(db, collectionName);
    super(collectionName, colRef);
    this._db = db;
  }

  doc(docId: string) {
    const docRef = doc(this._db, this.collectionName, docId);
    return new RealAdminDocumentReference(this.collectionName, docId, docRef);
  }
}

class RealAdminWriteBatch {
  private _batch: any;
  constructor(db: any) {
    this._batch = writeBatch(db);
  }

  set(docRef: RealAdminDocumentReference, data: any, options?: any) {
    this._batch.set(docRef._ref, data, options);
  }

  update(docRef: RealAdminDocumentReference, data: any) {
    this._batch.update(docRef._ref, data);
  }

  delete(docRef: RealAdminDocumentReference) {
    this._batch.delete(docRef._ref);
  }

  async commit() {
    await this._batch.commit();
  }
}

class RealMockFirestore {
  private _db: any;
  constructor(db: any) {
    this._db = db;
  }

  collection(collectionName: string) {
    return new RealAdminCollectionReference(this._db, collectionName);
  }

  batch() {
    return new RealAdminWriteBatch(this._db);
  }
}

// Real Firebase Admin Auth helper via Token payload decoding
class MockAdminAuth {
  async verifyIdToken(token: string) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
        return {
          uid: payload.user_id || payload.sub,
          name: payload.name || payload.email?.split('@')[0] || 'Authenticated User',
          email: payload.email
        };
      }
    } catch (e) {
      console.warn('[CivicResolve Server] JWT parse fallback used:', e);
    }

    // Fallback: If it's a simple UID string (from developer/sandbox credentials)
    return {
      uid: token,
      name: token === 'admin' ? 'Chief Admin' : 'Demo Sandbox User',
      email: `${token}@civicresolve.demo`
    };
  }
}

export const adminMock = {
  initializeApp() {
    console.log('[CivicResolve Server] Real Firebase app initialized on backend');
    return {};
  },
  auth() {
    return new MockAdminAuth();
  }
};

export function getFirestoreMock() {
  return new RealMockFirestore(realDb);
}
