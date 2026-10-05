"use client";

import { Badge } from "@/components/ui/badge";
import { AgentIcon } from "@/components/icon-map";
import type { Agent } from "@/lib/types";

interface AgentCardProps {
  agent: Agent;
  onOpen: (agentId: string) => void;
}

// A native <button> styled as a card, not a <div onClick>, so the whole card is a single
// focusable control that activates on click, Enter, and Space for free — no icon-only
// sub-buttons, no custom key handling. See design.md's accessibility section and
// taskbreakdown.md Task 4.
export function AgentCard({ agent, onOpen }: AgentCardProps) {
  const isLive = agent.category === "real";

  return (
    <button
      type="button"
      onClick={() => onOpen(agent.id)}
      className="group flex min-h-11 flex-col gap-3 rounded-xl bg-card p-4 text-left ring-1 ring-foreground/10 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <AgentIcon name={agent.icon} className="size-4.5" />
          </span>
          <span className="font-heading text-sm font-medium text-foreground">{agent.name}</span>
        </div>
        <Badge variant={isLive ? "default" : "outline"}>{isLive ? "Live" : "Preview"}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{agent.oneLinerStatus}</p>
    </button>
  );
}
