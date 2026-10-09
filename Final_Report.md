# Closed-Loop Auto-Calibration: Making the Qubit Tune Itself
**Q-Blueprint Quantum Hackathon 2026 - Final Report**

---

## D1: Plant Model
### Theoretical Framework
Our simulator models a driven three-level transmon (levels [0], [1], [2]) in a rotating frame. The Hamiltonian incorporates an anharmonicity of alpha/2pi = -300 MHz to properly account for leakage into the non-computational [2] state. 

### Drift Generators and Oracle
The environment is not static. We modeled the detuning Delta(t) as an Ornstein-Uhlenbeck (OU) process combined with random telegraph noise (simulating TLS defect switching). The drive gain g(t) is modeled with an OU process atop a slow 24-hour sinusoidal diurnal variation representing temperature fluctuations. 
Our static validation confirmed that a Gaussian pi pulse with zero detuning rotates the state from [0] to [1], with a small measurable leakage into [2], yielding a baseline gate error perfectly aligned with our fidelity formula.

*(Insert plot from D1_Plant.ipynb showing populations P_0(t), P_1(t), P_2(t) here)*

---

## D2: Calibration Primitives
To calibrate the drifting plant, we implemented three primitives:
1. **Amplitude:** Uses error amplification via repeated pi pulses, as direct Rabi oscillations lack sensitivity.
2. **Frequency:** Uses Ramsey interferometry with a ladder of delays to resolve both aliasing (phase wrapping) and precision.
3. **DRAG Coefficient:** Minimizes leakage to [2]. 

**DRAG Sign Convention & beta_opt**
Our DRAG derivative pulse is defined on the orthogonal quadrature: Omega_y(t) = -beta * d(Omega_x)/dt. Through empirical sweeping in our simulator, we found the optimal DRAG coefficient to be positive (beta_opt ≈ +0.53 ns). This numerical result perfectly aligns with the theoretical first-order expectation of beta ≈ 1/|alpha|, where |alpha|/2pi = 300 MHz.

*(Insert 3 convergence plots from D2_Calibration.ipynb here)*

---

## D3: Adaptive versus Fixed Design
We upgraded our frequency calibration to a Bayesian adaptive design. We maintain a posterior distribution P(Delta | data) and iteratively select the next delay tau_k that minimizes the expected posterior variance.

**Information-Theoretic Origin of the Shot Saving**
A fixed dense grid takes uniform measurements regardless of the data gathered. This is highly inefficient because it wastes shots resolving regions of the parameter space that have already been ruled out. In contrast, the Bayesian adaptive scheme maximizes the **information gain** (or mutual information) of every single shot. By dynamically choosing delays tau_k that target the peak uncertainty of the current posterior, the adaptive design collapses the variance exponentially faster than a fixed grid, hitting the Cramer-Rao bound with significantly fewer shots.

*(Insert posterior evolution and precision-vs-shots plots from D3_Adaptive.ipynb here)*

---

## D4: Policy Comparison
We evaluated three recalibration policies over a simulated 24-hour day:
*   **P0 (Baseline):** Calibrated once at t=0, then left to drift.
*   **P1 (Fixed Schedule):** Full recalibration every X minutes.
*   **P2 (Health Check):** Cheap periodic checks; recalibrates only if a statistical test indicates the error exceeds the threshold = 0.001.

*(Insert 24-hour trace of Oracle Gate Error vs Time from D4_Policy_Comparison.ipynb here)*
*(Insert Pareto Plot with seed-to-seed error bars here)*

The Pareto analysis clearly demonstrates that **P2 dominates P1**. By only triggering expensive recalibrations when the qubit physically requires it, P2 drastically reduces device downtime while keeping the time-averaged oracle gate error strictly bounded.

---

## D5: Algorithm-Level Impact (QAOA)
To map hardware-level errors to algorithmic utility, we ran a p=1 QAOA for MaxCut on a 4-qubit ring, using the instantaneous 2x2 matrix M(t) extracted from our drifting plant. 

*(Insert QAOA Cost Ratio vs Time of Day plot from D5_Algorithm_Impact.ipynb here)*

**Conclusion:** Policy P2 spends only a marginal fraction of the day calibrating, yet delivers a QAOA cost within a tight tolerance of the ideal value for nearly 100% of the day.

---

## D6: Memo
**Which parameter drift hurts the algorithm most, and what would I change in the hardware or the control stack to need less calibration?**

When mapping hardware drift to downstream algorithmic performance, detuning drift (Delta) is significantly more destructive to the QAOA circuit than drive gain drift (g). Gain drift only manifests as a rotation angle error during active driven pulses. In contrast, detuning drift acts continuously. It accumulates unwanted Z-rotations (phase errors) not only during single-qubit gates but crucially during idle times and multi-qubit entangling operations. Because near-term algorithms like QAOA rely heavily on precise phase accumulation across the qubit register, uncompensated detuning drift rapidly degrades the final cost function [1].

To reduce the calibration overhead and need for constant health checks, interventions are required at both the hardware and control stack levels. 

At the hardware level, the primary culprit of abrupt detuning jumps is the coupling to fluctuating Two-Level System (TLS) defects. Moving to advanced fabrication techniques (e.g., using tantalum instead of niobium, or improving substrate interfaces) can reduce the density of these defects. Furthermore, implementing tunable couplers can allow the control hardware to dynamically isolate the qubit from parasitic environmental interactions during idle times, mitigating continuous phase accumulation [1].

At the control stack layer, our current "Health Check" policy (P2) is highly efficient but entirely reactive—it only recalibrates after the error threshold is breached. To improve this, the control stack should transition to a predictive model. By replacing the simple threshold test with a Kalman filter or a Hidden Markov Model (HMM), the agent could track the underlying Ornstein-Uhlenbeck state of the detuning. This predictive tracking would allow the system to apply software-level virtual-Z corrections to cancel the detuning drift in real-time, completely bypassing the need for physical recalibration until extreme boundaries are reached [2].

**References**
[1] Krantz, P. et al. (2019). "A Quantum Engineer's Guide to Superconducting Qubits." *Applied Physics Reviews*, 6(2), 021318.
[2] Kelly, J. et al. (2018). "Physical Qubit Calibration on a Directed Acyclic Graph." *arXiv preprint arXiv:1803.03226*.
