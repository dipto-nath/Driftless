import { cn } from "@/lib/utils";
import type { PolicyId } from "@/data/types";
import { POLICY_COLORS, POLICY_DASHES, POLICY_LABELS } from "@/config";

interface LegendItem {
  policy: PolicyId;
  label?: string;
  color?: string;
  dash?: string;
  marker?: string;
}

export function PolicyLegend({
  items,
  compact = false,
}: {
  items: LegendItem[];
  compact?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-4 flex-wrap"
      role="figure"
      aria-label="Policy legend"
    >
      {items.map((item) => (
        <div key={item.policy} className="flex items-center gap-1.5">
          <svg
            width={compact ? 16 : 20}
            height={compact ? 12 : 14}
            className="flex-shrink-0"
          >
            <line
              x1={compact ? 0 : 2}
              y1={(compact ? 12 : 14) / 2}
              x2={compact ? 16 : 20}
              y2={(compact ? 12 : 14) / 2}
              strokeWidth={2}
              stroke={item.color ?? POLICY_COLORS[item.policy]}
                            strokeDasharray={
                item.dash ??
                (POLICY_DASHES[item.policy] === "dot"
                  ? "2,3"
                  : POLICY_DASHES[item.policy] === "dash"
                    ? "5,3"
                    : "0")
              }
              strokeLinecap="round"
            />
            {item.marker && (
              <circle
                cx={(compact ? 16 : 20) / 2}
                cy={(compact ? 12 : 14) / 2}
                r={compact ? 3 : 4}
                fill={item.color ?? POLICY_COLORS[item.policy]}
              />
            )}
          </svg>
          <span className={cn("text-sm", compact ? "text-xs" : "")}>
            {item.label ?? POLICY_LABELS[item.policy]}
          </span>
        </div>
      ))}
    </div>
  );
}