import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ChartCard } from "@/components/shared/ChartCard";
import { DataState } from "@/components/shared/DataState";

export function Overview() {
  return (
    <div>
      <PageHeader
        title="Control Room"
        description="Overview of the Q-Autopilot system: a drifting three-level transmon qubit, autonomous calibration agent, and policy comparison for 4-qubit QAOA."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Time-avg ε" value="2.3e-4" unit="" status="ok" hint="Below threshold ε_th=1e-3" />
        <StatCard label="Day calibrating" value="12.3" unit="%" status="ok" hint="Fraction of 24h spent in calibration" />
        <StatCard label="Within ε_th" value="87.5" unit="%" status="ok" hint="Percentage of day with ε < 1e-3" />
        <StatCard label="QAOA within 2%" value="82.1" unit="%" status="ok" hint="Fraction of day QAOA cost within 2% of ideal" />
      </div>
      <DataState state="success">
        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard title="Oracle Gate Error vs Time" caption="Mock data: P0 degrades, P1 sawtooth, P2 stays below threshold">
            <div className="h-64 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
              Chart placeholder: ε(t) for P0/P1/P2 (log y-axis, ε_th line)
            </div>
          </ChartCard>
          <ChartCard title="Pareto Preview" caption="Mock data: calibration fraction vs mean ε, 21 seeds">
            <div className="h-64 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
              Chart placeholder: Pareto frontier preview
            </div>
          </ChartCard>
        </div>
      </DataState>
    </div>
  );
}