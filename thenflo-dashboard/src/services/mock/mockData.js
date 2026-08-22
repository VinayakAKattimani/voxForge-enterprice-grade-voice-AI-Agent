/* Realistic mock data shared across mock service modules. Shaped the way
   the real API Gateway is expected to return it, so swapping USE_MOCK to
   false is a drop-in change for every page. */

export const FLOW_NAMES = [
  "Create Employee",
  "Run Payroll",
  "Approve Invoice",
  "Onboard Vendor",
  "Generate Report",
  "Close Fiscal Period",
];

const VISITORS = [
  { name: "Priya Nair", company: "Delta Freight Co." },
  { name: "Marcus Webb", company: "Ironclad Logistics" },
  { name: "Sofia Alvarez", company: "Northwind Retail" },
  { name: "Tom Delaney", company: "Beacon Health Group" },
  { name: "Amara Chen", company: "Vertex Manufacturing" },
  { name: "Leo Fischer", company: "Harborline Insurance" },
  { name: "Nadia Rahman", company: "Cobalt Systems" },
  { name: "Ben Okafor", company: "Fieldstone Realty" },
  { name: "Yuki Tanaka", company: "Rowan Analytics" },
  { name: "Grace Kim", company: "Solace Wellness" },
];

const STATUSES = ["Completed", "In Progress", "Failed", "Abandoned"];

function pad(n) {
  return String(n).padStart(2, "0");
}
function fmtDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function genSessions(n) {
  const out = [];
  const now = new Date("2026-08-19T09:30:00");
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getTime() - i * 3.4 * 3600 * 1000 - (i % 5) * 900000);
    const visitor = VISITORS[i % VISITORS.length];
    const flow = FLOW_NAMES[i % FLOW_NAMES.length];
    const status = STATUSES[i % 9 === 0 ? 2 : i % 7 === 0 ? 3 : i % 4 === 0 ? 1 : 0];
    const duration = status === "In Progress" ? 40 + (i % 6) * 20 : 90 + (i * 37) % 420;
    out.push({
      id: `SES-${10482 - i}`,
      date: fmtDate(d),
      visitor: visitor.name,
      company: visitor.company,
      flow,
      duration,
      status,
      interactions: 4 + (i % 9),
    });
  }
  return out;
}

export const SESSIONS = genSessions(28);

export const TRANSCRIPTS_BY_SESSION = {
  default: [
    { role: "visitor", text: "Can you show me how to add a new employee to the system?", time: "00:04" },
    { role: "ai", text: "I can walk you through that now. Opening Employee Management in the product.", time: "00:07" },
    { role: "action", text: "Navigated to Employee Management", time: "00:09" },
    { role: "ai", text: "Here's the employee list. I'll click Add Employee to start a new record.", time: "00:12" },
    { role: "action", text: "Clicked \u201cAdd Employee\u201d", time: "00:14" },
    { role: "visitor", text: "Does it support contractors as well as full-time staff?", time: "00:20" },
    { role: "ai", text: "Yes -- you can set the employment type to Contractor, Full-time, or Part-time from this same form.", time: "00:24" },
    { role: "action", text: "Filled employment type: Full-time", time: "00:27" },
    { role: "ai", text: "I'll fill in a sample name and department, then save the record.", time: "00:31" },
    { role: "action", text: "Submitted employee form", time: "00:36" },
    { role: "ai", text: "The new employee now appears in the directory, confirming the save was successful.", time: "00:40" },
    { role: "visitor", text: "Great, that's exactly what I needed to see.", time: "00:44" },
  ],
};

export const AUTOMATION_TIMELINE_BY_SESSION = {
  default: [
    { step: "Navigate to Employee Management", status: "Successful", time: "00:09" },
    { step: "Click \u201cAdd Employee\u201d", status: "Successful", time: "00:14" },
    { step: "Fill employment type", status: "Successful", time: "00:27" },
    { step: "Submit employee form", status: "Successful", time: "00:36" },
    { step: "Verify employee in directory", status: "Successful", time: "00:40" },
  ],
};

