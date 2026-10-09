import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { ThemeProvider } from "./ThemeProvider";
import { SeedProvider } from "@/components/shared/SeedSelect";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <ThemeProvider>
      <SeedProvider>
        <div className="min-h-screen bg-[var(--bg)]">
          <Sidebar onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <div
            className={cn(
              "transition-all duration-200 min-h-screen",
              sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
            )}
          >
            <TopBar title="Q-Autopilot" />
            <main className="p-4 lg:p-6 max-w-[1440px] mx-auto" id="main-content" role="main">
              {children}
            </main>
          </div>
        </div>
      </SeedProvider>
    </ThemeProvider>
  );
}