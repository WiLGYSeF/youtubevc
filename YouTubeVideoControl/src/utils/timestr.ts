import Decimal from 'decimal.js-light';

export interface TimeParts {
  seconds: number;
  minutes?: number;
  hours?: number;
  days?: number;
}

function matchgroupToSeconds(groups: { [key: string]: string }): number {
  return Number(groups.day ?? 0) * 24 * 60 * 60
    + Number(groups.hour ?? 0) * 60 * 60
    + Number(groups.min ?? 0) * 60
    + Number(groups.sec ?? 0);
}

function nlzstr(x: number): string {
  return (x >= 10 ? '' : '0') + x;
}

export function secondsToTimeParts(seconds: number): TimeParts {
  let sec = new Decimal(seconds);

  const isNeg = sec.isNegative();
  sec = sec.abs();

  const days = sec.dividedToIntegerBy(24 * 60 * 60);
  sec = sec.mod(24 * 60 * 60);
  const hours = sec.dividedToIntegerBy(60 * 60);
  sec = sec.mod(60 * 60);
  const minutes = sec.dividedToIntegerBy(60);
  sec = sec.mod(60);

  const toNum = (x: Decimal) => (isNeg ? x.neg().toNumber() : x.toNumber());

  return {
    seconds: toNum(sec),
    minutes: toNum(minutes),
    hours: toNum(hours),
    days: toNum(days),
  };
}

export function secondsToTimePartList(seconds: number): number[] {
  const parts = secondsToTimeParts(seconds);
  const arr = [
    parts.days ?? 0,
    parts.hours ?? 0,
    parts.minutes ?? 0,
    parts.seconds,
  ];

  let idx = 0;
  for (; idx < arr.length - 1 && arr[idx] === 0; idx += 1);
  return arr.slice(idx);
}

export function secondsToTimestamp(seconds: number): string {
  const parts = secondsToTimePartList(seconds);
  if (parts.length === 1) {
    parts.unshift(0);
  }
  return parts.map(nlzstr).join(':');
}

export function secondsToTimestring(seconds: number) {
  const parts = secondsToTimePartList(seconds);

  let labels = ['d', 'h', 'm', 's'];
  labels = labels.slice(labels.length - parts.length);

  const arr = [];
  for (let i = 0; i < parts.length; i += 1) {
    if (parts[i]) {
      arr.push((arr.length ? nlzstr(parts[i]) : parts[i]) + labels[i]);
    }
  }
  return arr.length ? arr.join(' ') : '0s';
}

export function timestampToSeconds(timestamp: string, hardMatch: boolean = false): number {
  const match = timestamp.match(hardMatch
    ? /^(?:(?:(?:(?<day>\d+):)?(?<hour>[01]\d|2[0-3]):)?(?<min>[0-5]?\d):)?(?<sec>[0-5]?\d(?:\.\d+)?)$/
    : /^(?:(?:(?:(?<day>\d+):)?(?<hour>\d+):)?(?<min>\d+):)?(?<sec>\d+(?:\.\d+)?)$/);
  if (!match || !match.groups) {
    throw new Error('invalid timestamp input');
  }

  return matchgroupToSeconds(match.groups);
}

export function timestringToSeconds(timestring: string): number {
  const times = [
    { group: 'day', units: ['days', 'day', 'd'] },
    { group: 'hour', units: ['hours', 'hour', 'h'] },
    { group: 'min', units: ['minutes', 'minute', 'min', 'm'] },
    { group: 'sec', units: ['seconds', 'second', 'sec', 's'] },
  ];

  const match = timestring.match(new RegExp(`^${times.map(
    (o) => String.raw`(?:(?<${o.group}>\d+) *(${o.units.join('|')}))?`,
  ).join(' *')}$`));
  if (!match || !match.groups) {
    throw new Error('invalid timestamp input');
  }

  return matchgroupToSeconds(match.groups);
}
