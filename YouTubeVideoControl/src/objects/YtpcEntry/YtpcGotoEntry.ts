import { YouTubePlayer } from 'youtube-player/dist/types';

import secondsToTimestamp from 'utils/secondsToTimestamp';
import timestampToSeconds from 'utils/timestampToSeconds';
import { mget } from 'utils/regexp-match-group';
import YouTubePlayerControllerEntry, { ControlType } from './YouTubePlayerControllerEntry';

export interface YtpcGotoState {
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

  public performAction(ytPlayer: YouTubePlayer, currentTime: number): void {
    ytPlayer.seekTo(this.gotoTime, true);
  }

  public getState(): YtpcGotoState {
    return {
      gotoTime: this.gotoTime,
    };
  }

  public getControlStr(): string {
    return secondsToTimestamp(this.gotoTime);
  }

  public static fromString(str: string): YtpcGotoEntry | null {
    const regex = new RegExp([
      String.raw`^At (?<timestamp>${YouTubePlayerControllerEntry.REGEXSTR_TIMESTAMP}),`,
      String.raw` ${YtpcGotoEntry.ACTION_STR}`,
      String.raw` (?<goto>${YouTubePlayerControllerEntry.REGEXSTR_TIMESTAMP})`,
      String.raw`$`,
    ].join(''));

    const match = str.match(regex);
    if (!match) {
      return null;
    }

    try {
      return new YtpcGotoEntry(
        timestampToSeconds(mget(match, 'timestamp')),
        timestampToSeconds(mget(match, 'goto')),
      );
    } catch {
      return null;
    }
  }
}

export default YtpcGotoEntry;
