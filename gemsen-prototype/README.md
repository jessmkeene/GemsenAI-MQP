# Gemsen Agent Dashboard — Prototype

A low-fidelity, clickable mockup of a dashboard surfacing Gemsen's agents, built for the
A-Term Project 5 deliverable. Built for Gemsen specifically (8-10 employees) — not a
generic or multi-org product. See `../techstack.md`, `../design.md`, and
`../taskbreakdown.md` in the repo root for the decisions and research behind this build.

No backend, no real model calls, no live mailbox/calendar integration. Every agent action
is a scripted dry run against static fixture data in `lib/agents.ts` — that's deliberate,
not a shortcut (see `design.md`, "Dry-Run Mode").

## Running it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's here

- `lib/types.ts` / `lib/agents.ts` — the shared `Agent` type and the 10-agent fixture data
  (3 real Gemsen agents + 7 theoretical ones from the sponsor's own list of friction areas).
- `components/greeting-panel.tsx` — the landing screen: greets by name, surfaces specific
  proposed actions (not a generic prompt).
- `components/agent-card.tsx` / `components/agent-grid.tsx` — the collapsed, scannable
  agent roster.
- `components/agent-detail-dialog.tsx` — the clickable flow: Editable Plan → Effort & Cost
  Preview → Dry-Run confirmation → Live Step Ledger (with one agent demonstrating a
  pause-for-approval state) → Confidence & Gaps result.
- `components/ui/` — shadcn/ui components (Base UI primitives), left mostly at their
  accessible defaults on purpose.

## Deploying

Connect this repo to Vercel and deploy the `main` branch. No environment variables or
backend services are required for this prototype.
