import PptxGenJS from "pptxgenjs";
import fs from "fs";
import path from "path";

const pptx = new PptxGenJS();

// ===== GLOBAL SETTINGS =====
pptx.author = "CivicResolve AI Team";
pptx.title = "CivicResolve AI — Project Presentation";
pptx.subject = "VIBE2SHIP Hackathon 2026";
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 inches

// ===== COLOR PALETTE =====
const DARK_BG = "0F172A";
const CARD_BG = "1E293B";
const ACCENT = "3B82F6";
const GREEN = "22C55E";
const RED = "EF4444";
const ORANGE = "F97316";
const YELLOW = "EAB308";
const PURPLE = "A855F7";
const TEXT_WHITE = "F1F5F9";
const TEXT_MUTED = "94A3B8";
const BORDER = "334155";

// Helper to convert screenshots to base64
function imgBase64(filename) {
  const imgPath = path.join("screenshots", filename);
  if (fs.existsSync(imgPath)) {
    const data = fs.readFileSync(imgPath);
    return `image/png;base64,${data.toString("base64")}`;
  }
  return null;
}

// ================================================================
// SLIDE 1: TITLE
// ================================================================
let slide1 = pptx.addSlide();
slide1.background = { color: DARK_BG };
// Gradient overlay (subtle accent)
slide1.addShape(pptx.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: "100%",
  fill: { type: "solid", color: DARK_BG, alpha: 90 },
});

slide1.addText("VIBE2SHIP HACKATHON 2026", {
  x: 0.8, y: 0.6, w: 10, h: 0.4,
  fontSize: 14, fontFace: "Calibri", color: ACCENT,
  bold: true, letterSpacing: 3,
});
slide1.addText("🏛️ CivicResolve AI", {
  x: 0.8, y: 1.2, w: 11, h: 1.4,
  fontSize: 52, fontFace: "Calibri", color: TEXT_WHITE,
  bold: true,
});
slide1.addText("From Citizen Report to Verified Resolution\nA smart, AI-powered platform that transforms how cities handle municipal complaints.", {
  x: 0.8, y: 2.8, w: 8, h: 1.2,
  fontSize: 18, fontFace: "Calibri", color: TEXT_MUTED,
  lineSpacingMultiple: 1.3,
});

// Feature tags
const tags = [
  { text: "🤖 Gemini AI Triage", color: GREEN },
  { text: "📊 Priority Scoring", color: ORANGE },
  { text: "📸 Photo Verification", color: PURPLE },
  { text: "🔍 Duplicate Detection", color: RED },
];
tags.forEach((tag, i) => {
  slide1.addShape(pptx.ShapeType.roundRect, {
    x: 0.8 + i * 2.8, y: 4.5, w: 2.5, h: 0.5,
    fill: { color: CARD_BG }, line: { color: tag.color, width: 1.5 },
    rectRadius: 0.15,
  });
  slide1.addText(tag.text, {
    x: 0.8 + i * 2.8, y: 4.5, w: 2.5, h: 0.5,
    fontSize: 11, fontFace: "Calibri", color: tag.color,
    bold: true, align: "center", valign: "middle",
  });
});

// ================================================================
// SLIDE 2: THE PROBLEM
// ================================================================
let slide2 = pptx.addSlide();
slide2.background = { color: DARK_BG };

slide2.addText("THE PROBLEM", {
  x: 0.8, y: 0.4, w: 4, h: 0.4,
  fontSize: 13, fontFace: "Calibri", color: RED,
  bold: true, letterSpacing: 2,
});
slide2.addText("Municipal complaint systems are broken", {
  x: 0.8, y: 0.9, w: 11, h: 0.8,
  fontSize: 36, fontFace: "Calibri", color: TEXT_WHITE,
  bold: true,
});

