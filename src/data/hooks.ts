import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { dataSource } from "./DataSource";
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

export const useStaticPulse = (withDrag: boolean): UseQueryResult<StaticPulse> =>
  useQuery({
    queryKey: ["static-pulse", withDrag],
    queryFn: () => dataSource.getStaticPulse(withDrag),
    staleTime: 1000 * 60 * 60,
  });

export const useValidationChecks = (): UseQueryResult<ValidationCheck[]> =>
  useQuery({
    queryKey: ["validation-checks"],
    queryFn: () => dataSource.getValidationChecks(),
    staleTime: 1000 * 60 * 60,
  });

export const useCalibConvergence = (kind: CalibConvergence["kind"]): UseQueryResult<CalibConvergence> =>
  useQuery({
    queryKey: ["calib-convergence", kind],
    queryFn: () => dataSource.getCalibConvergence(kind),
    staleTime: 1000 * 60 * 60,
  });

export const useAdaptiveRun = (): UseQueryResult<AdaptiveRun> =>
  useQuery({
    queryKey: ["adaptive-run"],
    queryFn: () => dataSource.getAdaptiveRun(),
    staleTime: 1000 * 60 * 60,
  });

export const usePrecisionVsShots = (): UseQueryResult<PrecisionVsShots> =>
  useQuery({
    queryKey: ["precision-vs-shots"],
    queryFn: () => dataSource.getPrecisionVsShots(),
    staleTime: 1000 * 60 * 60,
  });

export const usePolicies = () =>
  useQuery({
    queryKey: ["policies"],
    queryFn: () => dataSource.listPolicies(),
    staleTime: 1000 * 60 * 60,
  });

export const useDayResult = (policy: PolicyId, params: Record<string, number>, seed: number): UseQueryResult<DayResult> =>
  useQuery({
    queryKey: ["day-result", policy, params, seed],
    queryFn: () => dataSource.getDayResult(policy, params, seed),
    staleTime: 1000 * 60 * 5,
  });

export const usePareto = (uncertainty: UncertaintyType): UseQueryResult<ParetoPoint[]> =>
  useQuery({
    queryKey: ["pareto", uncertainty],
    queryFn: () => dataSource.getPareto(uncertainty),
    staleTime: 1000 * 60 * 5,
  });

export const useHardwareAlgoSummary = (zPercent: number): UseQueryResult<HardwareAlgoSummary[]> =>
  useQuery({
    queryKey: ["hardware-algo-summary", zPercent],
    queryFn: () => dataSource.getHardwareAlgoSummary(zPercent),
    staleTime: 1000 * 60 * 5,
  });

export const useDriftAblation = (): UseQueryResult<DriftAblation[]> =>
  useQuery({
    queryKey: ["drift-ablation"],
    queryFn: () => dataSource.getDriftAblation(),
    staleTime: 1000 * 60 * 5,
  });