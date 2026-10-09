import type {
  StaticPulse,
  ValidationCheck,
  CalibConvergence,
  CalibWindow,
  AdaptiveRun,
  PrecisionVsShots,
  DayResult,
  ParetoPoint,
  HardwareAlgoSummary,
  DriftAblation,
  PolicyId,
  UncertaintyType,
} from "./types";
import type { DataSource, ParamDef } from "./DataSource";
import { mulberry32, normalRandom, ouStep, telegraphStep } from "@/lib/prng";
import { APP_CONFIG } from "@/config";

function createRNG(seed: number) {
  return mulberry32(seed);
}

function generateTimeArray(start: number, end: number, step: number): number[] {
  const result: number[] = [];
  for (let t = start; t <= end; t += step) {
    result.push(t);
  }
  return result;
}

export class MockDataSource implements DataSource {
  private seed: number;

  constructor(seed = APP_CONFIG.officialSeed) {
    this.seed = seed;
  }

  setSeed(seed: number) {
    this.seed = seed;
  }

  async getStaticPulse(withDrag: boolean): Promise<StaticPulse> {
    const t_ns = generateTimeArray(0, 20, 0.1);
    const sigma = 20 / 4;
    const omega_max = Math.PI / 20;

    const p0 = t_ns.map((t) => {
      const envelope = Math.exp(-0.5 * Math.pow((t - 10) / sigma, 2));
      const theta = omega_max * envelope * t;
      return Math.cos(theta) ** 2;
    });

    const p1 = t_ns.map((t) => {
      const envelope = Math.exp(-0.5 * Math.pow((t - 10) / sigma, 2));
      const theta = omega_max * envelope * t;
      return Math.sin(theta) ** 2;
    });

    const p2 = t_ns.map((t) => {
      const envelope = Math.exp(-0.5 * Math.pow((t - 10) / sigma, 2));
      const theta = omega_max * envelope * t;
      const leakage = withDrag ? 1.2e-4 : 0.02;
      return leakage * Math.sin(theta) ** 2;
    });

    return {
      t_ns,
      p0,
      p1,
      p2,
      leakage: withDrag ? 1.2e-4 : 0.02,
      gate_error: withDrag ? 8.7e-5 : 0.002,
      with_drag: withDrag,
      beta_ns: withDrag ? 0.53 : 0,
    };
  }

  async getValidationChecks(): Promise<ValidationCheck[]> {
    return [
      { name: "Two-level Rabi limit", expected: 1.0, measured: 0.9999, tolerance: 1e-3, passed: true, note: "Population conserved in |0>+|1> subspace" },
      { name: "Unitarity", expected: 1.0, measured: 0.99995, tolerance: 1e-4, passed: true, note: "Total population conserved" },
      { name: "Amplitude error", expected: 0.00167, measured: 0.0017, tolerance: 1e-4, passed: true, note: "delta = 0.1 rad amplitude error" },
      { name: "Time-step convergence", expected: 0, measured: 2e-6, tolerance: 1e-5, passed: true, note: "dt=0.1ns vs dt=0.05ns difference" },
      { name: "OU variance", expected: 150 ** 2, measured: 22450, tolerance: 1000, passed: true, note: "Steady-state variance of detuning OU" },
      { name: "OU autocorrelation", expected: 2.0, measured: 2.01, tolerance: 0.1, passed: true, note: "Autocorrelation time in hours" },
            { name: "Telegraph dwell time", expected: 4.0, measured: 3.95, tolerance: 0.5, passed: true, note: "Mean dwell time in hours" },
    ];
  }

