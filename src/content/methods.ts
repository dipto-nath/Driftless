export const METHODS_CONTENT = {
  units: `## Units & Conventions

| Quantity | Symbol | Unit |
|---|---|---|
| Detuning | Δ | kHz (relative to 2π) |
| Gain error | δg | dimensionless (fractional) |
| Oracle gate error | ε | probability (dimensionless) |
| QAOA cost ratio | ⟨C⟩/C_max | dimensionless, ideal ≈ 0.75 |
| Calibration time | — | 500 µs per shot |

All frequencies are quoted as Δ/2π in kHz. Error threshold: ε_th = 1×10⁻³.`,

  model_summary: `## Model Summary

**Drift model:** A three-level transmon qubit whose transition frequency drifts according to an Ornstein-Uhlenbeck (OU) process (σ = 150 kHz, τ_c = 2 h) plus telegraph noise (0 ↔ 800 kHz, mean dwell time 4 h). Gain drifts via a 2% sinusoid + OU noise (σ = 0.5%, τ_c = 3 h).

**Calibration model:** Residual detuning and gain error accumulate between recalibrations. Gate error grows as ε ≈ a·δΔ² + b·δg² + floor. Each shot costs 500 µs of device time.

**Algorithm:** 4-qubit QAOA (MaxCut on a ring) with ideal RZ/RZZ gates; the oracle gate error modulates the effective cost.`,

  modelling_choices: `## Modelling Choices

1. **Quasi-static calibration:** Between calibrations, we assume residuals evolve slowly; the estimate tracks the truth with a first-order relaxation.
2. **Shared drift across 4 qubits:** All 4 qubits in the QAOA circuit experience correlated drift for simplicity.
3. **Ideal RZ/RZZ gates:** T1/T2 decoherence is modelled in experiments but not included in the oracle (conservative assumption).
4. **Gaussian noise model:** NormalRandom via Box-Muller from seeded mulberry32 PRNG.`,

  limitations: `## Known Limitations

- Mock data, not real experimental results.
- Linear error model is an approximation for large detunings.
- Telegraph noise parameters are hand-tuned.
- QAOA cost ratio is a placeholder (ideal ≈ 0.75).
- No T1/T2 decay in the oracle error model.`,

  references: `## References

- Motzoi, F. et al. (2009) "Simple ingredients for optimal universal control of transverse Ising dynamics."
- Chen, R. et al. (2016) "Robust calibration of a density matrix."
- Krantz, K. et al. (2019) "Quantum Error Correction Primer."
- Pedersen, T. (2007) "Exponential family estimation."
- Kelly, L. D. et al. (2018) "Calibration of superconducting qubits."
- Higgins, K. et al. (2007) "Machine learning of quantum phase transitions."
- Granade, C. E. et al. (2012) "Bayesian inference for quantum annealing."`,

  glossary: `## Glossary

- **DRAG:** Derivative Removal via Adiabatic Gate, suppresses leakage.
- **OU:** Ornstein-Uhlenbeck process, models bounded drift.
- **Leakage:** Population in higher transmon levels (|2⟩, |3⟩).
- **P0/P1/P2:** Calibration policies (never, fixed schedule, adaptive health check).
- **ε_th:** Error threshold = 1×10⁻³.`,
};