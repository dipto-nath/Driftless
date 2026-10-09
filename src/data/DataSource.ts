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
  PolicyId,
  UncertaintyType,
} from "./types";
import { MockDataSource } from "./MockDataSource";
import { DATA_SOURCE } from "@/config";

export interface DataSource {
  getStaticPulse(withDrag: boolean): Promise<StaticPulse>;
  getValidationChecks(): Promise<ValidationCheck[]>;
  getCalibConvergence(kind: CalibConvergence["kind"]): Promise<CalibConvergence>;
  getAdaptiveRun(): Promise<AdaptiveRun>;
  getPrecisionVsShots(): Promise<PrecisionVsShots>;
  listPolicies(): Promise<{ id: PolicyId; name: string; paramSchema: ParamDef[] }[]>;
  getDayResult(policy: PolicyId, params: Record<string, number>, seed: number): Promise<DayResult>;
  getPareto(uncertainty: UncertaintyType): Promise<ParetoPoint[]>;
  getHardwareAlgoSummary(zPercent: number): Promise<HardwareAlgoSummary[]>;
  getDriftAblation(): Promise<DriftAblation[]>;
}

export interface ParamDef {
  name: string;
  label: string;
  type: "number" | "integer";
  min: number;
  max: number;
  step: number;
  default: number;
}

const API_BASE = "http://localhost:8000/api/v1";

export class HttpDataSource implements DataSource {
  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  async getStaticPulse(withDrag: boolean): Promise<StaticPulse> {
    return this.request(`/static-pulse?withDrag=${withDrag}`);
  }

  async getValidationChecks(): Promise<ValidationCheck[]> {
    return this.request("/validation-checks");
  }

  async getCalibConvergence(kind: CalibConvergence["kind"]): Promise<CalibConvergence> {
    return this.request(`/calibration/${kind}`);
  }

  async getAdaptiveRun(): Promise<AdaptiveRun> {
    return this.request("/adaptive-run");
  }

  async getPrecisionVsShots(): Promise<PrecisionVsShots> {
    return this.request("/precision-vs-shots");
  }

  async listPolicies(): Promise<{ id: PolicyId; name: string; paramSchema: ParamDef[] }[]> {
    return this.request("/policies");
  }

  async getDayResult(policy: PolicyId, params: Record<string, number>, seed: number): Promise<DayResult> {
    return this.request(`/day-result?policy=${policy}&seed=${seed}&params=${JSON.stringify(params)}`);
  }

  async getPareto(uncertainty: UncertaintyType): Promise<ParetoPoint[]> {
    return this.request(`/pareto?uncertainty=${uncertainty}`);
  }

  async getHardwareAlgoSummary(zPercent: number): Promise<HardwareAlgoSummary[]> {
    return this.request(`/hardware-algo-summary?zPercent=${zPercent}`);
  }

  async getDriftAblation(): Promise<DriftAblation[]> {
    return this.request("/drift-ablation");
  }
}

export const dataSource: DataSource =
  DATA_SOURCE === "http" ? new HttpDataSource() : new MockDataSource();