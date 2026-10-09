import numpy as np
from .prng import mulberry32, normal_random
from .constants import CONFIG
from ..api.schemas import CalibConvergence


def simulate_amplitude_calibration(seed: int) -> CalibConvergence:
    """Rabi oscillation fit convergence vs shots."""
    rng = mulberry32(seed + 2000)
    shots_cum = np.array([100, 500, 1000, 2000, 5000, 10000, 20000, 50000])
    truth = 1.0
    # Fisher info: σ ∝ 1/√shots
    sigma = 0.02 / np.sqrt(shots_cum / 100)
    estimate = truth + sigma * np.array([normal_random(rng) for _ in shots_cum])
    return CalibConvergence(
        kind="amplitude",
        shots_cum=shots_cum.tolist(),
        estimate=estimate.tolist(),
        sigma=sigma.tolist(),
        truth=truth,
        unit="×",
        total_shots=int(shots_cum[-1])
    )


def simulate_frequency_calibration(seed: int) -> CalibConvergence:
    """Bayesian-adaptive Ramsey convergence."""
    rng = mulberry32(seed + 3000)
    shots_cum = np.array([100, 500, 1000, 2000, 5000, 10000, 20000, 50000])
    truth = -140.0  # kHz
    # Adaptive: σ ∝ 1/shots (Heisenberg-limited) vs 1/√shots (SQL)
    sigma_adaptive = 5.0 / (shots_cum / 100)
    sigma_fixed = 5.0 / np.sqrt(shots_cum / 100)
    estimate = truth + sigma_adaptive * np.array([normal_random(rng) for _ in shots_cum])
    return CalibConvergence(
        kind="frequency",
        shots_cum=shots_cum.tolist(),
        estimate=estimate.tolist(),
        sigma=sigma_adaptive.tolist(),
        truth=truth,
        unit="kHz",
        total_shots=int(shots_cum[-1])
    )


def simulate_drag_calibration(seed: int) -> CalibConvergence:
    """DRAG β sweep minimizing leakage."""
    rng = mulberry32(seed + 4000)
    beta_vals = np.linspace(0, 1.0, 21)
    alpha_ns = 1.0 / (abs(CONFIG.ALPHA_HZ) / 1e9)  # 1/|α| in ns ≈ 0.53
    # Leakage ∝ (β - β_opt)^2
    beta_opt = alpha_ns
    leakage = 1.2e-4 + 0.02 * (beta_vals - beta_opt)**2
    leakage += 1e-6 * np.array([normal_random(rng) for _ in beta_vals])
    # Return convergence at optimal beta
    shots_cum = np.array([100, 500, 1000, 2000, 5000])
    sigma = 0.05 / np.sqrt(shots_cum / 100)
    estimate = beta_opt + sigma * np.array([normal_random(rng) for _ in shots_cum])
    return CalibConvergence(
        kind="drag",
        shots_cum=shots_cum.tolist(),
        estimate=estimate.tolist(),
        sigma=sigma.tolist(),
        truth=beta_opt,
        unit="ns",
        total_shots=int(shots_cum[-1])
    )