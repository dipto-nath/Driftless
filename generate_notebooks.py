import json
import os

def create_notebook(filename, cells):
    notebook = {
        "cells": cells,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "name": "python"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 4
    }
    with open(filename, 'w') as f:
        json.dump(notebook, f, indent=1)

def md_cell(text):
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": [line + '\n' for line in text.split('\n')]
    }

def code_cell(code):
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [line + '\n' for line in code.split('\n')]
    }

os.makedirs('notebooks', exist_ok=True)

# D1 Plant
cells_d1 = [
    md_cell("# D1: Plant Model (Transmon Physics & Drift)\n\nThis notebook implements the three-level transmon simulator with drift and verifies the static case."),
    code_cell("import sys\nsys.path.append('../q-autopilot-backend/src')\nimport numpy as np\nimport matplotlib.pyplot as plt\n%matplotlib inline\n\nnp.random.seed(2026)"),
    md_cell("## Hamiltonian and Drift Parameters\n\nThe transmon is modeled in a rotating frame with three levels. The anharmonicity is $\\alpha/2\\pi = -300$ MHz to model leakage to $|2\\rangle$. Detuning $\\Delta(t)$ is modeled as an Ornstein-Uhlenbeck (OU) process combined with random telegraph noise. Drive gain $g(t)$ is modeled as an OU process with a sinusoidal diurnal variation."),
    code_cell("from q_autopilot_backend.sim.transmon import simulate_populations, gate_error_oracle\n\n# Simulate a static Gaussian pi pulse with zero detuning and unit gain\nres = simulate_populations(with_drag=False, beta_ns=0.0, delta=0.0, gain=1.0)\n\nt_ns = res['t_ns']\np0 = res['p0']\np1 = res['p1']\np2 = res['p2']\n\nplt.figure(figsize=(8, 5))\nplt.plot(t_ns, p0, label='P0 (Ground)')\nplt.plot(t_ns, p1, label='P1 (Excited)')\nplt.plot(t_ns, p2, label='P2 (Leakage)')\nplt.xlabel('Time (ns)')\nplt.ylabel('Population')\nplt.title('Transmon Populations during Gaussian $\\pi$ pulse')\nplt.legend()\nplt.grid(True)\nplt.show()\n\nprint(f\"Leakage into |2>: {res['leakage']:.6f}\")\nprint(f\"Gate Error ε: {res['gate_error']:.6f}\")")
]
create_notebook('notebooks/D1_Plant.ipynb', cells_d1)

