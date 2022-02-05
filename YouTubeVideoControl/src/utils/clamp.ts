export function clamp(x: number, a: number, b: number): number {
  return Math.max(a, Math.min(x, b));
}

export function clamp01(x: number): number {
  return clamp(x, 0, 1);
}
