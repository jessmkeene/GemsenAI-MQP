import { AgentCard } from "@/components/agent-card";
import type { Agent } from "@/lib/types";

interface AgentGridProps {
  agents: Agent[];
  onOpen: (agentId: string) => void;
}

// The full agent roster, below the greeting band per the F-pattern layout (design.md).
// Progressive disclosure: each card is one-line by default; detail lives behind a click
// (components/agent-detail-dialog.tsx), not stacked here.
export function AgentGrid({ agents, onOpen }: AgentGridProps) {
  return (
    <section aria-labelledby="agents-heading" className="flex flex-col gap-3">
      <h2 id="agents-heading" className="font-heading text-sm font-medium text-muted-foreground">
        All agents
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}
