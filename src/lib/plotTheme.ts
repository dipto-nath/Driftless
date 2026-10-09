import type { Layout } from "plotly.js-dist";

export function getPlotLayout(): Partial<Layout> {
  if (typeof document === "undefined") {
    return {
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: { family: "Inter, sans-serif", color: "#24312F" },
      margin: { l: 64, r: 24, t: 24, b: 56 },
      xaxis: { gridcolor: "#DDE3DA", zeroline: false },
      yaxis: { gridcolor: "#DDE3DA", zeroline: false },
      legend: { orientation: "h", y: -0.2 },
    };
  }

  const css = getComputedStyle(document.documentElement);
  return {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { family: "Inter, sans-serif", color: css.getPropertyValue("--text").trim() },
    margin: { l: 64, r: 24, t: 24, b: 56 },
    xaxis: { gridcolor: css.getPropertyValue("--border").trim(), zeroline: false },
    yaxis: { gridcolor: css.getPropertyValue("--border").trim(), zeroline: false },
    legend: { orientation: "h", y: -0.2 },
  };
}

export function getPolicyColor(policy: "P0" | "P1" | "P2"): string {
    const colors = {
    P0: "var(--danger)",
    P1: "var(--warning)",
    P2: "var(--primary)",
  } as const;
  return colors[policy];
}

export function getPolicyDash(policy: "P0" | "P1" | "P2"): "dot" | "dash" | "solid" {
    const dashes = {
    P0: "dot",
    P1: "dash",
    P2: "solid",
  } as const;
  return dashes[policy];
}

export function getPolicyMarker(policy: "P0" | "P1" | "P2"): string {
    const markers = {
    P0: "circle",
    P1: "square",
    P2: "diamond",
  } as const;
  return markers[policy];
}