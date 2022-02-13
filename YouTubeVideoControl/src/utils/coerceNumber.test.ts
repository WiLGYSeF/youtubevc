import coerceNumber from './coerceNumber';

describe('coerceNumber', () => {
  it.each([
    [3, 1, 10, 3],
    [0, 1, 10, 1],
    [17, 1, 10, 10],
    [1, 1, 10, 1],
    [10, 1, 10, 10],
  ])(
    'coerce clamp %d between %d and %d',
    (x: number, min: number, max: number, expected: number) => {
      expect(coerceNumber(x, min, max, undefined, true)).toBe(expected);
    },
  );

  it.each([
    [3, 1, 3],
    [0, 1, 1],
  ])(
    'coerce clamp %d with min %d',
    (x: number, min: number, expected: number) => {
      expect(coerceNumber(x, min, undefined, undefined, true)).toBe(expected);
    },
  );

  it.each([
    [3, 4, 3],
    [7, 4, 4],
  ])(
    'coerce clamp %d with max %d',
    (x: number, max: number, expected: number) => {
      expect(coerceNumber(x, undefined, max, undefined, true)).toBe(expected);
    },
  );

  it.each([
    [3, 3],
  ])(
    'coerce clamp %d with no min nor max',
    (x: number, expected: number) => {
      expect(coerceNumber(x, undefined, undefined, undefined, true)).toBe(expected);
    },
  );

  it.each([
    [3, 1, 10, 3],
    [0, 1, 10, 9],
    [17, 1, 10, 8],
    [123, 0, 60, 3],
    [-67, 0, 60, 53],
    [1, 1, 10, 1],
    [10, 1, 10, 10],
  ])(
    'coerce wrap %d between %d and %d',
    (x: number, min: number, max: number, expected: number) => {
      expect(coerceNumber(x, min, max, undefined, false)).toBe(expected);
    },
  );

  it.each([
    [3, 3],
  ])(
    'coerce wrap %d with no min nor max',
    (x: number, expected: number) => {
      expect(coerceNumber(x, undefined, undefined, undefined, false)).toBe(expected);
    },
  );

  it.each([
    [3, 1, 10, 1, 3],
    [3, 1, 10, 2, 4],
    [1.6, 0, 1, 0.3, 0.9],
  ])(
    'coerce %d between %d and %d with step %d',
    (x: number, min: number, max: number, step: number, expected: number) => {
      expect(coerceNumber(x, min, max, step, true)).toBe(expected);
    },
  );
});
