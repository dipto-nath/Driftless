import { cn } from "@/lib/utils";
import { Loader2, AlertCircle, FileQuestion, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

type DataStateType = "loading" | "empty" | "error" | "success";

interface DataStateProps {
  state: DataStateType;
  error?: Error | string;
  onRetry?: () => void;
  children?: ReactNode;
  emptyMessage?: string;
  loadingMessage?: string;
}

const stateConfigs = {
  loading: { icon: Loader2, message: "Loading data...", animate: true },
  empty: { icon: FileQuestion, message: "No data available", animate: false },
  error: { icon: AlertCircle, message: "Failed to load data", animate: false },
};

export function DataState({ state, error, onRetry, children, emptyMessage, loadingMessage }: DataStateProps) {
  if (state === "success") {
    return <>{children}</>;
  }

  const config = stateConfigs[state];
  const Icon = config.icon;
  const message = state === "loading" ? loadingMessage : state === "empty" ? emptyMessage : config.message;

  return (
    <div className={cn("rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]", state === "error" && "border-[var(--danger)]/30")}>
      <div className="flex flex-col items-center justify-center text-center gap-3 min-h-[200px]">
        <div className={cn("p-3 rounded-full bg-[var(--surface-2)]", config.animate && "animate-spin")}>
          <Icon className="h-6 w-6 text-[var(--text-muted)]" aria-hidden="true" />
        </div>
        <div>
          <p className="text-[var(--text)] font-medium">{message}</p>
          {error && state === "error" && (
            <p className="mt-1 text-sm text-[var(--text-muted)] font-mono max-w-md break-all">
              {error instanceof Error ? error.message : String(error)}
            </p>
          )}
        </div>
        {onRetry && state === "error" && (
          <button
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-fg)] font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}