import { useState, useEffect } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Atom, 
  FlaskConical,
  GitBranch,
  SlidersHorizontal,
  BarChart2,
  Brain,
  FileText,
  BookOpen,
  PlayCircle,
  Settings,
    ChevronLeft,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Control Room", icon: LayoutDashboard },
  { path: "/plant", label: "Plant & Validation", icon: Atom },
  { path: "/calibration", label: "Calibration Lab", icon: FlaskConical },
  { path: "/adaptive", label: "Adaptive Design", icon: GitBranch },
  { path: "/policies", label: "Policy Simulator", icon: SlidersHorizontal },
  { path: "/pareto", label: "Pareto Explorer", icon: BarChart2 },
  { path: "/algorithm", label: "Algorithm Impact", icon: Brain },
  { path: "/report", label: "Report & Memo", icon: FileText },
  { path: "/methods", label: "Methods", icon: BookOpen },
  { path: "/demo", label: "Presentation Mode", icon: PlayCircle },
  { path: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar({ onToggle }: { onToggle: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setCollapsed(true);
    }
  }, []);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-[var(--surface)] border-r border-[var(--border)] transition-all duration-200 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border)]">
        <Link to="/" className="flex items-center gap-2" aria-label="Q-Autopilot Home">
          <span className="text-xl font-bold text-[var(--primary)]">Q-Autopilot</span>
          {!collapsed && (
            <span className="text-xs text-[var(--text-muted)] font-mono">Control Room</span>
          )}
        </Link>
        <button
          onClick={() => { setCollapsed(!collapsed); onToggle(); }}
          className={cn(
            "p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors",
            collapsed && "rotate-180"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2" role="navigation" aria-label="Main">
        <ul className="space-y-1" role="list">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                    isActive
                      ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                  )}
                  aria-current={isActive ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border)] p-4">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            <div className="h-8 w-8 rounded-lg bg-[var(--primary-soft)] flex items-center justify-center flex-shrink-0">
              <Atom className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-medium text-[var(--text)]">Q-Autopilot</p>
                <p className="text-xs text-[var(--text-muted)] font-mono">v0.1.0</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}