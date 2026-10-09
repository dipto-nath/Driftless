interface ParamSliderProps {
  label: string;
  unit?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  hint?: string;
}

export function ParamSlider({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
  hint,
}: ParamSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-[var(--text)]">
          {label}
          {hint && <span className="ml-1 text-[var(--text-muted)]">— {hint}</span>}
        </label>
        <span className="font-mono text-sm tabular-nums text-[var(--text)]">
          {value.toFixed(step < 1 ? 1 : 0)}
          {unit && <span className="ml-1 text-xs text-[var(--text-muted)]">{unit}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-[var(--border)] rounded-full appearance-none cursor-pointer"
        aria-label={label}
      />
    </div>
  );
}