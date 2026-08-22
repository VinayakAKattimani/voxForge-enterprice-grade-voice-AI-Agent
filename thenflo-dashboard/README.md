# ThenFLo — Admin Dashboard

The admin/customer dashboard for ThenFLo, the AI Voice Demo Engineer. This is
**not** the public-facing `/demo/:workspace` experience — it's where a
company's team configures, monitors, and manages their ThenFLo deployment.

## Stack

- React 18 + Vite
- React Router v6 (client-side routing, protected routes)
- Tailwind CSS (design tokens as CSS variables, dark/light theme)
- Recharts (analytics charts)
- lucide-react (icons)

No state management library — auth and toast state are small enough for
React Context, and each page owns its own server-state via the `useAsync`
hook described below.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

The app boots straight into mock mode (see below), so `npm run dev` gives
you a fully working dashboard with no backend required. Sign in with any
email/password on the login screen.

```bash
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

## Project structure

```
src/
├── components/
│   ├── ui/          Reusable primitives: Button, Card, Badge, Modal,
│   │                ConfirmDialog, EmptyState, LoadingState, ErrorState,
│   │                AsyncView, FormField, SearchBar, FilterBar, DataTable,
│   │                Tabs, StatCard, UsageMeter, PlanCard, WaveBars
│   └── layout/       Sidebar, Topbar
├── layouts/          DashboardLayout (sidebar + topbar shell), AuthLayout
├── pages/            One file/folder per route (see Routing below)
├── routes/           AppRoutes.jsx (route table), ProtectedRoute.jsx
├── store/            AuthContext, ToastContext
├── hooks/            useAuth, useAsync, useDebounce, useTheme
├── services/
│   ├── api/          One module per domain: authApi, conversationApi,
│   │                 knowledgeApi, demoApi, automationApi, analyticsApi,
│   │                 billingApi, userApi — plus client.js (the single
│   │                 fetch wrapper every module goes through)
│   └── mock/         mockData.js (realistic fixtures), mockDb.js (fake
│                      latency/failure helper)
└── utils/            format.js, constants.js
```

**Pages never call `fetch` directly.** The chain is always:

```
Page component → services/api/<domain>Api.js → apiClient → API Gateway
```

## Connecting a real backend

Every function in `src/services/api/*.js` is written like this:

```js
async getSummary() {
  if (USE_MOCK) return delay(mockSummary);
  return apiClient.get("/analytics/summary");
}
```

To go live:

1. Set `VITE_API_BASE_URL` in `.env` to your API Gateway origin.
2. Set `VITE_USE_MOCK=false`.

No page or component needs to change — they only ever call the `*Api`
functions, and those functions already know how to talk to the real
endpoint. `src/services/api/client.js` is the one place that knows about
base URLs, auth headers, and 401/refresh-token handling; it's designed to
sit behind a single API Gateway rather than pointing at individual
services (STT, TTS, automation, etc.) directly.

## Auth

`AuthContext` (`src/store/AuthContext.jsx`) holds the current user and
auth status (`checking` / `authenticated` / `unauthenticated`).
`ProtectedRoute` wraps the `/dashboard` route tree and redirects to
`/login` when unauthenticated. Access/refresh tokens live in
`localStorage` via `tokenStore` in `client.js`; `apiClient` automatically
retries a request once with a refreshed token on a 401, and force-logs-out
on refresh failure.

## Loading / empty / error / success states

`useAsync(fetcher, deps)` (`src/hooks/useAsync.js`) runs an API call and
returns `{ status, data, error, reload }`, where `status` is one of
`loading | empty | error | success`. `<AsyncView state={...}>` renders the
right UI for each state automatically, so every data-driven page gets
consistent loading spinners, retryable error messages, and empty states
for free — see any page in `src/pages/` for the pattern.

## Routing

```
/login
/dashboard
/dashboard/sessions
/dashboard/sessions/:id
/dashboard/analytics
/dashboard/knowledge
/dashboard/demo-flows
/dashboard/demo-flows/:id
/dashboard/automation
/dashboard/configuration
/dashboard/team
/dashboard/billing
/dashboard/settings
```

The public demo experience (`/demo/:workspace`) is a deliberately separate
frontend and is not part of this project.

## Design

Dark/light theme via CSS variables in `src/index.css`, toggled by adding
`.dark` to `<html>` (see `useTheme`). Tailwind's `theme.extend.colors`
maps utility classes (`bg-signal`, `text-pulseText`, `border-line`, etc.)
straight onto those variables so both themes stay in sync automatically.

The sidebar is collapsed (68px, icons only) by default and expands to
236px on hover, matching the interaction pattern of tools like OrangeHRM.
On small screens it becomes a slide-in panel behind a hamburger button
instead of relying on hover.

## Billing

`src/pages/billing/Billing.jsx` and `src/services/api/billingApi.js` are
intentionally thin: usage meters, a plan comparison grid, and an invoice
history table, all backed by placeholder actions (`Upgrade` / `Manage
plan`). No payment collection happens in this codebase — the shape of
`billingApi` is meant to make it straightforward to wire up Stripe (or
another provider) behind the API Gateway later without touching the page.
