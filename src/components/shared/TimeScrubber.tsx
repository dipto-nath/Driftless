import { cn } from "@/lib/utils";
import { Play, Pause } from "lucide-react";
import type { CalibWindow } from "@/data/types";

interface TimeScrubberProps {
  currentTime: number;
  maxTime: number;
  playing: boolean;
  speed: number;
  onTimeChange: (time: number) => void;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
  calibWindows?: CalibWindow[];
}

export function TimeScrubber({
  currentTime,
  maxTime,
  playing,
  speed,
  onTimeChange,
  onPlayPause,
  onSpeedChange,
  calibWindows,
}: TimeScrubberProps) {
  const percent = (currentTime / maxTime) * 100;
  const hours = Math.floor(currentTime);
  const minutes = Math.round((currentTime - hours) * 60);

  const speedOptions = [1, 10, 60];

  return (
    <div className="space-y-3 p-4 bg-[var(--surface)] border-t border-[var(--border)]">
      <div className="flex items-center gap-4">
        <button
          onClick={onPlayPause}
          className="p-2 rounded-lg hover:bg-[var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>

        <div className="font-mono text-lg tabular-nums text-[var(--text)]">
          {hours.toString().padStart(2, "0")}h {minutes.toString().padStart(2, "0")}m
        </div>

        <div className="flex items-center gap-1">
          {speedOptions.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-lg focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                speed === s
                  ? "bg-[var(--primary)] text-[var(--primary-fg)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)]"
              )}
              aria-label={`Speed ${s}x`}
            >
              {s}×
            </button>
          ))}
        </div>

        <div className="ml-auto text-xs text-[var(--text-muted)]">
          {playing ? "Playing" : "Paused"} · {speed}× speed
        </div>
      </div>

      <div className="relative h-6">
        <input
          type="range"
          min={0}
          max={maxTime}
          step={0.01}
          value={currentTime}
          onChange={(e) => onTimeChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-2 bg-[var(--border)] rounded-full appearance-none cursor-pointer track-slider"
          aria-label="Time of day scrubber"
        />

        {/* Calibration window markers */}
        {calibWindows?.map((w, i) => {
          const startPercent = (w.start_h / maxTime) * 100;
          const width = ((w.end_h - w.start_h) / maxTime) * 100;
          return (
            <div
              key={i}
              className={cn(
                "absolute top-0 h-2 rounded-sm",
                w.kind === "health"
                  ? "bg-[var(--text-muted)]/30"
                  : "bg-[var(--primary)]/40"
              )}
              style={{ left: `${startPercent}%`, width: `${Math.max(width, 0.5)}%` }}
              title={`${w.kind === "health" ? "Health check" : "Full calibration"} at ${w.start_h.toFixed(1)}h`}
            />
          );
        })}

        {/* Current position marker */}
        <div
          className="absolute top-[-4px] h-10 w-0.5 bg-[var(--text)] shadow"
          style={{ left: `${percent}%` }}
        />
      </div>

      <style>{`
        .track-slider::-webkit-slider-thumb {
          appearance: none;
          width: 0;
          height: 0;
          opacity: 0;
        }
        .track-slider::-moz-range-thumb {
          width: 0;
          height: 0;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}