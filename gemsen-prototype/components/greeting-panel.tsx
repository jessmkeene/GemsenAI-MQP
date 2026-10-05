"use client";

import { ChevronRight } from "lucide-react";
import { AgentIcon } from "@/components/icon-map";
import type { Agent } from "@/lib/types";

interface GreetingPanelProps {
  personaName: string;
  suggestions: Agent[];
  onOpen: (agentId: string) => void;
}

function timeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Landing screen: greet by name, then surface specific, data-driven proposed actions —
// not a generic "how can I help?" prompt. See design.md, "Greeting screen (landing view)"
// and taskbreakdown.md Task 3. Priority order for which agents appear here is set by each
// agent's greetingTrigger.priority in lib/agents.ts.
export function GreetingPanel({ personaName, suggestions, onOpen }: GreetingPanelProps) {
  return (
    <section aria-labelledby="greeting-heading" className="flex flex-col gap-4">
      <h1 id="greeting-heading" className="font-heading text-2xl font-semibold text-foreground">
        {timeOfDayGreeting()}, {personaName}.
      </h1>
      {suggestions.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s worth your attention right now:</p>
          <ul className="flex flex-col gap-2">
            {suggestions.map((agent) => {
              return (
                <li key={agent.id}>
                  <button
                    type="button"
                    onClick={() => onOpen(agent.id)}
                    className="flex w-full min-h-11 items-center gap-3 rounded-xl bg-card px-4 py-3 text-left ring-1 ring-foreground/10 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                      <AgentIcon name={agent.icon} className="size-4" />
                    </span>
                    <span className="flex-1 text-sm text-foreground">{agent.greetingTrigger.message}</span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nothing urgent right now — browse the agents below.</p>
      )}
    </section>
  );
}
