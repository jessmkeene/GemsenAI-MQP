# Tech Stack — A-Term Prototype (Agent Dashboard Mockup)

Scope: low-fidelity, clickable dashboard mockup due Oct 9 (A-Term Project 5), demonstrating
sample agents (existing + theoretical) greeting the user and proposing help with work tasks.
Not the B-Term production harness — see "What this is not" below.

## Decisions

| Layer | Choice | Status |
|---|---|---|
| UI framework | Next.js (React) + TypeScript, run locally (`npm run dev`) | Decided |
| Styling / components | Tailwind CSS + shadcn/ui (built on Radix primitives) | Decided |
| Backend | None for this pass — no FastAPI/API layer yet | Decided |
| Agent data | Static JSON/TS fixtures, one entry per agent card | Decided |
| Greeting / proposal logic | Client-side rules evaluated against the fixtures (e.g. `unread > 0 → propose "draft replies"`) | Decided |
| Interaction model | Clickable flows per agent (plan → fake run → result), not descriptive cards with screenshots | Decided |
| Hosting for the demo | Vercel (free tier) | Decided |
| Dev tooling / coding assistant | Open choice per team member — Gemini, Claude, OpenAI/Codex, or similar (per sponsor) | Decided, not a deliverable constraint |
| Source control / CI | Git + GitHub (existing `GemsenAI-MQP` repo), GitHub Actions if time allows | Decided |
| Team comms for this sprint | Notion (sponsor-facing hub), WhatsApp (quick sync), email (official record), GitHub (code) | Decided |
| Sprint / epic tracking | Excel spreadsheet (replaces Jira) | Decided |

## Why these choices

- **Timeline (Oct 9, ~6 days out) drives everything.** Gemsen's Google Cloud Workstation
  access is still an open action item (credentials not yet resent, access not yet confirmed
  by the team), so the mockup is built locally/independent of Gemsen's infra and hosted on
  Vercel so the demo doesn't depend on anything Gemsen hasn't provisioned yet.
- **No backend, no real model calls.** The sponsor's own framing of this stage — "research
  frictions → identify where AI could help → build/test a few prototypes → learn" — is
  explicitly *not* the rigid, fully-orchestrated harness from the original Escape Velocity
  plan. Wiring a real backend or matching the existing fleet dashboard's A2A/OpenTelemetry
  wire format now would be solving a problem this stage doesn't have yet. Every agent action
  in this mockup is framed as a **dry run** ("Would send this reply to...") rather than a
  real execution — this is an evidence-backed UX pattern (see `design.md`), not just a
  shortcut.
- **Next.js + Tailwind + shadcn, not Streamlit.** The deliverable needs to read as a real
  product onboarding screen to a non-technical sponsor, not a data-science dashboard.
  shadcn/ui's Radix foundation also gets most WCAG keyboard/focus/ARIA behavior for free,
  which matters for the accessibility goals in `design.md`.
- **AI assistant choice left open.** The sponsor explicitly said the team can use its
  preferred AI coding assistant (Gemini, Claude, OpenAI/Codex) — this is a dev-workflow
  choice per person, not part of the shipped artifact's stack.

## What this is not (yet)

These were part of the original Escape Velocity harness plan and are explicitly deferred,
per the sponsor's own walk-back of "a predetermined multi-agent organization and harness":

- No orchestration layer (pipeline / supervisor / shared-workspace pattern)
- No handoff-contract validation between agents
- No integration with the existing fleet dashboard's A2A task-lifecycle or OpenTelemetry
  GenAI telemetry
- No real calls to the three existing agents (Research, Synthetic Data, Presentation) or to
  any model provider
- No spending ceiling, checkpoints, or harness-level monitoring

Revisit these for B-Term once the project direction (which agents, how many, what the
harness looks like) is actually decided — this prototype's job is to make that direction
concrete enough to discuss, not to build it.

## Scope target

Built and designed for Gemsen specifically — a company of roughly 8-10 employees — not a
generic multi-org or enterprise-scalable product. See `design.md` for how this shapes the
persona and fixture data. A scalable/configurable version may come later but is explicitly
not a design goal for this prototype.

## Open items

- Confirm Gemsen account / Google Cloud Workstation access before B-Term planning so dev
  can move onto Gemsen's environment if that becomes the right call.
