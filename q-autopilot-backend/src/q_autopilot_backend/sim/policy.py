import numpy as np
import json
from typing import Dict, List
from .prng import mulberry32, normal_random
from .drift import generate_drift_trajectory
from .transmon import gate_error_oracle, simulate_ramsey, simulate_ramsey_shot, simulate_populations
from .calibration import simulate_amplitude_calibration, simulate_frequency_calibration, simulate_drag_calibration
from .qaoa import simulate_qaoa_vs_time
from .constants import CONFIG
from ..api.schemas import DayResult, CalibWindow, PolicyId
from .utils.downsample import downsample_series

def simulate_day(policy: PolicyId, params: Dict[str, float], seed: int) -> DayResult:
    """Full 24h simulation with recalibration logic using real calibration primitives."""
    rng = mulberry32(seed + 7000)
    
    # Generate drift
    drift = generate_drift_trajectory(seed)
    t_h = drift["t_h"]
    delta_true = drift["delta_khz"]
    gain_true = drift["gain"]
    n_steps = len(t_h)
    dt_h = t_h[1] - t_h[0] if n_steps > 1 else 0
    
    # Policy parameters
    if policy == PolicyId.P1:
        period_min = params.get("period_min", 60)
        check_interval = None
        threshold = None
    elif policy == PolicyId.P2:
        check_interval = params.get("check_interval_min", 5)
        threshold = params.get("trigger_threshold", 3.0)
        period_min = None
    else:
        period_min = None
        check_interval = None
        threshold = None
    
    # State
    delta_est = np.zeros(n_steps)
    gain_est = np.ones(n_steps)
    eps_oracle = np.zeros(n_steps)
    qaoa_ratio = np.zeros(n_steps)
    calib_windows = []
    
    # Recalibration state
    last_full_cal = 0
    last_health_check = 0
    in_calibration = False
    cal_end_time = 0.0
    
    # Calibration duration (in hours)
    FULL_CAL_DURATION_H = 0.5  # 30 minutes
    HEALTH_CAL_DURATION_H = 0.0833  # 5 minutes
    
    for i in range(n_steps):
        t = t_h[i]
        
        # Handle ongoing calibration
        if in_calibration:
            if t >= cal_end_time:
                in_calibration = False
                # Reset residuals after calibration using real calibration estimates
                cal_seed = seed + i * 1000
                amp_cal = simulate_amplitude_calibration(cal_seed)
                freq_cal = simulate_frequency_calibration(cal_seed + 1000)
                drag_cal = simulate_drag_calibration(cal_seed + 2000)
                
                delta_est[i] = freq_cal.estimate[-1]
                gain_est[i] = amp_cal.estimate[-1]
                # DRAG beta is stored but not used in oracle directly
                
                last_full_cal = i
                if calib_windows:
                    calib_windows[-1].end_h = t
            else:
                # During calibration, use previous estimates
                delta_est[i] = delta_est[i-1] if i > 0 else delta_true[i]
                gain_est[i] = gain_est[i-1] if i > 0 else gain_true[i]
        else:
            # Drift accumulates since last calibration
            if i > last_full_cal:
                # Residuals grow with drift - simple tracking model
                alpha = 0.1
                delta_est[i] = delta_est[i-1] + alpha * (delta_true[i] - delta_est[i-1])
                gain_est[i] = gain_est[i-1] + alpha * (gain_true[i] - gain_est[i-1])
            else:
                delta_est[i] = delta_true[i]
                gain_est[i] = gain_true[i]
        
        # Gate error
        delta_delta = delta_true[i] - delta_est[i]
        delta_g = gain_true[i] - gain_est[i]
        eps_oracle[i] = gate_error_oracle(delta_delta, delta_g)
        
        # QAOA ratio (decreases with gate error)
        # Simple model: ratio = ideal - k * ε
        qaoa_ratio[i] = CONFIG.IDEAL_COST_RATIO - 0.5 * eps_oracle[i]
        qaoa_ratio[i] = max(0.3, qaoa_ratio[i])  # floor
        
        # Policy logic
        if policy == PolicyId.P0:
            pass  # Never recalibrate
            
        elif policy == PolicyId.P1:
            # Fixed schedule
            if i > last_full_cal and (t_h[i] - t_h[last_full_cal]) * 60 >= period_min:
                in_calibration = True
                cal_end_time = t + FULL_CAL_DURATION_H
                calib_windows.append(CalibWindow(start_h=t, end_h=t, kind="full"))
                last_health_check = i
                
        elif policy == PolicyId.P2:
            # Health check
            if i > last_health_check and (t_h[i] - t_h[last_health_check]) * 60 >= check_interval:
                # Health check: amplitude-only (fast)
                in_calibration = True
                cal_end_time = t + HEALTH_CAL_DURATION_H
                calib_windows.append(CalibWindow(start_h=t, end_h=t, kind="health"))
                last_health_check = i
                
                # Test statistic: |δΔ|/σ_Δ
                # Simplified: if detuning residual > threshold * sigma
                sigma_delta = CONFIG.DETUNING_OU_SIGMA_KHZ * np.sqrt(1 - np.exp(-2 * (t_h[i] - t_h[last_full_cal]) / 60 / CONFIG.DETUNING_OU_TAU_H))
                test_stat = abs(delta_delta) / max(sigma_delta, 1.0)
                
                if test_stat > threshold:
                    # Trigger full recalibration
                    cal_end_time = t + FULL_CAL_DURATION_H
                    if calib_windows:
                        calib_windows[-1].kind = "full"
    
    # Use QAOA simulation
    qaoa_ratio = simulate_qaoa_vs_time(eps_oracle)
    
    # Downsample if needed
    if len(t_h) > CONFIG.MAX_POINTS_PER_SERIES:
        t_h, delta_true = downsample_series(t_h, delta_true, CONFIG.MAX_POINTS_PER_SERIES)
        _, delta_est = downsample_series(t_h, delta_est, CONFIG.MAX_POINTS_PER_SERIES)
        _, gain_true = downsample_series(t_h, gain_true, CONFIG.MAX_POINTS_PER_SERIES)
        _, gain_est = downsample_series(t_h, gain_est, CONFIG.MAX_POINTS_PER_SERIES)
        _, eps_oracle = downsample_series(t_h, eps_oracle, CONFIG.MAX_POINTS_PER_SERIES)
        _, qaoa_ratio = downsample_series(t_h, qaoa_ratio, CONFIG.MAX_POINTS_PER_SERIES)
    
    calib_fraction = sum(w.end_h - w.start_h for w in calib_windows) / CONFIG.DAY_DURATION_H
    mean_eps = float(np.mean(eps_oracle))
    
    return DayResult(
        policy=policy,
        params=params,
        seed=seed,
        t_h=t_h.tolist(),
        delta_true_khz=delta_true.tolist(),
        delta_est_khz=delta_est.tolist(),
        gain_true=gain_true.tolist(),
        gain_est=gain_est.tolist(),
        eps_oracle=eps_oracle.tolist(),
        qaoa_ratio=qaoa_ratio.tolist(),
        calib_windows=[w.model_dump() for w in calib_windows],
        calib_fraction=calib_fraction,
        mean_eps=mean_eps
    )