  async getCalibConvergence(kind: CalibConvergence["kind"]): Promise<CalibConvergence> {
    const rng = createRNG(this.seed + 2000);
    const shots_cum = [100, 500, 1000, 2000, 5000, 10000, 20000, 50000];

    if (kind === "amplitude") {
      const truth = 1.0;
      const estimate = shots_cum.map((s) => truth + 0.02 * normalRandom(rng) / Math.sqrt(s / 100));
      const sigma = shots_cum.map((s) => 0.02 / Math.sqrt(s / 100));
      return { kind, shots_cum, estimate, sigma, truth, unit: "x", total_shots: 50000 };
    }

    if (kind === "frequency") {
      const truth = -140.0;
      const estimate = shots_cum.map((s) => truth + 5 * normalRandom(rng) / Math.sqrt(s / 100));
      const sigma = shots_cum.map((s) => 5 / Math.sqrt(s / 100));
      return { kind, shots_cum, estimate, sigma, truth, unit: "kHz", total_shots: 50000 };
    }

    const truth = 0.53;
    const estimate = shots_cum.map((s) => truth + 0.05 * normalRandom(rng) / Math.sqrt(s / 100));
    const sigma = shots_cum.map((s) => 0.05 / Math.sqrt(s / 100));
    return { kind, shots_cum, estimate, sigma, truth, unit: "ns", total_shots: 50000 };
  }

  async getAdaptiveRun(): Promise<AdaptiveRun> {
    const rng = createRNG(this.seed + 3000);
    const delta_grid_khz: number[] = [];
    for (let i = -500; i <= 500; i += 10) delta_grid_khz.push(i);
    const posteriors: number[][] = [];
    const tau_us: number[] = [];
    const shots_cum: number[] = [];
    const truth_khz = -140.0;

    let posterior = delta_grid_khz.map(() => 1 / delta_grid_khz.length);
    let shots = 0;
    let tau = 0.5;

    for (let batch = 0; batch < 10; batch++) {
      const info = posterior.reduce((sum, p, i) => sum + p * Math.pow(delta_grid_khz[i]! - truth_khz, 2), 0);
      tau = Math.min(tau * 1.5, 100);
      const shots_this = Math.ceil(1000 / (1 + info * tau));
      shots += shots_this;
      const likelihood = delta_grid_khz.map((d) =>
        Math.exp(-0.5 * Math.pow((d - truth_khz - 2 * normalRandom(rng)) / (10 + 5 * batch), 2))
      );
      const unnorm = posterior.map((p, i) => p * likelihood[i]!);
      const norm = unnorm.reduce((a, b) => a + b, 0);
      posterior = unnorm.map((v) => v / norm);
      posteriors.push([...posterior]);
      tau_us.push(tau);
      shots_cum.push(shots);
    }

        const estimate_khz = delta_grid_khz.reduce((sum, d, i) => sum + d * posterior[i]!, 0);
    const variance = delta_grid_khz.reduce((sum, d, i) => sum + posterior[i]! * Math.pow(d - estimate_khz, 2), 0);
    const sigma_khz = Math.sqrt(variance);

        return { delta_grid_khz, posteriors, tau_us, shots_cum, truth_khz, estimate_khz, sigma_khz };
  }

  async getPrecisionVsShots(): Promise<PrecisionVsShots> {
    const rng = createRNG(this.seed + 4000);
    const shots = [100, 500, 1000, 2000, 5000, 10000, 20000];
    const adaptive_sigma_khz = shots.map((s) => 50 / Math.sqrt(s / 100) * (0.8 + 0.4 * rng()));
    const fixed_sigma_khz = shots.map((s) => 200 / Math.sqrt(s / 100) * (0.8 + 0.4 * rng()));
    return {
      shots,
      adaptive_sigma_khz,
      fixed_sigma_khz,
      n_repeats: 20,
      uncertainty: "SD" as const,
      shot_saving_factor: 4.2,
    };
  }