const problems = [
  { icon: "🕳️", title: "No Transparency", desc: "Citizens file complaints and never hear back" },
  { icon: "🐌", title: "Slow Routing", desc: "Nobody knows which department handles the issue" },
  { icon: "⚖️", title: "No Prioritization", desc: "A live wire gets same urgency as a cracked tile" },
  { icon: "📋", title: "Duplicate Flooding", desc: "20 people report the same pothole = 20 tickets" },
  { icon: "🤥", title: "No Proof of Repair", desc: "Departments mark 'fixed' without evidence" },
  { icon: "🔒", title: "No Citizen Recourse", desc: "Once closed, no way to reopen a bad fix" },
];
problems.forEach((p, i) => {
  const y = 2.0 + i * 0.85;
  slide2.addText(p.icon, { x: 0.8, y, w: 0.6, h: 0.6, fontSize: 22 });
  slide2.addText(p.title, {
    x: 1.5, y, w: 3.5, h: 0.35,
    fontSize: 16, fontFace: "Calibri", color: TEXT_WHITE, bold: true,
  });
  slide2.addText(p.desc, {
    x: 1.5, y: y + 0.3, w: 9, h: 0.35,
    fontSize: 13, fontFace: "Calibri", color: TEXT_MUTED,
  });
  if (i < problems.length - 1) {
    slide2.addShape(pptx.ShapeType.line, {
      x: 0.8, y: y + 0.75, w: 11, h: 0,
      line: { color: BORDER, width: 0.5 },
    });
  }
});

// ================================================================
// SLIDE 3: OUR SOLUTION
// ================================================================
let slide3 = pptx.addSlide();
slide3.background = { color: DARK_BG };

slide3.addText("OUR SOLUTION", {
  x: 0.8, y: 0.4, w: 4, h: 0.4,
  fontSize: 13, fontFace: "Calibri", color: GREEN,
  bold: true, letterSpacing: 2,
});
slide3.addText("CivicResolve AI fixes all of it", {
  x: 0.8, y: 0.9, w: 11, h: 0.8,
  fontSize: 36, fontFace: "Calibri", color: TEXT_WHITE,
  bold: true,
});

const solutions = [
  { icon: "🤖", title: "AI Auto-Classification", desc: "Gemini AI reads the complaint and instantly identifies category, severity & correct department" },
  { icon: "📊", title: "Priority Scoring (0-100)", desc: "Formula-based ranking so critical hazards like electrical risks always come first" },
  { icon: "🔍", title: "Duplicate Detection", desc: "Reports within 150m of each other for the same category get auto-clustered" },
  { icon: "📸", title: "Photo Verification", desc: "Departments must upload repair proof. Admin compares Before vs After side-by-side" },
  { icon: "🔁", title: "Citizen Reopen", desc: "If the fix is bad, citizens can reopen the case with justification" },
  { icon: "📝", title: "Full Audit Trail", desc: "Every action permanently logged as an immutable event — nothing deleted" },
];

solutions.forEach((s, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 0.8 + col * 4;
  const y = 2.0 + row * 2.5;

  // Card background
  slide3.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 3.6, h: 2.2,
    fill: { color: CARD_BG }, line: { color: BORDER, width: 1 },
    rectRadius: 0.15,
  });
  slide3.addText(s.icon, { x: x + 0.3, y: y + 0.2, w: 0.6, h: 0.6, fontSize: 28 });
  slide3.addText(s.title, {
    x: x + 0.3, y: y + 0.8, w: 3, h: 0.4,
    fontSize: 15, fontFace: "Calibri", color: TEXT_WHITE, bold: true,
  });
  slide3.addText(s.desc, {
    x: x + 0.3, y: y + 1.2, w: 3, h: 0.8,
    fontSize: 11, fontFace: "Calibri", color: TEXT_MUTED,
    lineSpacingMultiple: 1.3,
  });
});

// ================================================================
// SLIDE 4: WORKFLOW
// ================================================================
let slide4 = pptx.addSlide();
slide4.background = { color: DARK_BG };

slide4.addText("WORKFLOW", {
  x: 0.8, y: 0.4, w: 4, h: 0.4,
  fontSize: 13, fontFace: "Calibri", color: ACCENT,
  bold: true, letterSpacing: 2,
});
slide4.addText("How It Works — End to End", {
  x: 0.8, y: 0.9, w: 11, h: 0.8,
  fontSize: 36, fontFace: "Calibri", color: TEXT_WHITE,
  bold: true,
});

const steps = [
  { icon: "👤", title: "Citizen\nReports", desc: "Photo + GPS", color: GREEN },
  { icon: "🤖", title: "AI\nAnalyzes", desc: "Category, Severity", color: PURPLE },
  { icon: "👨‍💼", title: "Admin\nReviews", desc: "Approves & Routes", color: ORANGE },
  { icon: "🔧", title: "Dept\nRepairs", desc: "Fix + Upload Proof", color: ACCENT },
  { icon: "✅", title: "Admin\nVerifies", desc: "Before vs After", color: YELLOW },
  { icon: "🎉", title: "Resolved!", desc: "Citizen Notified", color: GREEN },
];

