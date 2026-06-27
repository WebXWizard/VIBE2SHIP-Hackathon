import assert from 'node:assert/strict';
import test from 'node:test';
import { spawn } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';

const PORT = 3005;
const BASE_URL = `http://localhost:${PORT}`;

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

test('API Endpoints integration test', async (t) => {
  let serverProcess: ChildProcess | null = null;

  // 1. Start the server
  await t.test('start server', async () => {
    serverProcess = spawn('npx', ['tsx', 'server.ts'], {
      env: {
        ...process.env,
        PORT: PORT.toString(),
        ALLOW_INSECURE_DEMO_API: 'true',
        NODE_ENV: 'development'
      },
      shell: true
    });

    serverProcess.on('error', (err) => {
      console.error('[Server process error]', err);
    });

    serverProcess.stdout?.on('data', (data) => {
      console.log(`[Server stdout] ${data}`);
    });
    serverProcess.stderr?.on('data', (data) => {
      console.error(`[Server stderr] ${data}`);
    });

    // Wait for the server to spin up and health check to respond
    let attempts = 0;
    const maxAttempts = 15;
    while (attempts < maxAttempts) {
      try {
        const res = await fetch(`${BASE_URL}/api/health`);
        if (res.ok) {
          const data = await res.json() as any;
          if (data.status === 'ok') {
            console.log('Server is ready!');
            return;
          }
        }
      } catch (err) {
        // Ignored, server not up yet
      }
      attempts++;
      await delay(1000);
    }
    throw new Error('Server failed to start within time limit.');
  });

  // 2. Test GET /api/health
  await t.test('GET /api/health', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.equal(res.status, 200);
    const data = await res.json() as any;
    assert.equal(data.status, 'ok');
    assert.ok(data.time);
  });

  // 3. Test POST /api/seed
  await t.test('POST /api/seed', async () => {
    const res = await fetch(`${BASE_URL}/api/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ force: true })
    });
    assert.equal(res.status, 200);
    const data = await res.json() as any;
    assert.equal(data.success, true);
    assert.ok(data.message.includes('seeded') || data.message.includes('already'));
  });

  // 4. Test GET /api/mock-db/all
  await t.test('GET /api/mock-db/all', async () => {
    const res = await fetch(`${BASE_URL}/api/mock-db/all`);
    assert.equal(res.status, 200);
    const data = await res.json() as any;
    assert.equal(data.success, true);
    assert.ok(data.db);
    assert.ok(data.db.users);
    assert.ok(data.db.incidents);
  });

  // 5. Test POST /api/mock-db actions (getDoc, getDocs, addDoc, updateDoc, setDoc, deleteDoc, batch)
  let testDocId: string;
  await t.test('POST /api/mock-db actions', async (st) => {
    // getDocs
    await st.test('getDocs users', async () => {
      const res = await fetch(`${BASE_URL}/api/mock-db`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getDocs',
          collectionName: 'users'
        })
      });
      assert.equal(res.status, 200);
      const data = await res.json() as any;
      assert.equal(data.success, true);
      assert.ok(Array.isArray(data.data));
      assert.ok(data.data.length > 0);
    });

    // addDoc
    await st.test('addDoc reports', async () => {
      const res = await fetch(`${BASE_URL}/api/mock-db`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addDoc',
          collectionName: 'reports',
          data: {
            description: 'Integration test road pothole',
            category: 'POTHOLE',
            status: 'DRAFT',
            createdAt: new Date().toISOString()
          }
        })
      });
      assert.equal(res.status, 200);
      const data = await res.json() as any;
      assert.equal(data.success, true);
      assert.ok(data.id);
      testDocId = data.id;
    });

    // getDoc
    await st.test('getDoc report', async () => {
      const res = await fetch(`${BASE_URL}/api/mock-db`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getDoc',
          collectionName: 'reports',
          docId: testDocId
        })
      });
      assert.equal(res.status, 200);
      const data = await res.json() as any;
      assert.equal(data.success, true);
      assert.equal(data.data.description, 'Integration test road pothole');
    });

    // updateDoc
    await st.test('updateDoc report', async () => {
      const res = await fetch(`${BASE_URL}/api/mock-db`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateDoc',
          collectionName: 'reports',
          docId: testDocId,
          data: {
            description: 'Updated integration test road pothole'
          }
        })
      });
      assert.equal(res.status, 200);
      const data = await res.json() as any;
      assert.equal(data.success, true);
    });

    // setDoc
    await st.test('setDoc report', async () => {
      const res = await fetch(`${BASE_URL}/api/mock-db`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'setDoc',
          collectionName: 'reports',
          docId: testDocId,
          data: {
            description: 'Overwritten integration test road pothole',
            category: 'POTHOLE'
          }
        })
      });
      assert.equal(res.status, 200);
      const data = await res.json() as any;
      assert.equal(data.success, true);
    });

    // batch
    await st.test('batch operations', async () => {
      const res = await fetch(`${BASE_URL}/api/mock-db`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'batch',
          operations: [
            {
              action: 'updateDoc',
              collectionName: 'reports',
              docId: testDocId,
              data: {
                description: 'Batched update description'
              }
            }
          ]
        })
      });
      assert.equal(res.status, 200);
      const data = await res.json() as any;
      assert.equal(data.success, true);
    });

    // deleteDoc
    await st.test('deleteDoc report', async () => {
      const res = await fetch(`${BASE_URL}/api/mock-db`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteDoc',
          collectionName: 'reports',
          docId: testDocId
        })
      });
      assert.equal(res.status, 200);
      const data = await res.json() as any;
      assert.equal(data.success, true);
    });
  });

  // 6. Test POST /api/mock-auth/login
  await t.test('POST /api/mock-auth/login', async () => {
    const res = await fetch(`${BASE_URL}/api/mock-auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'citizen@civicresolve.demo',
        password: 'any'
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json() as any;
    assert.equal(data.success, true);
    assert.equal(data.user.role, 'CITIZEN');
  });

  // 7. Test POST /api/triage
  await t.test('POST /api/triage', async () => {
    const res = await fetch(`${BASE_URL}/api/triage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'Exposed cables and sparking wires near Oakwood school',
        submittedCategory: 'ELECTRICAL_HAZARD',
        latitude: 37.7749,
        longitude: -122.4194
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json() as any;
    assert.equal(data.success, true);
    assert.ok(data.analysis);
    assert.ok(data.deterministicPriority);
  });

  // 8. Test POST /api/check-duplicates
  await t.test('POST /api/check-duplicates', async () => {
    const res = await fetch(`${BASE_URL}/api/check-duplicates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'Severe deep pothole blocking the main school crossing road',
        category: 'POTHOLE',
        latitude: 37.7749,
        longitude: -122.4194
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json() as any;
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.duplicates));
  });

  // 9. Test POST /api/transition (citizen, admin, department interactions)
  await t.test('POST /api/transition actions', async (st) => {
    // Let's create a new incident in PENDING_ADMIN_REVIEW using batch/setDoc
    const incidentId = 'inc-test-transition-' + Math.random().toString(36).substring(2, 9);
    
    // First, seed a draft incident
    await fetch(`${BASE_URL}/api/mock-db`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'setDoc',
        collectionName: 'incidents',
        docId: incidentId,
        data: {
          id: incidentId,
          incidentCode: 'CR-TEST-TRANS',
          title: 'Transition Test Pothole',
          category: 'POTHOLE',
          status: 'PENDING_ADMIN_REVIEW',
          priorityScore: 50,
          priorityLevel: 'MEDIUM',
          reporterId: 'demo-citizen-id',
          createdAt: new Date().toISOString(),
          aiAnalysis: {
            severity: 3,
            explanation: 'Transition test pothole',
            evidenceQuality: 'GOOD'
          }
        }
      })
    });

    // ADMIN_ASSIGN (Admin assigns to roads department)
    await st.test('ADMIN_ASSIGN', async () => {
      const res = await fetch(`${BASE_URL}/api/transition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-uid': 'demo-admin-id',
          'x-user-name': 'Arthur Pendelton',
          'x-user-role': 'ADMIN'
        },
        body: JSON.stringify({
          incidentId,
          action: 'ADMIN_ASSIGN',
          departmentId: 'roads',
          priorityLevel: 'HIGH',
          notes: 'Assigning to roads dept'
        })
      });
      assert.equal(res.status, 200);
      const data = await res.json() as any;
      assert.equal(data.success, true);
      assert.equal(data.nextStatus, 'ASSIGNED_TO_DEPARTMENT');
    });

    // DEPT_ACCEPT (Roads manager accepts)
    await st.test('DEPT_ACCEPT', async () => {
      const res = await fetch(`${BASE_URL}/api/transition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-uid': 'demo-roads-id',
          'x-user-name': 'Marcus Vance',
          'x-user-role': 'DEPARTMENT_MANAGER',
          'x-user-deptid': 'roads'
        },
        body: JSON.stringify({
          incidentId,
          action: 'DEPT_ACCEPT',
          notes: 'Accepted by Roads Dept'
        })
      });
      assert.equal(res.status, 200);
      const data = await res.json() as any;
      assert.equal(data.success, true);
      assert.equal(data.nextStatus, 'ACCEPTED_BY_DEPARTMENT');
    });

    // DEPT_START_WORK
    await st.test('DEPT_START_WORK', async () => {
      const res = await fetch(`${BASE_URL}/api/transition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-uid': 'demo-roads-id',
          'x-user-name': 'Marcus Vance',
          'x-user-role': 'DEPARTMENT_MANAGER',
          'x-user-deptid': 'roads'
        },
        body: JSON.stringify({
          incidentId,
          action: 'DEPT_START_WORK'
        })
      });
      assert.equal(res.status, 200);
      const data = await res.json() as any;
      assert.equal(data.success, true);
      assert.equal(data.nextStatus, 'IN_PROGRESS');
    });

    // DEPT_SUBMIT_PROOF
    await st.test('DEPT_SUBMIT_PROOF', async () => {
      const res = await fetch(`${BASE_URL}/api/transition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-uid': 'demo-roads-id',
          'x-user-name': 'Marcus Vance',
          'x-user-role': 'DEPARTMENT_MANAGER',
          'x-user-deptid': 'roads'
        },
        body: JSON.stringify({
          incidentId,
          action: 'DEPT_SUBMIT_PROOF',
          notes: 'Repairs finished, photo attached',
          evidenceUrl: 'data:image/png;base64,dGVzdC1pbWFnZQ=='
        })
      });
      assert.equal(res.status, 200);
      const data = await res.json() as any;
      assert.equal(data.success, true);
      assert.equal(data.nextStatus, 'PENDING_ADMIN_VERIFICATION');
    });

    // ADMIN_VERIFY_RESOLVE
    await st.test('ADMIN_VERIFY_RESOLVE', async () => {
      const res = await fetch(`${BASE_URL}/api/transition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-uid': 'demo-admin-id',
          'x-user-name': 'Arthur Pendelton',
          'x-user-role': 'ADMIN'
        },
        body: JSON.stringify({
          incidentId,
          action: 'ADMIN_VERIFY_RESOLVE'
        })
      });
      assert.equal(res.status, 200);
      const data = await res.json() as any;
      assert.equal(data.success, true);
      assert.equal(data.nextStatus, 'RESOLVED');
    });

    // Cleanup transition test doc
    await fetch(`${BASE_URL}/api/mock-db`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'deleteDoc',
        collectionName: 'incidents',
        docId: incidentId
      })
    });
  });

  // 10. Clean up (kill the server process)
  if (serverProcess) {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/F', '/T', '/PID', (serverProcess as ChildProcess).pid!.toString()], { shell: true });
    } else {
      (serverProcess as ChildProcess).kill('SIGTERM');
    }
    // Allow process to terminate
    await delay(1500);
  }
});
