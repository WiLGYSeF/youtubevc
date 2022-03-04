import { YouTubePlayer } from 'youtube-player/dist/types';

import { secondsToTimestamp, timestampToSeconds } from 'utils/timestr';
import YouTubePlayerControllerEntry, { ControlType, YtpcEntryState } from './YouTubePlayerControllerEntry';

export interface YtpcGotoState extends YtpcEntryState {
  gotoTime: number;
}

class YtpcGotoEntry extends YouTubePlayerControllerEntry {
  public static ACTION_STR: string = 'go to';

  public gotoTime: number;

  constructor(atTime: number, gotoTime: number) {
    super(ControlType.Goto, atTime);

    this.gotoTime = gotoTime;
  }

  public get actionStr(): string {
    return YtpcGotoEntry.ACTION_STR;
  }

  public performAction(ytPlayer: YouTubePlayer): void {
    ytPlayer.seekTo(this.gotoTime, true);
  }

  public getState(): YtpcGotoState {
    return {
      ...super.getState(),
      gotoTime: this.gotoTime,
    };
  }

  public getControlStr(): string {
    return secondsToTimestamp(this.gotoTime);
  }

  public static fromState(state: YtpcGotoState): YtpcGotoEntry {
    return new YtpcGotoEntry(state.atTime, state.gotoTime);
  }

  public static fromString(str: string): YtpcGotoEntry | null {
    const regex = new RegExp([
      String.raw`^At (?<timestamp>${YouTubePlayerControllerEntry.REGEXSTR_TIMESTAMP}),`,
      String.raw` ${YtpcGotoEntry.ACTION_STR}`,
      String.raw` (?<goto>${YouTubePlayerControllerEntry.REGEXSTR_TIMESTAMP})`,
      String.raw`$`,
    ].join(''));

    const match = str.match(regex);
    if (!match || !match.groups) {
      return null;
    }

    try {
      return new YtpcGotoEntry(
        timestampToSeconds(match.groups.timestamp),
        timestampToSeconds(match.groups.goto),
      );
    } catch {
      return null;
    }
  }
}

export default YtpcGotoEntry;
