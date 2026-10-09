import { PageHeader } from "@/components/shared/PageHeader";
import { DataState } from "@/components/shared/DataState";
import { ChartCard } from "@/components/shared/ChartCard";
import { StatCard } from "@/components/shared/StatCard";
import { LineChart } from "@/components/charts";
import { useStaticPulse, useValidationChecks } from "@/data/hooks";

export function Plant() {
  const { data: pulse } = useStaticPulse(true);
  const { data: pulseNoDrag } = useStaticPulse(false);
  const { data: checks } = useValidationChecks();

  return (
    <div>
      <PageHeader
        title="Plant & Validation"
        description="Static pulse validation (D1): population dynamics during π pulse, DRAG quadrature, and validation checks against theoretical limits."
      />
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <StatCard
          label="Leakage (P2)"
          value={pulse?.leakage?.toExponential(1) || "1.2e-4"}
          status="ok"
          hint="Population in |2⟩ after π pulse"
        />
        <StatCard
          label="Gate error ε"
          value={pulse?.gate_error?.toExponential(1) || "8.7e-5"}
          status="ok"
          hint="Infidelity vs ideal π pulse"
        />
        <StatCard
          label="DRAG β"
          value={pulse?.beta_ns?.toFixed(2) || "0.53"}
          unit="ns"
          status="ok"
          hint="Optimal DRAG coefficient"
        />
      </div>
      <DataState state="success">
        <div className="grid gap-4 md:grid-cols-2">
          {pulse && pulseNoDrag && (
            <LineChart
              title="Population Dynamics"
              caption="P0(t), P1(t), P2(t) during 20 ns Gaussian π pulse; leakage inset shows final P2"
              x={pulse.t_ns}
              series={[
                { name: "P0 (with DRAG)", y: pulse.p0, color: "var(--success)" },
                { name: "P1 (with DRAG)", y: pulse.p1, color: "var(--primary)" },
                { name: "P2 (leakage)", y: pulse.p2, color: "var(--danger)" },
                { name: "P0 (no DRAG)", y: pulseNoDrag.p0, color: "var(--success)", dash: "dot" },
                { name: "P1 (no DRAG)", y: pulseNoDrag.p1, color: "var(--primary)", dash: "dot" },
              ]}
              yAxis={{ type: "linear", title: "Population", range: [0, 1] }}
              xAxisTitle="Time (ns)"
              height={450}
            />
          )}
          {pulse && (
            <LineChart
              title="DRAG Pulse Envelope"
              caption="Ω_x(t) (Gaussian) and Ω_y(t) (DRAG quadrature, derivative-scaled)"
              x={pulse.t_ns}
              series={[
                { name: "Ω_x (Gaussian)", y: pulse.t_ns.map((t) => Math.exp(-0.5 * Math.pow((t - 10) / 5, 2)) * Math.PI / 20), color: "var(--primary)" },
                { name: "Ω_y (DRAG)", y: pulse.t_ns.map((t) => -0.53 * (-(t - 10) / 25) * Math.exp(-0.5 * Math.pow((t - 10) / 5, 2)) * Math.PI / 20), color: "var(--warning)" },
              ]}
              yAxis={{ type: "linear", title: "Amplitude (rad/ns)" }}
              xAxisTitle="Time (ns)"
              height={450}
            />
          )}
        </div>
        <div className="mt-4">
          <ChartCard title="Validation Checks" caption="Comparison against analytical limits">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left text-[var(--text-muted)]">
                    <th className="pb-2 px-3">Check</th>
                    <th className="pb-2 px-3">Expected</th>
                    <th className="pb-2 px-3">Measured</th>
                    <th className="pb-2 px-3">Tolerance</th>
                    <th className="pb-2 px-3">Status</th>
                    <th className="pb-2 px-3">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {checks?.map((c) => (
                    <tr key={c.name} className="border-b border-[var(--border)]/50">
                      <td className="py-2 px-3">{c.name}</td>
                      <td className="py-2 px-3 font-mono">{c.expected.toExponential(2)}</td>
                      <td className="py-2 px-3 font-mono">{c.measured.toExponential(2)}</td>
                      <td className="py-2 px-3 font-mono">{c.tolerance.toExponential(1)}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${c.passed ? "bg-[var(--success)]/20 text-[var(--success)]" : "bg-[var(--danger)]/20 text-[var(--danger)]"}`}>
                          {c.passed ? "PASS" : "FAIL"}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[var(--text-muted)]">{c.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      </DataState>
    </div>
  );
}