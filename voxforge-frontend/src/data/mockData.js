// Central mock data + fake API layer. No backend — everything resolves
// through a simulated delay so components can be written as if it were real.

export const currentUser = {
  id: 'u_001',
  name: 'Ananya Rao',
  email: 'ananya.rao@northfieldbank.com',
  role: 'Workspace Admin',
  org: 'Northfield Bank',
  avatarInitials: 'AR',
  plan: 'Enterprise',
};

export const dashboardStats = {
  activeConversations: 18,
  totalConversations: 4821,
  avgLatencyMs: 312,
  voiceMinutesThisMonth: 6420,
  voiceMinutesQuota: 10000,
  resolutionRate: 0.91,
};

export const latencyTrend = [420, 388, 401, 356, 340, 322, 312];

export const recentConversations = [
  { id: 'c_1042', title: 'Card dispute — transaction #88213', channel: 'Voice', agentPersona: 'Banking Assistant', duration: '4m 12s', status: 'Resolved', updatedAt: '2026-07-05T08:12:00Z' },
  { id: 'c_1041', title: 'Reset online banking password', channel: 'Voice', agentPersona: 'Banking Assistant', duration: '2m 03s', status: 'Resolved', updatedAt: '2026-07-05T07:40:00Z' },
  { id: 'c_1040', title: 'Loan eligibility question', channel: 'Chat fallback', agentPersona: 'Banking Assistant', duration: '6m 51s', status: 'Escalated', updatedAt: '2026-07-04T19:05:00Z' },
  { id: 'c_1039', title: 'Branch hours — Koramangala', channel: 'Voice', agentPersona: 'Banking Assistant', duration: '0m 48s', status: 'Resolved', updatedAt: '2026-07-04T15:22:00Z' },
  { id: 'c_1038', title: 'Update mailing address', channel: 'Voice', agentPersona: 'Banking Assistant', duration: '3m 15s', status: 'Resolved', updatedAt: '2026-07-04T11:58:00Z' },
];

export const conversationHistory = [
  ...recentConversations,
  { id: 'c_1037', title: 'International wire transfer status', channel: 'Voice', agentPersona: 'Banking Assistant', duration: '5m 40s', status: 'Resolved', updatedAt: '2026-07-03T14:10:00Z' },
  { id: 'c_1036', title: 'Fraud alert — verify recent charge', channel: 'Voice', agentPersona: 'Banking Assistant', duration: '3m 02s', status: 'Escalated', updatedAt: '2026-07-03T09:47:00Z' },
  { id: 'c_1035', title: 'Interest rate on fixed deposit', channel: 'Voice', agentPersona: 'Banking Assistant', duration: '1m 55s', status: 'Resolved', updatedAt: '2026-07-02T18:30:00Z' },
  { id: 'c_1034', title: 'Close savings account', channel: 'Voice', agentPersona: 'Banking Assistant', duration: '7m 12s', status: 'Abandoned', updatedAt: '2026-07-02T12:05:00Z' },
  { id: 'c_1033', title: 'Credit score explanation', channel: 'Chat fallback', agentPersona: 'Banking Assistant', duration: '4m 30s', status: 'Resolved', updatedAt: '2026-07-01T16:44:00Z' },
  { id: 'c_1032', title: 'Set up autopay for credit card', channel: 'Voice', agentPersona: 'Banking Assistant', duration: '2m 48s', status: 'Resolved', updatedAt: '2026-06-30T10:15:00Z' },
];

export const conversationSummaries = {
  c_1042: 'Customer disputed a $214.00 charge from an unrecognized merchant. Assistant verified identity, filed a dispute ticket (#DSP-88213), and confirmed a provisional credit within 3–5 business days.',
  c_1040: 'Customer asked about eligibility for a personal loan. Assistant explained general criteria and income requirements, then escalated to a loan officer for a formal quote.',
  c_1036: 'System flagged a suspicious international charge. Assistant confirmed the customer did not recognize it, froze the card, and escalated to the fraud team.',
};

export const conversationTranscripts = {
  c_1042: [
    { speaker: 'user', text: 'Hi, I noticed a charge on my account I don\u2019t recognize.', ts: '00:02' },
    { speaker: 'ai', text: 'I can help with that. Can you confirm the last four digits of the card?', ts: '00:07' },
    { speaker: 'user', text: 'Yes, it\u2019s 4471.', ts: '00:12' },
    { speaker: 'ai', text: 'Thanks. I see a charge of $214.00 from "QWK Digital" on July 3rd. Do you recognize this merchant?', ts: '00:18' },
    { speaker: 'user', text: 'No, never heard of them.', ts: '00:24' },
    { speaker: 'ai', text: 'Understood. I\u2019ve filed a dispute, reference DSP-88213, and applied a provisional credit. You\u2019ll see it in 3 to 5 business days.', ts: '00:31' },
  ],
};

export const knowledgeDocuments = [
  { id: 'd_01', name: 'Employee-Handbook-2026.pdf', type: 'PDF', sizeKb: 2410, status: 'Indexed', uploadedAt: '2026-06-28T10:00:00Z', chunks: 184 },
  { id: 'd_02', name: 'Card-Dispute-Policy.docx', type: 'DOCX', sizeKb: 340, status: 'Indexed', uploadedAt: '2026-06-29T09:20:00Z', chunks: 42 },
  { id: 'd_03', name: 'Loan-Products-Q3.pdf', type: 'PDF', sizeKb: 1180, status: 'Processing', uploadedAt: '2026-07-05T07:55:00Z', chunks: 0 },
  { id: 'd_04', name: 'FAQ-Branch-Hours.txt', type: 'TXT', sizeKb: 12, status: 'Indexed', uploadedAt: '2026-06-15T13:40:00Z', chunks: 6 },
  { id: 'd_05', name: 'Fraud-Escalation-Runbook.pdf', type: 'PDF', sizeKb: 890, status: 'Failed', uploadedAt: '2026-06-20T11:11:00Z', chunks: 0 },
  { id: 'd_06', name: 'KYC-Onboarding-Guide.docx', type: 'DOCX', sizeKb: 560, status: 'Indexed', uploadedAt: '2026-06-10T08:05:00Z', chunks: 76 },
];

export const languageOptions = ['English (US)', 'English (UK)', 'Hindi', 'Spanish', 'French', 'German', 'Japanese'];
export const voiceOptions = [
  { id: 'v1', name: 'Aria', style: 'Warm, professional — female' },
  { id: 'v2', name: 'Callum', style: 'Calm, measured — male' },
  { id: 'v3', name: 'Nova', style: 'Energetic, friendly — female' },
  { id: 'v4', name: 'Denver', style: 'Deep, reassuring — male' },
];

// ---- Fake async API ----
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function fetchDashboardData() {
  await delay(400);
  return { stats: dashboardStats, recent: recentConversations, trend: latencyTrend };
}

export async function fetchConversationHistory() {
  await delay(350);
  return conversationHistory;
}

export async function fetchKnowledgeDocuments() {
  await delay(350);
  return knowledgeDocuments;
}

export async function fetchTranscript(id) {
  await delay(250);
  return conversationTranscripts[id] || [];
}

export async function loginRequest(email, password) {
  await delay(600);
  if (!email || !password) throw new Error('Enter your email and password to continue.');
  return { token: 'mock-token', user: currentUser };
}

export async function registerRequest(payload) {
  await delay(700);
  if (!payload.email || !payload.password) throw new Error('Fill in all required fields to create your account.');
  return { token: 'mock-token', user: { ...currentUser, name: payload.name || currentUser.name, email: payload.email } };
}
