# Task Breakdown — A-Term Prototype Build

How to build the dashboard mockup described in `techstack.md` and `design.md`, broken into
discrete tasks. Each task has a goal, inputs, concrete steps, and acceptance criteria — a
human teammate or a coding agent should be able to pick up any task and know exactly what
"done" looks like without re-reading the other two files first.

**Scope reminder**: Gemsen-sized (8-10 employees), one persona, no org-size toggle. No
backend, no real model calls, no real execution — every agent action is a dry run against
static fixture data. Deadline-driven: build in dependency order, not polish order.

## Dependency order

```
0. Scaffold project
   └─1. Define agent data model + fixtures
        ├─2. Build layout shell
        │    └─3. Build greeting / landing screen
        ├─4. Build Agent Card component
        │    └─5. Build Agent Detail flow (plan → dry-run → ledger → result)
        └─6. Accessibility pass (after 2-5 exist)
             └─7. Deploy + rehearsal
8. (stretch) CI lint/build
```

Tasks 2–5 can be split across teammates once task 1 (fixtures/schema) is settled, since
everything else reads from that shared shape.

---

## Task 0 — Scaffold the project

**Goal**: a running Next.js + TypeScript app with Tailwind and shadcn/ui installed, pushed
to the existing `GemsenAI-MQP` repo.

**Steps**:
1. `npx create-next-app@latest` inside the repo — TypeScript yes, Tailwind yes, App Router
   yes, `src/` directory yes.
2. Initialize shadcn/ui (`npx shadcn@latest init`); accept defaults.
3. Add shadcn components you already know you'll need: `card`, `button`, `dialog`, `badge`,
   `progress`, `separator`.
4. Confirm `npm run dev` serves a blank page at `localhost:3000`.
5. Commit as the initial scaffold.

**Acceptance criteria**: fresh clone of the repo + `npm install` + `npm run dev` produces a
working local server with no errors.

---

## Task 1 — Define the agent data model and fixtures

**Goal**: one shared TypeScript type + one JSON/TS fixture file that every component reads
from. Nothing downstream should hardcode agent content — it all comes from here.

**Steps**:
1. Create `src/lib/types.ts` with an `Agent` type covering at minimum:
   - `id`, `name`, `category` (`"real" | "theoretical"`)
   - `icon` (string key or component reference)
   - `oneLinerStatus` (what shows on the collapsed card, e.g. "3 unread, 2 need replies")
   - `greetingTrigger` (the condition/copy used on the landing screen when this agent has
     something to propose)
   - `planSteps`: ordered list of `{ id, label, removable: boolean }`
   - `effortEstimate` (e.g. "`~3 min · drafts 2 replies`")
   - `dryRunOutput` (the "Would do X" text shown before running)
   - `ledgerSteps`: ordered list of `{ id, label, durationMs }` for the fake run animation
   - `result`: `{ found: string[], assumed: string[], incomplete: string[] }` — the
     Confidence & Gaps footer content
   - `needsInput`: boolean — set `true` on exactly one agent so the mockup demonstrates the
     "paused, needs approval" state (see `design.md`, Trust and control)
2. Create `src/lib/agents.ts` exporting an array of 10 `Agent` objects: Research, Synthetic
   Data, Presentation (category `"real"`), plus Mailbox, Calendar, Meeting Follow-up,
   Market/Competitive Research, Client Discovery, Data/DB Mapping, Report Generation
   (category `"theoretical"`).
3. Write content assuming a single Gemsen-scale persona (an 8-10 person startup) — e.g. the
   Mailbox agent's unread count, the Calendar agent's meeting load, and the Market Research
   agent's example ("how could our anomaly-detection tech apply to fraud detection?") should
   read as genuinely Gemsen's, not a generic enterprise example.

**Acceptance criteria**: `agents.ts` type-checks, exports exactly 10 agents, exactly one has
`needsInput: true`, and every field in the `Agent` type is populated for every agent (no
`undefined`/placeholder text left in).

---

## Task 2 — Build the layout shell

**Goal**: the persistent frame every screen sits inside, following the F-pattern guidance
in `design.md`.

**Steps**:
1. Top bar: Gemsen branding/wordmark, persona name (e.g. "Good morning, Charlie").
2. Left column: static nav listing agent categories (or just "All Agents" for this scope —
   no role/org switcher per the resolved scope decision).
3. Main content area: where the landing screen and agent grid render.
4. Apply Tailwind spacing so the top band carries the highest-priority content (greeting +
   proposed actions) and the agent grid sits below it — not interleaved.

**Acceptance criteria**: layout renders with placeholder content, is responsive down to a
laptop-width viewport (this is a presentation demo, not a mobile product — don't over-invest
in small breakpoints), and passes a quick keyboard-tab-through with visible focus states.

---

## Task 3 — Build the greeting / landing screen

**Goal**: the empty-state landing view described in `design.md` — greet by name, surface
1-3 *specific* proposed actions pulled from the fixtures.

**Steps**:
1. Read `agents.ts`, filter to agents whose `greetingTrigger` condition is "active" in the
   mock data (e.g. unread count > 0), take the top 1-3 by whatever priority order you decide
   (document the order in a code comment — this is a judgment call worth being explicit
   about, not hiding).
