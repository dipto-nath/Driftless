import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Database } from "lucide-react";
import { APP_CONFIG } from "@/config";

type SeedOption = "official" | "all" | number;

interface SeedContextType {
  selectedSeed: SeedOption;
  setSelectedSeed: (seed: SeedOption) => void;
}

const SeedContext = createContext<SeedContextType | undefined>(undefined);

export function SeedProvider({ children }: { children: ReactNode }) {
  const [selectedSeed, setSelectedSeed] = useState<SeedOption>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedSeed");
      if (stored === "official" || stored === "all") return stored;
      const num = Number(stored);
      if (!isNaN(num) && num >= 1 && num <= APP_CONFIG.maxSeeds) return num;
    }
    return "official";
  });

  useEffect(() => {
    localStorage.setItem("selectedSeed", String(selectedSeed));
  }, [selectedSeed]);

  return (
    <SeedContext.Provider value={{ selectedSeed, setSelectedSeed }}>
      {children}
    </SeedContext.Provider>
  );
}

export function useSeed() {
  const context = useContext(SeedContext);
  if (!context) {
    throw new Error("useSeed must be used within a SeedProvider");
  }
  return context;
}

export function SeedSelect() {
  const { selectedSeed, setSelectedSeed } = useSeed();

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
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
          "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)]",
          "hover:bg-[var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        )}
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        <Database className="h-4 w-4 text-[var(--text-muted)]" aria-hidden="true" />
        <span className="hidden sm:inline font-mono tabular-nums">
          {selectedSeed === "official"
            ? "Official"
            : selectedSeed === "all"
            ? "All seeds"
            : `Seed ${selectedSeed}`}
        </span>
        <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" aria-hidden="true" />
      </button>
      <ul
        className="absolute right-0 mt-1.5 min-w-[160px] bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-[var(--shadow)] py-1 z-40"
        role="listbox"
        aria-label="Seed options"
      >
        {options.map(({ value, label }) => (
          <li key={value} role="option" aria-selected={selectedSeed === value}>
            <button
              onClick={() => setSelectedSeed(value as SeedOption)}
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
    </div>
  );
}