export const KNOWLEDGE_CHUNKS_BY_SESSION = {
  default: [
    { text: "Employee records support three employment types: Full-time, Part-time, and Contractor, each with distinct payroll rules.", doc: "HR_Module_Guide.pdf", score: 0.94 },
    { text: "New employees are added from Employee Management \u2192 Add Employee, requiring name, department, and start date.", doc: "Onboarding_Playbook.docx", score: 0.91 },
    { text: "Contractors are excluded from benefits eligibility calculations by default unless manually flagged.", doc: "Payroll_Policies.pdf", score: 0.78 },
  ],
};

export function genDocs() {
  const files = [
    ["HR_Module_Guide.pdf", "PDF", "2.4 MB", 118],
    ["Onboarding_Playbook.docx", "DOCX", "860 KB", 54],
    ["Payroll_Policies.pdf", "PDF", "1.1 MB", 76],
    ["Invoice_Approval_SOP.pdf", "PDF", "540 KB", 32],
    ["Vendor_Setup_Guide.docx", "DOCX", "690 KB", 41],
    ["Report_Templates_Overview.pdf", "PDF", "3.0 MB", 143],
    ["FAQ_Common_Questions.md", "MD", "88 KB", 21],
    ["Fiscal_Close_Checklist.xlsx", "XLSX", "210 KB", 12],
  ];
  return files.map((f, i) => ({
    id: `DOC-${1000 + i}`,
    filename: f[0],
    type: f[1],
    size: f[2],
    uploaded: `2026-0${(i % 6) + 1}-${10 + i}`,
    chunks: f[3],
    status: i === 6 ? "Failed" : i === 7 ? "Processing" : "Ready",
  }));
}

export function genFlows() {
  return [
    {
      id: "FLOW-01", name: "Create Employee", enabled: true, sessions: 412, successRate: 96,
      description: "Add a new employee record end to end, from the directory to confirmation.",
      steps: [
        { action: "Navigate", target: "Employee Management", description: "Open the employee directory", expected: "Directory list is visible", timeout: 8, fallback: "Retry navigation once" },
        { action: "Click", target: "Add Employee button", description: "Start a new employee record", expected: "Employee form opens", timeout: 5, fallback: "Search UI for alternate label" },
        { action: "Fill form", target: "Employee details", description: "Enter name, department, start date", expected: "All required fields populated", timeout: 10, fallback: "Skip optional fields" },
        { action: "Click", target: "Save button", description: "Submit the employee record", expected: "Confirmation toast appears", timeout: 6, fallback: "Retry submit once" },
        { action: "Verify", target: "Employee directory", description: "Confirm the new record is listed", expected: "New employee visible in list", timeout: 6, fallback: "Refresh directory view" },
      ],
    },
    {
      id: "FLOW-02", name: "Run Payroll", enabled: true, sessions: 288, successRate: 91,
      description: "Trigger a payroll run for the current pay period and confirm completion.",
      steps: [
        { action: "Navigate", target: "Payroll", description: "Open the payroll module", expected: "Payroll dashboard visible", timeout: 8, fallback: "Retry navigation once" },
        { action: "Click", target: "Run Payroll", description: "Start the current pay period run", expected: "Run confirmation dialog opens", timeout: 5, fallback: "None" },
        { action: "Click", target: "Confirm", description: "Confirm the payroll run", expected: "Run status changes to Processing", timeout: 6, fallback: "Retry confirm once" },
        { action: "Verify", target: "Run status", description: "Wait for run to complete", expected: "Status shows Completed", timeout: 20, fallback: "Poll status again" },
      ],
    },
    {
      id: "FLOW-03", name: "Approve Invoice", enabled: true, sessions: 201, successRate: 88,
      description: "Review and approve a pending vendor invoice.",
      steps: [
        { action: "Navigate", target: "Invoices", description: "Open pending invoices queue", expected: "Queue is visible", timeout: 8, fallback: "Retry navigation once" },
        { action: "Click", target: "Invoice row", description: "Open an invoice for review", expected: "Invoice detail opens", timeout: 5, fallback: "Select next row" },
        { action: "Click", target: "Approve button", description: "Approve the invoice", expected: "Status changes to Approved", timeout: 6, fallback: "Retry approve once" },
      ],
    },
    {
      id: "FLOW-04", name: "Onboard Vendor", enabled: false, sessions: 64, successRate: 82,
      description: "Register a new vendor and set up payment details.",
      steps: [
        { action: "Navigate", target: "Vendors", description: "Open vendor management", expected: "Vendor list visible", timeout: 8, fallback: "Retry navigation once" },
        { action: "Click", target: "Add Vendor", description: "Start new vendor record", expected: "Vendor form opens", timeout: 5, fallback: "None" },
        { action: "Fill form", target: "Vendor details", description: "Enter company and payment info", expected: "Required fields populated", timeout: 12, fallback: "Skip optional fields" },
        { action: "Click", target: "Save button", description: "Submit vendor record", expected: "Confirmation toast appears", timeout: 6, fallback: "Retry submit once" },
      ],
    },
    {
      id: "FLOW-05", name: "Generate Report", enabled: true, sessions: 176, successRate: 94,
      description: "Configure and export a standard financial report.",
      steps: [
        { action: "Navigate", target: "Reports", description: "Open reporting module", expected: "Report list visible", timeout: 8, fallback: "Retry navigation once" },
        { action: "Click", target: "Report template", description: "Select a report template", expected: "Configuration panel opens", timeout: 5, fallback: "Select first template" },
        { action: "Click", target: "Generate button", description: "Run the report", expected: "Report renders", timeout: 15, fallback: "Retry generate once" },
      ],
    },
    {
      id: "FLOW-06", name: "Close Fiscal Period", enabled: false, sessions: 39, successRate: 76,
      description: "Walk through the fiscal period close checklist.",
      steps: [
        { action: "Navigate", target: "Fiscal Close", description: "Open the close checklist", expected: "Checklist visible", timeout: 8, fallback: "Retry navigation once" },
        { action: "Click", target: "Start Close", description: "Begin the close process", expected: "Checklist items become active", timeout: 6, fallback: "None" },
        { action: "Verify", target: "Checklist items", description: "Confirm all items complete", expected: "All items checked", timeout: 20, fallback: "Flag incomplete items" },
      ],
    },
  ];
}

