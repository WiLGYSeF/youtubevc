export default function timestringToSeconds(timestring: string): number {
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

  return Number(match.groups.day ?? 0) * 24 * 60 * 60
    + Number(match.groups.hour ?? 0) * 60 * 60
    + Number(match.groups.min ?? 0) * 60
    + Number(match.groups.sec ?? 0);
}
