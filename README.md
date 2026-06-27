# CivicResolve AI

**From Citizen Report to Verified Resolution** — A robust, transparent, and collaborative civic-tech workspace that bridges the gap between citizens, administrators, and public works departments to streamline hyperlocal municipal repairs.

---

## 1. Project Overview

Municipal issue reporting is often plagued by opaque tracking, disjointed communication, and siloed workflows. **CivicResolve AI** solves this by establishing a shared, open, and audit-logged ledger. 

Every issue — from potholes to electrical hazards — is reported, analyzed by AI, dispatched, resolved, and verified on-chain (using Firestore as an immutable record of historical status transitions). This ensures transparency, accountability, and accelerated response times.

---

## 2. Key Features

- 🛰️ **Geospatial Reporting**: Citizen reports pin the exact location, upload media proof, and categorize the issue.
- 🧠 **AI-Powered Triage & Classification**: Automatically runs server-side Gemini 2.5 analysis on incoming descriptions to predict the exact category, severity level, safety risk, and routing department.
- ⚙️ **Deterministic Priority Scoring**: Combines AI severity, category hazard points, and community confirmation counts into an audit-verifiable score (0–100) to bubble critical hazards to the top.
- 👯 **Geospatial Duplicate Clustering**: Scans surrounding latitude/longitude coordinates and category overlaps to flag duplicate reports, letting admins merge them with one click.
- 🏗️ **Department Dispatch Workflows**: Simulates dedicated department views (Roads, Water, Electrical, Sanitation) where crews can accept tickets, track progress, log notes, and upload repair evidence.
- 📝 **Immutable Timeline Audits**: Logs every action, status transition, and comment as a distinct audit event, preventing tampering or deletion.
- 🔔 **Real-Time Citizen Feedbacks**: Delivers instant in-app alerts and notifications when tickets are accepted, updated, or resolved.

---

## 3. User Roles & Access Hierarchy

CivicResolve AI enforces strict role-based access control (RBAC):

1. **Citizen (`Sarah Jenkins` - `citizen@civicresolve.demo`)**
   - Can create new reports with images and location coordinates.
   - Can view and track their own reports and explore the public Live Map.
   - Can upvote/confirm other reports to raise their priority score.
   - Can reopen resolved cases with valid justification if repairs are inadequate.
   - *Cannot access admin dashboards, assign departments, change priority, or see internal department work queues.*

2. **Municipal Administrator (`Arthur Pendelton` - `admin@civicresolve.demo`)**
   - Has full visibility over the global stats dashboard and audit logs.
   - Reviews incoming triaged issues, reassigns departments, and overrides priorities.
   - Evaluates duplicate clusters and merges reports.
   - Performs physical inspection sign-off (closing cases) in the Verification tab.
   - *Only Admin can execute final closure transitions.*

3. **Department Managers**
   - **Roads & Maintenance (`Marcus Vance` - `roads@civicresolve.demo`)**
   - **Water Services (`Elena Rostova` - `water@civicresolve.demo`)**
   - **Electrical Services (`Thomas Edison Jr` - `electrical@civicresolve.demo`)**
   - **Sanitation Department (`Frank Cleanwood` - `sanitation@civicresolve.demo`)**
   - Can access only their respective department's isolated queue.
   - Can accept cases, mark them as In Progress, write progress updates, and upload mandatory photo proof to request verification.
   - *Cannot view or access incidents assigned to other sectors.*

---

## 4. Full Workflow Diagram

```
[ Citizen Report Created ]
          │
          ▼
[ Server-Side Gemini AI Triage ] ────► predicts: category, severity, dept, risk
          │
          ▼
[ Admin Triage Inbox ] ──────────────► verifies, locks priority, dispatches
          │
          ▼
[ Assigned Department Queue ] ───────► accepts ticket, initiates repairs
          │
          ▼
[ Repair Complete (Proof Upload) ] ──► upload mandatory evidence photo
          │
          ▼
[ Admin Verification Review ] ───────► inspects side-by-side (Before vs. After)
     ├───► [ Approved ] ─────────────► Marks RESOLVED, alerts citizen
     └───► [ Rejected ] ─────────────► Returns to department with feedback
          │
          ▼
[ Citizen Reopen Option ] ──────────► (If patch fails, citizen can reopen case)
```

---

## 5. AI Usage & Limitations

- **Model Selection**: CivicResolve AI utilizes **Gemini 2.5 Flash** for rapid, cost-effective structured text and visual analysis.
- **Triage Extraction**: Extracts structured fields strictly matching enum boundaries (severity, safetyRisk, suggestedDepartmentId).
- **Graceful Fallbacks**: If the `GEMINI_API_KEY` is missing or invalid, the backend automatically fails-over to a highly detailed, local rule-based heuristic parser. This guarantees that **no errors** are surfaced to the user, and the demo remains fully functional.
- **Human-in-the-Loop Safeguard**: AI recommendations carry an explicit label, and all dispatch actions require explicit review and approval by a human administrator.

---

## 6. Priority Scoring Explanation

The priority score (0–100) is calculated deterministically to eliminate subjective bias and ensure fair queue allocation:

$$\text{Priority Score} = (\text{Severity} \times 12) + \text{Category Weight} + \text{Evidence Points} + \text{Confirmation Bonus}$$

