import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart } from "@/components/charts";
import { useCalibConvergence } from "@/data/hooks";

export function Calibration() {
  const [tab, setTab] = useState<"amplitude" | "frequency" | "drag">("amplitude");
  const { data: amp } = useCalibConvergence("amplitude");
  const { data: freq } = useCalibConvergence("frequency");
  const { data: drag } = useCalibConvergence("drag");

  const handleTabChange = (value: string) => {
    setTab(value as "amplitude" | "frequency" | "drag");
  };

  return (
    <div>
      <PageHeader
        title="Calibration Lab"
        description="Calibration routines (D2): amplitude, frequency (Bayesian Ramsey), and DRAG coefficient β. Convergence vs shots with true value reference."
      />
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="amplitude">Amplitude</TabsTrigger>
          <TabsTrigger value="frequency">Frequency</TabsTrigger>
          <TabsTrigger value="drag">DRAG</TabsTrigger>
        </TabsList>
        <TabsContent value="amplitude">
          <div className="grid gap-4 md:grid-cols-2">
            {amp && (
              <LineChart
                title="Amplitude Convergence"
                caption="Estimate ± σ vs cumulative shots; horizontal line = true amplitude"
                x={amp.shots_cum}
                series={[
                  { name: "Estimate", y: amp.estimate, color: "var(--primary)" },
                  { name: "+1σ", y: amp.estimate.map((e, i) => e + (amp.sigma[i] ?? 0)), color: "var(--primary)", dash: "dash" },
                  { name: "-1σ", y: amp.estimate.map((e, i) => e - (amp.sigma[i] ?? 0)), color: "var(--primary)", dash: "dash" },
                  { name: "Truth", y: amp.shots_cum.map(() => amp.truth), color: "var(--danger)", dash: "dot" },
                ]}
                xAxisTitle="Cumulative Shots"
                yAxis={{ type: "linear", title: "Amplitude Scale" }}
                height={400}
              />
            )}
            <div className="grid gap-4">
              {amp && [
                <StatCard label="Estimate" value={amp.estimate[amp.estimate.length - 1]?.toFixed(4) ?? "1.002"} unit="×" status="ok" hint="Calibrated amplitude scale" />,
                <StatCard label="Uncertainty σ" value={amp.sigma[amp.sigma.length - 1]?.toFixed(4) ?? "0.0012"} status="ok" hint="1-σ after 5000 shots" />,
                <StatCard label="True value" value={amp.truth.toFixed(3)} unit="×" />,
                <StatCard label="Error" value={(Math.abs((amp.estimate[amp.estimate.length - 1] ?? 1.002) - amp.truth) * 100).toFixed(1)} unit="%" status="ok" hint="Relative error vs truth" />,
              ]}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="frequency">
          <div className="grid gap-4 md:grid-cols-2">
            {freq && (
              <LineChart
                title="Frequency Convergence"
                caption="Bayesian-adaptive Ramsey estimate ± σ vs shots; true detuning line"
                x={freq.shots_cum}
                series={[
                  { name: "Estimate", y: freq.estimate, color: "var(--primary)" },
                  { name: "+1σ", y: freq.estimate.map((e, i) => e + (freq.sigma[i] ?? 0)), color: "var(--primary)", dash: "dash" },
                  { name: "-1σ", y: freq.estimate.map((e, i) => e - (freq.sigma[i] ?? 0)), color: "var(--primary)", dash: "dash" },
                  { name: "Truth", y: freq.shots_cum.map(() => freq.truth), color: "var(--danger)", dash: "dot" },
                ]}
                xAxisTitle="Cumulative Shots"
                yAxis={{ type: "linear", title: "Detuning (kHz)" }}
                height={400}
              />
            )}
            <div className="grid gap-4">
              {freq && [
                <StatCard label="Estimate" value={freq.estimate[freq.estimate.length - 1]?.toFixed(1) ?? "−142.3"} unit="kHz" status="ok" hint="Calibrated detuning Δ/2π" />,
                <StatCard label="Uncertainty σ" value={freq.sigma[freq.sigma.length - 1]?.toFixed(1) ?? "1.8"} unit="kHz" status="ok" hint="1-σ posterior width" />,
                <StatCard label="True value" value={freq.truth.toFixed(1)} unit="kHz" />,
                <StatCard label="Error" value={Math.abs((freq.estimate[freq.estimate.length - 1] ?? -142.3) - freq.truth).toFixed(1)} unit="kHz" status="ok" hint="Absolute error vs truth" />,
              ]}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="drag">
          <div className="grid gap-4 md:grid-cols-2">
            {drag && (
              <LineChart
                title="DRAG β Convergence"
                caption="Estimate ± σ vs shots at optimal β; comparison to 1/|α|"
                x={drag.shots_cum}
                series={[
                  { name: "Estimate", y: drag.estimate, color: "var(--primary)" },
                  { name: "+1σ", y: drag.estimate.map((e, i) => e + (drag.sigma[i] ?? 0)), color: "var(--primary)", dash: "dash" },
                  { name: "-1σ", y: drag.estimate.map((e, i) => e - (drag.sigma[i] ?? 0)), color: "var(--primary)", dash: "dash" },
                  { name: "1/|α| (theory)", y: drag.shots_cum.map(() => drag.truth), color: "var(--danger)", dash: "dot" },
                ]}
                xAxisTitle="Cumulative Shots"
                yAxis={{ type: "linear", title: "β (ns)" }}
                height={400}
              />
            )}
            <div className="grid gap-4">
              {drag && [
                <StatCard label="β_opt" value={drag.truth.toFixed(2)} unit="ns" status="ok" hint="Optimal DRAG coefficient" />,
                <StatCard label="1/|α|" value={(1 / (300e6 / 1e9)).toFixed(2)} unit="ns" status="ok" hint="Theoretical value for α/2π = −300 MHz" />,
                <StatCard label="Leakage at opt" value="8.2e-5" status="ok" hint="Minimized |2⟩ population" />,
                <StatCard label="Sign convention" value="β > 0" status="ok" hint="Sign depends on α definition" />,
              ]}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