    async getDayResult(policy: PolicyId, params: Record<string, number>, seed: number): Promise<DayResult> {
    const rng = createRNG(seed + 5000);
    const n = 1000;
    const t_h = generateTimeArray(0, 24, 24 / n);
    const dt = 24 / n;

    const delta_ou_sigma = 150;
    const delta_ou_tau = 2;
    const gain_ou_sigma = 0.005;
    const gain_ou_tau = 3;
    const telegraph_states: [number, number] = [0, 800];
    const telegraph_rate = 1 / 4;

    let delta_ou = 0;
    let gain_ou = 0;
    let telegraph = 0;
    let last_calib = 0;
    let delta_est = 0;
        let gain_estimate = 1;
    const calib_windows: CalibWindow[] = [];

    const period = params.period_min || 60;
    const check_interval = params.check_interval_min || 5;
    const threshold = params.trigger_threshold || 3;

    const delta_true_khz: number[] = [];
    const delta_est_khz: number[] = [];
    const gain_true: number[] = [];
    const gain_est: number[] = [];
    const eps_oracle: number[] = [];
    const qaoa_ratio: number[] = [];

    for (let i = 0; i < t_h.length; i++) {
            const t = t_h[i]!;

      delta_ou = ouStep(delta_ou, 0, delta_ou_tau, delta_ou_sigma, dt, normalRandom(rng));
      telegraph = telegraphStep(telegraph, telegraph_states, telegraph_rate, dt, rng);
      gain_ou = ouStep(gain_ou, 0, gain_ou_tau, gain_ou_sigma, dt, normalRandom(rng));
      const gain_sin = 0.02 * Math.sin(2 * Math.PI * t / 24 + rng() * 2 * Math.PI);

            const delta_true = delta_ou + telegraph;
      const g_true = 1 + gain_sin + gain_ou;

      let should_calibrate = false;
      let calib_kind: "health" | "full" = "full";

      if (policy === "P1") {
        should_calibrate = t - last_calib >= period / 60;
      } else if (policy === "P2") {
        const time_since_check = t - last_calib;
        if (time_since_check >= check_interval / 60) {
          const test_stat = Math.abs(delta_true - delta_est) / (1 + Math.abs(delta_est) * 0.1);
          if (test_stat > threshold) {
            should_calibrate = true;
          } else {
            should_calibrate = true;
            calib_kind = "health";
          }
        }
      }

      if (should_calibrate) {
        calib_windows.push({ start_h: t, end_h: t + 0.01, kind: calib_kind });
        last_calib = t;
        delta_est = delta_true + 5 * normalRandom(rng);
                gain_estimate = g_true + 0.001 * normalRandom(rng);
      } else {
        delta_est += (delta_true - delta_est) * 0.01;
                gain_estimate += (g_true - gain_estimate) * 0.01;
      }

      const delta_err = delta_true - delta_est;
            const gain_err = g_true - gain_estimate;
      const eps = 1e-4 + 1e-6 * delta_err ** 2 + 0.1 * gain_err ** 2;
      const qaoa = Math.max(0.6, 0.75 * Math.exp(-1000 * eps));

            delta_true_khz.push(delta_true);
      delta_est_khz.push(delta_est);
      gain_true.push(g_true);
            gain_est.push(gain_estimate);
      eps_oracle.push(eps);
      qaoa_ratio.push(qaoa);
    }

    const calib_fraction = calib_windows.reduce((sum, w) => sum + (w.end_h - w.start_h), 0) / 24;
    const mean_eps = eps_oracle.reduce((a, b) => a + b, 0) / eps_oracle.length;

    return {
      policy,
      params,
      seed,
      t_h,
      delta_true_khz,
      delta_est_khz,
      gain_true,
      gain_est,
      eps_oracle,
      qaoa_ratio,
      calib_windows,
      calib_fraction,
            mean_eps,
    };
  }

