import round from './round';

describe('round', () => {
  it.each([
    [123.456, -4, 0],
    [123.456, -3, 0],
    [123.456, -2, 100],
    [123.456, -1, 120],
    [123.456, 0, 123],
    [123.456, 1, 123.5],
    [123.456, 2, 123.46],
    [123.456, 3, 123.456],
    [123.456, 4, 123.456],
  ])(
    'rounds %d to %d decimals',
    (value: number, decimals: number, expected: number) => {
      expect(round(value, decimals)).toBeCloseTo(expected);
    },
  );
});
