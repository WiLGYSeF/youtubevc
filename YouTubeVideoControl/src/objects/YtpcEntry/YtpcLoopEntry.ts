import { YouTubePlayer } from 'youtube-player/dist/types';

import { secondsToTimestamp, timestampToSeconds } from 'utils/timestr';
import YouTubePlayerControllerEntry, { ControlType, ExpectedState, YtpcEntryState } from './YouTubePlayerControllerEntry';

export interface YtpcLoopState extends YtpcEntryState {
  loopBackTo: number;
  loopCount: number;
}

class YtpcLoopEntry extends YouTubePlayerControllerEntry {
  public static ACTION_STR: string = 'loop back to';

  public loopBackTo: number;
  public loopCount: number;

  private loopNum: number;

  constructor(atTime: number, loopBackTo: number, loopCount?: number) {
    if (loopBackTo >= atTime) {
      throw new Error('time to loop back to must be before current time');
    }

    super(ControlType.Loop, atTime);

    this.loopBackTo = loopBackTo;
    this.loopCount = loopCount ?? -1;

    this.loopNum = 0;
  }

  public get actionStr(): string {
    return YtpcLoopEntry.ACTION_STR;
  }

  public get loopNumber(): number {
    return this.loopNum;
  }

  public performAction(ytPlayer: YouTubePlayer): ExpectedState {
    if (this.loopCount >= 0 && this.loopNum >= this.loopCount) {
      return {};
    }

    ytPlayer.seekTo(this.loopBackTo, true);
    this.loopNum += 1;

    return {
      currentTime: this.loopBackTo,
    };
  }

  public getState(): YtpcLoopState {
    return {
      ...super.getState(),
      loopBackTo: this.loopBackTo,
      loopCount: this.loopCount,
    };
  }

  public restoreState(): void {
    this.loopNum = 0;
  }

  public getControlStr(stateless: boolean = false): string {
    let result = `${secondsToTimestamp(this.loopBackTo)} ${
      this.loopCount >= 0
        ? `${this.loopCount} time${this.loopCount !== 1 ? 's' : ''}`
        : 'forever'
    }`;

    if (!stateless && this.loopCount > 0) {
      const remain = this.loopCount - this.loopNum;
      result += ` (${remain} loop${remain !== 1 ? 's' : ''} left)`;
    }

    return result;
  }

  public static fromState(state: YtpcLoopState): YtpcLoopEntry {
    return new YtpcLoopEntry(state.atTime, state.loopBackTo, state.loopCount);
  }

  public static fromString(str: string): YtpcLoopEntry | null {
    const regex = new RegExp([
      String.raw`^At (?<timestamp>${YouTubePlayerControllerEntry.REGEXSTR_TIMESTAMP}),`,
      String.raw` ${YtpcLoopEntry.ACTION_STR}`,
      String.raw` (?<loopBackTo>${YouTubePlayerControllerEntry.REGEXSTR_TIMESTAMP})`,
      String.raw`(?: (?<loopCount>\d+) times?| forever)?`,
      String.raw`$`,
    ].join(''));

    const match = str.match(regex);
    if (!match || !match.groups) {
      return null;
    }

    try {
      return new YtpcLoopEntry(
        timestampToSeconds(match.groups.timestamp),
        timestampToSeconds(match.groups.loopBackTo),
        Number(match.groups.loopCount ?? -1),
      );
    } catch {
      return null;
    }
  }
}

export default YtpcLoopEntry;
