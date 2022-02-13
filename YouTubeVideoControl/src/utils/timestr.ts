import Decimal from 'decimal.js-light';

export interface TimeParts {
  seconds: number;
  minutes?: number;
  hours?: number;
  days?: number;
}

export function secondsToTimeParts(seconds: number): TimeParts {
  let sec = new Decimal(seconds);
  const days = Math.floor(sec.div(24 * 60 * 60).toNumber());
  sec = sec.mod(24 * 60 * 60);
  const hours = Math.floor(sec.div(60 * 60).toNumber());
  sec = sec.mod(60 * 60);
  const minutes = Math.floor(sec.div(60).toNumber());
  sec = sec.mod(60);

  return {
    seconds: sec.toNumber(),
    minutes,
    hours,
    days,
  };
}

function nlzstr(x: number): string {
  return (x >= 10 ? '' : '0') + x;
}

export function secondsToTimestamp(seconds: number): string {
  const parts = secondsToTimeParts(seconds);
  return `${[
    parts.days, parts.hours,
  ].map((p) => (p ? `${nlzstr(p)}:` : '')).join('')
  }${nlzstr(parts.minutes ?? 0)}:${nlzstr(parts.seconds)}`;
}

export function secondsToTimestring(seconds: number) {
  const parts = secondsToTimeParts(seconds);
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

function matchgroupToSeconds(groups: { [key: string]: string }): number {
  return Number(groups.day ?? 0) * 24 * 60 * 60
    + Number(groups.hour ?? 0) * 60 * 60
    + Number(groups.min ?? 0) * 60
    + Number(groups.sec ?? 0);
}
