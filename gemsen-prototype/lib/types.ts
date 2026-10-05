// Shared data model for the agent dashboard mockup.
// See ../../design.md and ../../taskbreakdown.md (Task 1) for the decisions behind this shape.

export type AgentCategory = "real" | "theoretical";

export interface PlanStep {
  id: string;
  label: string;
  removable: boolean;
}

export interface LedgerStep {
  id: string;
  label: string;
  durationMs: number;
}

export interface AgentResult {
  found: string[];
  assumed: string[];
  incomplete: string[];
}

export interface GreetingTrigger {
  /** Whether this agent currently has something worth surfacing on the landing screen. */
  active: boolean;
  /** Short, specific suggestion copy shown on the landing screen (not a generic prompt). */
  message: string;
  /** Lower number = shown first when multiple agents are active. */
  priority: number;
}

export interface Agent {
  id: string;
  name: string;
  category: AgentCategory;
  /** Lucide icon name, resolved via lib/icon-map.tsx. */
  icon: string;
  /** One-line status shown on the collapsed card (progressive disclosure default state). */
  oneLinerStatus: string;
  greetingTrigger: GreetingTrigger;
  planSteps: PlanStep[];
  effortEstimate: string;
  dryRunOutput: string;
  ledgerSteps: LedgerStep[];
  result: AgentResult;
  /**
   * When true, the Live Step Ledger pauses before its final step and shows `pausePrompt`
   * instead of completing automatically — the one agent in the roster that demonstrates
   * the "agent pauses for approval" state (see taskbreakdown.md Task 5).
   */
  needsInput: boolean;
  pausePrompt?: string;
}
