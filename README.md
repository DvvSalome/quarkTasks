# Quark Tasking

**Your cognitive operating system for productivity.**

Quark Tasking is a next-generation, AI-powered productivity platform built on a foundation of privacy, digital sovereignty, and zero-knowledge architecture. It adapts to your mind — not the other way around.

---

## Overview

Quark Tasking is a **single-page application (SPA)** built as a React 18 frontend with no backend server in this repository. All data is currently stored in the browser's `localStorage` using mock data, simulating a full productivity ecosystem. A Supabase PostgreSQL schema is provided (`schema.sql`) but not yet connected — the frontend operates entirely client-side.

The entire UI is in **Spanish** (labels, greetings, onboarding flow) with real-time date formatting using the `es-ES` locale.

---

## Features

### Core

- **AI Copilot (Neural Core)** — Real-time cognitive assistant that analyzes your productivity patterns, suggests task scheduling based on your energy levels, and detects burnout risk before it happens. Includes a chat interface with simulated AI responses, a 4-step reasoning pipeline visualization, and dynamic recommendation cards.

- **Cognitive Dashboard** — Live metrics dashboard with 4 key performance indicators (tasks completed, focused hours, performance score, activity streak), an energy level bar chart (8 bars spanning 9 AM–4 PM with color-coded intensity), upcoming tasks list, AI insights panel, and a mini calendar section.

- **Task Management** — Kanban-style task board with 4 columns (Backlog, To Do, In Progress, Completed). Each task supports priority levels (high/medium/low with distinct color coding), tags, assignee avatars, due dates, and AI-generated suggestions marked with a glowing lightbulb icon.

- **Deep Focus Sessions** — Pomodoro-based circular timer (25 min default) with SVG progress ring, play/pause/reset controls, mode selector (Focus / Break / Deep), an animated breathing guide, current task checklist, and an ambient sounds grid (Lluvia, Océano, Bosque, Café, Silencio, Jazz — UI only, no audio backend).

- **Routines** — Build and track repeatable daily routines across a week selector (Mon–Sun). Features 3 routine cards (Morning Flow, Deep Work Block, Evening Review) with color-coded icons, subtask checklists, streak counters, completion percentage bars, and a statistics sidebar (total routines, streak, consistency %, best streak, total time/week).

- **Analytics** — Productivity analytics with time range selector (Day / Week / Month), 4 stat cards, weekly performance bar chart with gradient bars, category breakdown (Desarrollo 45%, Diseño 25%, Reuniones 20%, Docs 10%), AI insights panel, and a 7-day energy analysis chart color-coded by intensity.

- **Workflow** — SVG-based visual process flow diagram with 5 connected nodes (Planning → Design → Development → Testing → Deployment). Features an animated play/pause toggle that pulses a glowing circle along connection lines, zoom controls (50%–150%), and a sidebar with active projects and recent flows.

### Appearance & Themes

- **4 built-in themes** — Quantum Dark (default deep purple), Midnight (electric blue), Aurora (energy pink), Nebula (soft violet). All apply instantly without page reload and persist across sessions via `localStorage`.

- **CSS variable-driven theming** — Every color token is defined as RGB channel CSS custom properties (e.g., `--quantum-500: 123 61 255`), enabling full Tailwind opacity modifier support (`bg-quantum-500/20`) and real-time theme switching via JavaScript DOM injection.

- **Visual effects system** — Toggle particles, glassmorphism, glow effects, and animations independently via CSS classes on `<html>` (e.g., `fx-no-particles`). Each preference is saved to `localStorage`.

- **Animated particle field** — 55 physics-varied particles with multi-color palette (purple, blue, pink, violet), random sizes (1–3.5px), organic X-drift, and upward float animation.

- **Ambient orbs** — Three large animated radial gradients (purple, cyan, pink) that drift slowly across the background using Framer Motion.

- **Mouse-follow gradient** — Subtle radial gradient that tracks cursor movement across the entire app using spring physics (70vw wide, damping 45, stiffness 90).

### AI Provider Configuration

- **Bring your own API key** — Connect any AI provider directly from Settings. Keys are stored in `localStorage` only — never sent to Quark servers.

