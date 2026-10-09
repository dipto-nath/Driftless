/**
 * Application configuration.
 * Change DATA_SOURCE to "http" when backend is ready.
 */
export const DATA_SOURCE: "mock" | "http" = "http";

export const APP_CONFIG = {
  name: "Q-Autopilot",
  version: "0.1.0",
  officialSeed: 2026,
  maxSeeds: 20,
  errorThreshold: 1e-3,
  shotDurationUs: 500,
  maxPointsPerSeries: 2000,
} as const;

export const POLICY_COLORS = {
  P0: "var(--danger)",
  P1: "var(--warning)",
  P2: "var(--primary)",
} as const;

export const POLICY_DASHES = {
  P0: "dot",
  P1: "dash",
  P2: "solid",
} as const;

export const POLICY_LABELS = {
  P0: "P0: Never Recalibrate",
  P1: "P1: Fixed Schedule",
  P2: "P2: Health Check + Threshold",
} as const;