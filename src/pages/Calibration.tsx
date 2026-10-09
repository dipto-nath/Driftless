import { PageHeader } from "@/components/shared/PageHeader";
import { ChartCard } from "@/components/shared/ChartCard";
import { StatCard } from "@/components/shared/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Calibration() {
  return (
    <div>
      <PageHeader
        title="Calibration Lab"
        description="Calibration routines (D2): amplitude, frequency (Bayesian Ramsey), and DRAG coefficient β. Convergence vs shots with true value reference."
      />
      <Tabs defaultValue="amplitude" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="amplitude">Amplitude</TabsTrigger>
          <TabsTrigger value="frequency">Frequency</TabsTrigger>
          <TabsTrigger value="drag">DRAG</TabsTrigger>
        </TabsList>
        <TabsContent value="amplitude">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard title="Amplitude Convergence" caption="Mock data: estimate ± σ vs cumulative shots; horizontal line = true amplitude">
              <div className="h-80 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
                Chart placeholder: Amplitude estimate convergence
              </div>
            </ChartCard>
            <div className="grid gap-4">
              <StatCard label="Estimate" value="1.002" unit="×" status="ok" hint="Calibrated amplitude scale" />
              <StatCard label="Uncertainty σ" value="0.0012" status="ok" hint="1-σ after 5000 shots" />
              <StatCard label="True value" value="1.000" unit="×" />
              <StatCard label="Error" value="0.2" unit="%" status="ok" hint="Relative error vs truth" />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="frequency">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard title="Frequency Convergence" caption="Mock data: Bayesian-adaptive Ramsey estimate ± σ vs shots; true detuning line">
              <div className="h-80 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
                Chart placeholder: Frequency estimate convergence
              </div>
            </ChartCard>
            <div className="grid gap-4">
              <StatCard label="Estimate" value="−142.3" unit="kHz" status="ok" hint="Calibrated detuning Δ/2π" />
              <StatCard label="Uncertainty σ" value="1.8" unit="kHz" status="ok" hint="1-σ posterior width" />
              <StatCard label="True value" value="−140.0" unit="kHz" />
              <StatCard label="Error" value="2.3" unit="kHz" status="ok" hint="Absolute error vs truth" />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="drag">
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard title="DRAG β Sweep" caption="Mock data: leakage vs β; marked optimum β_opt ≈ 0.53 ns; comparison to 1/|α| ≈ 0.53 ns">
              <div className="h-80 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
                Chart placeholder: β sweep with optimum marker
              </div>
            </ChartCard>
            <div className="grid gap-4">
              <StatCard label="β_opt" value="0.53" unit="ns" status="ok" hint="Optimal DRAG coefficient" />
              <StatCard label="1/|α|" value="0.53" unit="ns" status="ok" hint="Theoretical value for α/2π = −300 MHz" />
              <StatCard label="Leakage at opt" value="8.2e-5" status="ok" hint="Minimized |2⟩ population" />
              <StatCard label="Sign convention" value="β > 0" status="ok" hint="Note: sign depends on α definition" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}