steps.forEach((step, i) => {
  const x = 0.5 + i * 2.1;
  const y = 2.5;

  // Step box
  slide4.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 1.7, h: 2.2,
    fill: { color: CARD_BG }, line: { color: step.color, width: 2 },
    rectRadius: 0.12,
  });
  slide4.addText(step.icon, { x, y: y + 0.15, w: 1.7, h: 0.5, fontSize: 26, align: "center" });
  slide4.addText(step.title, {
    x, y: y + 0.7, w: 1.7, h: 0.7,
    fontSize: 13, fontFace: "Calibri", color: TEXT_WHITE, bold: true, align: "center",
    lineSpacingMultiple: 1.1,
  });
  slide4.addText(step.desc, {
    x, y: y + 1.5, w: 1.7, h: 0.4,
    fontSize: 10, fontFace: "Calibri", color: TEXT_MUTED, align: "center",
  });

  // Arrow between steps
  if (i < steps.length - 1) {
    slide4.addText("→", {
      x: x + 1.7, y: y + 0.7, w: 0.4, h: 0.5,
      fontSize: 22, fontFace: "Calibri", color: ACCENT, bold: true, align: "center",
    });
  }
});

// Reopen callout
slide4.addShape(pptx.ShapeType.roundRect, {
  x: 3, y: 5.3, w: 7, h: 0.6,
  fill: { color: CARD_BG }, line: { color: BORDER, width: 1 },
  rectRadius: 0.1,
});
slide4.addText("🔁  If repair is bad → Citizen can REOPEN → Goes back to Admin", {
  x: 3, y: 5.3, w: 7, h: 0.6,
  fontSize: 14, fontFace: "Calibri", color: TEXT_MUTED, align: "center", valign: "middle",
});

// ================================================================
// SLIDE 5: USER ROLES
// ================================================================
let slide5 = pptx.addSlide();
slide5.background = { color: DARK_BG };

slide5.addText("USER ROLES", {
  x: 0.8, y: 0.4, w: 4, h: 0.4,
  fontSize: 13, fontFace: "Calibri", color: PURPLE,
  bold: true, letterSpacing: 2,
});
slide5.addText("Three Distinct Roles", {
  x: 0.8, y: 0.9, w: 11, h: 0.8,
  fontSize: 36, fontFace: "Calibri", color: TEXT_WHITE,
  bold: true,
});

const roles = [
  {
    icon: "👤", title: "Citizen", name: "Sarah Jenkins",
    desc: "Reports issues with photos & GPS\nTracks status of own reports\nUpvotes others' reports\nCan reopen bad fixes",
    color: GREEN,
  },
  {
    icon: "👨‍💼", title: "Municipal Admin", name: "Arthur Pendelton",
    desc: "Full stats dashboard\nReviews AI triage suggestions\nDispatches to departments\nVerifies repairs & closes cases",
    color: ORANGE,
  },
  {
    icon: "🔧", title: "Department Manager", name: "Marcus Vance (Roads)",
    desc: "Sees only own dept queue\nAccepts assigned tickets\nPerforms repairs\nUploads mandatory photo evidence",
    color: ACCENT,
  },
];

roles.forEach((role, i) => {
  const x = 0.8 + i * 4;
  const y = 2.2;

  // Card
  slide5.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 3.6, h: 4,
    fill: { color: CARD_BG }, line: { color: BORDER, width: 1 },
    rectRadius: 0.15,
  });
  // Color accent bar
  slide5.addShape(pptx.ShapeType.rect, {
    x, y, w: 0.08, h: 4,
    fill: { color: role.color },
  });

  slide5.addText(role.icon, { x, y: y + 0.3, w: 3.6, h: 0.6, fontSize: 36, align: "center" });
  slide5.addText(role.title, {
    x, y: y + 1.0, w: 3.6, h: 0.4,
    fontSize: 18, fontFace: "Calibri", color: TEXT_WHITE, bold: true, align: "center",
  });
  slide5.addText(role.name, {
    x, y: y + 1.4, w: 3.6, h: 0.4,
    fontSize: 13, fontFace: "Calibri", color: ACCENT, align: "center",
  });
  slide5.addText(role.desc, {
    x: x + 0.4, y: y + 2.0, w: 2.8, h: 1.8,
    fontSize: 12, fontFace: "Calibri", color: TEXT_MUTED,
    lineSpacingMultiple: 1.4,
  });
});

