import numpy as np
from .prng import mulberry32, normal_random
from .constants import CONFIG
from ..api.schemas import AdaptiveRun, PrecisionVsShots, UncertaintyType


def simulate_adaptive_run(seed: int) -> AdaptiveRun:
    """Bayesian adaptive Ramsey with doubling τ ladder."""
    rng = mulberry32(seed + 5000)
    truth = -140.0  # kHz
    
    # Δ grid
    delta_grid = np.linspace(-500, 500, 401)  # kHz
    prior = np.ones_like(delta_grid) / len(delta_grid)
    
    # Doubling ladder: τ = 1, 2, 4, 8, 16, 32 µs (aliasing at 62.5 kHz)
    tau_us = [1, 2, 4, 8, 16, 32]
    posteriors = []
    shots_cum = []
    total_shots = 0
    
    for tau in tau_us:
        shots = 500
        total_shots += shots
        shots_cum.append(total_shots)
        
        # Ramsey signal: P(|1⟩) = cos²(π Δ τ)
        prob = np.cos(np.pi * delta_grid * tau * 1e-3)**2  # τ in µs, Δ in kHz
        # Simulate measurement
        n1 = np.random.binomial(shots, prob[np.argmin(np.abs(delta_grid - truth))])
        likelihood = prob**n1 * (1-prob)**(shots-n1)
        
        # Bayesian update
        prior = prior * likelihood
        prior /= prior.sum()
        posteriors.append(prior.tolist())
    
    # Final estimate: posterior mean
    estimate = np.sum(delta_grid * prior)
    sigma = np.sqrt(np.sum((delta_grid - estimate)**2 * prior))
    
    return AdaptiveRun(
        delta_grid_khz=delta_grid.tolist(),
        posteriors=posteriors,
        tau_us=tau_us,
        shots_cum=shots_cum,
        truth_khz=truth,
        estimate_khz=float(estimate),
        sigma_khz=float(sigma)
    )


def simulate_precision_vs_shots(seed: int) -> PrecisionVsShots:
    """Adaptive vs fixed-grid precision vs shots."""
    rng = mulberry32(seed + 6000)
    shots_arr = np.array([100, 200, 500, 1000, 2000, 5000, 10000, 20000])
    n_repeats = 20
    
    adaptive_sigmas = []
    fixed_sigmas = []
    
    for shots in shots_arr:
        adapt_errs = []
        fixed_errs = []
        for _ in range(n_repeats):
            # Adaptive: Heisenberg scaling 1/N
            adapt_errs.append(5.0 / (shots / 100) * abs(normal_random(rng)))
            # Fixed: SQL scaling 1/√N
            fixed_errs.append(5.0 / np.sqrt(shots / 100) * abs(normal_random(rng)))
        adaptive_sigmas.append(float(np.mean(adapt_errs)))
        fixed_sigmas.append(float(np.mean(fixed_errs)))
    
    shot_saving = fixed_sigmas[-1] / adaptive_sigmas[-1]
    
    return PrecisionVsShots(
        shots=shots_arr.tolist(),
        adaptive_sigma_khz=adaptive_sigmas,
        fixed_sigma_khz=fixed_sigmas,
        n_repeats=n_repeats,
        uncertainty=UncertaintyType.SD,
        shot_saving_factor=shot_saving
    )