"use client";

import { useState } from "react";
import { TopBar } from "@/components/top-bar";
import { GreetingPanel } from "@/components/greeting-panel";
import { AgentGrid } from "@/components/agent-grid";
import { AgentDetailDialog } from "@/components/agent-detail-dialog";
import { agents, getActiveGreetingAgents, getAgentById } from "@/lib/agents";

// Single persona, Gemsen-scale (8-10 employees) — no role/org-size toggle. See design.md,
// "Scope: Gemsen-sized, not enterprise-scalable".
const PERSONA_NAME = "MQP Team";

export default function Home() {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function openAgent(agentId: string) {
    setSelectedAgentId(agentId);
    setDialogOpen(true);
  }

  const selectedAgent = selectedAgentId ? getAgentById(selectedAgentId) ?? null : null;

  return (
    <div className="flex flex-1 flex-col bg-background">
      <TopBar />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10">
        <GreetingPanel
          personaName={PERSONA_NAME}
          suggestions={getActiveGreetingAgents(3)}
          onOpen={openAgent}
        />
        <AgentGrid agents={agents} onOpen={openAgent} />
      </main>
      <AgentDetailDialog
        key={selectedAgentId ?? "none"}
        agent={selectedAgent}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