// ================================================================
// SLIDE 6-9: SCREENSHOTS (with text on left)
// ================================================================
const screenshotSlides = [
  {
    tag: "LIVE DEMO", tagColor: ACCENT,
    title: "Landing Page",
    bullets: [
      "Clean hero with 'Report an Issue' CTA",
      "Live Map explorer for public issues",
      "Real-time workspace stats dashboard",
      "Demo account selector for role switching",
      "AI disclaimer badge visible",
    ],
    image: "1_landing_page.png",
  },
  {
    tag: "CITIZEN VIEW", tagColor: GREEN,
    title: "Report Submission",
    bullets: [
      "Upload evidence photo (drag & drop)",
      "Detailed issue description box",
      "Interactive GPS map to pin location",
      "Category with 'Let AI Suggest' button",
      "Public or Private visibility toggle",
    ],
    image: "3_report_form.png",
  },
  {
    tag: "ADMIN VIEW", tagColor: ORANGE,
    title: "Decision Desk",
    bullets: [
      "Stats: Total, Critical, Triage, Resolved",
      "Recent incident ledger with priority badges",
      "Global audit log (every action recorded)",
      "Tabs: Dashboard, Triage, Duplicates, Verify",
      "AI labels on every recommendation",
    ],
    image: "4_admin_dashboard.png",
  },
  {
    tag: "DEPARTMENT VIEW", tagColor: ACCENT,
    title: "Work-Order Queue",
    bullets: [
      "Isolated queue — own department only",
      "CRITICAL / HIGH / MEDIUM priority badges",
      "SLA target timers with overdue alerts",
      "Accept → Repair → Upload Evidence flow",
      "Assigned Inbox & Active Repair counters",
    ],
    image: "5_department_queue.png",
  },
];

screenshotSlides.forEach((ss) => {
  let slide = pptx.addSlide();
  slide.background = { color: DARK_BG };

  // Left side: text
  slide.addText(ss.tag, {
    x: 0.8, y: 0.6, w: 4, h: 0.4,
    fontSize: 13, fontFace: "Calibri", color: ss.tagColor,
    bold: true, letterSpacing: 2,
  });
  slide.addText(ss.title, {
    x: 0.8, y: 1.1, w: 5, h: 0.7,
    fontSize: 32, fontFace: "Calibri", color: TEXT_WHITE, bold: true,
  });

  ss.bullets.forEach((b, i) => {
    slide.addText(`✓  ${b}`, {
      x: 0.8, y: 2.2 + i * 0.55, w: 5.5, h: 0.45,
      fontSize: 14, fontFace: "Calibri", color: TEXT_MUTED,
    });
  });

  // Right side: screenshot
  const imgData = imgBase64(ss.image);
  if (imgData) {
    slide.addImage({
      data: imgData,
      x: 6.5, y: 0.8, w: 6.5, h: 5.8,
      rounding: true,
    });
    // Border around image
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 6.5, y: 0.8, w: 6.5, h: 5.8,
      fill: { type: "none" }, line: { color: BORDER, width: 1.5 },
      rectRadius: 0.1,
    });
  } else {
    slide.addText(`[Screenshot: ${ss.image}]`, {
      x: 6.5, y: 2.5, w: 6, h: 2,
      fontSize: 16, fontFace: "Calibri", color: TEXT_MUTED, align: "center",
    });
  }
});

// ================================================================
// SLIDE 10: AI ENGINE
// ================================================================
let slide10 = pptx.addSlide();
slide10.background = { color: DARK_BG };

slide10.addText("AI ENGINE", {
  x: 0.8, y: 0.4, w: 4, h: 0.4,
  fontSize: 13, fontFace: "Calibri", color: PURPLE,
  bold: true, letterSpacing: 2,
});
slide10.addText("🧠 Gemini AI Under the Hood", {
  x: 0.8, y: 0.9, w: 11, h: 0.8,
  fontSize: 36, fontFace: "Calibri", color: TEXT_WHITE,
  bold: true,
});

// Left column: What AI Does
slide10.addText("What AI Does", {
  x: 0.8, y: 2.0, w: 5, h: 0.4,
  fontSize: 18, fontFace: "Calibri", color: ACCENT, bold: true,
});
const aiDoes = [
  "Reads citizen description & analyzes photo",
  "Predicts category (POTHOLE, ELECTRICAL, etc.)",
  "Assigns severity level (1–5)",
  "Evaluates safety risk (LOW → CRITICAL)",
  "Suggests department routing",
  "Flags sensitive content",
  "Returns confidence score (0–100%)",
];
aiDoes.forEach((item, i) => {
  slide10.addText(`✓  ${item}`, {
    x: 0.8, y: 2.5 + i * 0.5, w: 5.5, h: 0.4,
    fontSize: 13, fontFace: "Calibri", color: TEXT_MUTED,
  });
});

