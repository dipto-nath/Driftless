export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function normalRandom(rng: () => number): number {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function ouStep(
  x: number,
  mu: number,
  tau: number,
  sigma: number,
  dt: number,
  z: number
): number {
  return mu + (x - mu) * Math.exp(-dt / tau) + sigma * Math.sqrt(1 - Math.exp(-2 * dt / tau)) * z;
}

export function telegraphStep(
  current: number,
  states: [number, number],
  rate: number,
  dt: number,
  rng: () => number
): number {
  if (rng() < rate * dt) {
    return current === states[0] ? states[1] : states[0];
  }
  return current;
}