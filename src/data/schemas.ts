import { z } from "zod";
import type {
  StaticPulse,
  ValidationCheck,
  CalibConvergence,
  AdaptiveRun,
  PrecisionVsShots,
  DayResult,
  ParetoPoint,
  HardwareAlgoSummary,
  DriftAblation,
} from "./types";

export const StaticPulseSchema = z.object({
  t_ns: z.array(z.number()),
  p0: z.array(z.number()),
  p1: z.array(z.number()),
  p2: z.array(z.number()),
  leakage: z.number(),
  gate_error: z.number(),
  with_drag: z.boolean(),
  beta_ns: z.number(),
}) satisfies z.ZodType<StaticPulse>;

export const ValidationCheckSchema = z.object({
  name: z.string(),
  expected: z.number(),
  measured: z.number(),
  tolerance: z.number(),
  passed: z.boolean(),
    note: z.string().optional(),
}) satisfies z.ZodType<Omit<ValidationCheck, "note"> & { note?: string | undefined }>;

export const CalibConvergenceSchema = z.object({
  kind: z.enum(["amplitude", "frequency", "drag"]),
  shots_cum: z.array(z.number()),
  estimate: z.array(z.number()),
  sigma: z.array(z.number()),
  truth: z.number(),
  unit: z.string(),
  total_shots: z.number(),
}) satisfies z.ZodType<CalibConvergence>;

export const AdaptiveRunSchema = z.object({
  delta_grid_khz: z.array(z.number()),
  posteriors: z.array(z.array(z.number())),
  tau_us: z.array(z.number()),
  shots_cum: z.array(z.number()),
  truth_khz: z.number(),
  estimate_khz: z.number(),
  sigma_khz: z.number(),
}) satisfies z.ZodType<AdaptiveRun>;

export const PrecisionVsShotsSchema = z.object({
  shots: z.array(z.number()),
  adaptive_sigma_khz: z.array(z.number()),
  fixed_sigma_khz: z.array(z.number()),
  n_repeats: z.number(),
  uncertainty: z.enum(["SD", "SE", "CI95"]),
  shot_saving_factor: z.number(),
}) satisfies z.ZodType<PrecisionVsShots>;

export const CalibWindowSchema = z.object({
  start_h: z.number(),
  end_h: z.number(),
  kind: z.enum(["health", "full"]),
}) satisfies z.ZodType<{ start_h: number; end_h: number; kind: "health" | "full" }>;

export const DayResultSchema = z.object({
  policy: z.enum(["P0", "P1", "P2"]),
    params: z.record(z.string(), z.number()),
  seed: z.number(),
  t_h: z.array(z.number()),
  delta_true_khz: z.array(z.number()),
  delta_est_khz: z.array(z.number()),
  gain_true: z.array(z.number()),
  gain_est: z.array(z.number()),
  eps_oracle: z.array(z.number()),
  qaoa_ratio: z.array(z.number()),
  calib_windows: z.array(CalibWindowSchema),
  calib_fraction: z.number(),
  mean_eps: z.number(),
}) satisfies z.ZodType<DayResult>;

export const ParetoPointSchema = z.object({
  policy: z.enum(["P0", "P1", "P2"]),
  label: z.string(),
    params: z.record(z.string(), z.number()),
  calib_fraction_mean: z.number(),
  calib_fraction_err: z.number(),
  mean_eps_mean: z.number(),
  mean_eps_err: z.number(),
  n_seeds: z.number(),
  uncertainty: z.enum(["SD", "SE", "CI95"]),
  on_frontier: z.boolean(),
}) satisfies z.ZodType<ParetoPoint>;

export const HardwareAlgoSummarySchema = z.object({
  policy: z.enum(["P0", "P1", "P2"]),
  calib_percent: z.number(),
  z_percent: z.number(),
  within_z_percent_of_day: z.number(),
  ideal_cost_ratio: z.number(),
}) satisfies z.ZodType<HardwareAlgoSummary>;

export const DriftAblationSchema = z.object({
  source: z.string(),
  qaoa_loss_percent: z.number(),
  err: z.number(),
  n_seeds: z.number(),
}) satisfies z.ZodType<DriftAblation>;

export const PolicyInfoSchema = z.object({
  id: z.enum(["P0", "P1", "P2"]),
  name: z.string(),
  paramSchema: z.array(z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum(["number", "integer"]),
    min: z.number(),
    max: z.number(),
    step: z.number(),
    default: z.number(),
  })),
});