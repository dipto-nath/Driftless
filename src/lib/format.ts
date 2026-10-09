export function formatNumber(value: number, options: { precision?: number; scientific?: boolean } = {}): string {
  const { precision = 2, scientific = false } = options;
  
  if (scientific || Math.abs(value) < 0.001 || Math.abs(value) >= 10000) {
    return value.toExponential(precision);
  }
  
  if (Number.isInteger(value)) {
    return value.toLocaleString();
  }
  
  return value.toFixed(precision);
}

export function formatPercent(value: number, precision = 1): string {
  return `${(value * 100).toFixed(precision)}%`;
}

export function formatTime(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  if (hours < 24) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  const d = Math.floor(hours / 24);
  const h = Math.round(hours % 24);
  return h > 0 ? `${d}d ${h}h` : `${d}d`;
}

export function formatScientific(value: number, precision = 2): string {
  return value.toExponential(precision);
}