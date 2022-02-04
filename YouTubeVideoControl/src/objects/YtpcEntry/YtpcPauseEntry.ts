import { YouTubePlayer } from 'youtube-player/dist/types';
import Coroutine, { MSEC_PER_SEC } from '../../utils/coroutine';

import YouTubePlayerControllerEntry, { ControlType } from './YouTubePlayerControllerEntry';

class YtpcPauseEntry extends YouTubePlayerControllerEntry {
  public static ACTION_STR: string = 'pause for';

  public pauseTime: number;

  constructor(atTime: number, pauseTime: number) {
    super(ControlType.Pause, atTime);

    this.pauseTime = pauseTime;
  }

  public performAction(ytPlayer: YouTubePlayer, currentTime: number): void {
    ytPlayer.pauseVideo();

    const pauseTime = this.pauseTime * MSEC_PER_SEC;
    const routine = new Coroutine((timestamp: number) => {
      if (timestamp - routine.startTime > pauseTime) {
        ytPlayer.playVideo();
        routine.stop();
      }
    });
    routine.start();
  }

  public getActionStr(): string {
    return YtpcPauseEntry.ACTION_STR;
  }

  public getControlStr(): string {
    const parts = this.secondsToTimeParts(this.pauseTime);

    const nlzstr = (x: number): string => (x > 9 ? '' : '0') + x;

    const times = [parts.hours, parts.minutes, parts.seconds];
    const labels = ['h', 'm', 's'];

    const arr = [];

    for (let i = 0; i < times.length; i += 1) {
      if (times[i]) {
        arr.push(
          (arr.length ? nlzstr(times[i] ?? 0) : times[i])
          + labels[i],
        );
      }
    }

    return arr.join(' ');
  }
}

export default YtpcPauseEntry;
