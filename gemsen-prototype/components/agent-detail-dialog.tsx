"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AgentIcon } from "@/components/icon-map";
import type { Agent, PlanStep } from "@/lib/types";
import { CheckCircle2, Circle, Loader2, X } from "lucide-react";

// The clickable plan -> dry-run -> live ledger -> result flow that replaces a static
// descriptive card. Each state below corresponds to a pattern documented in design.md
// (Editable Plan, Effort & Cost Preview, Dry-Run Mode, Live Step Ledger, Confidence & Gaps
// footer) and to taskbreakdown.md Task 5.
//
// The caller (app/page.tsx) mounts this with `key={agent.id}` whenever a new agent opens,
// so every field below resets simply by remounting — no reset-on-open effect needed. That
// follows current React guidance against calling setState synchronously inside an effect
// just to react to a prop change (see react-hooks/set-state-in-effect).

type FlowState = "plan" | "dryrun" | "running" | "paused" | "result";
type StepStatus = "pending" | "running" | "done";

interface AgentDetailDialogProps {
  agent: Agent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgentDetailDialog({ agent, open, onOpenChange }: AgentDetailDialogProps) {
  const [flowState, setFlowState] = useState<FlowState>("plan");
  const [removedStepIds, setRemovedStepIds] = useState<Set<string>>(() => new Set());
  const [ledgerStatus, setLedgerStatus] = useState<Record<string, StepStatus>>(() =>
    Object.fromEntries((agent?.ledgerSteps ?? []).map((step) => [step.id, "pending" as StepStatus]))
  );
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clear any in-flight timers if the dialog unmounts (closed, or remounted for a
  // different agent) so a stale run can't update state after the dialog has moved on.
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  if (!agent) return null;

  const visiblePlanSteps = agent.planSteps.filter((step) => !removedStepIds.has(step.id));

  function removeStep(stepId: string) {
    setRemovedStepIds((prev) => new Set(prev).add(stepId));
  }

  function runLedger() {
    setFlowState("running");
    const steps = agent!.ledgerSteps;
    // Agents with needsInput pause before their final step instead of completing
    // automatically — the mockup's one demonstration of "agent pauses for approval".
    const pauseIndex = agent!.needsInput ? steps.length - 1 : steps.length;

    let cumulativeDelay = 0;
    steps.forEach((step, index) => {
      if (index >= pauseIndex) return;
      cumulativeDelay += step.durationMs;
      const startAt = cumulativeDelay - step.durationMs;
      const startTimeout = setTimeout(() => {
        setLedgerStatus((prev) => ({ ...prev, [step.id]: "running" }));
      }, startAt);
      const doneTimeout = setTimeout(() => {
        setLedgerStatus((prev) => ({ ...prev, [step.id]: "done" }));
        if (index === pauseIndex - 1) {
          setFlowState(agent!.needsInput ? "paused" : "result");
        }
      }, cumulativeDelay);
      timeoutsRef.current.push(startTimeout, doneTimeout);
    });
  }

  function resumeAfterPause() {
    const steps = agent!.ledgerSteps;
    const lastStep = steps[steps.length - 1];
    setLedgerStatus((prev) => ({ ...prev, [lastStep.id]: "running" }));
    const doneTimeout = setTimeout(() => {
      setLedgerStatus((prev) => ({ ...prev, [lastStep.id]: "done" }));
      setFlowState("result");
    }, lastStep.durationMs);
    timeoutsRef.current.push(doneTimeout);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
              <AgentIcon name={agent.icon} className="size-4.5" />
            </span>
            <div className="flex flex-col gap-1">
              <DialogTitle>{agent.name}</DialogTitle>
              <Badge variant={agent.category === "real" ? "default" : "outline"} className="w-fit">
                {agent.category === "real" ? "Live" : "Preview"}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {flowState === "plan" && (
          <PlanStepView
            agent={agent}
            visibleSteps={visiblePlanSteps}
            onRemove={removeStep}
            onContinue={() => setFlowState("dryrun")}
          />
        )}

        {flowState === "dryrun" && (
          <DryRunView agent={agent} onBack={() => setFlowState("plan")} onRun={runLedger} />
        )}

        {(flowState === "running" || flowState === "paused") && (
          <LedgerView
            agent={agent}
            ledgerStatus={ledgerStatus}
            paused={flowState === "paused"}
            onResume={resumeAfterPause}
          />
        )}

        {flowState === "result" && <ResultView agent={agent} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function PlanStepView({
  agent,
  visibleSteps,
  onRemove,
  onContinue,
}: {
  agent: Agent;
  visibleSteps: PlanStep[];
  onRemove: (stepId: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <DialogDescription>
        Here&apos;s what {agent.name} would do. Remove any step you don&apos;t want before previewing it.
      </DialogDescription>
      <ol className="flex flex-col gap-2">
        {visibleSteps.map((step, index) => (
          <li
            key={step.id}
            className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-foreground"
          >
            <span className="mt-0.5 font-mono text-xs text-muted-foreground">{index + 1}.</span>
            <span className="flex-1">{step.label}</span>
            {step.removable && (
              <button
                type="button"
                onClick={() => onRemove(step.id)}
                aria-label={`Remove step: ${step.label}`}
                className="shrink-0 rounded-md px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ol>
      <Separator />
      <p className="text-xs text-muted-foreground">{agent.effortEstimate}</p>
      <DialogFooter>
        <Button onClick={onContinue} disabled={visibleSteps.length === 0} className="w-full sm:w-auto">
          Preview run
        </Button>
      </DialogFooter>
    </div>
  );
}

function DryRunView({ agent, onBack, onRun }: { agent: Agent; onBack: () => void; onRun: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">Dry run</Badge>
        <span className="text-xs text-muted-foreground">Nothing sends or saves until you run it</span>
      </div>
      <p className="rounded-lg bg-muted/50 px-3 py-3 text-sm text-foreground">{agent.dryRunOutput}</p>
      <DialogFooter>
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          Back to plan
        </Button>
        <Button onClick={onRun} className="w-full sm:w-auto">
          Run {agent.name}
        </Button>
      </DialogFooter>
    </div>
  );
}

function StepGlyph({ status }: { status: StepStatus }) {
  if (status === "done") {
    return <CheckCircle2 className="size-4 shrink-0 text-foreground" aria-hidden="true" />;
  }
  if (status === "running") {
    return <Loader2 className="size-4 shrink-0 animate-spin text-foreground" aria-hidden="true" />;
  }
  return <Circle className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />;
}

function LedgerView({
  agent,
  ledgerStatus,
  paused,
  onResume,
}: {
  agent: Agent;
  ledgerStatus: Record<string, StepStatus>;
  paused: boolean;
  onResume: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <ol aria-live="polite" className="flex flex-col gap-2">
        {agent.ledgerSteps.map((step) => {
          const status = ledgerStatus[step.id] ?? "pending";
          return (
            <li key={step.id} className="flex items-center gap-2.5 text-sm">
              <StepGlyph status={status} />
              <span className={status === "pending" ? "text-muted-foreground" : "text-foreground"}>
                {step.label}
              </span>
              <span className="sr-only">
                {status === "done" ? "completed" : status === "running" ? "in progress" : "pending"}
              </span>
            </li>
          );
        })}
      </ol>
      {paused && (
        <div className="flex flex-col gap-3 rounded-lg bg-muted/50 p-3">
          <p className="text-sm text-foreground">{agent.pausePrompt}</p>
          <DialogFooter>
            <Button onClick={onResume} className="w-full sm:w-auto">
              Approve &amp; continue
            </Button>
          </DialogFooter>
        </div>
      )}
    </div>
  );
}

function ResultView({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <ResultGroup label="Found" items={agent.result.found} icon="done" />
      {agent.result.assumed.length > 0 && (
        <ResultGroup label="Assumed" items={agent.result.assumed} icon="assumed" />
      )}
      {agent.result.incomplete.length > 0 && (
        <ResultGroup label="Incomplete" items={agent.result.incomplete} icon="incomplete" />
      )}
      <DialogFooter>
        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
          Done
        </Button>
      </DialogFooter>
    </div>
  );
}

function ResultGroup({
  label,
  items,
  icon,
}: {
  label: string;
  items: string[];
  icon: "done" | "assumed" | "incomplete";
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
            {icon === "done" && <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />}
            {icon === "assumed" && <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
            {icon === "incomplete" && <X className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
