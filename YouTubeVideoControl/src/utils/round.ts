export default function round(value: number, decimalPlaces: number): number {
  // NOTE: this is not always exact due to floating points
  const mult = 10 ** decimalPlaces;
  return Math.round(value * mult) / mult;
}
