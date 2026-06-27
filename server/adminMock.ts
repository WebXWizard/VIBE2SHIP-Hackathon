/**
 * Mock Firebase Admin and Firestore for backend server.
 * Reads and writes data to a local db_mock.json file.
 */

import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db_mock.json');

// Ensure db_mock.json exists and is initialized
let memoryDb: any = null;

export function readDb() {
  if (memoryDb) {
    return memoryDb;
  }

  if (!fs.existsSync(dbPath)) {
    const initialDb = {
      users: {},
      incidents: {},
      reports: {},
      incidentEvents: {},
      workUpdates: {},
      notifications: {},
      departments: {}
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2), 'utf-8');
    memoryDb = initialDb;
    return memoryDb;
  }
  try {
    memoryDb = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    return memoryDb;
  } catch (e) {
    console.error('Error reading mock DB, resetting:', e);
    const initialDb = {
      users: {},
      incidents: {},
      reports: {},
      incidentEvents: {},
      workUpdates: {},
      notifications: {},
      departments: {}
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2), 'utf-8');
    memoryDb = initialDb;
    return memoryDb;
  }
}

export function writeDb(data: any) {
  memoryDb = data;
  fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8', (err) => {
    if (err) {
      console.error('Failed to write mock DB asynchronously:', err);
    }
  });
}

// Mock Firestore Classes
class AdminDocumentSnapshot {
  id: string;
  private _data: any;
  constructor(id: string, data: any) {
    this.id = id;
    this._data = data;
  }
  get exists() {
    return this._data !== null && this._data !== undefined;
  }
  data() {
    return this._data;
  }
}

class AdminQuerySnapshot {
  docs: AdminDocumentSnapshot[];
  constructor(docs: AdminDocumentSnapshot[]) {
    this.docs = docs;
  }
  get empty() {
    return this.docs.length === 0;
  }
  get size() {
    return this.docs.length;
  }
  forEach(callback: (doc: AdminDocumentSnapshot) => void) {
    this.docs.forEach(callback);
  }
}

class AdminDocumentReference {
  collectionName: string;
  docId: string;
  constructor(collectionName: string, docId: string) {
    this.collectionName = collectionName;
    this.docId = docId;
  }

  async get() {
    const dbData = readDb();
    const col = dbData[this.collectionName] || {};
    const docData = col[this.docId] || null;
    return new AdminDocumentSnapshot(this.docId, docData);
  }

  async set(data: any, options?: any) {
    const dbData = readDb();
    if (!dbData[this.collectionName]) dbData[this.collectionName] = {};
    
    const current = dbData[this.collectionName][this.docId] || {};
    if (options && options.merge) {
      dbData[this.collectionName][this.docId] = { ...current, ...data };
    } else {
      dbData[this.collectionName][this.docId] = data;
    }
    writeDb(dbData);
  }

  async update(data: any) {
    const dbData = readDb();
    const col = dbData[this.collectionName] || {};
    if (col[this.docId]) {
      dbData[this.collectionName][this.docId] = { ...col[this.docId], ...data };
      writeDb(dbData);
    } else {
      throw new Error(`Document ${this.docId} not found in ${this.collectionName}`);
    }
  }

  async delete() {
    const dbData = readDb();
    if (dbData[this.collectionName] && dbData[this.collectionName][this.docId]) {
      delete dbData[this.collectionName][this.docId];
      writeDb(dbData);
    }
  }
}

class AdminQuery {
  collectionName: string;
  private constraints: any[];

  constructor(collectionName: string, constraints: any[] = []) {
    this.collectionName = collectionName;
    this.constraints = constraints;
  }

  where(field: string, operator: string, value: any) {
    return new AdminQuery(this.collectionName, [
      ...this.constraints,
      { type: 'where', field, operator, value }
    ]);
  }

  limit(value: number) {
    return new AdminQuery(this.collectionName, [
      ...this.constraints,
      { type: 'limit', value }
    ]);
  }

  async get() {
    const dbData = readDb();
    const col = dbData[this.collectionName] || {};
    let docs = Object.values(col);

    for (const con of this.constraints) {
      if (con.type === 'where') {
        const { field, operator, value } = con;
        docs = docs.filter((doc: any) => {
          const val = doc[field];
          if (operator === '==') return val === value;
          if (operator === '>=') return val >= value;
          if (operator === '<=') return val <= value;
          if (operator === 'array-contains') return Array.isArray(val) && val.includes(value);
          return true;
        });
      }
      if (con.type === 'limit') {
        docs = docs.slice(0, con.value);
      }
    }

    const snaps = docs.map((doc: any) => new AdminDocumentSnapshot(doc.id || doc.uid, doc));
    return new AdminQuerySnapshot(snaps);
  }
}

class AdminCollectionReference extends AdminQuery {
  constructor(collectionName: string) {
    super(collectionName);
  }

  doc(docId: string) {
    return new AdminDocumentReference(this.collectionName, docId);
  }
}

class AdminWriteBatch {
  private operations: any[] = [];

  set(docRef: AdminDocumentReference, data: any, options?: any) {
    this.operations.push({ action: 'set', docRef, data, options });
  }

  update(docRef: AdminDocumentReference, data: any) {
    this.operations.push({ action: 'update', docRef, data });
  }

  delete(docRef: AdminDocumentReference) {
    this.operations.push({ action: 'delete', docRef });
  }

  async commit() {
    const dbData = readDb();
    for (const op of this.operations) {
      const { action, docRef, data, options } = op;
      const { collectionName, docId } = docRef;
      if (!dbData[collectionName]) dbData[collectionName] = {};

      if (action === 'set') {
        const current = dbData[collectionName][docId] || {};
        if (options && options.merge) {
          dbData[collectionName][docId] = { ...current, ...data };
        } else {
          dbData[collectionName][docId] = data;
        }
      } else if (action === 'update') {
        const current = dbData[collectionName][docId];
        if (current) {
          dbData[collectionName][docId] = { ...current, ...data };
        }
      } else if (action === 'delete') {
        delete dbData[collectionName][docId];
      }
    }
    writeDb(dbData);
  }
}

class MockFirestore {
  collection(collectionName: string) {
    return new AdminCollectionReference(collectionName);
  }

  batch() {
    return new AdminWriteBatch();
  }
}

// Mock Firebase Admin Auth
class MockAdminAuth {
  async verifyIdToken(token: string) {
    // Decodes the token directly as a User UID
    const dbData = readDb();
    const usersCol = dbData['users'] || {};
    const user = usersCol[token];
    if (user) {
      return {
        uid: user.uid,
        name: user.name,
        email: user.email
      };
    }
    return {
      uid: token,
      name: 'Demo Sandbox User',
      email: `${token}@civicresolve.demo`
    };
  }
}

// Mock Firebase Admin Main Exports
export const adminMock = {
  initializeApp() {
    console.log('[CivicResolve Server] Mock Firebase Admin Initialized');
    return {};
  },
  auth() {
    return new MockAdminAuth();
  }
};

export function getFirestoreMock() {
  return new MockFirestore();
}
