import { YouTubePlayer } from 'youtube-player/dist/types';

import Coroutine, { MSEC_PER_SEC } from 'utils/coroutine';
import lerp from 'utils/lerp';
import { timestampToSeconds } from 'utils/timestr';
import YouTubePlayerControllerEntry, { ControlType, YtpcEntryState } from './YouTubePlayerControllerEntry';

export interface YtpcVolumeState extends YtpcEntryState {
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
      ...super.getState(),
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

  public static fromState(state: YtpcVolumeState): YtpcVolumeEntry {
    return new YtpcVolumeEntry(state.atTime, state.volume, state.lerpSeconds);
  }

  public static fromString(str: string): YtpcVolumeEntry | null {
    const rsNum = String.raw`-?\d+(?:\.\d*)?`;
    const regex = new RegExp([
      String.raw`^At (?<timestamp>${YouTubePlayerControllerEntry.REGEXSTR_TIMESTAMP}),`,
      String.raw` ${YtpcVolumeEntry.ACTION_STR}`,
      String.raw` (?<volume>${rsNum})`,
      String.raw`(?: during the next (?<lerp>${rsNum}) seconds)?`,
      String.raw`$`,
    ].join(''));

    const match = str.match(regex);
    if (!match || !match.groups) {
      return null;
    }

    try {
      return new YtpcVolumeEntry(
        timestampToSeconds(match.groups.timestamp),
        Number(match.groups.volume),
        Number(match.groups.lerp ?? -1),
      );
    } catch {
      return null;
    }
  }
}

export default YtpcVolumeEntry;
