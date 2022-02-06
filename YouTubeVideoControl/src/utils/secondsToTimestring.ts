import secondsToTimeParts from './secondsToTimeParts';

export default function secondsToTimestring(seconds: number) {
  const parts = secondsToTimeParts(seconds);

  const nlzstr = (x: number): string => (x >= 10 ? '' : '0') + x;

  const times = [parts.days, parts.hours, parts.minutes, parts.seconds];
  const labels = ['d', 'h', 'm', 's'];

  const arr = [];

  for (let i = 0; i < times.length; i += 1) {
    if (times[i]) {
      arr.push((arr.length ? nlzstr(times[i] ?? 0) : times[i]) + labels[i]);
    }
  }

  return arr.join(' ');
}
