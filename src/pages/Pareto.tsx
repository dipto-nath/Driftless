import { PageHeader } from "@/components/shared/PageHeader";
import { DataState } from "@/components/shared/DataState";
import { ChartCard } from "@/components/shared/ChartCard";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useState } from "react";
import { ScatterChart } from "@/components/charts";
import { usePareto } from "@/data/hooks";
import type { UncertaintyType } from "@/data/types";

export function Pareto() {
  const [uncertainty, setUncertainty] = useState<UncertaintyType>("SD");
  const [showFrontier, setShowFrontier] = useState(true);
  const { data: pareto } = usePareto(uncertainty);

  return (
    <div>
      <PageHeader
        title="Pareto Explorer"
        description="Pareto frontier (D4): calibration fraction vs time-averaged oracle ε with error bars, frontier line, and policy family toggles. 21 seeds (20 random + official 2026)."
      />
      <div className="grid gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <SegmentedControl value={uncertainty} onValueChange={setUncertainty} options={[{ value: "SD", label: "SD" }, { value: "SE", label: "SE" }, { value: "CI95", label: "95% CI" }]} />
          <div className="flex items-center gap-4 border-l border-[var(--border)] pl-4 ml-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={showFrontier} onChange={(e) => setShowFrontier(e.target.checked)} className="rounded border-[var(--border)]" />
              Show Frontier
            </label>
          </div>
        </div>
      </div>
      <DataState state="success">
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          {pareto && <ScatterChart title="Pareto Frontier" caption={`Mean ± ${uncertainty} over 21 seeds; P2 dominates frontier`} points={pareto} showFrontier={showFrontier} uncertaintyLabel={uncertainty} />}
          <div className="space-y-4">
            <ChartCard title="Configurations Table" caption="Sortable table; click to view day in Policy Simulator">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-left text-[var(--text-muted)]">
                      <th className="pb-2 px-3">Policy</th>
                      <th className="pb-2 px-3">Params</th>
                      <th className="pb-2 px-3">Calib %</th>
                      <th className="pb-2 px-3">ε Mean</th>
                      <th className="pb-2 px-3">ε Err</th>
                      <th className="pb-2 px-3">Frontier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pareto?.map((p, i) => (
                      <tr key={i} className="border-b border-[var(--border)]/50 hover:bg-[var(--surface-2)] cursor-pointer">
                        <td className="py-2 px-3 font-mono font-medium" style={{ color: `var(--${p.policy === "P0" ? "danger" : p.policy === "P1" ? "warning" : "primary"})` }}>{p.policy}</td>
                        <td className="py-2 px-3 font-mono text-xs">{JSON.stringify(p.params)}</td>
                        <td className="py-2 px-3">{(p.calib_fraction_mean * 100).toFixed(1)}</td>
                        <td className="py-2 px-3 font-mono">{p.mean_eps_mean.toExponential(1)}</td>
                        <td className="py-2 px-3 font-mono">±{p.mean_eps_err.toExponential(1)}</td>
                        <td className="py-2 px-3">{p.on_frontier ? "✓" : ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>
        </div>
      </DataState>
    </div>
  );
}
