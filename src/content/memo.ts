export const MEMO_CONTENT = `# Q-Autopilot: Autonomous Calibration for Transmon Qubits

**Abstract**

We present Q-Autopilot, a dashboard for monitoring and evaluating autonomous
calibration policies on a drifting three-level transmon qubit. Over a simulated
24-hour day, we compare three policies—never recalibrate (P0), fixed-schedule
(P1), and health-check with threshold-triggered recalibration (P2)—and measure
their effect on a 4-qubit QAOA (MaxCut) algorithm.

**Results**

Policy P2 spends ~12% of the day calibrating and delivers a p = 1 QAOA cost
within 1% of the ideal value for ~80% of the day, while P0 degrades to ~13%.

**Conclusions**

Adaptive health-check calibration (P2) offers the best trade-off between
calibration overhead and algorithm fidelity. The dashboard makes the physics
legible and the policy trade-offs transparent.

---

*This memo is a placeholder. Replace with actual results once the backend is connected.*

**Word count:** ~200 (target: 400)`;