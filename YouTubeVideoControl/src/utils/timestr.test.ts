import {
  secondsToTimePartList,
  secondsToTimeParts,
  secondsToTimestamp,
  secondsToTimestring,
  TimeParts,
  timestampToSeconds,
  timestringToSeconds,
} from './timestr';

describe('timestr', () => {
  it.each([
    [
      0,
      {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0,
      },
      [0],
    ],
    [
      43,
      {
        seconds: 43,
        minutes: 0,
        hours: 0,
        days: 0,
      },
      [43],
    ],
    [
      2 * 60 + 2,
      {
        seconds: 2,
        minutes: 2,
        hours: 0,
        days: 0,
      },
      [2, 2],
    ],
    [
      60 * 60 + 7,
      {
        seconds: 7,
        minutes: 0,
        hours: 1,
        days: 0,
      },
      [1, 0, 7],
    ],
    [
      3 * 24 * 60 * 60 + 19 * 60 * 60 + 52 * 60 + 1,
      {
        seconds: 1,
        minutes: 52,
        hours: 19,
        days: 3,
      },
      [3, 19, 52, 1],
    ],
    [
      3 * 24 * 60 * 60 + 19 * 60 * 60 + 1,
      {
        seconds: 1,
        minutes: 0,
        hours: 19,
        days: 3,
      },
      [3, 19, 0, 1],
    ],
    [
      -(2 * 60 + 2),
      {
        seconds: -2,
        minutes: -2,
        hours: 0,
        days: 0,
      },
      [-2, -2],
    ],
  ])(
    'converts %d seconds to timeparts',
    (seconds: number, expectedParts: TimeParts, expectedList: number[]) => {
      expect(secondsToTimeParts(seconds)).toStrictEqual(expectedParts);
      expect(secondsToTimePartList(seconds)).toStrictEqual(expectedList);
    },
  );

  it.each([
    [60.2, {
      seconds: 0.2,
      minutes: 1,
      hours: 0,
      days: 0,
    }],
  ])(
    'converts %d fractional seconds to timeparts',
    (seconds: number, expected: TimeParts) => {
      expect(secondsToTimeParts(seconds)).toStrictEqual(expected);
    },
  );

  it.each([
    [0, '00:00', '0s'],
    [7, '00:07', '7s'],
    [13, '00:13', '13s'],
    [60 + 54, '01:54', '1m 54s'],
    [13 * 60 + 4, '13:04', '13m 04s'],
    [2 * 60 * 60 + 2, '02:00:02', '2h 02s'],
    [11 * 60 * 60 + 41 * 60, '11:41:00', '11h 41m'],
    [5 * 24 * 60 * 60 + 6 * 60, '05:00:06:00', '5d 06m'],
    [42 * 24 * 60 * 60, '42:00:00:00', '42d'],
    [123 * 24 * 60 * 60 + 12 * 60 * 60 + 34 * 60 + 56, '123:12:34:56', '123d 12h 34m 56s'],
  ])(
    'converts %d seconds to timestamp and timestring',
    (seconds: number, expectedTimestamp: string, expectedTimestring: string) => {
      expect(secondsToTimestamp(seconds)).toEqual(expectedTimestamp);
      expect(secondsToTimestring(seconds)).toEqual(expectedTimestring);
    },
  );

  it.each([
    ['', false, 0, true],
    ['', true, 0, true],
    ['00:0a', false, 0, true],
    ['00:0a', true, 0, true],
    ['0', false, 0],
    ['0', true, 0],
    ['00', false, 0],
    ['00', true, 0],
    ['3', false, 3],
    ['3', true, 3],
    ['03', false, 3],
    ['03', true, 3],
    ['16', false, 16],
    ['16', true, 16],
    ['0:07', false, 7],
    ['0:07', true, 7],
    ['1:01', false, 60 + 1],
    ['1:01', true, 60 + 1],
    ['03:12', false, 3 * 60 + 12],
    ['03:12', true, 3 * 60 + 12],
    ['16:00:52', false, 16 * 60 * 60 + 52],
    ['16:00:52', true, 16 * 60 * 60 + 52],
    ['103:00:01:23', false, 103 * 24 * 60 * 60 + 60 + 23],
    ['103:00:01:23', true, 103 * 24 * 60 * 60 + 60 + 23],
    ['71:23', false, 71 * 60 + 23],
    ['71:23', true, 0, true],
    ['1:23', false, 60 + 23],
    ['1:23', true, 60 + 23],
    ['1:23.2', false, 60 + 23.2],
    ['1:23.2', true, 60 + 23.2],
  ])(
    'converts %s to seconds',
    (timestamp: string, hardMatch: boolean, expected: number, throws: boolean = false) => {
      if (throws) {
        expect(() => timestampToSeconds(timestamp, hardMatch)).toThrow();
      } else {
        expect(timestampToSeconds(timestamp, hardMatch)).toEqual(expected);
        if (!hardMatch) {
          expect(timestampToSeconds(timestamp)).toEqual(expected);
        }
      }
    },
  );

  it.each([
    ['', 0],
    ['1a', 0, true],
    ['0s', 0],
    ['4s', 4],
    ['04s', 4],
    ['16s', 16],
    ['106s', 106],
    ['7m', 7 * 60],
    ['3m   19s', 3 * 60 + 19],
    ['6h 1s', 6 * 60 * 60 + 1],
    ['4 days 3 hours 2m 1sec', 4 * 24 * 60 * 60 + 3 * 60 * 60 + 2 * 60 + 1],
  ])(
    'converts %s to seconds',
    (timestring: string, expected: number, throws: boolean = false) => {
      if (throws) {
        expect(() => timestringToSeconds(timestring)).toThrow();
      } else {
        expect(timestringToSeconds(timestring)).toEqual(expected);
      }
    },
  );
});