2. Render each as a short, specific suggestion line (reuse the `oneLinerStatus` /
   `greetingTrigger` copy), each clickable and routing into that agent's detail flow (Task
   5).
3. Below the greeting, render the full agent grid (Task 4) so agents not surfaced in the
   greeting are still reachable.

**Acceptance criteria**: landing screen shows a personalized greeting, at least one specific
proposed action (not a generic "how can I help"), and clicking a suggestion opens that
agent's detail flow.

---

## Task 4 — Build the Agent Card component

**Goal**: the collapsed, scannable representation of each agent in the grid — progressive
disclosure applied (one line by default, detail on click).

**Steps**:
1. Card shows: icon, name, a `"Live"` or `"Preview"` badge driven by `category`
   (`real`/`theoretical` — keep this honest per `design.md`), and `oneLinerStatus`.
2. Clicking anywhere on the card opens the Agent Detail flow (Task 5) — the whole card is
   the click target, not a small icon-only button (accessibility: avoid icon-only tap
   targets per `design.md`).
3. Minimum tap target 44×44px per card action (WCAG guidance in `design.md`).

**Acceptance criteria**: grid renders all 10 agents, "Live" vs "Preview" badges are visually
distinct, every card is keyboard-focusable and activates on Enter/Space, not only mouse
click.

---

## Task 5 — Build the Agent Detail flow

**Goal**: the clickable sequence that replaces a static card — this is the task the
"clickable, not descriptive" requirement is actually about. Build as one flow with four
visible states.

**Steps**:
1. **Editable Plan state**: show `planSteps` as a numbered list; each `removable: true` step
   has a remove control; allow drag-or-button reordering if time allows (reordering is
   nice-to-have, removal is not — prioritize removal if short on time).
2. **Effort & Cost Preview**: render `effortEstimate` near a primary "Run" button.
3. **Dry-Run confirmation**: clicking "Run" shows `dryRunOutput` text framed explicitly as a
   preview (e.g. a labeled "Dry run" badge) before advancing — don't let this read as a real
   action.
4. **Live Step Ledger**: animate through `ledgerSteps` in order, each transitioning
   pending → running → done on a `setTimeout` using each step's `durationMs`. If this
   agent's `needsInput` is `true`, stop the ledger partway and show a distinct "paused,
   needs your input" state with a visible resume/approve control instead of completing
   automatically.
5. **Result state**: render the Confidence & Gaps footer from `result.found` /
   `result.assumed` / `result.incomplete` as three visually distinct groups.
6. Provide a clear way back to the grid/landing screen from every state (don't trap the
   user in the flow).

**Acceptance criteria**: for every agent except the one with `needsInput: true`, the flow
runs start-to-finish from Editable Plan to Result without a dead end; the `needsInput` agent
visibly pauses and requires an explicit action to proceed; all four states are reachable by
keyboard alone.

---

## Task 6 — Accessibility pass

**Goal**: verify the WCAG and semantic-HTML points in `design.md` actually hold, rather than
assuming shadcn's defaults cover everything.

**Steps**:
1. Run a contrast checker against the chosen Tailwind palette — every text/background pair
   must meet 4.5:1.
2. Tab through the entire app (landing → card → detail flow → result) using only the
   keyboard; confirm every interactive element has a visible focus ring and nothing is
   skipped or trapped.
3. Check every button/link has real text or an `aria-label` — no icon-only controls without
   a label.
4. Spot-check touch targets are ≥24×24px (ideally 44×44px) using browser devtools.

**Acceptance criteria**: no contrast failures on primary text, full keyboard traversal works
end to end, no unlabeled interactive elements.

---

## Task 7 — Deploy and rehearse

**Goal**: a stable, shareable link for the Oct 9 presentation that doesn't depend on
anyone's laptop or on Gemsen's not-yet-confirmed cloud workstation access.

**Steps**:
1. Connect the repo to Vercel; deploy the `main` branch.
2. Click through the full demo path (greeting → at least 2 agents' detail flows, including
   the `needsInput` one) on the deployed link, not just locally.
3. Decide and rehearse the actual click-path you'll demo live — know in advance which
   agents you're clicking and in what order so the live demo doesn't wander.

**Acceptance criteria**: a Vercel URL that works from a fresh browser/incognito window (no
local state assumptions), and a written or verbally-agreed demo script the team has run
through at least once together.

---

## Task 8 — (Stretch) CI lint/build check

**Goal**: catch a broken build before the demo, not during it.

**Steps**:
1. Add a GitHub Actions workflow running `npm run lint` and `npm run build` on every push.

**Acceptance criteria**: a red/green check on the PR/commit list. Skip entirely if time is
tight before Oct 9 — this is the lowest-priority task in the breakdown.

---

## Definition of done for the whole prototype

- All 10 agents exist in the fixture data and render in the grid.
- The greeting screen surfaces at least one specific, data-driven proposed action.
- At least one full agent flow (plan → dry-run → ledger → result) can be clicked
  start-to-finish live.
- The `needsInput` agent visibly demonstrates the "agent pauses for approval" state.
- The app is reachable via a Vercel link independent of anyone's local machine.
- Nothing in the fixture data or copy references multi-org scaling, role switching, or
  company-size variation — scope stays Gemsen-sized per the resolved decision above.
