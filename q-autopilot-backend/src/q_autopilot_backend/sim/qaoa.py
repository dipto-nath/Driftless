import numpy as np
from .constants import CONFIG


def maxcut_4qubit_ring_cost(gamma: float, beta: float, eps: float) -> float:
    """
    QAOA p=1 on 4-qubit ring.
    Ideal cost (eps=0) ≈ 0.75 * 4 edges = 3.0
    Gate error reduces effective cost.
    """
    # Simplified model: each RZZ gate has fidelity (1-eps)
    # For 4 edges, cost scales with fidelity
    n_edges = 4
    ideal = CONFIG.IDEAL_COST_RATIO * n_edges
    # Error reduces contrast
    effective = ideal * (1 - eps)**2  # Two-qubit gate error
    return effective / n_edges  # Normalized ratio


def simulate_qaoa_vs_time(eps_oracle: np.ndarray) -> np.ndarray:
    """QAOA cost ratio over time."""
    return np.array([maxcut_4qubit_ring_cost(np.pi/4, np.pi/8, eps) for eps in eps_oracle])