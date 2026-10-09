import { PageHeader } from "@/components/shared/PageHeader";
import { DataState } from "@/components/shared/DataState";
import { ChartCard } from "@/components/shared/ChartCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Report() {
  return (
    <div>
      <PageHeader
        title="Report & Memo Hub"
        description="Figure gallery, D6 memo viewer with word counter, deliverables checklist, and export buttons (disabled in mock mode)."
      />
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
                {[
                  "Control Room Overview",
                  "Plant: Population Dynamics",
                  "Plant: DRAG Pulse",
                  "Plant: Validation Table",
                  "Calibration: Amplitude",
                  "Calibration: Frequency",
                  "Calibration: DRAG β Sweep",
                  "Adaptive: Posterior Evolution",
                  "Adaptive: Chosen Delays",
                  "Adaptive: Precision vs Shots",
                  "Policies: Detuning",
                  "Policies: Gain",
                  "Policies: Oracle Error",
                  "Policies: QAOA Ratio",
                  "Pareto: Frontier",
                  "Algorithm: QAOA Cost",
                  "Algorithm: Drift Ablation",
                ].map((fig) => (
                  <div key={fig} className="bg-[var(--surface-2)] rounded-lg p-4 text-center hover:bg-[var(--border)] transition-colors cursor-pointer">
                    <div className="aspect-video bg-[var(--surface)] rounded mb-2 flex items-center justify-center">
                      <span className="text-[var(--text-muted)]">Thumbnail</span>
                    </div>
                    <p className="text-sm font-medium text-[var(--text)]">{fig}</p>
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
                  <span className="text-sm text-[var(--text-muted)]">Word count: <span className="font-mono">0 / 400</span></span>
                  <button className="px-3 py-1.5 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-fg)]" disabled>
                    Export PDF
                  </button>
                </div>
                <textarea
                  className="w-full h-96 font-mono text-sm p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="# Q-Autopilot D6 Memo\n\n## Summary\n\n[Placeholder: Write your 400-word memo here...]\n\n## Key Findings\n\n- Policy P2 achieves...\n- Adaptive calibration saves...\n- QAOA impact shows...\n\n## Limitations\n\n[Placeholder: Note known limitations]\n\n## References\n\n[Placeholder: Add references]"
                  disabled
                />
              </div>
            </ChartCard>
          </DataState>
        </TabsContent>
        <TabsContent value="checklist">
                    <DataState state="success">
            <ChartCard title="Deliverables Checklist" caption="D1–D6 status tracking (editable locally)">
              <div className="space-y-3">
                {[
                  { id: "D1", name: "Plant & Validation", status: "done" as const },
                  { id: "D2", name: "Calibration Routines", status: "done" as const },
                  { id: "D3", name: "Adaptive Design", status: "done" as const },
                  { id: "D4", name: "Policy Simulator & Pareto", status: "done" as const },
                  { id: "D5", name: "Algorithm Impact", status: "done" as const },
                  { id: "D6", name: "Report & Memo", status: "pending" as const },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-[var(--surface-2)] rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-medium text-[var(--text)]">{item.id}</span>
                      <span className="text-[var(--text)]">{item.name}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      item.status === "done"
                        ? "bg-[var(--success)]/20 text-[var(--success)]"
                        : item.status === "pending"
                        ? "bg-[var(--warning)]/20 text-[var(--warning)]"
                        : "bg-[var(--danger)]/20 text-[var(--danger)]"
                    }`}>
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