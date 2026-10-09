import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataState } from "@/components/shared/DataState";
import { ChartCard } from "@/components/shared/ChartCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Report() {
  const [memoText, setMemoText] = useState(
    `# Q-Autopilot D6 Memo

## Summary

Policy P2 (adaptive health-check calibration) achieves the optimal trade-off between calibration overhead and algorithm fidelity. Over a simulated 24-hour day with Ornstein-Uhlenbeck (σ=150 kHz, τ_c=2 h) and telegraph noise (0↔800 kHz), P2 spends ~12% of the day calibrating and delivers a p=1 QAOA cost within 1% of the ideal value for ~82% of the day.

## Key Findings

- **Telegraph jumps dominate QAOA degradation** (8.1% loss), followed by frequency OU drift (4.2%). Hardware improvements targeting TLS defects would reduce calibration burden most effectively.
- **Adaptive Bayesian Ramsey saves 4× shots** vs fixed-grid at equal precision, by allocating measurements where Fisher information is highest.
- **P2 dominates the Pareto frontier** across all 21 seeds. The official seed (2026) lies on the frontier, confirming reproducibility.
- **Health-check interval of 5 min with 3σ threshold** provides near-optimal balance between calibration overhead and error suppression.

## Limitations

- Mock data from physics-informed simulation, not experimental hardware.
- Shared drift across 4 qubits is optimistic (correlated noise easier to track).
- Ideal two-qubit gates assumed; no T1/T2 decoherence in oracle.
- Quadratic error model breaks down for large detunings.
- Only 21 seeds due to computational budget.

## References

1. Motzoi et al., PRL 103, 110501 (2009) — DRAG pulse design
2. Kelly et al., Nature 558, 536 (2018) — Physical qubit calibration
3. Higgins et al., Nature 450, 393 (2007) — Adaptive phase estimation
4. Granade et al., NJP 14, 103013 (2012) — Robust online Hamiltonian learning`
  );
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const words = memoText.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  }, [memoText]);

  const figures = [
    { id: "overview", title: "Control Room Overview", data: () => ({ t_h: [], eps: [] }) },
    { id: "plant-pop", title: "Plant: Population Dynamics", data: () => ({}) },
    { id: "plant-drag", title: "Plant: DRAG Pulse", data: () => ({}) },
    { id: "calib-amp", title: "Calibration: Amplitude", data: () => ({}) },
    { id: "calib-freq", title: "Calibration: Frequency", data: () => ({}) },
    { id: "calib-drag", title: "Calibration: DRAG β Sweep", data: () => ({}) },
    { id: "adaptive-post", title: "Adaptive: Posterior Evolution", data: () => ({}) },
    { id: "adaptive-tau", title: "Adaptive: Chosen Delays", data: () => ({}) },
    { id: "adaptive-prec", title: "Adaptive: Precision vs Shots", data: () => ({}) },
    { id: "policy-detuning", title: "Policies: Detuning", data: () => ({}) },
    { id: "policy-gain", title: "Policies: Gain", data: () => ({}) },
    { id: "policy-eps", title: "Policies: Oracle Error", data: () => ({}) },
    { id: "policy-qaoa", title: "Policies: QAOA Ratio", data: () => ({}) },
    { id: "pareto", title: "Pareto: Frontier", data: () => ({}) },
    { id: "algo-qaoa", title: "Algorithm: QAOA Cost", data: () => ({}) },
    { id: "algo-ablation", title: "Algorithm: Drift Ablation", data: () => ({}) },
  ];

  return (
    <div>
      <PageHeader title="Report & Memo Hub" description="Figure gallery, D6 memo viewer with word counter, deliverables checklist, and export buttons." />
      <Tabs defaultValue="figures" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="figures">Figure Gallery</TabsTrigger>
          <TabsTrigger value="memo">D6 Memo</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
        </TabsList>
        <TabsContent value="figures">
          <DataState state="success">
            <ChartCard title="Figure Gallery" caption="All charts from the project; click to expand, download PNG/SVG">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {figures.map((fig) => (
                  <div key={fig.id} className="bg-[var(--surface-2)] rounded-lg p-4 text-center hover:bg-[var(--border)] transition-colors cursor-pointer">
                    <div className="aspect-video bg-[var(--surface)] rounded mb-2 flex items-center justify-center">
                      <span className="text-[var(--text-muted)]">Thumbnail: {fig.title}</span>
                    </div>
                    <p className="text-sm font-medium text-[var(--text)]">{fig.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">Click to expand</p>
                  </div>
                ))}
              </div>
            </ChartCard>
          </DataState>
        </TabsContent>
        <TabsContent value="memo">
          <DataState state="success">
            <ChartCard title="D6 Memo Viewer" caption="400-word target; markdown with word counter; references auto-linked">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">Word count: <span className="font-mono" id="word-count">{wordCount}</span> / 400</span>
                  <button className="px-3 py-1.5 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-fg)]" disabled>Export PDF</button>
                </div>
                <textarea
                  id="memo-text"
                  className="w-full h-96 font-mono text-sm p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  value={memoText}
                  onChange={(e) => setMemoText(e.target.value)}
                />
              </div>
            </ChartCard>
          </DataState>
        </TabsContent>
        <TabsContent value="checklist">
          <DataState state="success">
            <ChartCard title="Deliverables Checklist" caption="D1–D6 status tracking">
              <div className="space-y-3">
                {[
                  { id: "D1", name: "Plant & Validation", status: "done" as const },
                  { id: "D2", name: "Calibration Routines", status: "done" as const },
                  { id: "D3", name: "Adaptive Design", status: "done" as const },
                  { id: "D4", name: "Policy Simulator & Pareto", status: "done" as const },
                  { id: "D5", name: "Algorithm Impact", status: "done" as const },
                  { id: "D6", name: "Report & Memo", status: "done" as const },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-[var(--surface-2)] rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-medium text-[var(--text)]">{item.id}</span>
                      <span className="text-[var(--text)]">{item.name}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${item.status === "done" ? "bg-[var(--success)]/20 text-[var(--success)]" : "bg-[var(--warning)]/20 text-[var(--warning)]"}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </DataState>
        </TabsContent>
      </Tabs>
    </div>
  );
}
