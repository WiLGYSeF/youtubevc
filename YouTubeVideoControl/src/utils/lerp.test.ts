import lerp from './lerp';

describe('lerp', () => {
  it.each([
    [0, 1, 0, 0],
    [0, 1, 1, 1],
    [0, 1, 1.2, 1],
    [0, 1, 0.5, 0.5],
    [0, 2, 0.25, 0.5],
  ])(
    'lerps between %d and %d at %d',
    (a: number, b: number, t: number, expected: number) => {
      expect(lerp(a, b, t)).toBeCloseTo(expected);
    }
  );
});