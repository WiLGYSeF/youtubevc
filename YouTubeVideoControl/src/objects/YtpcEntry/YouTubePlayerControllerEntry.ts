import { YouTubePlayer } from 'youtube-player/dist/types';

export enum ControlType {
  ThreeSixty = '360',
  Goto = 'goto',
  Loop = 'loop',
  Pause = 'pause',
  PlaybackRate = 'playback-rate',
  Volume = 'volume',
}

interface TimeParts {
  seconds: number;
  minutes?: number;
  hours?: number;
}

abstract class YouTubePlayerControllerEntry {
  public controlType: ControlType;
  public atTime: number;

  constructor(controlType: ControlType, atTime: number) {
    this.controlType = controlType;
    this.atTime = atTime;
  }

  abstract performAction(ytPlayer: YouTubePlayer, currentTime: number): void;

  abstract getActionStr(): string;

  abstract getControlStr(): string;

  public toString(): string {
    return `At ${this.secondsToTime(this.atTime)}, ${this.getActionStr()} ${this.getControlStr()}`;
  }

  public getKey(): string {
    return `${this.controlType}-${this.atTime}`;
  }

  public secondsToTime(seconds: number): string {
    const parts = this.secondsToTimeParts(seconds);

    const nlzstr = (x: number): string => (x > 9 ? '' : '0') + x;
    return `${parts.hours ? `${nlzstr(parts.hours)}:` : ''}${nlzstr(parts.minutes ?? 0)}:${nlzstr(parts.seconds)}`;
  }

  public secondsToTimeParts(seconds: number): TimeParts {
    let sec = seconds;
    const hours = Math.floor(sec / 3600);
    sec %= 3600;
    const minutes = Math.floor(sec / 60);
    sec %= 60;

    return {
      seconds: sec,
      minutes,
      hours,
    };
  }
}

export default YouTubePlayerControllerEntry;
