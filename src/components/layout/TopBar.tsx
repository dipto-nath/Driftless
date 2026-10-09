import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, HelpCircle, PlayCircle, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { DATA_SOURCE } from "@/config";
import { SeedSelect } from "@/components/shared/SeedSelect";
import { MockBadge } from "@/components/shared/MockBadge";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { 
  Monitor, Zap, FlaskConical, GitBranch, SlidersHorizontal, 
  BarChart2, Brain, FileText, BookOpen, Settings 
} from "lucide-react";

const BREADCRUMBS: Record<string, { label: string; icon?: LucideIcon; href?: string }[]> = {
  "/": [{ label: "Control Room", icon: Monitor }],
  "/plant": [{ label: "Control Room", href: "/" }, { label: "Plant & Validation", icon: Zap }],
  "/calibration": [{ label: "Control Room", href: "/" }, { label: "Calibration Lab", icon: FlaskConical }],
  "/adaptive": [{ label: "Control Room", href: "/" }, { label: "Adaptive Design", icon: GitBranch }],
  "/policies": [{ label: "Control Room", href: "/" }, { label: "Policy Simulator", icon: SlidersHorizontal }],
  "/pareto": [{ label: "Control Room", href: "/" }, { label: "Pareto Explorer", icon: BarChart2 }],
  "/algorithm": [{ label: "Control Room", href: "/" }, { label: "Algorithm Impact", icon: Brain }],
  "/report": [{ label: "Control Room", href: "/" }, { label: "Report & Memo", icon: FileText }],
  "/methods": [{ label: "Control Room", href: "/" }, { label: "Methods", icon: BookOpen }],
  "/demo": [{ label: "Control Room", href: "/" }, { label: "Presentation Mode", icon: PlayCircle }],
  "/settings": [{ label: "Control Room", href: "/" }, { label: "Settings", icon: Settings }],
};

export function TopBar({ title, children }: { title: string; children?: ReactNode }) {
  const [presentationMode, setPresentationMode] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShortcutsOpen(true);
      }
      if (e.key === "Escape") {
        setShortcutsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const breadcrumbs = BREADCRUMBS[window.location.pathname] || [{ label: title }];

  return (
    <header className="sticky top-0 z-30 h-14 bg-[var(--surface)]/80 backdrop-blur-sm border-b border-[var(--border)] flex items-center gap-4 px-4 lg:px-6">
      <nav className="flex items-center gap-2 text-sm hidden md:flex" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2" role="list">
          {breadcrumbs.map((crumb, i) => (
            <li key={crumb.label} className="flex items-center gap-2">
              {i > 0 && <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" aria-hidden="true" />}
              {crumb.href ? (
                <Link to={crumb.href} className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                  {crumb.icon && <crumb.icon className="h-4 w-4" aria-hidden="true" />}
                  <span>{crumb.label}</span>
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-[var(--text)] font-medium">
                  {crumb.icon && <crumb.icon className="h-4 w-4" aria-hidden="true" />}
                  <span>{crumb.label}</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex-1" />
      <h1 className="text-lg font-semibold text-[var(--text)] hidden lg:block truncate max-w-md">{title}</h1>
      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {DATA_SOURCE === "mock" && <MockBadge />}
        <SeedSelect />
        <button
          onClick={() => setPresentationMode(!presentationMode)}
          className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]", presentationMode ? "bg-[var(--primary)] text-[var(--primary-fg)]" : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]")}
          aria-pressed={presentationMode}
          title="Presentation mode (full-screen, large type)"
        >
          <PlayCircle className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Demo</span>
        </button>
        <ThemeToggle />
        <button onClick={() => setShortcutsOpen(true)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors" aria-label="Keyboard shortcuts">
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
        </button>
        {children}
      </div>
      {shortcutsOpen && <ShortcutsDialog onClose={() => setShortcutsOpen(false)} />}
    </header>
  );
}

function ShortcutsDialog({ onClose }: { onClose: () => void }) {
  const shortcuts = [
    { keys: ["g", "o"], action: "Go to Control Room" },
    { keys: ["g", "p"], action: "Go to Plant & Validation" },
    { keys: ["g", "c"], action: "Go to Calibration Lab" },
    { keys: ["g", "a"], action: "Go to Adaptive Design" },
    { keys: ["g", "s"], action: "Go to Policy Simulator" },
    { keys: ["g", "r"], action: "Go to Pareto Explorer" },
    { keys: ["?"], action: "Show this dialog" },
    { keys: ["Esc"], action: "Close dialog / Exit presentation mode" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="shortcuts-title">
      <div className="bg-[var(--surface)] rounded-[var(--radius)] shadow-[var(--shadow)] p-6 max-w-md w-full mx-4 animate-in" onClick={(e) => e.stopPropagation()}>
        <h2 id="shortcuts-title" className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center justify-between">
          Keyboard Shortcuts
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text)]" aria-label="Close">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </h2>
        <dl className="space-y-3">
          {shortcuts.map(({ keys, action }) => (
            <div key={action} className="flex items-center justify-between gap-4">
              <dt className="text-[var(--text)]">{action}</dt>
              <dd className="flex items-center gap-1">
                                  {keys.map((key, i) => (
                  <Fragment key={i}>
                    {i > 0 && <span className="text-[var(--text-muted)] px-1">→</span>}
                    <kbd className="px-2 py-0.5 text-xs font-mono bg-[var(--surface-2)] rounded text-[var(--text-muted)] border border-[var(--border)]">
                      {key}
                    </kbd>
                  </Fragment>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
