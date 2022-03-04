import Decimal from 'decimal.js-light';

import { clamp } from './clamp';

export default function coerceNumber(
  value: number,
  minValue?: number,
  maxValue?: number,
  step?: number,
  doClamp?: boolean,
): number {
  let num = value;
  if (Number.isNaN(num)) {
    return num;
  }

  if (doClamp) {
    if (minValue !== undefined && maxValue === undefined) {
      num = Math.max(num, minValue);
    } else if (minValue === undefined && maxValue !== undefined) {
      num = Math.min(num, maxValue);
    } else if (minValue !== undefined && maxValue !== undefined) {
      num = clamp(num, minValue, maxValue);
    }
  } else if (minValue !== undefined && maxValue !== undefined) {
    const diff = maxValue - minValue;

    if (num < minValue || num > maxValue) {
      num %= diff;
      if (num > 0 && maxValue < 0) {
        num = -num;
      }
    }
    if (num < minValue) {
      num += diff;
    }
    if (num > maxValue) {
      num -= diff;
    }
  }

  if (step) {
    num = new Decimal(num).div(step).toInteger().mul(step)
      .toNumber();
  }

  return num;
}
