/**
 * Mock implementation of Firebase App, Auth, Firestore, and Storage for local sandbox environment.
 * Bypasses network requests and credentials by calling local backend APIs and using localStorage.
 */

// --- Firebase App Mock ---
export function initializeApp() {
  return {};
}
export function getApps() {
  return [{}];
}
export function getApp() {
  return {};
}

// --- Firebase Auth Mock ---
const authListeners = new Set<(user: any) => void>();

export const auth = {
  get currentUser() {
    const userStr = localStorage.getItem('civicresolve_user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        return {
          uid: parsed.uid,
          email: parsed.email,
          displayName: parsed.name,
          getIdToken: async () => parsed.uid,
          emailVerified: true,
          isAnonymous: false,
          tenantId: null,
          providerData: []
        };
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};

export function getAuth() {
  return auth;
}

export function onAuthStateChanged(authObj: any, callback: any) {
  authListeners.add(callback);
  // Emit current state
  callback(auth.currentUser);
  return () => {
    authListeners.add(callback);
  };
}

function triggerAuthListeners() {
  const user = auth.currentUser;
  authListeners.forEach(listener => {
    try {
      listener(user);
    } catch (e) {
      console.error(e);
    }
  });
}

export async function signInWithEmailAndPassword(authObj: any, email: string, password: any) {
  const res = await fetch('/api/mock-auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Authentication failed');
  }
  
  localStorage.setItem('civicresolve_user', JSON.stringify(data.user));
  triggerAuthListeners();
  
  return {
    user: {
      uid: data.user.uid,
      email: data.user.email,
      displayName: data.user.name,
      getIdToken: async () => data.user.uid
    }
  };
}

export async function createUserWithEmailAndPassword(authObj: any, email: string, password: any) {
  const uid = 'user-' + Math.random().toString(36).substring(2, 11);
  const user = {
    uid,
    name: email.split('@')[0],
    email,
    role: 'CITIZEN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  };

  const res = await fetch('/api/mock-db', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'setDoc',
      collectionName: 'users',
      docId: uid,
      data: user
    })
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to create account');
  }

  localStorage.setItem('civicresolve_user', JSON.stringify(user));
  triggerAuthListeners();

  return {
    user: {
      uid,
      email,
      displayName: user.name,
      getIdToken: async () => uid
    }
  };
}

export async function signOut(authObj: any) {
  localStorage.removeItem('civicresolve_user');
  triggerAuthListeners();
}

export async function updateProfile(userObj: any, profileData: any) {
  // Mock profile update
  return;
}

// --- Firebase Firestore Mock ---
export const db = {
  type: 'db'
};

export function initializeFirestore() {
  return db;
}

export function getFirestore() {
  return db;
}

export function doc(dbObj: any, collectionName: string, docId: string) {
  return { type: 'document', collectionName, docId };
}

export function collection(dbObj: any, collectionName: string) {
  return { type: 'collection', collectionName };
}

export function query(collectionRef: any, ...constraints: any[]) {
  return { type: 'query', collectionRef, constraints };
}

export function where(field: string, operator: string, value: any) {
  return { type: 'where', field, operator, value };
}

export function limit(value: number) {
  return { type: 'limit', value };
}

class MockDocumentSnapshot {
  id: string;
  private _data: any;
  constructor(id: string, data: any) {
    this.id = id;
    this._data = data;
  }
  exists() {
    return this._data !== null && this._data !== undefined;
  }
  data() {
    return this._data;
  }
}

class MockQuerySnapshot {
  docs: MockDocumentSnapshot[];
  constructor(docs: MockDocumentSnapshot[]) {
    this.docs = docs;
  }
  get empty() {
    return this.docs.length === 0;
  }
  get size() {
    return this.docs.length;
  }
  forEach(callback: (doc: MockDocumentSnapshot) => void) {
    this.docs.forEach(callback);
  }
}