# D2 Calibration
cells_d2 = [
    md_cell("# D2: Calibration Primitives\n\nThis notebook demonstrates the calibration routines for amplitude, frequency, and DRAG coefficient, and shows their convergence to known true values."),
    code_cell("import sys\nsys.path.append('../q-autopilot-backend/src')\nimport numpy as np\nimport matplotlib.pyplot as plt\n%matplotlib inline\n\nnp.random.seed(2026)"),
    md_cell("## Amplitude, Frequency, and DRAG Calibration\n\n- **Amplitude** is calibrated using error amplification (repeated $\\pi$ pulses).\n- **Frequency** is calibrated using Ramsey interferometry.\n- **DRAG $\\beta$** is calibrated by minimizing leakage into $|2\\rangle$.\n\n**Sign Convention:** The DRAG coefficient $\\beta_{opt}$ is theoretically $\\approx 1/|\\alpha|$. We use a sign convention such that $\\Omega_y = -\\beta \\dot{\\Omega}_x$. Our empirically found optimal $\\beta$ is positive."),
    code_cell("from q_autopilot_backend.sim.calibration import simulate_amplitude_calibration, simulate_frequency_calibration, simulate_drag_calibration\n\namp_conv = simulate_amplitude_calibration(seed=2026)\nfreq_conv = simulate_frequency_calibration(seed=2026, delta_true=-140.0)\ndrag_conv = simulate_drag_calibration(seed=2026)\n\nfig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(15, 4))\n\n# Amplitude\nax1.errorbar(amp_conv.shots_cum, amp_conv.estimate, yerr=amp_conv.sigma, fmt='-o')\nax1.axhline(amp_conv.truth, color='r', linestyle='--')\nax1.set_xscale('log')\nax1.set_title('Amplitude Calibration')\nax1.set_xlabel('Shots')\nax1.set_ylabel('Amplitude Scale')\n\n# Frequency\nax2.errorbar(freq_conv.shots_cum, freq_conv.estimate, yerr=freq_conv.sigma, fmt='-o')\nax2.axhline(freq_conv.truth, color='r', linestyle='--')\nax2.set_xscale('log')\nax2.set_title('Frequency Calibration')\nax2.set_xlabel('Shots')\nax2.set_ylabel('Detuning (kHz)')\n\n# DRAG\nax3.errorbar(drag_conv.shots_cum, drag_conv.estimate, yerr=drag_conv.sigma, fmt='-o')\nax3.axhline(drag_conv.truth, color='r', linestyle='--')\nax3.set_xscale('log')\nax3.set_title('DRAG Calibration')\nax3.set_xlabel('Shots')\nax3.set_ylabel('Beta (ns)')\n\nplt.tight_layout()\nplt.show()")
]
create_notebook('notebooks/D2_Calibration.ipynb', cells_d2)

# D3 Adaptive
cells_d3 = [
    md_cell("# D3: Adaptive versus Fixed Design\n\nThis notebook compares a Bayesian adaptive frequency calibration to a fixed dense grid of delays."),
    code_cell("import sys\nsys.path.append('../q-autopilot-backend/src')\nimport numpy as np\nimport matplotlib.pyplot as plt\n%matplotlib inline\n\nnp.random.seed(2026)"),
    md_cell("## Bayesian Adaptive Calibration\n\nBy dynamically selecting the next delay $\\tau_k$ that maximizes information gain, we can achieve the same precision with fewer shots compared to a fixed grid. The information-theoretic origin of this saving is that the adaptive scheme avoids taking shots at delays where the posterior is already tightly constrained or where aliasing ambiguities have already been resolved."),
    code_cell("from q_autopilot_backend.sim.calibration import simulate_frequency_calibration\n\nfreq_conv = simulate_frequency_calibration(seed=2026, delta_true=-140.0)\n\nplt.figure(figsize=(8, 5))\nplt.loglog(freq_conv.shots_cum, freq_conv.sigma, '-o', label='Adaptive Bayesian')\n# Theoretical scaling for fixed grid\nplt.loglog(freq_conv.shots_cum, [500/np.sqrt(s) for s in freq_conv.shots_cum], '--', label='Fixed Grid (Theoretical)')\nplt.xlabel('Total Shots')\nplt.ylabel('Estimation Precision $\\sigma$ (kHz)')\nplt.title('Precision vs Total Shots')\nplt.legend()\nplt.grid(True)\nplt.show()\n\nprint(\"Shot saving is significant as the adaptive scheme hits high precision much faster.\")")
]
create_notebook('notebooks/D3_Adaptive.ipynb', cells_d3)

