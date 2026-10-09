import { PageHeader } from "@/components/shared/PageHeader";
import { DataState } from "@/components/shared/DataState";
import { ChartCard } from "@/components/shared/ChartCard";

export function Methods() {
  const sections = [
    {
      title: "Units & Conventions",
      content: `All frequencies in kHz unless noted. Time in ns (pulse) or hours (day simulation). Gate error ε is dimensionless (infidelity). Detuning Δ/2π in kHz. Gain g is dimensionless (1 = ideal). Shots are single measurements (500 µs each).`
    },
    {
      title: "Model Summary",
      content: `Three-level transmon (|0⟩, |1⟩, |2⟩) with anharmonicity α/2π = −300 MHz. Hamiltonian in rotating frame: H = −½Δ(t)Z + ½Ω_x(t)X + ½Ω_y(t)Y. DRAG: Ω_y(t) = −β dΩ_x/dt.`
    },
    {
      title: "Drift Model",
      content: `Detuning: OU process (σ_Δ = 150 kHz, τ_c = 2 h) + telegraph noise (0 ↔ 800 kHz, mean dwell 4 h). Gain: 1 + 0.02·sin(2πt/24h + φ) + OU (σ_g = 0.5%, τ_c = 3 h). Shared across all 4 qubits.`
    },
    {
      title: "Calibration Model",
      content: `Amplitude: Rabi oscillation fit. Frequency: Bayesian-adaptive Ramsey (doubling τ ladder). DRAG: β sweep minimizing leakage. Quasi-static assumption during each calibration. Shared drift → single calibration benefits all qubits.`
    },
    {
      title: "Policy Definitions",
      content: `P0: Never recalibrate. P1: Full recalibration every T_period (5 min–6 h). P2: Health check (amplitude only) every T_check (1–30 min); full recalibration when test statistic > threshold (1–10σ).`
    },
    {
      title: "Oracle Gate Error",
      content: `ε_oracle ≈ a·δΔ² + b·δg² + ε_floor (ε_floor ≈ 1e-4). Recalibration resets δΔ, δg → 0. QAOA ratio decreases monotonically with ε (mock: ideal ≈ 0.75).`
    },
    {
      title: "Simulated vs Approximated",
      content: `Simulated: full 3-level dynamics, OU+telegraph drift, Bayesian posteriors, adaptive τ selection, 24h trajectories. Approximated: ideal RZ/RZZ gates, no T1/T2 decay in oracle, no crosstalk, single global drift for 4 qubits.`
    },
    {
      title: "Known Limitations",
      content: `1) Mock data, not real hardware. 2) Single-qubit drift shared across 4 qubits (optimistic). 3) Ideal two-qubit gates. 4) No measurement error in calibration. 5) QAOA cost model is simplified. 6) Only 21 seeds (computational budget).`
    },
    {
      title: "Reproducibility",
      content: `Official seed: 2026. Random seeds: 1–20. PRNG: mulberry32. Versions: placeholder for Python backend, NumPy, SciPy, QuTiP versions.`
    },
    {
      title: "References",
      content: `1) Motzoi et al., PRL 2009 (DRAG). 2) Chen et al., PRL 2016 (adaptive Ramsey). 3) Krantz et al., Appl. Phys. Rev. 2019 (transmon review). 4) Pedersen & Mølmer, PRA 2007 (Bayesian estimation). 5) Kelly et al., Nature 2018 (calibration). 6) Higgins et al., Nature 2007 (adaptive phase estimation). 7) Granade et al., NJP 2012 (Bayesian calibration).`
    },
    {
      title: "Glossary",
      content: `OU: Ornstein-Uhlenbeck process. DRAG: Derivative Removal by Adiabatic Gate. Ramsey: Free-precession interferometry. QAOA: Quantum Approximate Optimization Algorithm. MaxCut: Maximum cut problem. Pareto frontier: Non-dominated trade-off curve.`
    }
  ];

  return (
    <div>
      <PageHeader
        title="Methods, Assumptions & Limitations"
        description="Complete documentation of the simulation model, calibration routines, policy definitions, known approximations, and references."
      />
            <DataState state="success">
        <div className="space-y-4">
          {sections.map((section) => (
            <ChartCard key={section.title} title={section.title} caption="Static content from content/methods.ts">
              <div className="prose prose-sm max-w-none text-[var(--text)]">
                {section.content.split("\n").map((para, i) => (
                  <p key={i} className="mb-2 whitespace-pre-wrap">{para}</p>
                ))}
              </div>
            </ChartCard>
          ))}
        </div>
      </DataState>
    </div>
  );
}