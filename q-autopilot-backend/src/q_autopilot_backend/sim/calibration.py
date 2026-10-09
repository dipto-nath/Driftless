import numpy as np
from .prng import mulberry32, normal_random
from .transmon import simulate_populations as _sim_pop, simulate_ramsey, simulate_ramsey_shot
from .constants import CONFIG
from ..api.schemas import CalibConvergence

SHOT_DURATION_US = CONFIG.SHOT_DURATION_US  # 500 µs

def _multinomial(rng, shots: int, probs: list) -> list:
    counts = [0] * len(probs)
    cum_probs = np.cumsum(probs)
    for _ in range(shots):
        r = rng()
        for i, cp in enumerate(np.cumsum(probs)):
            if r < cp:
                counts[i] += 1
                break
    return counts

def _measure_population(populations: dict, shots: int, rng) -> tuple:
    p0, p1, p2 = populations["p0"][-1], populations["p1"][-1], populations["p2"][-1]
    total = p0 + p1 + p2
    p0, p1, p2 = p0/total, p1/total, p2/total
    counts = np.random.multinomial(shots, [p0, p1, p2])
    return counts[0], counts[1], counts[2]

def _fit_amplitude_scale(shots: int, rng) -> float:
    """Estimate amplitude scale from error amplification (repeated π pulses)."""
    scales = np.linspace(0.8, 1.2, 9)
    n_pulses = 10
    counts = []
    for s in scales:
        pop = _sim_pop(with_drag=True, beta_ns=0.53, gain=s)
        p1 = pop["p1"][-1]
        effective_p1 = 1 - n_pulses * (1 - p1)
        c1 = np.random.binomial(shots, max(0, min(1, effective_p1)))
        counts.append(c1)
    idx_max = np.argmax(counts)
    return float(np.linspace(0.8, 1.2, 9)[idx_max])

def _fit_frequency_offset(shots: int, rng, tau_us: float) -> float:
    """Estimate frequency detuning from Ramsey measurement at given tau using real simulation."""
    delta_grid = np.linspace(-500, 500, 401)
    prior = np.ones_like(delta_grid) / len(delta_grid)
    
    # Use real Ramsey simulation instead of theoretical formula
    true_delta = -140.0
    p1 = simulate_ramsey(tau_us, true_delta)
    n1 = np.random.binomial(shots, p1)
    
    # Bayesian update with real probabilities
    probs = np.array([simulate_ramsey(tau_us, delta) for delta in delta_grid])
    n1 = np.random.binomial(shots, simulate_ramsey(tau_us, -140.0))
    likelihood = probs**n1 * (1-probs)**(shots-n1)
    prior = prior * likelihood
    prior /= prior.sum()
    return float(np.sum(delta_grid * prior))
def _fit_drag_beta(shots: int, rng) -> float:
    """Estimate optimal DRAG beta from leakage measurements."""
    beta_vals = np.linspace(0.2, 0.8, 13)
    leakages = []
    for beta in beta_vals:
        pop = _sim_pop(with_drag=True, beta_ns=beta)
        _, _, c2 = _measure_population(pop, shots, rng)
        leakages.append(c2 / shots)
    return float(beta_vals[np.argmin(leakages)])
def simulate_amplitude_calibration(seed: int) -> CalibConvergence:
    rng = mulberry32(seed + 2000)
    shots_cum = np.array([100, 500, 1000, 2000, 5000, 10000, 20000, 50000])
    truth = 1.0
    estimates = []
    sigmas = []
    for n_shots in shots_cum:
        scale_est = _fit_amplitude_scale(n_shots, rng)
        estimates.append(float(scale_est))
        boot_scales = []
        for i in range(50):
            boot_rng = mulberry32(seed + 2000 + i + 1)
            boot_est = _fit_amplitude_scale(n_shots, boot_rng)
            boot_scales.append(boot_est)
        sigmas.append(float(np.std(boot_scales, ddof=1)))
    return CalibConvergence(
        kind="amplitude",
        shots_cum=shots_cum.tolist(),
        estimate=estimates,
        sigma=sigmas,
        truth=truth,
        unit="x",
        total_shots=int(shots_cum[-1])
    )
def simulate_frequency_calibration(seed: int) -> CalibConvergence:
    rng = mulberry32(seed + 3000)
    shots_cum = np.array([100, 500, 1000, 2000, 5000, 10000, 20000, 50000])
    truth = -140.0
    delta_grid = np.linspace(-500, 500, 401)
    prior = np.ones_like(delta_grid) / len(delta_grid)
    tau_ladder = [1, 2, 4, 8, 16, 32]
    estimates = []
    sigmas = []
    for tau in tau_ladder:
        shots = 500
        # Use real Ramsey simulation instead of theoretical formula
        probs = np.array([simulate_ramsey(tau, delta) for delta in delta_grid])
        true_idx = np.argmin(np.abs(delta_grid - (-140.0)))
        n1 = np.random.binomial(shots, simulate_ramsey(tau, -140.0))
        likelihood = probs**n1 * (1-probs)**(shots-n1)
        prior = prior * likelihood
        prior /= prior.sum()
        estimate = float(np.sum(delta_grid * prior))
        sigma = float(np.sqrt(np.sum((delta_grid - estimate)**2 * prior)))
        estimates.append(estimate)
        sigmas.append(sigma)
    while len(estimates) < len(shots_cum):
        estimates.append(estimates[-1])
        sigmas.append(sigmas[-1])
    return CalibConvergence(
        kind="frequency",
        shots_cum=shots_cum.tolist(),
        estimate=estimates,
        sigma=sigmas,
        truth=truth,
        unit="kHz",
        total_shots=int(shots_cum[-1])
    )
def simulate_drag_calibration(seed: int) -> CalibConvergence:
    rng = mulberry32(seed + 4000)
    beta_vals = np.linspace(0.2, 0.8, 13)
    leakages = []
    for beta in beta_vals:
        pop = _sim_pop(with_drag=True, beta_ns=beta)
        p2 = pop["p2"][-1]
        n2 = np.random.binomial(5000, p2)
        leakages.append(n2 / 5000)
    beta_opt = float(beta_vals[np.argmin(leakages)])
    shots_cum = np.array([100, 500, 1000, 2000, 5000])
    estimates = []
    sigmas = []
    for n_shots in shots_cum:
        leakages_noisy = []
        for beta in beta_vals:
            pop = _sim_pop(with_drag=True, beta_ns=beta)
            p2 = pop["p2"][-1]
            n2 = np.random.binomial(n_shots, p2)
            leakages_noisy.append(n2 / n_shots)
        beta_est = float(beta_vals[np.argmin(leakages_noisy)])
        estimates.append(beta_est)
        boot = []
        for i in range(50):
            l_b = [np.random.binomial(n_shots, _sim_pop(with_drag=True, beta_ns=b)["p2"][-1]) / n_shots for b in beta_vals]
            boot.append(beta_vals[np.argmin(l_b)])
        sigmas.append(float(np.std(boot, ddof=1)))
        estimates.append(beta_est)
    estimates = estimates[:len(shots_cum)]
    return CalibConvergence(
        kind="drag",
        shots_cum=shots_cum.tolist(),
        estimate=estimates,
        sigma=sigmas,
        truth=float(beta_opt),
        unit="ns",
        total_shots=int(shots_cum[-1])
    )
