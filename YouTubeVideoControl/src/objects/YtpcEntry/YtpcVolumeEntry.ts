import { YouTubePlayer } from 'youtube-player/dist/types';
import Coroutine, { MSEC_PER_SEC } from '../../utils/coroutine';
import lerp from '../../utils/lerp';

import YouTubePlayerControllerEntry, { ControlType } from './YouTubePlayerControllerEntry';

export interface YtpcVolumeState {
  volume: number;
  lerpSeconds: number;
}

class YtpcVolumeEntry extends YouTubePlayerControllerEntry {
  public static ACTION_STR: string = 'set volume to';

  public volume: number;
  public lerpSeconds: number;

  constructor(atTime: number, volume: number, lerpSeconds?: number) {
    super(ControlType.Volume, atTime);

    this.volume = volume;
    this.lerpSeconds = lerpSeconds ?? -1;
  }

  public get actionStr(): string {
    return YtpcVolumeEntry.ACTION_STR;
  }

  public performAction(ytPlayer: YouTubePlayer, currentTime: number): void {
    if (this.lerpSeconds > 0) {
      const vol = ytPlayer.getVolume();
      const lerpMs = this.lerpSeconds * MSEC_PER_SEC;

      const routine = new Coroutine((timestamp: number) => {
        ytPlayer.setVolume(lerp(vol, this.volume, (timestamp - routine.startTime) / lerpMs));
      }, lerpMs);
      routine.start();
    } else {
      ytPlayer.setVolume(this.volume);
    }
  }

  public getState(): YtpcVolumeState {
    return {
      volume: this.volume,
      lerpSeconds: this.lerpSeconds,
    };
  }

  public getControlStr(): string {
    let result = `${this.volume}`;

    if (this.lerpSeconds > 0) {
      result += ` during the next ${this.lerpSeconds} seconds`;
    }

    return result;
  }
}

export default YtpcVolumeEntry;