export const TEAM = [
  { id: "usr_1", name: "Renee Castillo", email: "renee@thenflo.io", role: "Owner", status: "Active", lastActive: "Just now" },
  { id: "usr_2", name: "David Okoro", email: "david@thenflo.io", role: "Admin", status: "Active", lastActive: "12m ago" },
  { id: "usr_3", name: "Mei Lin Zhou", email: "mei@thenflo.io", role: "Editor", status: "Active", lastActive: "1h ago" },
  { id: "usr_4", name: "Anders Holm", email: "anders@thenflo.io", role: "Editor", status: "Invited", lastActive: "\u2014" },
  { id: "usr_5", name: "Farah Siddiqui", email: "farah@thenflo.io", role: "Viewer", status: "Active", lastActive: "3d ago" },
  { id: "usr_6", name: "Jonas Kruger", email: "jonas@thenflo.io", role: "Viewer", status: "Suspended", lastActive: "22d ago" },
];

export const ACTIVITY = [
  { type: "knowledge", text: "Payroll_Policies.pdf finished processing", time: "6m ago" },
  { type: "flow", text: "Demo flow \u201cApprove Invoice\u201d updated by Mei Lin Zhou", time: "34m ago" },
  { type: "session", text: "Session SES-10479 completed successfully", time: "1h ago" },
  { type: "automation", text: "Automation failure in \u201cOnboard Vendor\u201d \u2014 step 3", time: "2h ago" },
  { type: "team", text: "Anders Holm invited as Editor", time: "5h ago" },
  { type: "billing", text: "Workspace upgraded to the Growth plan", time: "1d ago" },
];