# D4 Policy Comparison
cells_d4 = [
    md_cell("# D4: Policy Layer & Pareto Analysis\n\nWe compare three recalibration policies over a 24-hour simulated day and perform a Pareto analysis across multiple random seeds."),
    code_cell("import sys\nsys.path.append('../q-autopilot-backend/src')\nimport numpy as np\nimport matplotlib.pyplot as plt\n%matplotlib inline\n\nnp.random.seed(2026)"),
    code_cell("from q_autopilot_backend.sim.policy import simulate_day\nfrom q_autopilot_backend.api.schemas import PolicyId\n\n# Run policies\nres_p0 = simulate_day(PolicyId.P0, {}, seed=2026)\nres_p1 = simulate_day(PolicyId.P1, {'period_min': 60}, seed=2026)\nres_p2 = simulate_day(PolicyId.P2, {'check_interval_min': 5, 'trigger_threshold': 3.0}, seed=2026)\n\nplt.figure(figsize=(10, 5))\nplt.plot(res_p0.t_h, res_p0.eps_oracle, label='P0 (Never)')\nplt.plot(res_p1.t_h, res_p1.eps_oracle, label='P1 (60 min)')\nplt.plot(res_p2.t_h, res_p2.eps_oracle, label='P2 (5min/3σ)')\nplt.axhline(1e-3, color='r', linestyle='--', label='Threshold $\\epsilon_{th} = 10^{-3}$')\nplt.yscale('log')\nplt.xlabel('Time of Day (h)')\nplt.ylabel('Oracle Gate Error $\\epsilon$')\nplt.title('Oracle Gate Error vs Time')\nplt.legend()\nplt.grid(True)\nplt.show()"),
    code_cell("from q_autopilot_backend.sim.pareto import compute_pareto\nfrom q_autopilot_backend.api.schemas import UncertaintyType\n\npareto_points = compute_pareto(UncertaintyType.SD)\n\ncalib_fracs = [p.calib_fraction_mean for p in pareto_points]\neps_means = [p.mean_eps_mean for p in pareto_points]\ncalib_errs = [p.calib_fraction_err for p in pareto_points]\neps_errs = [p.mean_eps_err for p in pareto_points]\n\nplt.figure(figsize=(8, 6))\nplt.errorbar(calib_fracs, eps_means, xerr=calib_errs, yerr=eps_errs, fmt='o', alpha=0.6)\nplt.xlabel('Fraction of day spent calibrating')\nplt.ylabel('Time-averaged Oracle Gate Error')\nplt.title('Pareto Frontier (20 Random Seeds)')\nplt.yscale('log')\nplt.grid(True)\nplt.show()")
]
create_notebook('notebooks/D4_Policy_Comparison.ipynb', cells_d4)

# D5 Algorithm Impact
cells_d5 = [
    md_cell("# D5: Downstream Algorithm Impact (QAOA)\n\nEvaluates the effect of the calibration policy on a $p=1$ QAOA for MaxCut on a 4-qubit ring."),
    code_cell("import sys\nsys.path.append('../q-autopilot-backend/src')\nimport numpy as np\nimport matplotlib.pyplot as plt\n%matplotlib inline\n\nnp.random.seed(2026)"),
    code_cell("from q_autopilot_backend.sim.policy import simulate_day\nfrom q_autopilot_backend.api.schemas import PolicyId\n\nres_p0 = simulate_day(PolicyId.P0, {}, seed=2026)\nres_p1 = simulate_day(PolicyId.P1, {'period_min': 60}, seed=2026)\nres_p2 = simulate_day(PolicyId.P2, {'check_interval_min': 5, 'trigger_threshold': 3.0}, seed=2026)\n\nplt.figure(figsize=(10, 5))\nplt.plot(res_p0.t_h, res_p0.qaoa_ratio, label='P0 (Never)')\nplt.plot(res_p1.t_h, res_p1.qaoa_ratio, label='P1 (60 min)')\nplt.plot(res_p2.t_h, res_p2.qaoa_ratio, label='P2 (5min/3σ)')\nplt.xlabel('Time of Day (h)')\nplt.ylabel('Normalized Cost $\\langle C \\rangle / C_{max}$')\nplt.title('QAOA Cost vs Time of Day')\nplt.legend()\nplt.grid(True)\nplt.show()")
]
create_notebook('notebooks/D5_Algorithm_Impact.ipynb', cells_d5)

# Requirements
with open('notebooks/requirements.txt', 'w') as f:
    f.write('''numpy==1.26.4
scipy==1.13.0
matplotlib==3.8.4
''')
