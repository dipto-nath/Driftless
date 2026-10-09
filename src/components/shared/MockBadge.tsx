import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export function MockBadge() {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        "bg-[var(--warning)]/15 text-[var(--warning)] border border-[var(--warning)]/30"
      )}
      title="Running with mock data — not real experimental results"
    >
      <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
      <span>Mock data</span>
    </span>
  );
}