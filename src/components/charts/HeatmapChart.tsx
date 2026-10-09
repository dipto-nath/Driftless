import Plot from "react-plotly.js";
import { ChartCard } from "@/components/shared/ChartCard";
import type { AdaptiveRun } from "@/data/types";

interface HeatmapChartProps {
  title: string;
  caption?: string;
  data: AdaptiveRun;
  batch: number;
  onBatchChange: (b: number) => void;
  height?: number;
}

export function HeatmapChart({ title, caption, data, batch, onBatchChange, height = 400 }: HeatmapChartProps) {
  const posteriors = data.posteriors[batch] || data.posteriors[0];

  const heatmapData = [{
    z: [posteriors],
    x: data.delta_grid_khz,
    y: [batch],
    type: "heatmap" as const,
    colorscale: "Viridis",
    showscale: true,
    colorbar: { title: "P(Δ|data)" },
    hovertemplate: "Δ: %{x:.1f} kHz<br>Posterior: %{z:.2e}<extra></extra>",
  }];

  const layout = {
    title: { text: title, font: { size: 14 } },
    height,
    margin: { t: 50, r: 60, b: 50, l: 60 },
    xaxis: { title: "Detuning Δ (kHz)", showgrid: false },
    yaxis: { title: "Batch", showgrid: false, range: [-0.5, data.posteriors.length - 0.5] },
    paper_bgcolor: "var(--surface)",
    plot_bgcolor: "var(--surface)",
    font: { color: "var(--text)" },
    annotations: [{
      x: data.truth_khz,
      y: batch,
      xref: "x",
      yref: "y",
      text: "● True Δ",
      showarrow: true,
      arrowhead: 2,
      arrowcolor: "var(--danger)",
      font: { color: "var(--danger)" },
    }],
  };

  return (
    <ChartCard title={title} caption={caption ?? ""}>
      <div>
        <Plot data={heatmapData} layout={layout} config={{ responsive: true, displayModeBar: false }} />
        <div className="mt-4">
          <label className="block text-sm text-[var(--text-muted)] mb-1">Batch: {batch + 1} / {data.posteriors.length}</label>
          <input
            type="range"
            min={0}
            max={data.posteriors.length - 1}
            value={batch}
            onChange={(e) => onBatchChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </ChartCard>
  );
}