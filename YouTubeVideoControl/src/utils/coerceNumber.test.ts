import coerceNumber from './coerceNumber';

describe('coerceNumber', () => {
  it.each([
    [NaN, 1, 10, NaN],
    [3, 1, 10, 3],
    [0, 1, 10, 1],
    [17, 1, 10, 10],
    [1, 1, 10, 1],
    [10, 1, 10, 10],
  ])(
    'coerce clamps %d between %d and %d',
    (x: number, min: number, max: number, expected: number) => {
      if (!Number.isNaN(x)) {
        expect(coerceNumber(x, min, max, undefined, true)).toBeCloseTo(expected);
      } else {
        expect(coerceNumber(x, min, max, undefined, true)).toEqual(NaN);
      }
    },
  );

  it.each([
    [3, 1, 3],
    [0, 1, 1],
  ])(
    'coerce clamps %d with min %d',
    (x: number, min: number, expected: number) => {
      expect(coerceNumber(x, min, undefined, undefined, true)).toBeCloseTo(expected);
    },
  );

  it.each([
    [3, 4, 3],
    [7, 4, 4],
  ])(
    'coerce clamps %d with max %d',
    (x: number, max: number, expected: number) => {
      expect(coerceNumber(x, undefined, max, undefined, true)).toBeCloseTo(expected);
    },
  );

  it.each([
    [3, 3],
  ])(
    'coerce clamps %d with no min nor max',
    (x: number, expected: number) => {
      expect(coerceNumber(x, undefined, undefined, undefined, true)).toBeCloseTo(expected);
    },
  );

  it.each([
    [3, 1, 10, 3],
    [0, 1, 10, 9],
    [17, 1, 10, 8],
    [123, 0, 60, 3],
    [-67, 0, 60, 53],
    [10, -8, -4, -6],
    [-30, -10, 2, -6],
    [1, 1, 10, 1],
    [10, 1, 10, 10],
  ])(
    'coerce wraps %d between %d and %d',
    (x: number, min: number, max: number, expected: number) => {
      expect(coerceNumber(x, min, max, undefined, false)).toBeCloseTo(expected);
    },
  );

  it.each([
    [3, 3],
  ])(
    'coerce wraps %d with no min nor max',
    (x: number, expected: number) => {
      expect(coerceNumber(x, undefined, undefined, undefined, false)).toBeCloseTo(expected);
    },
  );

  it.each([
    [3, 1, 10, 1, 3],
    [3, 1, 10, 2, 4],
    [1.6, 0, 1, 0.3, 0.9],
  ])(
    'coerces %d between %d and %d with step %d',
    (x: number, min: number, max: number, step: number, expected: number) => {
      expect(coerceNumber(x, min, max, step, true)).toBeCloseTo(expected);
    },
  );
});
