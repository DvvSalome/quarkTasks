# Quark Tasking

**Your cognitive operating system for productivity.**

Quark Tasking is a next-generation productivity platform powered by AI, built on a foundation of privacy, digital sovereignty, and zero-knowledge architecture. It adapts to your mind — not the other way around.

---

## Features

### Core

- **AI Copilot (Neural Core)** — Real-time cognitive assistant that analyzes your productivity patterns, suggests task scheduling based on your energy levels, and detects burnout risk before it happens.
- **Cognitive Dashboard** — Live metrics: tasks completed, focused hours, performance score, and activity streaks. Energy level chart updates throughout the day.
- **Task Management** — Full task lifecycle with priority levels (urgent / normal / low), project grouping, and AI-generated task creation.
- **Deep Focus Sessions** — Pomodoro-based focus timer with session tracking and automatic break scheduling.
- **Routines** — Build and track repeatable daily routines. AI optimizes routine order based on your performance data.
- **Analytics** — Weekly and monthly productivity reports, pattern detection, and trend visualization via Recharts.
- **Workflow** — Collaborative Kanban board with drag-and-drop task management across custom stages.

### Appearance & Themes

- **4 built-in themes** — Quantum Dark (default), Midnight (electric blue), Aurora (energy pink), Nebula (soft violet). All apply instantly and persist across sessions.
- **CSS variable-driven theming** — Every color token is a runtime CSS variable, enabling true theme switching without page reload.
- **Visual effects system** — Toggle particles, glassmorphism, glow effects, and animations independently. Each preference is saved to `localStorage`.
- **Animated particle field** — 55 physics-varied particles with multi-color palette, organic X-drift, and ambient orb backgrounds.
- **Mouse-follow gradient** — Subtle radial gradient tracks cursor across the entire app for depth.

### AI Provider Configuration

- **Bring your own API key** — Connect any AI provider directly from Settings. Keys are stored in `localStorage` only — never sent to Quark servers.
- **Supported providers** — OpenAI (GPT-4o, GPT-4 Turbo, GPT-3.5), Anthropic (Claude Opus 4.7, Sonnet 4.6, Haiku 4.5), Google AI (Gemini 2.0 Flash, 1.5 Pro), Mistral (Large, 8x22B), and any OpenAI-compatible custom endpoint.
- **Connection verification** — Test your API key against the selected provider before saving.
- **Neural Core toggles** — Fine-grained control over: auto-planning, smart suggestions, pattern analysis, burnout prediction.
- **AI autonomy levels** — Basic / Advanced / Experimental — controls how aggressively the system acts on insights.

### Profile & Account Management

- **Inline field editing** — Edit display name, @username, email, phone number — all inline with save/cancel and animated confirmation.
- **Avatar upload** — Upload a profile photo (read locally, no server upload required).
- **Password change** — Expandable password update form with field-level visibility toggle.
- **Session management** — View and revoke active sessions by device and location.
- **Quick logout / account switch** — Instant session termination via localStorage clear + reload.
- **Danger zone** — Typed-confirmation deletion for "clear all data" and "delete account" — both irreversible actions require the user to type a confirmation string.

### Notifications

- **Channel control** — Toggle push notifications, email, and in-app notifications independently.
- **Frequency selector** — Instant / Daily digest / Weekly digest.
- **Category toggles** — Granular control over three groups:
  - *Productivity:* task reminders, focus alerts, daily goals, streak alerts
  - *AI:* copilot insights, recommendations, weekly report
  - *System:* app updates, maintenance, security alerts

### Security

See [Data Philosophy](#data-philosophy) below.

- **Two-factor authentication** — Toggle 2FA with method selector: authenticator app or SMS (requires phone number in profile).
- **Active sessions panel** — View all logged-in devices with location and timestamp. Revoke any session individually or all at once.
- **Privacy controls** — Opt-in/out of anonymous telemetry, AI learning from your data, and cloud sync.
- **GDPR rights panel** — Export all data as JSON. Request full account deletion ("right to be forgotten").

### Authentication

- **Registration fields** — Display name (how the AI addresses you), @username (unique account handle), email, phone (optional, for 2FA), password.
- **Login** — Email or @username + password.
- **SSO** — Google sign-in button (UI-ready).
- **Mouse-tracking background** — Dynamic radial gradient follows cursor on the login page.

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

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Animations | Framer Motion 11 |
| Styling | Tailwind CSS 3 (CSS-variable theming) |
| Charts | Recharts |
| Icons | Lucide React |
| UI Primitives | Radix UI |
| State | React local state + `localStorage` |
| Fonts | Plus Jakarta Sans, IBM Plex Mono |

---

## Project Structure

```
src/
├── App.jsx                  # Root router, loading screen, layout
├── main.jsx                 # React entry point + ThemeProvider
├── index.css                # Global styles, CSS variables, effect toggles
├── contexts/
│   └── ThemeContext.jsx     # Theme system (4 themes, 4 effect toggles)
├── components/
│   ├── CosmicBackground.jsx # Particle field, ambient orbs, mouse-follow gradient
│   ├── Sidebar.jsx          # Navigation with animated active indicator
│   ├── TopBar.jsx           # Search, notifications, breadcrumb
│   ├── Dashboard.jsx        # Cognitive dashboard with metrics and energy chart
│   ├── AICopilot.jsx        # Neural Core chat interface
│   ├── Tasks.jsx            # Task management
│   ├── Focus.jsx            # Deep focus / Pomodoro timer
│   ├── Routines.jsx         # Daily routine builder
│   ├── Analytics.jsx        # Productivity analytics
│   ├── Workflow.jsx         # Collaborative Kanban
│   ├── Settings.jsx         # Full settings: appearance, profile, AI, notifications, security
│   ├── Login.jsx            # Auth page with registration fields
│   └── Onboarding.jsx       # First-run setup flow
└── lib/
    └── utils.js             # Shared utilities
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

All colors are defined as RGB channel CSS variables (`--quantum-500: 123 61 255`) enabling full Tailwind opacity modifier support (`bg-quantum-500/20`) and real-time theme switching.

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
