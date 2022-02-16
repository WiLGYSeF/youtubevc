import { YouTubePlayer } from 'youtube-player/dist/types';

import Coroutine, { MSEC_PER_SEC } from 'utils/coroutine';
import { secondsToTimestring, timestampToSeconds, timestringToSeconds } from 'utils/timestr';
import YouTubePlayerControllerEntry, { ControlType, YtpcEntryState } from './YouTubePlayerControllerEntry';

export interface YtpcPauseState extends YtpcEntryState {
  pauseTime: number;
}

class YtpcPauseEntry extends YouTubePlayerControllerEntry {
  public static ACTION_STR: string = 'pause for';

  public pauseTime: number;

  constructor(atTime: number, pauseTime: number) {
    super(ControlType.Pause, atTime);

    this.pauseTime = pauseTime;
  }

  public get actionStr(): string {
    return YtpcPauseEntry.ACTION_STR;
  }

  public performAction(ytPlayer: YouTubePlayer): void {
    ytPlayer.pauseVideo();

    const pauseTime = this.pauseTime * MSEC_PER_SEC;
    const routine = new Coroutine((timestamp: number) => {
      if (timestamp - routine.startTime >= pauseTime) {
        ytPlayer.playVideo();
        routine.stop();
      }
    });
    routine.start();
  }

  public getState(): YtpcPauseState {
    return {
      ...super.getState(),
      pauseTime: this.pauseTime,
    };
  }

  public getControlStr(): string {
    return secondsToTimestring(this.pauseTime);
  }

  public static fromState(state: YtpcPauseState): YtpcPauseEntry {
    return new YtpcPauseEntry(state.atTime, state.pauseTime);
  }

  public static fromString(str: string): YtpcPauseEntry | null {
    const regex = new RegExp([
      String.raw`^At (?<timestamp>${YouTubePlayerControllerEntry.REGEXSTR_TIMESTAMP}),`,
      String.raw` ${YtpcPauseEntry.ACTION_STR}`,
      String.raw` (?<timestring>.*)`,
      String.raw`$`,
    ].join(''));

    const match = str.match(regex);
    if (!match || !match.groups) {
      return null;
    }

    try {
      return new YtpcPauseEntry(
        timestampToSeconds(match.groups.timestamp),
        timestringToSeconds(match.groups.timestring),
      );
    } catch {
      return null;
    }
  }
}

export default YtpcPauseEntry;
