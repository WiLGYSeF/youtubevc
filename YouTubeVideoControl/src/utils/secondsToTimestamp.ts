import secondsToTimeParts from './secondsToTimeParts';

export default function secondsToTimestamp(seconds: number): string {
  const parts = secondsToTimeParts(seconds);

  const nlzstr = (x: number): string => (x > 9 ? '' : '0') + x;
  return `${(parts.days ? `${nlzstr(parts.days)}:` : '')
    + (parts.hours ? `${nlzstr(parts.hours)}:` : '')
    + nlzstr(parts.minutes ?? 0)
  }:${nlzstr(parts.seconds)}`;
}