- **Supported providers** — OpenAI (GPT-4o, GPT-4 Turbo, GPT-3.5), Anthropic (Claude Opus 4.7, Sonnet 4.6, Haiku 4.5), Google AI (Gemini 2.0 Flash, 1.5 Pro), Mistral (Large, 8x22B), and any OpenAI-compatible custom endpoint with configurable base URL and model name.

- **Connection verification** — Test your API key against the selected provider before saving (currently simulated — checks if key length > 8).

- **Neural Core toggles** — Fine-grained control over: auto-planning, smart suggestions, pattern analysis, burnout prediction.

- **AI autonomy levels** — Basic / Advanced / Experimental — controls how aggressively the system acts on insights.

### Profile & Account Management

- **Inline field editing** — Edit display name, @username, email, phone number with save/cancel UX and animated confirmation feedback.

- **Avatar upload** — Upload a profile photo via FileReader (read locally, no server upload).

- **Password change** — Expandable password update form with per-field visibility toggle.

- **Session management** — View and revoke active sessions by device and location (UI mockup with 3 simulated sessions).

- **Quick logout / account switch** — Instant session termination via `localStorage` clear + page reload.

- **Danger zone** — Typed-confirmation deletion for "clear all data" and "delete account" — both irreversible actions require the user to type a confirmation string.

### Notifications

- **Channel control** — Toggle push notifications, email, and in-app notifications independently.

- **Frequency selector** — Instant / Daily digest / Weekly digest.

- **Category toggles** — Granular control over 3 groups:
  - *Productivity:* task reminders, focus alerts, daily goals, streak alerts
  - *AI:* copilot insights, recommendations, weekly report
  - *System:* app updates, maintenance, security alerts

### Security

- **Two-factor authentication** — Toggle 2FA with method selector: authenticator app or SMS (requires phone number in profile).

- **Active sessions panel** — View all logged-in devices with location and timestamp. Revoke any session individually or all at once.

- **Privacy controls** — Opt-in/out of anonymous telemetry, AI learning from your data, and cloud sync.

- **GDPR rights panel** — Export all data as JSON. Request full account deletion ("right to be forgotten").

### Authentication

- **Registration fields** — Display name (how the AI addresses you), @username (unique account handle), email, phone (optional, for 2FA), password.

- **Login** — Email or @username + password.

- **SSO** — Google sign-in button (UI-ready, no OAuth integration).

- **Mouse-tracking background** — Dynamic radial gradient follows cursor on the login page.

---

## App Architecture

### Entry Point & Routing

The app has no React Router — navigation is managed via a simple `currentPage` state in `App.jsx` with 4 possible application states:

1. **`loading`** — An animated splash screen with orbital rings, pulsing logo, "INICIALIZANDO SISTEMA..." text, and 4 animated dots. Displays for 1.8 seconds.
2. **`login`** — Renders the `<Login />` component. Sets `quark_session` in localStorage on completion.
3. **`onboarding`** — Renders the `<Onboarding />` first-run wizard. Sets `quark_onboarded` in localStorage.
4. **`app`** — The main application layout with `<CosmicBackground />` (persistent background layer), `<Sidebar />` (left navigation), `<TopBar />` (header), and `<AnimatePresence>`-wrapped page transitions using Framer Motion (opacity + scale + blur animations).

### State Management

- **No external state library.** All component state uses React `useState` and `useEffect` hooks.
- **localStorage persistence keys:** `quark_session`, `quark_onboarded`, `quark_theme`, `quark_effects`, `quark_ai_config`.
- **No API calls.** All data is mock/hardcoded. AI chat simulates a 2-second response delay. AI connection test simulates a 1.8-second delay.

### Database Schema

A Supabase (PostgreSQL) schema is provided in `schema.sql` with:

- **`profiles`** — User profiles with UUID PK (references `auth.users`), name, random color assignment, auto-create trigger on user signup. Row Level Security (RLS) enforced.
- **`tasks`** — Full task model with title, description, project, status (backlog/doing/review/done), priority, tags (text array), due date, blocked/stuck flags, AI notes, assignee IDs (uuid array), checklist (JSONB), auto-update timestamp trigger. RLS with collaborative access policies.
- **`task_comments`** — Task-level comments with FK cascade delete. RLS: select all, insert own.

All tables are added to `supabase_realtime` publication for live collaboration support.