function getCurrentUserToken() {
  const user = localStorage.getItem('civicresolve_user');
  if (user) {
    try {
      return JSON.parse(user).uid;
    } catch (e) {
      return '';
    }
  }
  return '';
}

export async function getDoc(docRef: any) {
  const res = await fetch('/api/mock-db', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getCurrentUserToken()}`
    },
    body: JSON.stringify({
      action: 'getDoc',
      collectionName: docRef.collectionName,
      docId: docRef.docId
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Firestore mock error');
  return new MockDocumentSnapshot(docRef.docId, data.data);
}

export async function getDocs(queryOrColRef: any) {
  const collectionName = queryOrColRef.type === 'query' 
    ? queryOrColRef.collectionRef.collectionName 
    : queryOrColRef.collectionName;
  
  const constraints = queryOrColRef.type === 'query' ? queryOrColRef.constraints : [];

  const res = await fetch('/api/mock-db', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getCurrentUserToken()}`
    },
    body: JSON.stringify({
      action: 'getDocs',
      collectionName,
      constraints
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Firestore mock error');
  
  const snapshots = data.data.map((item: any) => new MockDocumentSnapshot(item.id, item));
  return new MockQuerySnapshot(snapshots);
}

export async function setDoc(docRef: any, data: any, options?: any) {
  const res = await fetch('/api/mock-db', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getCurrentUserToken()}`
    },
    body: JSON.stringify({
      action: 'setDoc',
      collectionName: docRef.collectionName,
      docId: docRef.docId,
      data,
      options
    })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to set document');
  }
}

export async function addDoc(collectionRef: any, data: any) {
  const res = await fetch('/api/mock-db', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getCurrentUserToken()}`
    },
    body: JSON.stringify({
      action: 'addDoc',
      collectionName: collectionRef.collectionName,
      data
    })
  });
  const resData = await res.json();
  if (!res.ok) {
    throw new Error(resData.error || 'Failed to add document');
  }
  return { id: resData.id };
}

export async function updateDoc(docRef: any, data: any) {
  const res = await fetch('/api/mock-db', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getCurrentUserToken()}`
    },
    body: JSON.stringify({
      action: 'updateDoc',
      collectionName: docRef.collectionName,
      docId: docRef.docId,
      data
    })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update document');
  }
}

export async function deleteDoc(docRef: any) {
  const res = await fetch('/api/mock-db', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getCurrentUserToken()}`
    },
    body: JSON.stringify({
      action: 'deleteDoc',
      collectionName: docRef.collectionName,
      docId: docRef.docId
    })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete document');
  }
}

