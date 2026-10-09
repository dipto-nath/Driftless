"use client";

import { cn } from "@/lib/utils";

interface SegmentedControlOption<T> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T> {
  value: T;
  onValueChange: (value: T) => void;
  options: SegmentedControlOption<T>[];
  className?: string;
  disabled?: boolean;
}

export function SegmentedControl<T extends string | number>({
  value,
  onValueChange,
  options,
  className,
  disabled = false,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-[var(--surface-2)] p-1",
        className
      )}
      role="group"
      aria-label="Segmented control"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => !disabled && onValueChange(option.value)}
          disabled={disabled}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2",
            "disabled:opacity-50 disabled:pointer-events-none",
            value === option.value
              ? "bg-[var(--surface)] text-[var(--text)] shadow-sm"
              : "text-[var(--text-muted)] hover:text-[var(--text)]"
          )}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}