// Right column: Safety Guardrails
slide10.addText("Safety Guardrails", {
  x: 7, y: 2.0, w: 5, h: 0.4,
  fontSize: 18, fontFace: "Calibri", color: GREEN, bold: true,
});
const guardrails = [
  { title: "Graceful Fallback", desc: "No API key? Rule-based heuristics take over" },
  { title: "Human-in-the-Loop", desc: "AI only recommends. Admin decides." },
  { title: "Clearly Labeled", desc: "All outputs carry 'AI Recommendation' badge" },
  { title: "Server-Side Only", desc: "No client-side API key exposure" },
];
guardrails.forEach((g, i) => {
  slide10.addText(`⚡ ${g.title}`, {
    x: 7, y: 2.6 + i * 0.95, w: 5.5, h: 0.35,
    fontSize: 14, fontFace: "Calibri", color: ORANGE, bold: true,
  });
  slide10.addText(g.desc, {
    x: 7.3, y: 2.95 + i * 0.95, w: 5, h: 0.35,
    fontSize: 12, fontFace: "Calibri", color: TEXT_MUTED,
  });
});

// Priority formula
slide10.addShape(pptx.ShapeType.roundRect, {
  x: 2, y: 6.2, w: 9, h: 0.7,
  fill: { color: CARD_BG }, line: { color: BORDER, width: 1 },
  rectRadius: 0.1,
});
slide10.addText([
  { text: "Priority Score = ", options: { fontSize: 14, color: TEXT_MUTED } },
  { text: "(Severity × 12)", options: { fontSize: 14, color: ACCENT, bold: true } },
  { text: " + ", options: { fontSize: 14, color: TEXT_MUTED } },
  { text: "Category Weight", options: { fontSize: 14, color: ORANGE, bold: true } },
  { text: " + ", options: { fontSize: 14, color: TEXT_MUTED } },
  { text: "Evidence Pts", options: { fontSize: 14, color: GREEN, bold: true } },
  { text: " + ", options: { fontSize: 14, color: TEXT_MUTED } },
  { text: "Upvote Bonus", options: { fontSize: 14, color: PURPLE, bold: true } },
], {
  x: 2, y: 6.2, w: 9, h: 0.7,
  fontFace: "Calibri", align: "center", valign: "middle",
});

// ================================================================
// SLIDE 11: TECH STACK
// ================================================================
let slide11 = pptx.addSlide();
slide11.background = { color: DARK_BG };

slide11.addText("TECH STACK", {
  x: 0.8, y: 0.4, w: 4, h: 0.4,
  fontSize: 13, fontFace: "Calibri", color: ACCENT,
  bold: true, letterSpacing: 2,
});
slide11.addText("Built With", {
  x: 0.8, y: 0.9, w: 11, h: 0.8,
  fontSize: 36, fontFace: "Calibri", color: TEXT_WHITE,
  bold: true,
});

const techStack = [
  { layer: "🖥️  Frontend", tech: "React 19, Vite, Tailwind CSS 4, Lucide Icons" },
  { layer: "⚙️  Backend", tech: "Node.js, Express.js" },
  { layer: "🤖  AI Engine", tech: "Google Gemini 2.5 Flash (@google/genai)" },
  { layer: "💾  Database", tech: "Local JSON Mock (Firebase-compatible)" },
  { layer: "🔐  Auth", tech: "Demo Auth (Firebase-ready)" },
  { layer: "📦  Language", tech: "TypeScript end-to-end" },
  { layer: "🎨  Icons", tech: "Lucide React" },
  { layer: "✨  Animations", tech: "Motion library" },
];

// Table header
slide11.addShape(pptx.ShapeType.rect, {
  x: 0.8, y: 2.0, w: 7, h: 0.5,
  fill: { color: CARD_BG },
});
slide11.addText("LAYER", {
  x: 0.8, y: 2.0, w: 2.5, h: 0.5,
  fontSize: 12, fontFace: "Calibri", color: ACCENT, bold: true, valign: "middle",
  margin: [0, 0, 0, 10],
});
slide11.addText("TECHNOLOGY", {
  x: 3.3, y: 2.0, w: 4.5, h: 0.5,
  fontSize: 12, fontFace: "Calibri", color: ACCENT, bold: true, valign: "middle",
});

