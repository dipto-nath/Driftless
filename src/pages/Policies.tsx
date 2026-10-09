import { PageHeader } from "@/components/shared/PageHeader";
import { DataState } from "@/components/shared/DataState";
import { ChartCard } from "@/components/shared/ChartCard";
import { StatCard } from "@/components/shared/StatCard";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export function Policies() {
  const [policy, setPolicy] = useState<"P0" | "P1" | "P2">("P2");
  const [p1Period, setP1Period] = useState(60);
  const [p2CheckInterval, setP2CheckInterval] = useState(5);
  const [p2Threshold, setP2Threshold] = useState(3);
  const [compareAll, setCompareAll] = useState(false);
  const [seed, setSeed] = useState("official");

  return (
    <div>
      <PageHeader
        title="Policy Simulator"
        description="24-hour day simulation (D4): detuning, gain, oracle gate error, and QAOA ratio for P0/P1/P2 with linked zoom/pan and calibration window markers."
      />
      <div className="grid gap-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <SegmentedControl
            value={policy}
            onValueChange={setPolicy}
            options={[
              { value: "P0", label: "P0: Never" },
              { value: "P1", label: "P1: Fixed Schedule" },
              { value: "P2", label: "P2: Health Check" },
            ]}
          />
          <div className="flex-1 min-w-[200px]" />
          <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <input type="checkbox" checked={compareAll} onChange={(e) => setCompareAll(e.target.checked)} className="rounded border-[var(--border)]" />
            Compare all three
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {policy === "P1" && (
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-1">P1 Period: {p1Period} min</label>
                            <Slider value={[p1Period]} onValueChange={([v]) => v !== undefined && setP1Period(v)} min={5} max={360} step={5} />
            </div>
          )}
          {policy === "P2" && (
            <>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">P2 Check Interval: {p2CheckInterval} min</label>
                                <Slider value={[p2CheckInterval]} onValueChange={([v]) => v !== undefined && setP2CheckInterval(v)} min={1} max={30} step={1} />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">P2 Threshold: {p2Threshold}σ</label>
                                <Slider value={[p2Threshold]} onValueChange={([v]) => v !== undefined && setP2Threshold(v)} min={1} max={10} step={0.5} />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm text-[var(--text-muted)] mb-1">Seed: {seed}</label>
            <select value={seed} onChange={(e) => setSeed(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm">
              <option value="official">Official (2026)</option>
              <option value="all">All seeds (aggregate)</option>
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i} value={i + 1}>Seed {i + 1}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
            <DataState state="success">
        <div className="space-y-4">
          <ChartCard title="Detuning Δ/2π" caption="Mock data: true (solid) vs estimated (dashed) detuning in kHz; shaded bands = calibration windows">
            <div className="h-64 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
              Chart placeholder: Δ_true vs Δ_est (kHz) over 24h
            </div>
          </ChartCard>
          <ChartCard title="Gain g(t)" caption="Mock data: true vs estimated gain; 2% sinusoidal + OU drift">
            <div className="h-64 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
              Chart placeholder: g_true vs g_est over 24h
            </div>
          </ChartCard>
          <ChartCard title="Oracle Gate Error ε" caption="Mock data: log y-axis; ε_th = 1e-3 dashed line; violations shaded; recalibration resets residuals">
            <div className="h-64 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
              Chart placeholder: ε(t) log scale with ε_th line
            </div>
          </ChartCard>
          <ChartCard title="QAOA Ratio ⟨C⟩/C_max" caption="Mock data: normalized cost vs time; ideal reference line; collapsible">
            <div className="h-64 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
              Chart placeholder: QAOA ratio over 24h
            </div>
          </ChartCard>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <StatCard label="Time-avg ε" value="2.3e-4" status="ok" hint="Mean oracle gate error over 24h" />
          <StatCard label="Calibrating" value="12.3" unit="%" status="ok" hint="Fraction of day in calibration" />
          <StatCard label="Full recalibrations" value="8" status="ok" hint="Number of full calibration runs" />
          <StatCard label="Within ε_th" value="87.5" unit="%" status="ok" hint="% of day with ε < 1e-3" />
        </div>
      </DataState>
    </div>
  );
}