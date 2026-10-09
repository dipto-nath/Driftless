export interface DemoStep {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  component: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: "hook",
    title: "The Problem",
    subtitle: "Drifting qubits degrade algorithm performance",
    content: "A transmon qubit's frequency drifts due to OU noise and telegraph jumps. Without calibration, gate errors grow and QAOA performance degrades over a 24-hour day.",
    component: "hook",
  },
  {
    id: "pulse",
    title: "Static Pulse",
    subtitle: "DRAG-corrected π pulse",
    content: "DRAG (Derivative Removal via Adiabatic Gate) suppresses leakage to higher transmon levels. With DRAG, leakage drops from 2% to ~0.01%, gate error from 2e-3 to ~8.7e-5.",
    component: "plant",
  },
  {
    id: "calibration",
    title: "Calibration",
    subtitle: "Adaptive vs fixed schedules",
    content: "Bayesian-adaptive Ramsey spectroscopy converges faster than fixed-grid approaches. Adaptive calibration saves 3-6× shots at equal precision.",
    component: "calibration",
  },
  {
    id: "day",
    title: "The 24-Hour Day",
    subtitle: "Policy comparison",
    content: "Over a simulated day with drift, P0 (never) degrades, P1 (fixed) shows sawtooth, P2 (adaptive) stays below ε_th with occasional spikes.",
    component: "policies",
  },
  {
    id: "pareto",
    title: "Pareto Frontier",
    subtitle: "Overhead vs fidelity",
    content: "P2 dominates the Pareto frontier: better fidelity at all calibration overheads. The trade-off is clear across 25+ configurations and 21 seeds.",
    component: "pareto",
  },
  {
    id: "algorithm",
    title: "Algorithm Impact",
    subtitle: "QAOA MaxCut",
    content: "P2 delivers a p=1 QAOA cost within 1% of ideal for ~82% of the day, compared to ~13% for P0.",
    component: "algorithm",
  },
  {
    id: "limitations",
    title: "Honest Limitations",
    subtitle: "Mock data disclaimer",
    content: "All results are from a seeded mock simulator. Real device behavior may differ. See /methods for assumptions and limitations.",
    component: "methods",
  },
];