export function writeBatch(dbObj: any) {
  const operations: any[] = [];
  return {
    set(docRef: any, data: any, options?: any) {
      operations.push({ action: 'setDoc', collectionName: docRef.collectionName, docId: docRef.docId, data, options });
    },
    update(docRef: any, data: any) {
      operations.push({ action: 'updateDoc', collectionName: docRef.collectionName, docId: docRef.docId, data });
    },
    delete(docRef: any) {
      operations.push({ action: 'deleteDoc', collectionName: docRef.collectionName, docId: docRef.docId });
    },
    async commit() {
      const res = await fetch('/api/mock-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCurrentUserToken()}`
        },
        body: JSON.stringify({
          action: 'batch',
          operations
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to commit batch');
      }
    }
  };
}

const listeners = new Set<{
  id: string;
  type: 'document' | 'collection' | 'query';
  collectionName: string;
  docId?: string;
  constraints?: any[];
  callback: (snapshot: any) => void;
  lastJson: string;
}>();

let globalPollStarted = false;

function startGlobalPoll() {
  if (globalPollStarted) return;
  globalPollStarted = true;

  const poll = async () => {
    if (listeners.size === 0) {
      globalPollStarted = false;
      return;
    }

    try {
      const res = await fetch('/api/mock-db/all', {
        headers: {
          'Authorization': `Bearer ${getCurrentUserToken()}`
        }
      });
      if (res.ok) {
        const payload = await res.json();
        const dbData = payload.db || {};

        listeners.forEach(listener => {
          try {
            let dataToCompare: any;
            let snapshot: any;

            if (listener.type === 'document') {
              const col = dbData[listener.collectionName] || {};
              const docData = col[listener.docId!] || null;
              dataToCompare = docData;
              snapshot = new MockDocumentSnapshot(listener.docId!, docData);
            } else {
              const col = dbData[listener.collectionName] || {};
              let docs = Object.values(col);

              if (listener.constraints && Array.isArray(listener.constraints)) {
                for (const con of listener.constraints) {
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
              }

              dataToCompare = docs;
              const snaps = docs.map((d: any) => new MockDocumentSnapshot(d.id || d.uid || '', d));
              snapshot = new MockQuerySnapshot(snaps);
            }

            const currentJson = JSON.stringify(dataToCompare);
            if (currentJson !== listener.lastJson) {
              listener.lastJson = currentJson;
              listener.callback(snapshot);
            }
          } catch (err) {
            console.error('[CivicResolve Sync] Listener update error:', err);
          }
        });
      }
    } catch (err) {
      console.error('[CivicResolve Sync] Global poll error:', err);
    }

    // Poll every 3 seconds
    setTimeout(poll, 3000);
  };

  poll();
}

async function getDocOrDocsInitial(queryOrDocRef: any) {
  if (queryOrDocRef.type === 'document') {
    return getDoc(queryOrDocRef);
  } else {
    return getDocs(queryOrDocRef);
  }
}

export function onSnapshot(queryOrDocRef: any, callback: any, errorCallback?: any) {
  const id = Math.random().toString(36).substring(2, 11);
  const listener: any = {
    id,
    callback,
    lastJson: ''
  };

  if (queryOrDocRef.type === 'document') {
    listener.type = 'document';
    listener.collectionName = queryOrDocRef.collectionName;
    listener.docId = queryOrDocRef.docId;
  } else {
    listener.type = queryOrDocRef.type === 'query' ? 'query' : 'collection';
    listener.collectionName = queryOrDocRef.type === 'query' 
      ? queryOrDocRef.collectionRef.collectionName 
      : queryOrDocRef.collectionName;
    listener.constraints = queryOrDocRef.type === 'query' ? queryOrDocRef.constraints : [];
  }

  listeners.add(listener);
  
  // Trigger initial fetch from local DB immediately to prevent blank UI state
  getDocOrDocsInitial(queryOrDocRef)
    .then(snapshot => {
      let dataToCompare;
      if (listener.type === 'document') {
        dataToCompare = snapshot.data();
      } else {
        dataToCompare = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
      }
      listener.lastJson = JSON.stringify(dataToCompare);
      callback(snapshot);
    })
    .catch(err => {
      if (errorCallback) errorCallback(err);
    });

  startGlobalPoll();

  return () => {
    listeners.delete(listener);
  };
}

// --- Firebase Storage Mock ---
export function getStorage() {
  return {};
}

export function ref(storageObj: any, pathStr: string) {
  return { pathStr };
}

export function uploadBytes(refObj: any, file: any) {
  return Promise.resolve({ ref: refObj });
}

export function uploadBytesResumable(refObj: any, file: any) {
  const uploadTask = {
    snapshot: { ref: refObj },
    on(event: string, next: any, error?: any, complete?: any) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        try {
          next({ bytesTransferred: progress, totalBytes: 100 });
        } catch (e) {
          console.error(e);
        }
        if (progress === 100) {
          clearInterval(interval);
          if (complete) {
            try {
              complete();
            } catch (e) {
              console.error(e);
            }
          }
        }
      }, 100);
    }
  };
  return uploadTask;
}

export function getDownloadURL(refObj: any) {
  return Promise.resolve(`https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=800&q=80`);
}
