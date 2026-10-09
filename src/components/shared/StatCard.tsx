import { cn } from "@/lib/utils";

type Status = "ok" | "warn" | "bad";

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  status?: Status;
  hint?: string;
}

const statusStyles: Record<Status, string> = {
  ok: "bg-[var(--success)]",
  warn: "bg-[var(--warning)]",
  bad: "bg-[var(--danger)]",
};

export function StatCard({ label, value, unit, status = "ok", hint }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] transition-shadow hover:shadow-lg"
      )}
      title={hint}
    >
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <span className={cn("h-2 w-2 rounded-full", statusStyles[status])} aria-hidden="true" />
        {label}
      </div>
      <div className="mt-2 font-mono text-3xl tabular-nums">
        {value}
        {unit && <span className="ml-1 text-base text-[var(--text-muted)]">{unit}</span>}
      </div>
    </div>
  );
}