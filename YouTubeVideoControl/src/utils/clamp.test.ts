import React from 'react';

import { clamp, clamp01 } from './clamp';

describe('clamp', () => {
  it.each([
    [3, 1, 10, 3],
    [0, 1, 10, 1],
    [17, 1, 10, 10],
    [1, 1, 10, 1],
    [10, 1, 10, 10],
  ])('clamp %d between %d and %d', (x, a, b, expected) => {
    expect(clamp(x, a, b)).toBe(expected);
  });

  it.each([
    [0.3, 0.3],
    [-3, 0],
    [1.5, 1],
    [0, 0],
    [1, 1]
  ])('clamp %d between 0 and 1', (x, expected) => {
    expect(clamp01(x)).toBe(expected);
  });
});
