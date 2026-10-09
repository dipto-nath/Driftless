import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X, Volume2, Info } from "lucide-react";
import { ChartCard } from "@/components/shared/ChartCard";

const STEPS = [
  { title: "1. Hook", description: "Quantum computers drift. Gates degrade. Recalibration costs time. How do we balance?", chart: "Overview: 4 StatCards + mini Pareto + mini ε(t)", notes: "30 sec: Frame the problem. Qubits drift → gate errors rise → algorithms fail. Recalibration fixes errors but costs device time (500 µs/shot). The question: what policy maximizes algorithm performance per unit calibration time?" },
  { title: "2. Static Pulse", description: "Validated 3-level transmon model. DRAG reduces leakage to 1e-4. ε ≈ 9e-5.", chart: "Plant: Population dynamics + DRAG envelope + validation table", notes: "45 sec: Show the physics is sound. P0/P1/P2 populations during π pulse. Leakage inset. DRAG β sweep matches 1/|α|. Validation checks all pass (Rabi limit, unitarity, OU statistics)." },
  { title: "3. Calibration", description: "Three routines: amplitude, Bayesian frequency, DRAG β. Adaptive frequency wins 4× shot saving.", chart: "Calibration: 3 convergence charts + Adaptive: posterior heatmap + precision vs shots", notes: "60 sec: Amplitude converges in ~1k shots. Frequency uses Bayesian-adaptive Ramsey (doubling τ) — 4× fewer shots than fixed grid. DRAG β_opt ≈ 1/|α|. Calibration order: frequency → amplitude → DRAG." },
  { title: "4. The 24-Hour Day", description: "P0 degrades. P1 sawtooths. P2 stays below ε_th with health checks. Telegraph jumps cause spikes.", chart: "Policies: 4 linked charts (Δ, g, ε, QAOA) + TimeScrubber", notes: "90 sec: Play the day at 60×. Show Δ_true vs Δ_est tracking. Gain sinusoid visible. ε(t) log scale with ε_th line. P0 crosses threshold at ~6h. P1 resets every period. P2 health checks catch drift; full recals only when needed. Telegraph jumps annotated." },
  { title: "5. Pareto Frontier", description: "P2 dominates. 21 seeds. Frontier connects P2 configs. Official seed 2026 on frontier.", chart: "Pareto: scatter with error bars + frontier + config table", notes: "60 sec: X = calibration fraction, Y = mean ε (log). Error bars = SD over 21 seeds. P0 single point (high ε, 0% calib). P1 curve (sawtooth trade-off). P2 cluster dominates frontier. Hollow marker = official seed 2026. Hover for params." },
  { title: "6. Algorithm Link", description: "Policy P2: 12.3% calib time, QAOA within 2% of ideal for 82% of day. Ablation: telegraph jumps hurt most.", chart: "Algorithm: QAOA ratio vs time + drift ablation bars + headline sentence", notes: "60 sec: QAOA cost tracks ε(t). P0 drops to 60% of ideal. P1 oscillates. P2 stays >90% ideal most of day. Ablation bars: telegraph jumps → 8% loss, frequency OU → 4%, gain sinusoid → 2%, gain OU → 1%. Headline sentence generator." },
  { title: "7. Honest Limitations", description: "Mock data. Shared drift (optimistic). Ideal 2Q gates. No T1/T2 in oracle. 21 seeds only.", chart: "Methods page + Report checklist", notes: "30 sec: This is a simulation framework, not hardware data. Key approximations listed on Methods page. Backend interface ready for real data. Deliverables checklist shows D1–D5 done, D6 memo pending." }
];

