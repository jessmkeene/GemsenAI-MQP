import type { Agent } from "./types";

// Fixture data for the dashboard mockup. Scope: Gemsen specifically (an 8-10 person
// FinTech startup), one persona (Charlie, the founder) — not a generic or multi-org
// dataset. See ../../design.md for the roster and the reasoning behind each pattern used
// below (Editable Plan, Dry-Run, Live Step Ledger, Confidence & Gaps footer).
//
// "real" = one of the three agents that actually exist in Gemsen's fleet today.
// "theoretical" = a mocked example of a future agent, per the sponsor's own list of
// candidate friction areas (meeting follow-up, email review, market research, client
// discovery, data mapping, report generation) plus the mailbox/calendar examples Charlie
// gave verbally.

export const agents: Agent[] = [
  {
    id: "mailbox",
    name: "Mailbox",
    category: "theoretical",
    icon: "Mail",
    oneLinerStatus: "4 unread · 2 need a reply today",
    greetingTrigger: {
      active: true,
      message: "2 emails are waiting on a reply — want drafts to review?",
      priority: 1,
    },
    planSteps: [
      { id: "scan", label: "Scan the inbox for unread and flagged messages", removable: false },
      { id: "classify", label: "Identify which need a reply vs. are just FYI", removable: true },
      { id: "draft", label: "Draft replies for the 2 that need one", removable: true },
      { id: "hold", label: "Leave everything in Drafts — nothing sends automatically", removable: false },
    ],
    effortEstimate: "~2 min · 2 draft replies · nothing sent",
    dryRunOutput:
      "Would draft replies to the 2 unread emails that look like they need a response (a Fintech Sandbox contact and a MassChallenge coordinator), and leave both in Drafts for you to review.",
    ledgerSteps: [
      { id: "s1", label: "Scanning inbox", durationMs: 700 },
      { id: "s2", label: "Classifying unread messages", durationMs: 800 },
      { id: "s3", label: "Drafting reply 1 of 2", durationMs: 1000 },
      { id: "s4", label: "Drafting reply 2 of 2", durationMs: 1000 },
    ],
    result: {
      found: ["2 draft replies written and saved to Drafts"],
      assumed: ["Treated the Company message as time-sensitive based on its subject line"],
      incomplete: ["1 unread message left unclassified — looked like a newsletter, skipped rather than guessed"],
    },
    needsInput: false,
  },
  {
    id: "calendar",
    name: "Calendar",
    category: "theoretical",
    icon: "CalendarDays",
    oneLinerStatus: "3 meetings today · 1 has no agenda yet",
    greetingTrigger: {
      active: true,
      message: "Your 2pm with the WPI mentor has no agenda yet — want a draft?",
      priority: 2,
    },
    planSteps: [
      { id: "read", label: "Read today's meeting titles and attendees", removable: false },
      { id: "check", label: "Check which meetings are missing an agenda", removable: false },
      { id: "draft", label: "Draft a short agenda for the 2pm", removable: true },
    ],
    effortEstimate: "~1 min · 1 draft agenda",
    dryRunOutput:
      "Would draft a 3-bullet agenda for today's 2pm with the WPI mentor, based on the meeting title and your last email thread with them.",
    ledgerSteps: [
      { id: "s1", label: "Reading today's calendar", durationMs: 600 },
      { id: "s2", label: "Checking for missing agendas", durationMs: 500 },
      { id: "s3", label: "Drafting agenda", durationMs: 900 },
    ],
    result: {
      found: ["Draft agenda ready for the 2pm"],
      assumed: ["Assumed the meeting is a check-in, not a pitch, based on past meetings with this contact"],
      incomplete: [],
    },
    needsInput: false,
  },
  {
    id: "research",
    name: "Research",
    category: "real",
    icon: "Search",
    oneLinerStatus: "Ready — last used 2 days ago for the MassChallenge follow-up brief",
    greetingTrigger: {
      active: true,
      message: "Want a starting brief on fraud-detection use cases for GEM's anomaly detection?",
      priority: 3,
    },
    planSteps: [
      { id: "scope", label: "Define sub-questions on anomaly-detection applications in fraud, AML, and identity theft", removable: true },
      { id: "search", label: "Dispatch a grounded sub-agent search for each sub-question", removable: false },
      { id: "resolve", label: "Resolve citations to real URLs; drop any claim whose source doesn't resolve", removable: false },
      { id: "compile", label: "Compile the surviving claims into a brief", removable: true },
    ],
    effortEstimate: "~4 min · 3 sub-questions · citations verified",
    dryRunOutput:
      "Would research how GEM's online-learning and drift-detection capabilities apply to fraud detection, AML, and identity-theft use cases, and return only claims with a resolvable source.",
    ledgerSteps: [
      { id: "s1", label: "Splitting question into sub-questions", durationMs: 900 },
      { id: "s2", label: "Searching and grounding sub-question 1 of 3", durationMs: 1200 },
      { id: "s3", label: "Searching and grounding sub-question 2 of 3", durationMs: 1200 },
      { id: "s4", label: "Searching and grounding sub-question 3 of 3", durationMs: 1200 },
      { id: "s5", label: "Resolving citations and dropping unverifiable claims", durationMs: 800 },
      { id: "s6", label: "Compiling brief", durationMs: 600 },
    ],
    result: {
      found: ["3 of 4 claims resolved to a verifiable source", "Anomaly-detection parallels identified in card-fraud and AML literature"],
      assumed: ["Treated 'identity theft' and 'synthetic identity fraud' as related but distinct"],
      incomplete: ["1 claim dropped — its source link no longer resolved"],
    },
    needsInput: false,
  },
  {
    id: "meeting-followup",
    name: "Meeting Follow-up",
    category: "theoretical",
    icon: "ClipboardList",
    oneLinerStatus: "1 transcript ready to process (yesterday's sponsor call)",
    greetingTrigger: {
      active: true,
      message: "Yesterday's sponsor call has a transcript — want the action items pulled out?",
      priority: 4,
    },
    planSteps: [
      { id: "read", label: "Read the transcript", removable: false },
      { id: "extract", label: "Pull out decisions and action items", removable: false },
      { id: "assign", label: "Assign each action item to a likely owner", removable: true },
      { id: "recap", label: "Draft a short recap email", removable: true },
    ],
    effortEstimate: "~2 min · 1 transcript · 1 recap draft",
    dryRunOutput:
      "Would read yesterday's sponsor-call transcript, list the action items with likely owners, and draft a recap email — nothing sends automatically.",
    ledgerSteps: [
      { id: "s1", label: "Reading transcript", durationMs: 900 },
      { id: "s2", label: "Extracting action items", durationMs: 1000 },
      { id: "s3", label: "Assigning likely owners", durationMs: 800 },
      { id: "s4", label: "Drafting recap email", durationMs: 900 },
    ],
    result: {
      found: ["4 action items extracted", "Recap draft ready"],
      assumed: ["Owner assignment is a best guess from who spoke about each item — not a commitment"],
      incomplete: ["1 action item was ambiguous ('look into the thing Charlie mentioned') — left unassigned rather than guessed"],
    },
    needsInput: false,
  },
  {
    id: "market-research",
    name: "Market & Competitive Research",
    category: "theoretical",
    icon: "BarChart3",
    oneLinerStatus: "Preview — could map GEM's anomaly detection against fraud/AML tools",
    greetingTrigger: {
      active: true,
      message: "Want a first pass comparing GEM's anomaly detection to fraud and AML tools on the market?",
      priority: 5,
    },
    planSteps: [
      { id: "scope", label: "Define the comparison scope (fraud detection, AML, identity theft)", removable: true },
      { id: "gather", label: "Gather public information on comparable tools", removable: false },
      { id: "map", label: "Map GEM's stated capabilities against them", removable: true },
      { id: "flag", label: "Flag claims that need sponsor confirmation before external use", removable: false },
    ],
    effortEstimate: "~5 min · 3 comparison areas",
    dryRunOutput:
      "Would research how GEM's online-learning and drift-detection capabilities compare to existing fraud-detection, AML, and identity-theft tools, and flag anything that needs Charlie to confirm before it's used externally.",
    ledgerSteps: [
      { id: "s1", label: "Scoping comparison areas", durationMs: 700 },
      { id: "s2", label: "Gathering public info on comparable tools", durationMs: 1300 },
      { id: "s3", label: "Mapping GEM capabilities against them", durationMs: 1100 },
      { id: "s4", label: "Flagging claims needing confirmation", durationMs: 700 },
    ],
    result: {
      found: ["Comparison drafted across 3 areas"],
      assumed: ["Treated Gemsen's public positioning as accurate where no sponsor confirmation exists yet"],
      incomplete: ["Pricing and customer-base comparisons skipped — not publicly available for Gemsen"],
    },
    needsInput: false,
  },
  {
    id: "synthetic-data",
    name: "Synthetic Data",
    category: "real",
    icon: "Database",
    oneLinerStatus: "Ready — mock startup dataset profiled, release gate passing (70/70 tests)",
    greetingTrigger: {
      active: false,
      message: "Could generate a fresh mock dataset from the current schema.",
      priority: 9,
    },
    planSteps: [
      { id: "profile", label: "Profile the current file suite / database", removable: false },
      { id: "propose", label: "Have the model propose what each column means", removable: false },
      { id: "validate", label: "Validate those proposals against the real data", removable: false },
      { id: "generate", label: "Generate new records with a copula", removable: true },
    ],
    effortEstimate: "~2 min · 500 synthetic records · release-gated",
    dryRunOutput:
      "Would profile the mock startup dataset, validate the model's column proposals against real values, and generate 500 new synthetic records — nothing is written until you approve.",
    ledgerSteps: [
      { id: "s1", label: "Profiling file suite", durationMs: 700 },
      { id: "s2", label: "Proposing column meanings", durationMs: 900 },
      { id: "s3", label: "Validating proposals against data", durationMs: 1000 },
      { id: "s4", label: "Generating synthetic records", durationMs: 1100 },
      { id: "s5", label: "Running release gate (70 tests)", durationMs: 900 },
    ],
    result: {
      found: ["500 records generated, release gate passed 70/70"],
      assumed: ["2 ambiguous columns inferred from naming convention, flagged for review"],
      incomplete: [],
    },
    needsInput: false,
  },
  {
    id: "client-discovery",
    name: "Client Discovery",
    category: "theoretical",
    icon: "Users",
    oneLinerStatus: "Preview — could build a first-contact list from public FinTech directories",
    greetingTrigger: {
      active: false,
      message: "Could shortlist potential contacts from public FinTech cohort directories.",
      priority: 7,
    },
    planSteps: [
      { id: "profile", label: "Define target profile (size, industry, data sensitivity)", removable: true },
      { id: "search", label: "Search public directories and FinTech cohorts", removable: false },
      { id: "shortlist", label: "Shortlist contacts using public info only", removable: true },
      { id: "flag", label: "Flag anything that would need a warm intro", removable: false },
    ],
    effortEstimate: "~4 min · ~10 shortlisted contacts",
    dryRunOutput:
      "Would search public FinTech cohort directories (like MassChallenge and Fintech Sandbox alumni) for companies matching Gemsen's target profile, and shortlist contacts — no outreach sent.",
    ledgerSteps: [
      { id: "s1", label: "Defining target profile", durationMs: 600 },
      { id: "s2", label: "Searching public directories", durationMs: 1200 },
      { id: "s3", label: "Shortlisting contacts", durationMs: 900 },
      { id: "s4", label: "Flagging intro-needed contacts", durationMs: 600 },
    ],
    result: {
      found: ["9 companies shortlisted from public cohort directories"],
      assumed: ["Treated 'financial services' broadly since Gemsen's target market isn't fully confirmed"],
      incomplete: ["Contact info for 3 companies wasn't public — flagged for a warm intro instead of guessed"],
    },
    needsInput: false,
  },
  {
    id: "data-mapping",
    name: "Data & Database Mapping",
    category: "theoretical",
    icon: "Share2",
    oneLinerStatus: "Preview — could map the mock startup dataset's schema and relationships",
    greetingTrigger: {
      active: false,
      message: "Could map the mock startup dataset's schema and flag anything unclear.",
      priority: 8,
    },
    planSteps: [
      { id: "scan", label: "Scan the provided mock startup dataset", removable: false },
      { id: "infer", label: "Infer relationships between tables and fields", removable: false },
      { id: "flagfields", label: "Flag fields with unclear meaning instead of guessing", removable: true },
      { id: "map", label: "Produce a schema map", removable: true },
    ],
    effortEstimate: "~3 min · full schema map",
    dryRunOutput:
      "Would scan the mock startup dataset Gemsen provided, infer relationships between tables, and produce a schema map — flagging anything it can't confidently infer instead of guessing.",
    ledgerSteps: [
      { id: "s1", label: "Scanning dataset", durationMs: 800 },
      { id: "s2", label: "Inferring relationships", durationMs: 1100 },
      { id: "s3", label: "Flagging unclear fields", durationMs: 700 },
      { id: "s4", label: "Producing schema map", durationMs: 900 },
    ],
    result: {
      found: ["Schema map produced for 6 tables"],
      assumed: ["Inferred 2 foreign-key relationships from naming convention, not explicit constraints"],
      incomplete: ["1 field's meaning couldn't be inferred from data alone — flagged below"],
    },
    needsInput: true,
    pausePrompt:
      "One field ('gem_ref_id') couldn't be confidently inferred from the data alone — confirm I should finish the schema map and flag it for you, rather than guess?",
  },
  {
    id: "report-generation",
    name: "Report Generation",
    category: "theoretical",
    icon: "FileBarChart",
    oneLinerStatus: "Preview — could draft a weekly status report from this week's runs",
    greetingTrigger: {
      active: false,
      message: "Could draft this week's status report from what the other agents produced.",
      priority: 10,
    },
    planSteps: [
      { id: "collect", label: "Collect this week's agent outputs and notes", removable: false },
      { id: "draft", label: "Draft a short status report", removable: true },
      { id: "cite", label: "Link every figure back to the run it came from", removable: false },
    ],
    effortEstimate: "~3 min · 1 draft report",
    dryRunOutput:
      "Would collect this week's agent outputs, draft a short status report, and link every figure back to the run it came from — no number appears that isn't traceable to a source.",
    ledgerSteps: [
      { id: "s1", label: "Collecting this week's agent outputs", durationMs: 800 },
      { id: "s2", label: "Drafting status report", durationMs: 1200 },
      { id: "s3", label: "Linking figures back to their source runs", durationMs: 700 },
    ],
    result: {
      found: ["Draft report ready, 6 figures all traced to a source run"],
      assumed: ["Grouped the Mailbox and Meeting Follow-up activity under one 'communications' section"],
      incomplete: [],
    },
    needsInput: false,
  },
  {
    id: "presentation",
    name: "Presentation",
    category: "real",
    icon: "Presentation",
    oneLinerStatus: "Ready — branded template last rebuilt 3 weeks ago",
    greetingTrigger: {
      active: false,
      message: "Could turn this week's report into a branded slide deck.",
      priority: 6,
    },
    planSteps: [
      { id: "outline", label: "Outline slides from the source report", removable: true },
      { id: "render", label: "Render branded slides through the template service", removable: false },
      { id: "export", label: "Export to PowerPoint and PDF", removable: true },
    ],
    effortEstimate: "~2 min · 8-slide deck · PPTX + PDF",
    dryRunOutput:
      "Would turn this week's status report into an 8-slide branded deck and export it to PowerPoint and PDF — using the precompiled template, so no style changes apply unless the template is rebuilt first.",
    ledgerSteps: [
      { id: "s1", label: "Outlining slides from the source report", durationMs: 800 },
      { id: "s2", label: "Rendering branded slides", durationMs: 1300 },
      { id: "s3", label: "Exporting to PowerPoint and PDF", durationMs: 700 },
    ],
    result: {
      found: ["8-slide deck exported to PPTX and PDF"],
      assumed: ["Used the default template — no custom styling requested this run"],
      incomplete: [],
    },
    needsInput: false,
  },
];

export function getAgentById(id: string): Agent | undefined {
  return agents.find((agent) => agent.id === id);
}

/** Agents worth surfacing on the landing-screen greeting, highest priority first. */
export function getActiveGreetingAgents(limit = 3): Agent[] {
  return agents
    .filter((agent) => agent.greetingTrigger.active)
    .sort((a, b) => a.greetingTrigger.priority - b.greetingTrigger.priority)
    .slice(0, limit);
}
