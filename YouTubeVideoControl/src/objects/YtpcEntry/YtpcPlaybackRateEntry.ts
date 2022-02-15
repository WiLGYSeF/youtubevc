import { YouTubePlayer } from 'youtube-player/dist/types';

import { timestampToSeconds } from 'utils/timestr';
import YouTubePlayerControllerEntry, { ControlType, YtpcEntryState } from './YouTubePlayerControllerEntry';

export interface YtpcPlaybackRateState extends YtpcEntryState {
  playbackRate: number;
}

class YtpcPlaybackRateEntry extends YouTubePlayerControllerEntry {
  public static ACTION_STR: string = 'set playback rate to';

  public playbackRate: number;

  constructor(atTime: number, playbackRate: number) {
    super(ControlType.PlaybackRate, atTime);

    this.playbackRate = playbackRate;
  }

  public get actionStr(): string {
    return YtpcPlaybackRateEntry.ACTION_STR;
  }

  public performAction(ytPlayer: YouTubePlayer, currentTime: number): void {
    ytPlayer.setPlaybackRate(this.playbackRate);
  }

  public getState(): YtpcPlaybackRateState {
    return {
      ...super.getState(),
      playbackRate: this.playbackRate,
    };
  }

  public getControlStr(): string {
    return `x${this.playbackRate}`;
  }

  public static fromState(state: YtpcPlaybackRateState): YtpcPlaybackRateEntry {
    return new YtpcPlaybackRateEntry(state.atTime, state.playbackRate);
  }

  public static fromString(str: string): YtpcPlaybackRateEntry | null {
    const regex = new RegExp([
      String.raw`^At (?<timestamp>${YouTubePlayerControllerEntry.REGEXSTR_TIMESTAMP}),`,
      String.raw` ${YtpcPlaybackRateEntry.ACTION_STR}`,
      String.raw` x?(?<rate>\d+(?:\.\d+)?)`,
      String.raw`$`,
    ].join(''));

    const match = str.match(regex);
    if (!match || !match.groups) {
      return null;
    }

    try {
      return new YtpcPlaybackRateEntry(
        timestampToSeconds(match.groups.timestamp),
        Number(match.groups.rate),
      );
    } catch {
      return null;
    }
  }
}

export default YtpcPlaybackRateEntry;
