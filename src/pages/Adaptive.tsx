import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataState } from "@/components/shared/DataState";
import { ChartCard } from "@/components/shared/ChartCard";
import { StatCard } from "@/components/shared/StatCard";
import { Slider } from "@/components/ui/slider";

export function Adaptive() {
  const [batch, setBatch] = useState(5);

  return (
    <div>
      <PageHeader
        title="Adaptive Design"
        description="Adaptive Bayesian frequency estimation (D3): posterior evolution heatmap, chosen delays τ, and precision vs shots comparison against fixed grid."
      />
            <DataState state="success">
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <ChartCard title="Posterior Evolution" caption="Mock data: posterior density over Δ grid across batches; slider scrubs batches; true Δ marked">
            <div className="space-y-4">
              <div className="h-80 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
                Heatmap placeholder: Posterior P(Δ|data) over batches
              </div>
                            <Slider
                value={[batch]}
                onValueChange={([v]) => v !== undefined && setBatch(v)}
                max={10}
                step={1}
                className="w-full"
                aria-label="Batch index"
              />
              <p className="text-sm text-[var(--text-muted)] text-center">Batch {batch} of 10</p>
            </div>
          </ChartCard>
          <ChartCard title="Chosen Delays τ" caption="Mock data: adaptive τ (µs, log scale) vs batch number showing doubling-ladder pattern">
            <div className="h-80 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
              Chart placeholder: τ vs batch (log scale)
            </div>
          </ChartCard>
        </div>
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <ChartCard title="Precision vs Shots" caption="Mock data: adaptive (blue) vs fixed-grid (amber) σ_Δ vs shots (log-log); shaded band = SD over 20 repeats; shot saving ≈ 4×">
            <div className="h-80 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
              Chart placeholder: Precision vs shots (log-log)
            </div>
          </ChartCard>
          <div className="grid gap-4">
            <StatCard label="Shot saving factor" value="4.2" unit="×" status="ok" hint="Adaptive vs fixed-grid at equal precision" />
            <StatCard label="Adaptive σ (final)" value="1.8" unit="kHz" status="ok" hint="After 5000 shots" />
            <StatCard label="Fixed σ (final)" value="7.6" unit="kHz" status="warn" hint="After 5000 shots on dense grid" />
            <StatCard label="Repeats" value="20" status="ok" hint="Monte Carlo runs for error bars" />
          </div>
        </div>
        <div className="bg-[var(--surface-2)] rounded-lg p-4 text-sm text-[var(--text-muted)]">
          <h4 className="font-medium text-[var(--text)] mb-2">Why adaptive wins</h4>
          <ul className="space-y-1 list-disc list-inside">
            <li>Information per shot grows as (τ·V)² — use long delays when variance V is low</li>
            <li>Long delays alias: adaptive resolves ambiguity with short τ first</li>
            <li>Adaptive allocates shots where Fisher information is highest</li>
            <li>Fundamentally limited by T₂ coherence time</li>
                    </ul>
        </div>
      </DataState>
    </div>
  );
}