export function Demo() {
  const [step, setStep] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const next = useCallback(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), []);
  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "n" || e.key === "N") setShowNotes(!showNotes);
      if (e.key === "Escape") { setFullscreen(false); document.exitFullscreen?.(); }
      if (e.key === "f" || e.key === "F") { if (!fullscreen) { document.documentElement.requestFullscreen?.(); setFullscreen(true); } }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev, showNotes, fullscreen]);

      const current = STEPS[step]!;

  return (
    <div className={cn("h-screen w-screen bg-[var(--bg)] flex flex-col", fullscreen && "fixed inset-0 z-50")}>
      <div className="flex items-center justify-center gap-2 px-4 py-3 border-b border-[var(--border)]">
        {STEPS.map((_, i) => (
          <button key={i} onClick={() => setStep(i)} className={cn("h-2.5 w-2.5 rounded-full transition-all", i === step ? "bg-[var(--primary)] w-10" : "bg-[var(--border)] hover:bg-[var(--text-muted)]")} aria-label={"Step " + (i + 1)} aria-current={i === step ? "step" : undefined} />
        ))}
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm">
          <div><h1 className="text-2xl lg:text-3xl font-semibold text-[var(--text)]">{current.title}</h1><p className="mt-1 text-lg text-[var(--text-muted)] max-w-3xl">{current.description}</p></div>
          <div className="flex items-center gap-2"><button onClick={() => setShowNotes(!showNotes)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors", showNotes ? "bg-[var(--primary)] text-[var(--primary-fg)]" : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]")} aria-pressed={showNotes}><Info className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">Speaker Notes</span></button><button onClick={() => { if (!fullscreen) { document.documentElement.requestFullscreen?.(); setFullscreen(true); } else { document.exitFullscreen?.(); setFullscreen(false); } }} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors" aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}>{fullscreen ? <X className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}</button></div></header>
        <main className="flex-1 flex items-center justify-center p-6 overflow-auto"><ChartCard title={current.chart} caption="Presentation scale — simplified for demo"><div className="aspect-video w-full max-w-4xl bg-[var(--surface-2)] rounded-lg flex items-center justify-center text-[var(--text-muted)]"><div className="text-center p-8"><p className="text-xl font-medium mb-2">Chart: {current.chart}</p><p className="text-sm">(Full implementation in respective pages)</p></div></div></ChartCard></main>
        <footer className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm"><button onClick={prev} disabled={step === 0} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors", step === 0 ? "text-[var(--border)] cursor-not-allowed" : "text-[var(--text)] hover:bg-[var(--surface-2)]")} aria-label="Previous step"><ChevronLeft className="h-5 w-5" aria-hidden="true" /><span className="hidden sm:inline">Previous</span></button><div className="text-sm text-[var(--text-muted)] font-mono tabular-nums">{step + 1} / {STEPS.length}</div><button onClick={next} disabled={step === STEPS.length - 1} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors", step === STEPS.length - 1 ? "text-[var(--border)] cursor-not-allowed" : "bg-[var(--primary)] text-[var(--primary-fg)] hover:opacity-90")} aria-label="Next step"><span className="hidden sm:inline">Next</span><ChevronRight className="h-5 w-5" aria-hidden="true" /></button></footer></div>{showNotes && (<div className={cn("fixed bottom-0 right-0 w-full md:w-96 h-64 md:h-auto max-h-[70vh] bg-[var(--surface)] border-t border-l border-[var(--border)] shadow-[var(--shadow)] p-4 overflow-auto z-40 animate-in")}><div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-[var(--text)]">Speaker Notes</h3><button onClick={() => setShowNotes(false)} className="p-1 text-[var(--text-muted)] hover:text-[var(--text)]" aria-label="Close notes"><X className="h-5 w-5" /></button></div><div className="prose prose-sm max-w-none text-[var(--text)]"><p className="whitespace-pre-wrap">{current.notes}</p></div></div>)}<div className="fixed bottom-4 left-4 text-xs text-[var(--text-muted)] bg-[var(--surface)] px-3 py-2 rounded border border-[var(--border)] pointer-events-none">← → / Space: navigate | N: notes | F: fullscreen | Esc: exit</div></div>
  );
}
