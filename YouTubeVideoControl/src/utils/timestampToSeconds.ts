export default function timestampToSeconds(timestamp: string, hardMatch: boolean = false): number {
  const match = timestamp.match(hardMatch
    ? /^(?:(?:(?:(?<day>\d+):)?(?<hour>[01]\d|2[0-3]):)?(?<min>[0-5]?\d):)?(?<sec>[0-5]?\d(?:\.\d+)?)$/
    : /^(?:(?:(?:(?<day>\d+):)?(?<hour>\d+):)?(?<min>\d+):)?(?<sec>\d+(?:\.\d+)?)$/);
  if (!match || !match.groups) {
    throw new Error('invalid timestamp input');
  }

  return Number(match.groups.day ?? 0) * 24 * 60 * 60
    + Number(match.groups.hour ?? 0) * 60 * 60
    + Number(match.groups.min ?? 0) * 60
    + Number(match.groups.sec ?? 0);
}
