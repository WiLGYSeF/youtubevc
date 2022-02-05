import { YouTubePlayer } from 'youtube-player/dist/types';

import YouTubePlayerControllerEntry, { ControlType } from './YouTubePlayerControllerEntry';

export interface YtpcPlaybackRateState {
  playbackRate: number;
}

class YtpcPlaybackRateEntry extends YouTubePlayerControllerEntry {
  public static ACTION_STR: string = 'set playback rate to';

  public playbackRate: number;

  constructor(atTime: number, playbackRate: number) {
    super(ControlType.PlaybackRate, atTime);

    this.playbackRate = playbackRate;
  }

  public performAction(ytPlayer: YouTubePlayer, currentTime: number): void {
    ytPlayer.setPlaybackRate(this.playbackRate);
  }

  public getActionStr(): string {
    return YtpcPlaybackRateEntry.ACTION_STR;
  }

  public getControlStr(): string {
    return `x${this.playbackRate}`;
  }
}

export default YtpcPlaybackRateEntry;
