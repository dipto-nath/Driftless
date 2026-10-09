import Plot from "react-plotly.js";
import { ChartCard } from "@/components/shared/ChartCard";
import type { ReactNode } from "react";

interface LineChartProps {
  title: string;
  caption?: string;
  x: number[];
  series: { name: string; y: number[]; color?: string; dash?: string; lineWidth?: number }[];
  yAxis?: { type: "linear" | "log"; title: string; range?: number[] };
  xAxisTitle?: string;
  height?: number;
  showLegend?: boolean;
  shapes?: any[];
  annotations?: any[];
  nSeeds?: number;
  uncertainty?: "SD" | "SE" | "CI95";
}

export function LineChart({
  title,
  caption,
  x,
  series,
  yAxis = { type: "linear", title: "Value" },
  xAxisTitle = "Time (h)",
  height = 400,
  showLegend = true,
  shapes = [],
  annotations = [],
  nSeeds,
  uncertainty,
}: LineChartProps) {
  const data = series.map((s) => ({
    x,
    y: s.y,
    type: "scatter" as const,
    mode: "lines" as const,
    name: s.name,
    line: { color: s.color, dash: s.dash, width: s.lineWidth || 2 },
    hovertemplate: `${s.name}: %{y:.3e}<br>${xAxisTitle}: %{x:.2f}<extra></extra>`,
  }));

  const layout = {
    title: { text: title, font: { size: 14 } },
    height,
    margin: { t: 50, r: 20, b: 50, l: 60 },
    xaxis: { title: xAxisTitle, showgrid: true, gridcolor: "var(--border)" },
    yaxis: { title: yAxis.title, type: yAxis.type, range: yAxis.range, showgrid: true, gridcolor: "var(--border)" },
    paper_bgcolor: "var(--surface)",
    plot_bgcolor: "var(--surface)",
    font: { color: "var(--text)" },
    showlegend: showLegend,
    legend: { bgcolor: "var(--surface-2)", bordercolor: "var(--border)", borderwidth: 1 },
    shapes,
    annotations,
    hovermode: "x unified" as const,
  };

  const chartChildren: ReactNode = (
    <Plot data={data} layout={layout} config={{ responsive: true, displayModeBar: false }} />
  );

  // Build props object conditionally to satisfy exactOptionalPropertyTypes
  interface CardProps {
    title: string;
    caption: string;
    children: ReactNode;
    nSeeds?: number;
    uncertainty?: "SD" | "SE" | "CI95";
  }

  const cardProps: CardProps = {
    title,
    caption: caption ?? "",
    children: chartChildren,
  };
  if (nSeeds !== undefined) cardProps.nSeeds = nSeeds;
  if (uncertainty !== undefined) cardProps.uncertainty = uncertainty;

  return <ChartCard {...cardProps} />;
}