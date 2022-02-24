import { YouTubePlayer } from 'youtube-player/dist/types';

import Coroutine, { MSEC_PER_SEC } from 'utils/coroutine';
import round from 'utils/round';
import { secondsToTimestring, timestampToSeconds, timestringToSeconds } from 'utils/timestr';
import YouTubePlayerControllerEntry, { ControlType, YtpcEntryState } from './YouTubePlayerControllerEntry';

export interface YtpcPauseState extends YtpcEntryState {
  pauseTime: number;
}

class YtpcPauseEntry extends YouTubePlayerControllerEntry {
  public static ACTION_STR: string = 'pause for';

  public pauseTime: number;

  private routine: Coroutine | null;

  constructor(atTime: number, pauseTime: number) {
    super(ControlType.Pause, atTime);

    this.pauseTime = pauseTime;

    this.routine = null;
  }

  public get actionStr(): string {
    return YtpcPauseEntry.ACTION_STR;
  }

  public performAction(ytPlayer: YouTubePlayer): void {
    ytPlayer.pauseVideo();

    const pauseTime = this.pauseTime * MSEC_PER_SEC;
    this.routine = new Coroutine((timestamp: number) => {
      if (timestamp - this.routine!.startTimestamp >= pauseTime) {
        ytPlayer.playVideo();
        this.routine!.stop();
      }
    });
    this.routine.start();
  }

  public getState(): YtpcPauseState {
    return {
      ...super.getState(),
      pauseTime: this.pauseTime,
    };
  }

  public restoreState(): void {
    this.routine?.stop();
  }

  public getControlStr(stateless: boolean = false): string {
    let result = secondsToTimestring(this.pauseTime);

    if (!stateless && this.routine?.running) {
      result += ` (${secondsToTimestring(round(this.pauseTime - this.routine.runningTime / 1000, 1))} left)`;
    }

    return result;
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