export const AUTOMATION_HISTORY = (() => {
  const rows = [];
  const actions = [
    ["Create Employee", "Click \u201cAdd Employee\u201d", "Click", "Successful"],
    ["Create Employee", "Enter employee name", "Fill", "Successful"],
    ["Create Employee", "Submit form", "Click", "Successful"],
    ["Run Payroll", "Confirm payroll run", "Click", "Successful"],
    ["Run Payroll", "Poll run status", "Verify", "Successful"],
    ["Approve Invoice", "Open invoice row", "Click", "Successful"],
    ["Approve Invoice", "Approve invoice", "Click", "Failed"],
    ["Onboard Vendor", "Fill payment details", "Fill", "Failed"],
    ["Generate Report", "Select template", "Click", "Successful"],
    ["Generate Report", "Run generate", "Click", "Successful"],
    ["Close Fiscal Period", "Verify checklist", "Verify", "Failed"],
    ["Create Employee", "Verify directory", "Verify", "Successful"],
  ];
  for (let i = 0; i < actions.length; i++) {
    rows.push({
      session: SESSIONS[i % SESSIONS.length].id,
      flow: actions[i][0],
      step: actions[i][1],
      action: actions[i][2],
      time: `${(0.4 + (i % 5) * 0.3).toFixed(1)}s`,
      status: actions[i][3],
    });
  }
  return rows;
})();

export function genTimeSeries() {
  const out = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date("2026-08-19T00:00:00");
    d.setDate(d.getDate() - i);
    out.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      sessions: 260 + Math.round(60 * Math.sin(i / 2.4)) + (i % 3) * 12,
      successful: 220 + Math.round(50 * Math.sin(i / 2.4 + 0.4)) + (i % 4) * 8,
    });
  }
  return out;
}

export const FLOW_USAGE = FLOW_NAMES.map((f, i) => ({ name: f, sessions: [412, 288, 201, 176, 64, 39][i] }));

export const TOP_QUESTIONS = [
  { q: "Does it support contractors?", count: 312 },
  { q: "Can I export this report to Excel?", count: 274 },
  { q: "How long does approval take?", count: 219 },
  { q: "Is there an audit trail?", count: 188 },
  { q: "Can multiple people approve at once?", count: 151 },
];

export const AI_PERFORMANCE = [
  { label: "Total response time", ms: 620 },
  { label: "Speech-to-text", ms: 180 },
  { label: "Knowledge retrieval", ms: 140 },
  { label: "Language model", ms: 340 },
  { label: "Text-to-speech", ms: 210 },
  { label: "Automation execution", ms: 890 },
];

export const PLANS = [
  { id: "starter", name: "Starter", price: "$99", period: "/mo", sessions: 200, minutes: 400, storage: "1 GB", seats: 3 },
  { id: "growth", name: "Growth", price: "$349", period: "/mo", sessions: 1000, minutes: 2000, storage: "5 GB", seats: 10, popular: true },
  { id: "business", name: "Business", price: "$899", period: "/mo", sessions: 3500, minutes: 7000, storage: "20 GB", seats: 30 },
  { id: "enterprise", name: "Enterprise", price: "Custom", period: "", sessions: "Unlimited", minutes: "Unlimited", storage: "Custom", seats: "Unlimited" },
];

export const BILLING_SUMMARY = {
  planId: "growth",
  planName: "Growth",
  billingPeriod: "Aug 1 \u2014 Aug 31, 2026",
  nextBillingDate: "2026-09-01",
  estimatedBill: "$349.00",
  usage: {
    sessions: { used: 720, limit: 1000 },
    minutes: { used: 1240, limit: 2000 },
    storageGb: { used: 2.4, limit: 5 },
  },
};

export const BILLING_HISTORY = [
  { invoice: "INV-2026-0007", date: "2026-08-01", amount: "$349.00", status: "Paid" },
  { invoice: "INV-2026-0006", date: "2026-07-01", amount: "$349.00", status: "Paid" },
  { invoice: "INV-2026-0005", date: "2026-06-01", amount: "$349.00", status: "Paid" },
  { invoice: "INV-2026-0004", date: "2026-05-01", amount: "$99.00", status: "Paid" },
  { invoice: "INV-2026-0003", date: "2026-04-01", amount: "$99.00", status: "Paid" },
];

export const CURRENT_USER = {
  id: "usr_1",
  name: "Renee Castillo",
  email: "renee@thenflo.io",
  role: "Owner",
  company: "Northwind Retail",
  initials: "RC",
};
