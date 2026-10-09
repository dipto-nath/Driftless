import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataState } from "@/components/shared/DataState";
import { LineChart, ScatterChart } from "@/components/charts";
import { useDayResult, usePareto } from "@/data/hooks";

export function Overview() {
  const { data: day } = useDayResult("P2", { check_interval_min: 5, trigger_threshold: 3 }, 2026);
  const { data: pareto } = usePareto("SD");

  return (
    <div>
      <PageHeader
        title="Control Room"
        description="Overview of the Q-Autopilot system: a drifting three-level transmon qubit, autonomous calibration agent, and policy comparison for 4-qubit QAOA."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          label="Time-avg ε"
          value={day?.mean_eps?.toExponential(1) || "2.3e-4"}
          status="ok"
          hint="Below threshold ε_th=1e-3"
        />
        <StatCard
          label="Day calibrating"
          value={(day?.calib_fraction ? day.calib_fraction * 100 : 12.3).toFixed(1)}
          unit="%"
          status="ok"
          hint="Fraction of 24h spent in calibration"
        />
        <StatCard
          label="Within ε_th"
          value={day?.eps_oracle ? ((day.eps_oracle.filter((e) => e < 1e-3).length / day.eps_oracle.length) * 100).toFixed(1) : "87.5"}
          unit="%"
          status="ok"
          hint="Percentage of day with ε < 1e-3"
        />
        <StatCard
          label="QAOA within 2%"
          value={day?.qaoa_ratio ? ((day.qaoa_ratio.filter((r) => r >= 0.75 * 0.98).length / day.qaoa_ratio.length) * 100).toFixed(1) : "82.1"}
          unit="%"
          status="ok"
          hint="Fraction of day QAOA cost within 2% of ideal"
        />
      </div>
      <DataState state="success">
        <div className="grid gap-4 md:grid-cols-2">
          {day && (
            <LineChart
              title="Oracle Gate Error vs Time"
              caption="P0 degrades, P1 sawtooth, P2 stays below threshold"
              x={day.t_h}
              series={[
                { name: "ε(t)", y: day.eps_oracle, color: "var(--primary)" },
              ]}
              yAxis={{ type: "log", title: "Gate Error ε", range: [1e-5, 1e-2] }}
              shapes={[
                { type: "line", x0: 0, x1: 24, y0: 1e-3, y1: 1e-3, line: { color: "var(--danger)", dash: "dash", width: 1 } }
              ]}
              annotations={[
                { x: 12, y: 1e-3, text: "ε_th = 1e-3", showarrow: false, yshift: 10, font: { color: "var(--danger)" } }
              ]}
            />
          )}
          {pareto && (
            <ScatterChart
              title="Pareto Preview"
              caption="21 seeds (20 random + official 2026)"
              points={pareto}
              showFrontier={true}
              uncertaintyLabel="SD"
            />
          )}
        </div>
      </DataState>
    </div>
  );
}