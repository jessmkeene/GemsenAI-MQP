# Design — A-Term Prototype (Agent Dashboard Mockup)

Evidence-backed UX decisions for the dashboard mockup. Each pattern below is tied to a
source; patterns from Nielsen Norman Group, Microsoft's HAX Toolkit, and Google's PAIR
Guidebook are peer-reviewed/research-backed, marked **[research]**. Patterns from industry
UX blogs synthesizing common practice are marked **[industry]** — useful for concrete
pattern names, but their cited stats aren't independently verified.

## Scope: Gemsen-sized, not enterprise-scalable

This prototype is designed for Gemsen specifically — roughly 8-10 employees — not for a
generic startup-to-enterprise range. One persona, one company scale. No role/org-size
toggle, no multi-tenant framing. A scalable/configurable version may be explored later, but
it is explicitly not a design goal here, so fixture data and the greeting screen should
assume a single small-team context throughout rather than hedging for larger orgs.

## Agent roster for the mockup

Mix of real and theoretical agents, pulled from the sponsor's own list of candidate
friction areas plus the existing Gemsen fleet. Mark each card honestly as real vs. mocked —
that honesty is consistent with how the sponsor framed this stage as exploratory, not a
finished product.

| Agent | Status | Source |
|---|---|---|
| Research agent | Real (exists) | Gemsen fleet |
| Synthetic Data agent | Real (exists) | Gemsen fleet |
| Presentation agent | Real (exists) | Gemsen fleet |
| Mailbox / email review | Theoretical, mocked | Sponsor example + meeting notes |
| Calendar | Theoretical, mocked | Sponsor example |
| Meeting transcript / follow-up | Theoretical, mocked | Meeting notes |
| Market / competitive research | Theoretical, mocked | Meeting notes |
| Client discovery | Theoretical, mocked | Meeting notes |
| Data / database mapping | Theoretical, mocked | Meeting notes |
| Report generation | Theoretical, mocked | Meeting notes |

## Layout

- **F-pattern scanning** **[research]** — NN/G's eye-tracking study (232 users) found users
  sweep horizontally across the top of a screen, then scan down the left edge. Apply: most
  important status/greeting content in the top band and primary agent navigation on the
  left; don't bury the agent roster below the fold.
- **Progressive disclosure** **[research]** — NN/G found disclosure layers beyond two deep
  measurably hurt usability; a 75-study review found information overload is the most
  common dashboard complaint (~47% of studies). Apply: agent cards show a one-line status
  by default, expand in place (no navigation) for detail.

## Greeting screen (landing view)

- **Guided empty state** **[research/industry]** — first-run UX literature and Google
  Gemini's own production pattern ("Hello, Sam. How can I help you today?") both converge on
  one short greeting + one clear primary action outperforming a blank screen or a wall of
  options.
- Apply: greet by name, then surface 1–3 *specific* proposed actions pulled straight from
  the mock data (e.g. "3 unread emails need replies") rather than a generic "what can I help
  with?" prompt. Specificity is what makes it read as an assistant, not a search box.

## Making agent actions clickable (not descriptive cards)

Patterns below **[industry]**, synthesized from common practice across current agent
products (Claude, ChatGPT, enterprise agent tools):

- **Editable Plan** — clicking an agent shows a numbered list of steps it *would* take,
  reorderable/removable, not a binary accept/reject. Highest payoff-per-hour pattern for
  making the mockup feel real without a backend.
- **Effort & Cost Preview** — a line like "~3 min · drafts 2 replies" before commit, builds
  calibrated expectations **[research — Google PAIR, "set the right expectations"]**.
- **Dry-Run Mode** — every action in this mockup is framed as a dry run by design ("Would
  send this reply to...") since nothing executes for real yet. This is the honest version of
  the pattern, not a workaround.
- **Live Step Ledger** — vertical list with status glyphs (pending → running → done) instead
  of a vague spinner, for the "agent is working" demo moment.
- **Confidence & Gaps footer** — end each demo run with three parts: what it found, what it
  assumed, what it couldn't finish **[research — Google PAIR, "explain for understanding,
  not completeness"]**. Directly echoes Gemsen's own stated concern about privacy/trust —
  worth calling out explicitly to the sponsor.

## Trust and control

- **Supervised automation framing** **[research — Google PAIR #16, #18; Microsoft HAX]** —
  anything that reads as "sends" or "writes" should visually signal it needs approval, even
  faked. Show at least one agent "paused, needs input" in the demo, not only happy-path
  success — planning for visible failure is core to both guidelines, not optional polish.

## Accessibility (dual-purpose: compliance + on-brand for an AI company)

- **WCAG 2.2 SC 2.5.8** — 24×24px minimum touch targets (Level AA); cited research shows a
  15% mis-tap rate at 24px vs. 3% at 44px, so prefer 44px where layout allows.
- **WCAG AA contrast** — 4.5:1 minimum for normal text.
- **No icon-only buttons, no "click here" links** **[research — NN/G, "AI Agents as
  Users"]** — clear descriptive labeling and real semantic HTML now serve both
  assistive-tech users and any future agent parsing the interface. Genuinely on-brand point
  for a company whose product is AI agents.
- shadcn/ui (Radix-based) gets most of this for free — keyboard nav, focus states, ARIA
  roles — as long as defaults aren't overridden. Worth stating in the presentation as a
  deliberate choice.

## Build priority (given the 6-day timeline)

1. Greeting screen with specific proposed actions
2. Editable Plan + Dry-Run framing on click, per agent
3. Live Step Ledger for the "it's working" moment
4. Confidence & Gaps footer at the end of a run
5. Accessibility basics — mostly free if shadcn/Radix defaults aren't fought

## Sources

- [AI Agents as Users - NN/G](https://www.nngroup.com/articles/ai-agents-as-users/)
- [Progressive Disclosure - NN/G](https://www.nngroup.com/articles/progressive-disclosure/)
- [12 Dashboard Design Principles For Better UX](https://uxpilot.ai/blogs/dashboard-design-principles)
- [Guidelines for Human-AI Interaction - Microsoft HAX Toolkit](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/)
- [People + AI Research - Patterns](https://pair.withgoogle.com/guidebook-v2/patterns)
- [Explainability + Trust - People + AI Research](https://pair.withgoogle.com/chapter/explainability-trust/)
- [16 AI agent UI design patterns for plans, approvals and undo](https://www.setproduct.com/blog/ai-agent-ui-design-patterns)
- [Best User Interfaces for Enterprise AI Agents: 9 Design Patterns](https://www.entrans.ai/blog/best-user-interfaces-enterprise-ai-agent-development)
- [The Role Of Empty States In User Onboarding — Smashing Magazine](https://www.smashingmagazine.com/2017/02/user-onboarding-empty-states-mobile-apps/)
- [Empty state UX examples and design rules that actually work](https://www.eleken.co/blog-posts/empty-state-ux)
- [WCAG 2.2 Quick Reference](https://www.audioeye.com/post/wcag-22-quick-reference-guide/)
- [All Touch Targets Must Be 24px or Larger](https://www.accessibilitychecker.org/wcag-guides/all-touch-targets-must-be-24px-large-or-leave-sufficient-space/)

## Resolved scope question

Previously open: whether to build one persona or demonstrate the dashboard adapting across
roles/org sizes. **Resolved** — one persona, Gemsen-scale (8-10 employees), no role/org-size
toggle. Scalability may return as a later exploration but should not shape this prototype's
data model or UI.