techStack.forEach((t, i) => {
  const y = 2.5 + i * 0.55;
  slide11.addText(t.layer, {
    x: 0.8, y, w: 2.5, h: 0.5,
    fontSize: 14, fontFace: "Calibri", color: TEXT_WHITE, bold: true, valign: "middle",
    margin: [0, 0, 0, 10],
  });
  slide11.addText(t.tech, {
    x: 3.3, y, w: 4.5, h: 0.5,
    fontSize: 13, fontFace: "Calibri", color: TEXT_MUTED, valign: "middle",
  });
  slide11.addShape(pptx.ShapeType.line, {
    x: 0.8, y: y + 0.5, w: 7, h: 0,
    line: { color: BORDER, width: 0.5 },
  });
});

// Run commands box
slide11.addShape(pptx.ShapeType.roundRect, {
  x: 8.5, y: 2.0, w: 4, h: 4.5,
  fill: { color: CARD_BG }, line: { color: BORDER, width: 1 },
  rectRadius: 0.15,
});
slide11.addText("🚀", { x: 8.5, y: 2.3, w: 4, h: 0.6, fontSize: 36, align: "center" });
slide11.addText("Run in 2 Commands", {
  x: 8.5, y: 3.0, w: 4, h: 0.4,
  fontSize: 18, fontFace: "Calibri", color: TEXT_WHITE, bold: true, align: "center",
});

slide11.addShape(pptx.ShapeType.roundRect, {
  x: 9, y: 3.8, w: 3, h: 1,
  fill: { color: DARK_BG }, rectRadius: 0.08,
});
slide11.addText("npm install\nnpm run dev", {
  x: 9, y: 3.8, w: 3, h: 1,
  fontSize: 15, fontFace: "Consolas", color: GREEN, align: "center", valign: "middle",
  lineSpacingMultiple: 1.5,
});

slide11.addText("Boots at localhost:3000", {
  x: 8.5, y: 5.0, w: 4, h: 0.4,
  fontSize: 13, fontFace: "Calibri", color: TEXT_MUTED, align: "center",
});

// ================================================================
// SLIDE 12: THANK YOU
// ================================================================
let slide12 = pptx.addSlide();
slide12.background = { color: DARK_BG };

slide12.addText("Thank You! 🙏", {
  x: 0, y: 1.0, w: "100%", h: 1.2,
  fontSize: 60, fontFace: "Calibri", color: TEXT_WHITE,
  bold: true, align: "center",
});
slide12.addText("CivicResolve AI brings transparency, accountability,\nand AI-powered efficiency to municipal complaint resolution.", {
  x: 2, y: 2.5, w: 9, h: 1,
  fontSize: 18, fontFace: "Calibri", color: TEXT_MUTED,
  align: "center", lineSpacingMultiple: 1.4,
});

const summaryCards = [
  { icon: "🤖", title: "AI-Powered", desc: "Gemini 2.5 Flash" },
  { icon: "🔍", title: "Transparent", desc: "Full Audit Trail" },
  { icon: "👥", title: "3 Roles", desc: "Citizen, Admin, Dept" },
  { icon: "✅", title: "Verified", desc: "Before vs After" },
];
summaryCards.forEach((c, i) => {
  const x = 1.5 + i * 2.8;
  const y = 4.0;
  slide12.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 2.4, h: 2,
    fill: { color: CARD_BG }, line: { color: BORDER, width: 1 },
    rectRadius: 0.12,
  });
  slide12.addText(c.icon, { x, y: y + 0.2, w: 2.4, h: 0.5, fontSize: 28, align: "center" });
  slide12.addText(c.title, {
    x, y: y + 0.8, w: 2.4, h: 0.4,
    fontSize: 16, fontFace: "Calibri", color: TEXT_WHITE, bold: true, align: "center",
  });
  slide12.addText(c.desc, {
    x, y: y + 1.3, w: 2.4, h: 0.4,
    fontSize: 12, fontFace: "Calibri", color: TEXT_MUTED, align: "center",
  });
});

slide12.addText("VIBE2SHIP Hackathon 2026", {
  x: 0, y: 6.5, w: "100%", h: 0.5,
  fontSize: 16, fontFace: "Calibri", color: ACCENT, bold: true, align: "center",
});

// ================================================================
// SAVE THE FILE
// ================================================================
const outputPath = "CivicResolve_AI_Presentation.pptx";
pptx.writeFile({ fileName: outputPath }).then(() => {
  console.log(`✅ PowerPoint saved: ${outputPath}`);
}).catch(err => {
  console.error("Error creating PPTX:", err);
});
