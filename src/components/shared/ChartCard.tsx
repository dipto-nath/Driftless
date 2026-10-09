import { cn } from "@/lib/utils";
import { Download, Copy, ExternalLink } from "lucide-react";
import { forwardRef } from "react";
import type { ReactNode } from "react";

type UncertaintyType = "SD" | "SE" | "CI95";

interface ChartCardProps {
  title: string;
  caption: string;
  nSeeds?: number;
  uncertainty?: UncertaintyType;
    children: ReactNode;
  className?: string;
  onDownloadPng?: () => void;
  onDownloadSvg?: () => void;
  onCopyCaption?: () => void;
}

export const ChartCard = forwardRef<HTMLDivElement, ChartCardProps>(
  ({ title, caption, nSeeds, uncertainty, children, className, onDownloadPng, onDownloadSvg, onCopyCaption }, ref) => {
    const footerParts: string[] = [];
    if (nSeeds !== undefined) footerParts.push(`${nSeeds} seeds`);
    if (uncertainty) footerParts.push(uncertainty);

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] overflow-hidden",
          className
        )}
      >
        <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--surface-2)]/50 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)] max-w-3xl">{caption}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {onCopyCaption && (
              <button
                onClick={onCopyCaption}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-colors"
                aria-label="Copy caption"
              >
                <Copy className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            {onDownloadPng && (
              <button
                onClick={onDownloadPng}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-colors"
                aria-label="Download PNG"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            {onDownloadSvg && (
              <button
                onClick={onDownloadSvg}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-colors"
                aria-label="Download SVG"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
        <div className="p-5">{children}</div>
        {(nSeeds !== undefined || uncertainty) && (
          <div className="px-5 pb-4 pt-0 border-t border-[var(--border)] bg-[var(--surface-2)]/30">
            <p className="text-xs text-[var(--text-muted)] font-mono">
              {footerParts.join(" · ") || "—"}
            </p>
          </div>
        )}
      </div>
    );
  }
);

ChartCard.displayName = "ChartCard";