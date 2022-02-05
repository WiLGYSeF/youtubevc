import { YouTubePlayer } from 'youtube-player/dist/types';

import YouTubePlayerControllerEntry, { ControlType } from './YouTubePlayerControllerEntry';

export interface YtpcGotoState {
  goto: number;
}

class YtpcGotoEntry extends YouTubePlayerControllerEntry {
  public static ACTION_STR: string = 'go to';

  public gotoTime: number;

  constructor(atTime: number, gotoTime: number) {
    super(ControlType.Goto, atTime);

    this.gotoTime = gotoTime;
  }

  public performAction(ytPlayer: YouTubePlayer, currentTime: number): void {
    ytPlayer.seekTo(this.gotoTime, true);
  }

  public getActionStr(): string {
    return YtpcGotoEntry.ACTION_STR;
  }

  public getControlStr(): string {
    return this.secondsToTime(this.gotoTime);
  }
}

export default YtpcGotoEntry;
