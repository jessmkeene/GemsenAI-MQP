import {
  Mail,
  CalendarDays,
  Search,
  Database,
  BarChart3,
  Users,
  Share2,
  ClipboardList,
  Presentation,
  FileBarChart,
  Bot,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Mail,
  CalendarDays,
  Search,
  Database,
  BarChart3,
  Users,
  Share2,
  ClipboardList,
  Presentation,
  FileBarChart,
};

/**
 * Renders an Agent's `icon` name, falling back to a generic bot icon for an unknown name.
 * Defined once here (not resolved to a local variable inside another component's render
 * body) so icon selection doesn't trip the "component created during render" lint rule.
 */
export function AgentIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Bot;
  return <Icon className={className} aria-hidden="true" />;
}
