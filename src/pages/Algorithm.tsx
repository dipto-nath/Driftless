import { PageHeader } from "@/components/shared/PageHeader";
import { DataState } from "@/components/shared/DataState";
import { ChartCard } from "@/components/shared/ChartCard";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useState } from "react";

export function Algorithm() {
  const [zPercent, setZPercent] = useState(2);

  const policies = [
    { policy: "P0", calib: 0.0, withinZ: 12.5, meanRatio: 0.68 },
    { policy: "P1", calib: 8.3, withinZ: 45.2, meanRatio: 0.71 },
    { policy: "P2", calib: 12.3, withinZ: 82.1, meanRatio: 0.74 },
  ];

  return (
    <div>
      <PageHeader
        title="Algorithm Impact"
        description="Hardware–algorithm co-design (D5): QAOA cost vs time for each policy, ablation study of drift sources, and the headline sentence generator."
      />
      <div className="mb-6">
        <div className="flex items-center gap-4 flex-wrap mb-4">
          <SegmentedControl
            value={zPercent}
            onValueChange={setZPercent}
            options={[
              { value: 1, label: "±1%" },
              { value: 2, label: "±2%" },
              { value: 5, label: "±5%" },
            ]}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {policies.map((p) => (
            <div key={p.policy} className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
              <h4 className="font-semibold text-[var(--text)] mb-2">Policy {p.policy}</h4>
              <p className="text-sm leading-relaxed">
                <strong>Policy {p.policy}</strong> spends <b>{p.calib.toFixed(1)}%</b> of the day calibrating and delivers a
                p = 1 QAOA cost within <b>{zPercent}%</b> of the ideal value for <b>{p.withinZ.toFixed(1)}%</b> of the day.
              </p>
            </div>
          ))}
        </div>
      </div>
            <DataState state="success">
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <ChartCard title="QAOA Cost vs Time" caption={`Mock data: normalized ⟨C⟩/C_max over 24h; ideal reference at 0.75; ±${zPercent}% band shaded`}>
            <div className="h-80 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
              Chart placeholder: QAOA ratio over 24h for P0/P1/P2 with ideal line and ±z% band
            </div>
          </ChartCard>
          <ChartCard title="Drift Ablation" caption="Mock data: QAOA loss % from each drift source (OU frequency, telegraph jumps, gain sinusoid, gain OU); error bars = SD over 21 seeds">
            <div className="h-80 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
              Chart placeholder: Horizontal bar chart of drift source contributions
            </div>
          </ChartCard>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard title="4-Qubit Ring Schematic" caption="QAOA layers: RX mixers via M(t), ideal RZZ gates on ring topology">
            <div className="h-64 bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
              SVG placeholder: 4-qubit ring with QAOA circuit diagram
            </div>
          </ChartCard>
          <div className="space-y-4">
            <ChartCard title="Hardware–Algorithm Summary" caption="Per-policy metrics for the selected z% threshold">
              <div className="space-y-2">
                {policies.map((p) => (
                  <div key={p.policy} className="flex items-center justify-between p-3 bg-[var(--surface-2)] rounded-lg">
                    <div>
                      <p className="font-mono font-medium">Policy {p.policy}</p>
                      <p className="text-sm text-[var(--text-muted)]">
                        Calib: {p.calib.toFixed(1)}% · Within {zPercent}%: {p.withinZ.toFixed(1)}% · Mean ratio: {p.meanRatio.toFixed(3)}
                      </p>
                    </div>
                    <span className="text-sm font-mono text-[var(--primary)]">{p.meanRatio.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>
      </DataState>
    </div>
  );
}