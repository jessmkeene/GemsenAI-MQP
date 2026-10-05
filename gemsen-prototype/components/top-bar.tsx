// Persistent header. Part of the layout shell (taskbreakdown.md Task 2) — carries
// branding, not primary content, so it stays out of the F-pattern's top-reading band
// reserved for the greeting (see design.md, Layout).
export function TopBar() {
  return (
    <header className="border-b border-border bg-background px-6 py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-base font-semibold text-foreground">Gemsen</span>
          <span className="text-sm text-muted-foreground">Agent Dashboard — Prototype</span>
        </div>
      </div>
    </header>
  );
}
