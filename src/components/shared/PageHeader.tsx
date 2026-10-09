import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-[var(--text)] tracking-tight">{title}</h1>
          <p className="mt-1 text-[var(--text-muted)] max-w-2xl">{description}</p>
        </div>
        {action && <div className="flex-shrink-0 mt-1">{action}</div>}
      </div>
    </header>
  );
}