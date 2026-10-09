export interface Point {
  x: number;
  y: number;
}

export function lttbDownsample(data: Point[], maxPoints: number): Point[] {
  if (data.length <= maxPoints) return data;

  const n = data.length;
  const bucketSize = (n - 2) / (maxPoints - 2);
  const sampled: Point[] = [data[0]!];

  for (let i = 1; i < maxPoints - 1; i++) {
    const start = Math.floor((i - 1) * bucketSize) + 1;
    const end = Math.min(Math.floor(i * bucketSize) + 1, n - 1);
    const avgX = (start + end) / 2;
    const closestIdx = data
      .slice(start, end)
      .reduce((closest, p, idx) =>
        Math.abs(p.x - avgX) < Math.abs(data[start + closest]!.x - avgX) ? idx : closest,
        0
      );
    sampled.push(data[start + closestIdx]!);
  }

  sampled.push(data[n - 1]!);
  return sampled;
}

export function downsampleSeries(
  x: number[],
  y: number[],
  maxPoints: number
): { x: number[]; y: number[] } {
  if (x.length <= maxPoints) return { x, y };
  const points: Point[] = x.map((xi, i) => ({ x: xi, y: y[i]! }));
  const sampled = lttbDownsample(points, maxPoints);
  return {
    x: sampled.map((p) => p.x),
    y: sampled.map((p) => p.y),
  };
}
