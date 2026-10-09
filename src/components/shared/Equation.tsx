import type { ReactNode } from "react";
import * as katex from "katex";

interface GlossaryProps {
  term: string;
  definition: string;
  children?: ReactNode;
}

export function Glossary({ term, definition, children }: GlossaryProps) {
  return (
    <span className="relative group cursor-help">
      <span className="border-b border-dotted border-[var(--text-muted)]/30">
        {children ?? term}
      </span>
      <div
        role="tooltip"
        className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50"
      >
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 max-w-xs">
          <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow)] text-sm">
            <strong className="font-semibold text-[var(--text)]">{term}</strong>
            <p className="mt-1 text-[var(--text-muted)]">{definition}</p>
          </div>
        </div>
      </div>
    </span>
  );
}

interface EquationProps {
  latex: string;
  caption?: string;
  numbered?: boolean;
}

export function Equation({ latex, caption, numbered = false }: EquationProps) {
  return (
    <div className="my-4 text-center">
      <div className="display-equation bg-[var(--surface-2)] rounded-[var(--radius)] p-4 border border-[var(--border)] shadow-[var(--shadow)]">
                <span dangerouslySetInnerHTML={{ __html: katex.renderToString(latex, { displayMode: true }) }} />
        {numbered && <span className="equation-number text-xs text-[var(--text-muted)] ml-2">(1)</span>}
      </div>
      {caption && <p className="mt-1 text-xs text-[var(--text-muted)]">{caption}</p>}
    </div>
  );
}