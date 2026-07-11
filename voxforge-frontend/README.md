# VoxForge — Enterprise Voice AI Platform (Frontend)

A modern, minimal React + JavaScript frontend for an enterprise voice AI platform. Built with plain CSS design tokens (no Tailwind/UI kit), React Router, and mock data only — no backend required.

## Stack
- React 19 + JavaScript (functional components, hooks)
- React Router v7 for navigation
- Plain CSS with a custom design-token system (light/dark theme via CSS variables)
- Web Audio API for a real, live microphone waveform on the Voice Conversation page (falls back to a simulated animation if mic access is denied)

## Getting started
```bash
npm install
npm run dev       # start local dev server
npm run build      # production build to dist/
```

## Pages
- **Login / Register** — mock auth (any email/password works; a "Continue with demo workspace" shortcut is on the login screen)
- **Dashboard** — greeting, active/total conversations, latency, voice usage, recent activity
- **Voice Conversation** — mic button, live waveform, live transcript, AI response panel with playback controls, timeline, stop/pause/restart, connection status, and a text-input fallback
- **Conversation History** — search, date filter, view transcript + summary, delete
- **Knowledge Base** — drag-and-drop upload (PDF/DOCX/TXT), simulated processing status, search, delete
- **Settings** — theme toggle, language, voice, notifications, account
- **Profile** — account details + usage overview

## Structure
```
src/
  components/
    layout/     Sidebar, Topbar, AppLayout (responsive shell)
    ui/         Button, Card, Badge, Field/Input/Select/Switch, Modal, EmptyState, StatCard, icons
    voice/      Waveform, MicButton, TranscriptPanel, Timeline
  context/      AuthContext, ThemeContext
  data/         mockData.js — all mock data + a fake async API layer
  pages/        one file per route, plus a co-located .css file
```

## Notes
- All data is mocked in `src/data/mockData.js` and resolves through simulated network delay, so it's easy to swap in real API calls later.
- The mic button requests real microphone access to drive the waveform; if denied, it falls back to a smooth simulated animation so the demo still works.
- Auth session is stored in `sessionStorage` for demo persistence only — nothing is sent to a server.