**Note:** The frontend does not currently connect to Supabase. This schema is provided as the data layer blueprint for future backend integration.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | JavaScript (JSX) |
| Animations | Framer Motion 11 (spring physics, layout animations, shared element transitions) |
| Styling | Tailwind CSS 3 (CSS-variable-driven theming, custom animations, glassmorphism) |
| Charts | SVG-based (custom hand-coded bars; Recharts is listed as a dependency but not used) |
| Icons | Lucide React (50+ icon types) |
| UI Primitives | Radix UI (Dialog, DropdownMenu, Popover, Select, Switch, Tabs, Tooltip, Progress) |
| State | React local state + localStorage persistence |
| CSS Utilities | clsx + tailwind-merge (`cn()` helper) |
| Fonts | Plus Jakarta Sans (sans-serif), IBM Plex Mono (monospace) — Google Fonts CDN |
| Database | Supabase / PostgreSQL (schema only, not integrated) |

---

## Project Structure

```
src/
├── App.jsx                  # Root router (4 states), loading screen, main layout
├── main.jsx                 # React entry point + ThemeProvider wrapper
├── index.css                # Global styles, CSS variables, glass effects, effect toggles
├── contexts/
│   └── ThemeContext.jsx     # Theme system provider (4 themes, 4 effect toggles, CSS injection)
├── components/
│   ├── CosmicBackground.jsx # Particle field (55 particles), ambient orbs, mouse-follow gradient
│   ├── Sidebar.jsx          # Navigation with animated active indicator (layoutId)
│   ├── TopBar.jsx           # Greeting breadcrumb, search bar, notification bell, avatar
│   ├── Dashboard.jsx        # Cognitive dashboard: KPI cards, energy chart, AI insights
│   ├── AICopilot.jsx        # Neural Core AI chat: quick actions, reasoning pipeline, recommendations
│   ├── Tasks.jsx            # Kanban task board: 4 columns, priorities, tags, AI suggestions
│   ├── Focus.jsx            # Pomodoro timer: circular progress, breath guide, ambient sounds
│   ├── Routines.jsx         # Daily routine builder: week selector, streak tracking, statistics
│   ├── Analytics.jsx        # Analytics: weekly charts, category breakdown, energy analysis
│   ├── Workflow.jsx         # SVG process flow: 5 nodes, animated connections, zoom controls
│   ├── Settings.jsx         # 8-section settings (1042 lines): appearance, profile, AI, notifications, security
│   ├── Login.jsx            # Auth page: login/register toggle, Google SSO, mouse-follow gradient
│   └── Onboarding.jsx       # 6-step first-run wizard with progress bar and validation
└── lib/
    └── utils.js             # cn(), formatDate (es-ES), formatTime, getGreeting, generateId
```

---

## Color Palette

| Name | Hex | Role |
|---|---|---|
| Quantum Purple | `#7B3DFF` | Brand primary, interactive elements |
| Nebula Violet | `#A78BFA` | Secondary, hover states |
| Deep Indigo | `#1E1B3A` | Surface backgrounds |
| Electric Blue | `#3D5AFE` | Action buttons, CTAs |
| Energy Pink | `#FF4DDB` | Accents, alerts, notifications |
| Slate Gray | `#8B8FA6` | Secondary text, subtle borders |

All colors are defined as RGB channel CSS variables (e.g., `--quantum-500: 123 61 255`) enabling full Tailwind opacity modifier support (`bg-quantum-500/20`) and real-time runtime theme switching via JavaScript DOM injection.

---

## Theme System

The theme system in `ThemeContext.jsx` is one of the most sophisticated parts of the app:

- **4 themes** defined as CSS variable maps (Quantum Dark, Midnight, Aurora, Nebula), each overriding 14 color tokens (10 `--quantum-*` scale variables + 4 `--neon-*` accent variables).
- **4 visual effect toggles** persisted to localStorage: Particles, Glassmorphism, Glow, Animations — applied as CSS classes on `<html>` that cascade through the global stylesheet.
- **Persistence:** `quark_theme` and `quark_effects` keys in localStorage.
- **Application:** `applyTheme()` loops over theme CSS keys and sets them via `root.style.setProperty()`. `applyEffects()` toggles CSS classes on `<html>`.

---

## Component Details

