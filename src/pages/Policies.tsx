import { PageHeader } from "@/components/shared/PageHeader";
import { DataState } from "@/components/shared/DataState";
import { StatCard } from "@/components/shared/StatCard";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Slider } from "@/components/ui/slider";
import { useState, useMemo } from "react";
import { LineChart } from "@/components/charts";
import { useDayResult } from "@/data/hooks";

export function Policies() {
  const [policy, setPolicy] = useState<"P0" | "P1" | "P2">("P2");
  const [p1Period, setP1Period] = useState(60);
  const [p2CheckInterval, setP2CheckInterval] = useState(5);
  const [p2Threshold, setP2Threshold] = useState(3);
  const [seed, setSeed] = useState("2026");
  const [compareAll, setCompareAll] = useState(false);

  const params = useMemo(() => {
    if (policy === "P1") return { period_min: p1Period };
    if (policy === "P2") return { check_interval_min: p2CheckInterval, trigger_threshold: p2Threshold };
    return {};
  }, [policy, p1Period, p2CheckInterval, p2Threshold]);

  const seedNum = seed === "all" ? 2026 : parseInt(seed);

  const { data: day } = useDayResult(policy as any, params, seedNum);
  const { data: allDays } = useDayResult("P1", { period_min: 60 }, seedNum);

  const series = useMemo(() => {
    if (!day) return [];
    const base = [
      { name: "True Δ", y: day.delta_true_khz, color: "var(--primary)", dash: "solid" },
      { name: "Est Δ", y: day.delta_est_khz, color: "var(--primary)", dash: "dash" },
    ];
    if (compareAll) {
      return [
        ...base,
        { name: "P1 True Δ", y: allDays?.delta_true_khz || [], color: "var(--warning)", dash: "solid" },
        { name: "P1 Est Δ", y: allDays?.delta_est_khz || [], color: "var(--warning)", dash: "dash" },
      ];
    }
    return base;
  }, [day, allDays, compareAll]);

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
            options={[{ value: "P0", label: "P0: Never" }, { value: "P1", label: "P1: Fixed Schedule" }, { value: "P2", label: "P2: Health Check" }]}
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
              <option value="2026">Official (2026)</option>
              {Array.from({ length: 20 }, (_, i) => <option key={i} value={i + 1}>Seed {i + 1}</option>)}
            </select>
          </div>
        </div>
      </div>
      <DataState state="success">
        <div className="space-y-4">
          {day && (
            <>
              <LineChart
                title="Detuning Δ/2π"
                caption="True (solid) vs estimated (dashed) detuning in kHz; shaded = calibration windows"
                x={day.t_h}
                series={series.filter(s => s.name.includes("Δ"))}
                yAxis={{ type: "linear", title: "Δ (kHz)" }}
                height={350}
                shapes={day.calib_windows.map((w) => ({ type: "rect", x0: w.start_h, x1: w.end_h, y0: -1000, y1: 1000, fillcolor: w.kind === "full" ? "rgba(255,0,0,0.1)" : "rgba(255,255,0,0.1)", line: { width: 0 }, layer: "below" as const }))}
              />
              <LineChart
                title="Gain g(t)"
                caption="True vs estimated gain; 2% sinusoid + OU drift"
                x={day.t_h}
                series={[
                  { name: "True g", y: day.gain_true, color: "var(--primary)", dash: "solid" },
                  { name: "Est g", y: day.gain_est, color: "var(--primary)", dash: "dash" },
                ]}
                yAxis={{ type: "linear", title: "Gain", range: [0.9, 1.1] }}
                height={350}
              />
              <LineChart
                title="Oracle Gate Error ε"
                caption="Log y-axis; ε_th = 1e-3 dashed line; violations shaded; recalibration resets residuals"
                x={day.t_h}
                series={[
                  { name: "ε(t)", y: day.eps_oracle, color: "var(--danger)" },
                ]}
                yAxis={{ type: "log", title: "Gate Error ε", range: [1e-5, 1e-2] }}
                height={350}
                shapes={[
                  { type: "line", x0: 0, x1: 24, y0: 1e-3, y1: 1e-3, line: { color: "var(--danger)", dash: "dash", width: 1 } },
                  ...day.calib_windows.map((w) => ({ type: "rect", x0: w.start_h, x1: w.end_h, y0: 1e-5, y1: 1e-2, fillcolor: w.kind === "full" ? "rgba(255,0,0,0.1)" : "rgba(255,255,0,0.1)", line: { width: 0 }, layer: "below" as const }))
                ]}
              />
              <LineChart
                title="QAOA Ratio ⟨C⟩/C_max"
                caption="Normalized cost vs time; ideal reference line"
                x={day.t_h}
                series={[
                  { name: "QAOA Ratio", y: day.qaoa_ratio, color: "var(--primary)" },
                  { name: "Ideal (0.75)", y: day.t_h.map(() => 0.75), color: "var(--success)", dash: "dot" },
                ]}
                yAxis={{ type: "linear", title: "⟨C⟩/C_max", range: [0.3, 0.85] }}
                height={350}
              />
            </>
          )}
          {day && (
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <StatCard label="Time-avg ε" value={day.mean_eps.toExponential(1)} status="ok" hint="Mean oracle gate error over 24h" />
              <StatCard label="Calibrating" value={(day.calib_fraction * 100).toFixed(1)} unit="%" status="ok" hint="Fraction of day in calibration" />
              <StatCard label="Full recalibrations" value={String(day.calib_windows.filter(w => w.kind === "full").length)} status="ok" hint="Number of full calibration runs" />
              <StatCard label="Within ε_th" value={((day.eps_oracle.filter(e => e < 1e-3).length / day.eps_oracle.length) * 100).toFixed(1)} unit="%" status="ok" hint="% of day with ε < 1e-3" />
            </div>
          )}
        </div>
      </DataState>
    </div>
  );
}
