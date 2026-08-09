export const clamp = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

export function remap(x: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  const t = (x - inMin) / (inMax - inMin);
  return lerp(outMin, outMax, t);
}

export function expDecay(value: number, rate: number, dt: number): number {
  return value * Math.exp(-rate * dt);
}

export function hashNoise(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
