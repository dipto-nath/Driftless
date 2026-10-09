import { PageHeader } from "@/components/shared/PageHeader";
import { DataState } from "@/components/shared/DataState";
import { ChartCard } from "@/components/shared/ChartCard";
import { StatCard } from "@/components/shared/StatCard";

export function Plant() {
  return (
    <div>
      <PageHeader
        title="Plant & Validation"
        description="Static pulse validation (D1): population dynamics during π pulse, DRAG quadrature, and validation checks against theoretical limits."
      />
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <StatCard label="Leakage (P2)" value="1.2e-4" status="ok" hint="Population in |2⟩ after π pulse" />
        <StatCard label="Gate error ε" value="8.7e-5" status="ok" hint="Infidelity vs ideal π pulse" />
        <StatCard label="DRAG β" value="0.53" unit="ns" status="ok" hint="Optimal DRAG coefficient" />
      </div>
            <DataState state="success">
        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard title="Population Dynamics" caption="Mock data: P0(t), P1(t), P2(t) during 20 ns Gaussian π pulse; leakage inset shows final P2">
            <div className="h-80 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
              Chart placeholder: Population vs time (ns)
            </div>
          </ChartCard>
          <ChartCard title="DRAG Pulse Envelope" caption="Mock data: Ω_x(t) (Gaussian) and Ω_y(t) (DRAG quadrature, derivative-scaled)">
            <div className="h-80 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
              Chart placeholder: Pulse envelope (rad/ns)
            </div>
          </ChartCard>
        </div>
        <div className="mt-4">
          <ChartCard title="Validation Checks" caption="Comparison of simulated quantities against analytical limits (two-level Rabi, unitarity, time-step convergence, OU statistics)">
            <div className="h-80 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
              Table placeholder: ValidationCheck[] with pass/fail pills
            </div>
          </ChartCard>
        </div>
      </DataState>
    </div>
  );
}