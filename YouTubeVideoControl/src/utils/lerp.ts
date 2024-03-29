import { clamp01 } from './clamp';

export default function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp01(t);
}
