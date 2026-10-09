import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataState } from "@/components/shared/DataState";
import { ChartCard } from "@/components/shared/ChartCard";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { LineChart, DriftAblationChart, HardwareAlgoTable } from "@/components/charts";
import { useQuery } from "@tanstack/react-query";
import { dataSource } from "@/data";

export function Algorithm() {
  const [zPercent, setZPercent] = useState(2);
  const { data: summary } = useQuery({ queryKey: ["algo-summary", zPercent], queryFn: () => dataSource.getHardwareAlgoSummary(zPercent) });
  const { data: ablation } = useQuery({ queryKey: ["ablation"], queryFn: () => dataSource.getDriftAblation() });
  const { data: dayP0 } = useQuery({ queryKey: ["day", "P0", 2026], queryFn: () => dataSource.getDayResult("P0", {}, 2026) });
  const { data: dayP1 } = useQuery({ queryKey: ["day", "P1", 2026], queryFn: () => dataSource.getDayResult("P1", { period_min: 60 }, 2026) });
  const { data: dayP2 } = useQuery({ queryKey: ["day", "P2", 2026], queryFn: () => dataSource.getDayResult("P2", { check_interval_min: 5, trigger_threshold: 3 }, 2026) });

  return (
    <div>
      <PageHeader title="Algorithm Impact" description="Hardware–algorithm co-design (D5): QAOA cost vs time for each policy, ablation study of drift sources, and the headline sentence generator." />
      <div className="mb-6">
        <SegmentedControl value={zPercent} onValueChange={setZPercent} options={[{ value: 1, label: "±1%" }, { value: 2, label: "±2%" }, { value: 5, label: "±5%" }]} />
        <div className="grid gap-4 md:grid-cols-3 mt-4">
          {summary?.map((s) => (
            <div key={s.policy} className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
              <h4 className="font-semibold text-[var(--text)] mb-2">Policy {s.policy}</h4>
              <p className="text-sm leading-relaxed">
                <strong>Policy {s.policy}</strong> spends <b>{s.calib_percent.toFixed(1)}%</b> of the day calibrating and delivers a
                p = 1 QAOA cost within <b>{s.z_percent}%</b> of the ideal value for <b>{s.within_z_percent_of_day.toFixed(1)}%</b> of the day.
              </p>
            </div>
          ))}
        </div>
      </div>
      <DataState state="success">
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          {(dayP0 && dayP1 && dayP2) && (
            <LineChart
              title="QAOA Cost vs Time"
              caption={`Normalized ⟨C⟩/C_max over 24h; ideal reference at 0.75; ±${zPercent}% band shaded`}
              x={dayP0.t_h}
              series={[
                { name: "P0", y: dayP0.qaoa_ratio, color: "var(--danger)" },
                { name: "P1", y: dayP1.qaoa_ratio, color: "var(--warning)" },
                { name: "P2", y: dayP2.qaoa_ratio, color: "var(--primary)" },
                { name: "Ideal", y: dayP0.t_h.map(() => 0.75), color: "var(--success)", dash: "dot" },
                { name: `+${zPercent}%`, y: dayP0.t_h.map(() => 0.75 * (1 + zPercent / 100)), color: "var(--primary)", dash: "dash" },
                { name: `-${zPercent}%`, y: dayP0.t_h.map(() => 0.75 * (1 - zPercent / 100)), color: "var(--primary)", dash: "dash" },
              ]}
              yAxis={{ type: "linear", title: "⟨C⟩/C_max", range: [0.3, 0.85] }}
              height={400}
            />
          )}
          {ablation && <DriftAblationChart title="Drift Ablation" caption="QAOA loss % from each drift source; error bars = SD over 21 seeds" data={ablation} />}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard title="4-Qubit Ring Schematic" caption="QAOA layers: RX mixers via M(t), ideal RZZ gates on ring topology">
            <div className="aspect-square bg-[var(--surface-2)] rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full text-[var(--text-muted)]">
                <circle cx="100" cy="100" r="70" fill="none" stroke="var(--border)" strokeWidth="2" />
                {[0, 1, 2, 3].map((i) => {
                  const angle = (i * Math.PI / 2) - Math.PI / 2;
                  const x = 100 + 70 * Math.cos(angle);
                  const y = 100 + 70 * Math.sin(angle);
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="18" fill="var(--primary)" stroke="var(--primary-fg)" strokeWidth="2" />
                      <text x={x} y={y + 5} textAnchor="middle" fill="var(--primary-fg)" fontSize="14" fontWeight="bold">Q{i}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </ChartCard>
          <div className="space-y-4">
            {summary && <HardwareAlgoTable title="Hardware–Algorithm Summary" caption={`Per-policy metrics for the selected ${zPercent}% threshold`} data={summary} />}
          </div>
        </div>
      </DataState>
    </div>
  );
}
