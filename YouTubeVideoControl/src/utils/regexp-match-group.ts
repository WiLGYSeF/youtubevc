export class RegExpMatchGroupError extends Error {
  constructor(...params: any[]) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RegExpMatchGroupError);
    }

    this.name = 'RegExpMatchGroupError';
  }
}

export function mget(match: RegExpMatchArray, group: string): string {
  if (!match.groups || !(group in match.groups)) {
    throw new RegExpMatchGroupError(`regex match does not have group '${group}'`);
  }
  return match.groups[group];
}
