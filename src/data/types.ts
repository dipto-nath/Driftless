export type PolicyId = "P0" | "P1" | "P2";
export type UncertaintyType = "SD" | "SE" | "CI95";

export interface StaticPulse {
  t_ns: number[];
  p0: number[];
  p1: number[];
  p2: number[];
  leakage: number;
  gate_error: number;
  with_drag: boolean;
  beta_ns: number;
}

export interface ValidationCheck {
  name: string;
  expected: number;
  measured: number;
  tolerance: number;
  passed: boolean;
  note?: string;
}

export interface CalibConvergence {
  kind: "amplitude" | "frequency" | "drag";
  shots_cum: number[];
  estimate: number[];
  sigma: number[];
  truth: number;
  unit: string;
  total_shots: number;
}

export interface AdaptiveRun {
  delta_grid_khz: number[];
  posteriors: number[][];
  tau_us: number[];
  shots_cum: number[];
  truth_khz: number;
  estimate_khz: number;
  sigma_khz: number;
}

export interface PrecisionVsShots {
  shots: number[];
  adaptive_sigma_khz: number[];
  fixed_sigma_khz: number[];
  n_repeats: number;
  uncertainty: UncertaintyType;
  shot_saving_factor: number;
}

export interface CalibWindow {
  start_h: number;
  end_h: number;
  kind: "health" | "full";
}

export interface DayResult {
  policy: PolicyId;
  params: Record<string, number>;
  seed: number;
  t_h: number[];
  delta_true_khz: number[];
  delta_est_khz: number[];
  gain_true: number[];
  gain_est: number[];
  eps_oracle: number[];
  qaoa_ratio: number[];
  calib_windows: CalibWindow[];
  calib_fraction: number;
  mean_eps: number;
}

export interface ParetoPoint {
  policy: PolicyId;
  label: string;
  params: Record<string, number>;
  calib_fraction_mean: number;
  calib_fraction_err: number;
  mean_eps_mean: number;
  mean_eps_err: number;
  n_seeds: number;
  uncertainty: UncertaintyType;
  on_frontier: boolean;
}

export interface HardwareAlgoSummary {
  policy: PolicyId;
  calib_percent: number;
  z_percent: number;
  within_z_percent_of_day: number;
  ideal_cost_ratio: number;
}

export interface DriftAblation {
  source: string;
  qaoa_loss_percent: number;
  err: number;
  n_seeds: number;
}