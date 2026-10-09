import { PageHeader } from "@/components/shared/PageHeader";
import { DataState } from "@/components/shared/DataState";
import { ChartCard } from "@/components/shared/ChartCard";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useState, useEffect } from "react";

export function Settings() {
  const [defaultUncertainty, setDefaultUncertainty] = useState<"SD" | "SE" | "CI95">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("defaultUncertainty");
      if (stored) return stored as "SD" | "SE" | "CI95";
    }
    return "SD";
  });

  useEffect(() => {
    localStorage.setItem("defaultUncertainty", defaultUncertainty);
  }, [defaultUncertainty]);

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Theme, default seed, uncertainty type, chart download format, and data source configuration."
      />
            <DataState state="success">
        <div className="space-y-6 max-w-2xl">
          <ChartCard title="Appearance" caption="Theme is synced with system preference by default">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Theme</label>
                <ThemeToggle />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Default Uncertainty Display</label>
                <SegmentedControl
                  value={defaultUncertainty}
                  onValueChange={setDefaultUncertainty}
                  options={[
                    { value: "SD", label: "SD" },
                    { value: "SE", label: "SE" },
                    { value: "CI95", label: "95% CI" },
                  ]}
                />
              </div>
            </div>
          </ChartCard>
        </div>
      </DataState>
    </div>
  );
}