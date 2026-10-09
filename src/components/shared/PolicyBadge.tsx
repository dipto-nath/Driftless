import { cn } from "@/lib/utils";
import type { PolicyId } from "@/data/types";
import { POLICY_LABELS } from "@/config";

interface PolicyBadgeProps {
  policy: PolicyId;
  compact?: boolean;
}

export function PolicyBadge({ policy, compact = false }: PolicyBadgeProps) {
  const colorClass = policy === "P0" ? "bg-[var(--danger)]/15 text-[var(--danger)]" :
    policy === "P1" ? "bg-[var(--warning)]/15 text-[var(--warning)]" :
    "bg-[var(--primary)]/15 text-[var(--primary)]";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium text-xs",
        "border-current/20",
        colorClass,
        compact ? "px-2 py-0.5" : "px-3 py-1"
      )}
      aria-label={POLICY_LABELS[policy]}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: "currentColor" }}
        aria-hidden="true"
      />
      <span className="font-mono">{policy}</span>
      {!compact && <span className="hidden sm:inline">{POLICY_LABELS[policy].split(": ")[1]}</span>}
    </span>
  );
}