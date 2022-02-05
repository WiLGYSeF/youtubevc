export default function timestampToSeconds(timestamp: string): number {
  const match = timestamp.match(/^(?:(?:(?<hour>[0-9]+):)?(?<min>[0-9]+):)?(?<sec>[0-9]+)$/);
  if (!match || !match.groups) {
    throw new Error('invalid timestamp input');
  }

  return Number(match.groups.hour ?? 0) * 3600
    + Number(match.groups.min ?? 0) * 60
    + Number(match.groups.sec ?? 0);
}