Where:
- **Severity (1-5)**: Set by AI or modified by Admin (contributes up to 60 points).
- **Category Weight**: Highly hazardous categories like `ELECTRICAL_HAZARD` or `WATER_LEAKAGE` receive higher default weights (up to 20 points).
- **Evidence Quality**: `EXCELLENT` or `GOOD` metadata adds up to 10 points for high-quality actionable submissions.
- **Confirmation Bonus**: Each upvote/confirmation by local citizens adds **+2 points** (capped at 10 points) to represent civic urgency.

---

## 7. Duplicate Detection Explanation

CivicResolve AI automatically clusters duplicate reports to prevent department congestion:
1. **Category Match**: Candidates must have matching incident classifications.
2. **Geospatial Proximity**: Compares coordinates using the **Haversine formula**. Reports within **150 meters** are automatically linked.
3. **Admin Merge**: Admins review duplicates side-by-side. Merging transfers the report count metrics to the master ticket, logs an audit log, and marks the duplicate as `DUPLICATE_MERGED`.

---

## 8. Department Routing Explanation

Routing uses explicit department scope isolation:
- `POTHOLE`, `ROAD_DAMAGE` ──► **Roads & Maintenance** (72-hour SLA target)
- `BROKEN_STREETLIGHT`, `ELECTRICAL_HAZARD` ──► **Electrical Services** (120-hour SLA target)
- `WATER_LEAKAGE`, `DAMAGED_PIPE`, `DRAINAGE_ISSUE` ──► **Water Services** (24-hour SLA target)
- `GARBAGE_OVERFLOW`, `ILLEGAL_DUMPING`, `WASTE_MANAGEMENT` ──► **Sanitation Department** (48-hour SLA target)
- `OTHER`, `UNCLEAR` ──► **General Administration** (96-hour SLA target)

---

## 9. Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, `motion` (animations).
- **Backend**: Node.js, Express, Firebase Admin SDK.
- **Database**: Firebase Firestore (NoSQL Document Store).
- **Auth**: Firebase Authentication (Email/Password).
- **AI Engine**: `@google/genai` TypeScript SDK (Gemini 2.5).

---

## 10. Environment Variables

Create a `.env` file in the root directory. Only the variable names are required; never hardcode active API credentials into source code.

```env
# Server-Side Configuration
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000

# Client-Side Configuration (Vite)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

---

## 11. Setup & Installation Guides

### Firebase Setup
1. Create a Firebase Project at [Firebase Console](https://console.firebase.google.com).
2. Provision a **Firestore Database** in Native Mode. Use the custom database ID specified in `firebase-applet-config.json` if available.
3. Enable **Email/Password Provider** in Authentication.
4. Download your project's configuration and populate your `.env` or client configuration block.

### Google Maps Setup
- The application implements a gorgeous fallback coordinate picker and interactive custom canvas maps.
- For full Google Maps integration, enable the **Maps JavaScript API** in your Google Cloud Console and include the script in `index.html` with your API Key.

### Gemini Setup
1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/).
2. Assign it to `GEMINI_API_KEY` in your backend server environment.

---

## 12. Local Development

To run the application locally:

```bash
# 1. Install dependencies
npm install

# 2. Start the integrated full-stack development server
npm run dev
```

The dev server boots on `http://localhost:3000` with the Vite dev server running in middleware mode inside Express.

To build and compile the application for production:

```bash
npm run build
```

This compiles frontend assets into `dist/` and compiles the backend into a clean, standalone `dist/server.cjs` file using `esbuild`.

---

## 13. Demo Walkthrough Steps

For a flawless hackathon presentation, perform this complete workflow:

1. **Reset Database**: Log in or navigate to the Home Page. Click **"Seed Mock Workspace Data"** (shows when database has 0 records, or via the demo switcher reset option) to instantiate exactly 20 real incidents and profiles.
2. **Citizen Submission**: Sign in as `Sarah Jenkins` (`citizen@civicresolve.demo`). Go to **Report Issue**, describe a pothole on Main Street, and upload a photo. Save and submit.
3. **AI Recommendation**: View the report. Observe the "AI recommendation" label displaying the projected urgency, department, and observed criteria.
4. **Admin Routing**: Switch to `Chief Inspector Arthur Pendelton` (`admin@civicresolve.demo`). Open the **Triage Queue**, find the new pothole, review the AI suggestion, and click **Approve & Dispatch** to assign to Roads & Maintenance.
5. **Department Repair**: Switch to `Marcus Vance` (`roads@civicresolve.demo`). Locate the pothole in your queue. Click **Accept**, then click **Start Repair**. Once repaired, type a completion note, add a "Before/After" style repair photo link, and submit for verification.
6. **Admin Verification & Close**: Switch back to `Arthur Pendelton`. Go to the **Verification** tab. Compare the citizen's original report photo side-by-side with the department's repair evidence photo. Click **Approve & Close Case**.
7. **Citizen Verification & Reopen**: Switch back to `Sarah Jenkins`. Check **My Reports**. Confirm status is **Resolved** and repair evidence is visible. Test the fail-safe: click **Reopen Case**, fill out a reason, and confirm that the status returns to `REOPENED` for admin re-routing!

---

## 14. Known Limitations & Simulation Notice

- **Government Integration Notice**: This application is a high-fidelity municipal-workflow simulation for hackathon demonstration. All external maps, notifications, and departments are fully interactive simulations and are not connected to any official state authorities.
- **Target Response Times**: Simulated SLA deadlines are displayed as "Target response time" rather than binding guarantees.
- **File Uploads**: Image selections accept camera simulations or URL listings for seamless, standalone demo capabilities.

---

## 15. License

SPDX-License-Identifier: Apache-2.0