### CosmicBackground.jsx
Renders a persistent visual atmospheric layer with:
- 55 animated particles (memoized with `useMemo`) with random sizes, brand colors, and upward drift animation via absolute positioning and CSS keyframes.
- 3 ambient orbs using Framer Motion's `animate` with drifting translate animations.
- Mouse-follow gradient using Framer Motion `useMotionValue` + `useSpring` for smooth cursor tracking (damping: 45, stiffness: 90).
- Fixed CSS grid overlay masked by a radial gradient.

### Sidebar.jsx
- 8 navigation items with Lucide icons (Dashboard, AI Copilot, Tareas, Enfoque, Rutinas, Analytics, Workflow, Ajustes).
- Animated active indicator using Framer Motion's `layoutId="activeAccent"` for smooth shared-element transitions.
- AI Status Card at the bottom showing "IA ACTIVA" with a pulsing green dot.

### Settings.jsx (largest component — 1042 lines)
8 sections controlled by an internal `activeSection` state:
1. **Apariencia** — Theme selector (4 preview cards with color swatches) + effect toggles
2. **Perfil** — Avatar upload via FileReader, inline editable fields (save/cancel pattern), password change form, danger zone
3. **Configuración IA** — Provider selector, API key input (password-masked), model selector per provider, custom endpoint, connection test, Neural Core toggles, autonomy level
4. **Notificaciones** — Channel toggles, frequency selector, category toggles (10 total across 3 groups)
5. **Seguridad** — 2FA toggle, active sessions panel, privacy controls, GDPR panel
6. **Integraciones** — Placeholder
7. **Datos** — Placeholder
8. **Ayuda** — Placeholder

### Login.jsx
- Two-column layout: brand panel (logo, tagline, 3 feature highlights) + form panel.
- Toggle between Login (email/username + password) and Register (display name, @username, email, phone, password).
- Google SSO button (UI only — no OAuth integration).
- "Entrar ahora mismo" quick-entry button that bypasses auth.

### Onboarding.jsx
6-step animated wizard with header indicator (current step / total steps):
1. Welcome (animated brain icon)
2. Profile (name input)
3. Work style (morning/night/afternoon/flexible — radio cards with icons)
4. Focus time (25/45/90/120 min — radio cards)
5. Goals (multi-select: productivity, focus, routine, work-life balance, goals, habits)
6. Ready (summary with "SISTEMA CONFIGURADO" badge)

---

## Current Limitations

- **No backend integration.** The `schema.sql` file exists but the frontend does not connect to Supabase. All data is hardcoded mock data.
- **No actual API calls.** AI Copilot responses are simulated. The AI connection test in Settings merely checks if API key length > 8 with a simulated 1.8s delay.
- **No React Router.** Page navigation uses a simple `currentPage` state variable — no URL routes or deep linking.
- **No audio implementation.** The ambient sounds grid in Focus.jsx has no audio backend — buttons are decorative.
- **No actual OAuth.** The Google sign-in button has no authentication integration.
- **Security is client-side only.** 2FA, session management, and privacy controls are UI mockups with no server-side enforcement.
- **The app is a design prototype.** Visually polished with comprehensive UI interactions, but functionally limited to client-side state simulation.

---

## Data Philosophy

> **"Your data belongs to you. Always."**

Quark Tasking was founded on a radical philosophy of privacy, digital sovereignty, and user protection. The platform does not view data as a resource to be exploited — it is the exclusive property of each individual or team using the system.

Quark's entire architecture is designed on the principle of **zero trust**, where the user maintains real control over what information exists, where it is stored, how it is processed, and who can access it.

**Core commitments:**

- **Zero-Knowledge architecture** — Data is encrypted on your device before it ever reaches our servers. We cannot read it. No one can.
- **No data sales** — We do not sell, license, or share your personal data with any third party, ever.
- **Transparent AI** — The Neural Core AI operates with your explicit consent on each feature. You decide what it learns and what it does with that knowledge.
- **Your API keys stay local** — When you configure a third-party AI provider, your API key is stored in your browser's localStorage only. It never touches Quark's infrastructure.
- **GDPR compliant** — Full data export on demand. Right to erasure honored immediately and completely.
- **Auditable** — Quark's security architecture is designed to be independently audited. We welcome scrutiny.

Quark's AI must not become a tool for surveillance, invasive profiling, or hidden monetization. It is an intelligent assistance system built around **transparency, consent, and operational security**.

---

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

---

## License

Private. All rights reserved — Quark Tasking.
