import { YouTubePlayer } from 'youtube-player/dist/types';

import { secondsToTimestamp } from 'utils/timestr';

export enum ControlType {
  ThreeSixty = '360',
  Goto = 'goto',
  Loop = 'loop',
  Pause = 'pause',
  PlaybackRate = 'playback-rate',
  Volume = 'volume',
}

export interface YtpcEntryState {
  atTime: number;
  controlType: ControlType;
}

abstract class YouTubePlayerControllerEntry {
  public static REGEXSTR_TIMESTAMP = String.raw`(?:\d+:)*\d+(?:\.\d*)?`;

  public controlType: ControlType;
  public atTime: number;

  constructor(controlType: ControlType, atTime: number) {
    this.controlType = controlType;
    this.atTime = atTime;
  }

  abstract get actionStr(): string;

  abstract performAction(ytPlayer: YouTubePlayer, currentTime: number): void;

  abstract getControlStr(stateless: boolean): string;

  public getState(): YtpcEntryState {
    return {
      controlType: this.controlType,
      atTime: this.atTime,
    };
  }

  public restoreState(): void {}

  public toString(): string {
    return `At ${secondsToTimestamp(this.atTime)}, ${this.actionStr} ${this.getControlStr(false)}`;
  }

  public toStringStateless(): string {
    return `At ${secondsToTimestamp(this.atTime)}, ${this.actionStr} ${this.getControlStr(true)}`;
  }

  public getKey(): string {
    return `${this.controlType}-${this.atTime}`;
  }
}

export default YouTubePlayerControllerEntry;
