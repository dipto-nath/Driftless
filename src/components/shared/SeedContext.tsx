import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { APP_CONFIG } from "@/config";

export type SeedOption = "official" | "all" | number;

interface SeedContextType {
  selectedSeed: SeedOption;
  setSelectedSeed: (seed: SeedOption) => void;
}

const SeedContext = createContext<SeedContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export { SeedContext };

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
