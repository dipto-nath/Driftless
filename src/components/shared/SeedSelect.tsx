import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Database } from "lucide-react";
import { APP_CONFIG } from "@/config";
import { useSeed } from "./useSeed";
import type { SeedOption } from "./SeedContext";

export function SeedSelect() {
  const { selectedSeed, setSelectedSeed } = useSeed();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { value: "official", label: "Official (2026)" },
    { value: "all", label: "All seeds (aggregate)" },
    ...Array.from({ length: APP_CONFIG.maxSeeds }, (_, i) => ({
      value: i + 1,
      label: `Seed ${i + 1}`,
    })),
  ];

  return (
    <div className="relative" role="group" aria-label="Seed selection">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
          "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)]",
          "hover:bg-[var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Database className="h-4 w-4 text-[var(--text-muted)]" aria-hidden="true" />
        <span className="hidden sm:inline font-mono tabular-nums">
          {selectedSeed === "official"
            ? "Official"
            : selectedSeed === "all"
            ? "All seeds"
            : `Seed ${selectedSeed}`}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-[var(--text-muted)] transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
      </button>
      {isOpen && (
        <ul
          ref={dropdownRef}
          className="absolute right-0 mt-1.5 min-w-[160px] bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-[var(--shadow)] py-1 z-40"
          role="listbox"
          aria-label="Seed options"
        >
          {options.map(({ value, label }) => (
            <li key={value} role="option" aria-selected={selectedSeed === value}>
              <button
                onClick={() => {
                  setSelectedSeed(value as SeedOption);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 text-sm text-left transition-colors",
                  "focus-visible:outline-none focus-visible:bg-[var(--primary-soft)] focus-visible:text-[var(--primary)]",
                  selectedSeed === value
                    ? "bg-[var(--primary-soft)] text-[var(--primary)] font-medium"
                    : "text-[var(--text)] hover:bg-[var(--surface-2)]"
                )}
              >
                <span className="font-mono tabular-nums">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
