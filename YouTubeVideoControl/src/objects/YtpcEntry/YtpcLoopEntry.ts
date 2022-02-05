import { YouTubePlayer } from 'youtube-player/dist/types';

import YouTubePlayerControllerEntry, { ControlType } from './YouTubePlayerControllerEntry';
import secondsToTimestamp from '../../utils/secondsToTimestamp';

export interface YtpcLoopState {
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

  public performAction(ytPlayer: YouTubePlayer, currentTime: number): void {
    if (this.loopCount >= 0 && this.loopNum >= this.loopCount) {
      return;
    }

    ytPlayer.seekTo(this.loopBackTo, true);
    this.loopNum += 1;
  }

  public getActionStr(): string {
    return YtpcLoopEntry.ACTION_STR;
  }

  public getControlStr(): string {
    return `${secondsToTimestamp(this.loopBackTo)} ${
      this.loopCount >= 0
        ? `${this.loopCount} time${this.loopCount !== 1 ? 's' : ''}`
        : 'forever'
    }`;
  }
}

export default YtpcLoopEntry;