  async listPolicies(): Promise<{ id: PolicyId; name: string; paramSchema: ParamDef[] }[]> {
    return [
      { id: "P0", name: "P0: Never Recalibrate", paramSchema: [] },
      { id: "P1", name: "P1: Fixed Schedule", paramSchema: [{ name: "period_min", label: "Period (min)", type: "integer", min: 5, max: 360, step: 5, default: 60 }] },
      { id: "P2", name: "P2: Health Check + Threshold", paramSchema: [{ name: "check_interval_min", label: "Check (min)", type: "integer", min: 1, max: 30, step: 1, default: 5 }, { name: "trigger_threshold", label: "Threshold", type: "number", min: 1, max: 10, step: 0.5, default: 3 }] },
    ];
  }

    async getPareto(uncertainty: UncertaintyType): Promise<ParetoPoint[]> {
    const rng = createRNG(this.seed + 6000);
    const points: ParetoPoint[] = [];

    points.push({
      policy: "P0",
      label: "P0: Never",
      params: {},
      calib_fraction_mean: 0,
      calib_fraction_err: 0,
      mean_eps_mean: 0.008,
      mean_eps_err: 0.001,
      n_seeds: 21,
      uncertainty,
      on_frontier: false,
    });

    for (const period of [10, 30, 60, 120, 180, 240, 300, 360]) {
      const mean_eps = 0.003 + 0.005 * Math.exp(-period / 100) + 0.0005 * rng();
      const calib_frac = (24 * 60 / period) * 0.01 / 24;
      points.push({
        policy: "P1",
        label: "P1: " + period + "min",
        params: { period_min: period },
        calib_fraction_mean: calib_frac,
        calib_fraction_err: calib_frac * 0.1,
        mean_eps_mean: mean_eps,
        mean_eps_err: mean_eps * 0.15,
        n_seeds: 21,
        uncertainty,
        on_frontier: period >= 60 && period <= 180,
      });
    }

    for (const check of [1, 2, 5, 10, 15, 30]) {
      for (const thr of [1, 2, 3, 5]) {
        const mean_eps = 0.0008 + 0.001 * Math.exp(-check / 10) * (thr / 3) + 0.0002 * rng();
        const calib_frac = 0.05 + 0.08 * (5 / check) * (3 / thr) + 0.01 * rng();
        points.push({
          policy: "P2",
          label: "P2: " + check + "min/" + thr + "sigma",
          params: { check_interval_min: check, trigger_threshold: thr },
          calib_fraction_mean: Math.min(calib_frac, 0.3),
          calib_fraction_err: calib_frac * 0.1,
          mean_eps_mean: mean_eps,
          mean_eps_err: mean_eps * 0.2,
          n_seeds: 21,
          uncertainty,
          on_frontier: check <= 10 && thr >= 2,
        });
      }
    }

    return points;
  }

  async getHardwareAlgoSummary(zPercent: number): Promise<HardwareAlgoSummary[]> {
    const rng = createRNG(this.seed + 7000);
    return [
      { policy: "P0", calib_percent: 0, z_percent: zPercent, within_z_percent_of_day: 12.5 + 2 * rng(), ideal_cost_ratio: 0.68 },
      { policy: "P1", calib_percent: 8.3, z_percent: zPercent, within_z_percent_of_day: 45.2 + 5 * rng(), ideal_cost_ratio: 0.71 },
      { policy: "P2", calib_percent: 12.3, z_percent: zPercent, within_z_percent_of_day: 82.1 + 3 * rng(), ideal_cost_ratio: 0.74 },
    ];
  }

  async getDriftAblation(): Promise<DriftAblation[]> {
    const rng = createRNG(this.seed + 8000);
    return [
      { source: "Frequency OU", qaoa_loss_percent: 4.2 + rng(), err: 0.5, n_seeds: 21 },
      { source: "Telegraph jumps", qaoa_loss_percent: 8.1 + rng(), err: 0.8, n_seeds: 21 },
      { source: "Gain sinusoid", qaoa_loss_percent: 2.3 + rng(), err: 0.3, n_seeds: 21 },
      { source: "Gain OU", qaoa_loss_percent: 1.1 + rng(), err: 0.2, n_seeds: 21 },
    ];
  }
}