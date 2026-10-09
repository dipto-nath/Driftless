import Plot from "react-plotly.js";
import { ChartCard } from "@/components/shared/ChartCard";
import type { ParetoPoint, PolicyId } from "@/data/types";
import { POLICY_COLORS } from "@/config";

interface ScatterChartProps {
  title: string;
  caption?: string;
  points: ParetoPoint[];
  showFrontier: boolean;
  uncertaintyLabel: string;
  xLog?: boolean;
  height?: number;
}

export function ScatterChart({ title, caption, points, showFrontier, uncertaintyLabel, xLog = false, height = 500 }: ScatterChartProps) {
  const policyGroups = points.reduce((acc, p) => {
    (acc[p.policy] = acc[p.policy] || []).push(p);
    return acc;
  }, {} as Record<PolicyId, ParetoPoint[]>);

  const data = Object.entries(policyGroups).map(([policy, pts]) => ({
    x: pts.map((p) => p.calib_fraction_mean),
    y: pts.map((p) => p.mean_eps_mean),
    error_x: { type: "data" as const, array: pts.map((p) => p.calib_fraction_err), visible: true },
    error_y: { type: "data" as const, array: pts.map((p) => p.mean_eps_err), visible: true },
    type: "scatter" as const,
    mode: "markers" as const,
    name: pts[0]?.label ?? policy,
    marker: { color: POLICY_COLORS[policy as PolicyId], size: 10, symbol: "circle" },
    text: pts.map((p) => `${p.label}<br>Calib: ${(p.calib_fraction_mean * 100).toFixed(1)}%<br>ε: ${p.mean_eps_mean.toExponential(2)}<br>Seeds: ${p.n_seeds}`),
    hovertemplate: "%{text}<extra></extra>",
    showlegend: true,
  }));

  // Frontier line
  const frontierPts = points.filter((p) => p.on_frontier).sort((a, b) => a.calib_fraction_mean - b.calib_fraction_mean);
  const extraTraces = [];
  if (showFrontier && frontierPts.length > 1) {
    extraTraces.push({
      x: frontierPts.map((p) => p.calib_fraction_mean),
      y: frontierPts.map((p) => p.mean_eps_mean),
      type: "scatter" as const,
      mode: "lines" as const,
      name: "Pareto Frontier",
      line: { color: "var(--primary)", width: 3, dash: "dash" },
      showlegend: true,
      hoverinfo: "skip",
    });
  }

  const layout = {
    title: { text: title, font: { size: 14 } },
    height,
    margin: { t: 50, r: 20, b: 60, l: 70 },
    xaxis: { title: "Calibration Fraction (%)", type: xLog ? "log" : "linear", tickformat: ".1%", showgrid: true, gridcolor: "var(--border)" },
    yaxis: { title: `Mean Oracle Gate Error ε (${uncertaintyLabel})`, type: "log", showgrid: true, gridcolor: "var(--border)", exponentformat: "e" },
    paper_bgcolor: "var(--surface)",
    plot_bgcolor: "var(--surface)",
    font: { color: "var(--text)" },
    legend: { bgcolor: "var(--surface-2)", bordercolor: "var(--border)", borderwidth: 1 },
    hovermode: "closest" as const,
  };

  return (
    <ChartCard title={title} caption={caption ?? ""}>
      <Plot data={[...data, ...extraTraces]} layout={layout} config={{ responsive: true, displayModeBar: true }} />
    </ChartCard>
  );
}
