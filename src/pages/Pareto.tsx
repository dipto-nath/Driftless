import { PageHeader } from "@/components/shared/PageHeader";
import { DataState } from "@/components/shared/DataState";
import { ChartCard } from "@/components/shared/ChartCard";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useState } from "react";

export function Pareto() {
  const [uncertainty, setUncertainty] = useState<"SD" | "SE" | "CI95">("SD");
  const [showFrontier, setShowFrontier] = useState(true);
  const [showP0, setShowP0] = useState(true);
  const [showP1, setShowP1] = useState(true);
  const [showP2, setShowP2] = useState(true);
  const [logX, setLogX] = useState(false);

  return (
    <div>
      <PageHeader
        title="Pareto Explorer"
        description="Pareto frontier (D4): calibration fraction vs time-averaged oracle ε with error bars, frontier line, and policy family toggles. 21 seeds (20 random + official 2026)."
      />
      <div className="grid gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <SegmentedControl
            value={uncertainty}
            onValueChange={setUncertainty}
            options={[
              { value: "SD", label: "SD" },
              { value: "SE", label: "SE" },
              { value: "CI95", label: "95% CI" },
            ]}
          />
          <div className="flex items-center gap-4 border-l border-[var(--border)] pl-4 ml-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={showFrontier} onChange={(e) => setShowFrontier(e.target.checked)} className="rounded border-[var(--border)]" />
              Frontier only
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={logX} onChange={(e) => setLogX(e.target.checked)} className="rounded border-[var(--border)]" />
              Log X
            </label>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm text-[var(--text-muted)]">Policy families:</span>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showP0} onChange={(e) => setShowP0(e.target.checked)} className="rounded border-[var(--border)]" />
            <span style={{ color: "var(--danger)" }}>●</span> P0
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showP1} onChange={(e) => setShowP1(e.target.checked)} className="rounded border-[var(--border)]" />
            <span style={{ color: "var(--warning)" }}>●</span> P1
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showP2} onChange={(e) => setShowP2(e.target.checked)} className="rounded border-[var(--border)]" />
            <span style={{ color: "var(--primary)" }}>●</span> P2
          </label>
        </div>
      </div>
            <DataState state="success">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <ChartCard title="Pareto Frontier" caption={`Mock data: Mean ± ${uncertainty} over 21 seeds (20 random + official seed 2026); P2 dominates frontier`} nSeeds={21} uncertainty={uncertainty}>
            <div className="h-[500px] bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
              Chart placeholder: Pareto scatter with error bars, frontier line, hollow official-seed marker
            </div>
          </ChartCard>
          <div className="space-y-4">
            <ChartCard title="Configurations Table" caption="Sortable table of all ~25 configs; click 'View day' to open Policy Simulator">
              <div className="h-96 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
                Table placeholder: Config | Policy | Params | Calib% | ε_mean | ε_err | Frontier | View day
              </div>
            </ChartCard>
          </div>
        </div>
      </DataState>
    </div>
  );
}