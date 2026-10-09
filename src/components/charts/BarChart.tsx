import Plot from "react-plotly.js";
import { ChartCard } from "@/components/shared/ChartCard";
import type { DriftAblation, HardwareAlgoSummary } from "@/data/types";

export function DriftAblationChart({ title, caption, data, height = 350 }: { title: string; caption?: string; data: DriftAblation[]; height?: number }) {
  const chartData = [{
    x: data.map((d) => d.qaoa_loss_percent),
    y: data.map((d) => d.source),
    type: "bar" as const,
    orientation: "h" as const,
    marker: { color: "var(--primary)" },
    error_x: { type: "data" as const, array: data.map((d) => d.err), visible: true },
    hovertemplate: "%{y}: %{x:.1f}% ± %{error_x.array:.1f}%<extra></extra>",
  }];

  const layout = {
    title: { text: title, font: { size: 14 } },
    height,
    margin: { t: 50, r: 20, b: 80, l: 120 },
    xaxis: { title: "QAOA Loss (%)", showgrid: true, gridcolor: "var(--border)" },
    yaxis: { type: "category" as const, autorange: "reversed" as const, showgrid: false },
    paper_bgcolor: "var(--surface)",
    plot_bgcolor: "var(--surface)",
    font: { color: "var(--text)" },
    showlegend: false,
  };

  return (
    <ChartCard title={title} caption={caption ?? ""}>
      <Plot data={chartData} layout={layout} config={{ responsive: true, displayModeBar: false }} />
    </ChartCard>
  );
}

export function HardwareAlgoTable({ title, caption, data }: { title: string; caption?: string; data: HardwareAlgoSummary[] }) {
  return (
    <ChartCard title={title} caption={caption ?? ""}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[var(--text-muted)]">
              <th className="pb-2 px-3">Policy</th>
              <th className="pb-2 px-3">Calib %</th>
              <th className="pb-2 px-3">z%</th>
              <th className="pb-2 px-3">Within z% of Day</th>
              <th className="pb-2 px-3">Ideal Cost Ratio</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.policy} className="border-b border-[var(--border)]/50 hover:bg-[var(--surface-2)]">
                <td className="py-2 px-3 font-mono font-medium">{d.policy}</td>
                <td className="py-2 px-3">{d.calib_percent.toFixed(1)}%</td>
                <td className="py-2 px-3">{d.z_percent}%</td>
                <td className="py-2 px-3">{d.within_z_percent_of_day.toFixed(1)}%</td>
                <td className="py-2 px-3 font-mono">{d.ideal_cost_ratio.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}