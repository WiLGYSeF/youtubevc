import { clamp, clamp01 } from './clamp';

describe('clamp', () => {
  it.each([
    [3, 1, 10, 3],
    [0, 1, 10, 1],
    [17, 1, 10, 10],
    [1, 1, 10, 1],
    [10, 1, 10, 10],
  ])(
    'clamps %d between %d and %d',
    (x: number, a: number, b: number, expected: number) => {
      expect(clamp(x, a, b)).toBeCloseTo(expected);
    },
  );

  it.each([
    [0.3, 0.3],
    [-3, 0],
    [1.5, 1],
    [0, 0],
    [1, 1],
  ])(
    'clamps %d between 0 and 1',
    (x: number, expected: number) => {
      expect(clamp01(x)).toBeCloseTo(expected);
    },
  );
});
